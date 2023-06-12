import {NewUser, User} from "../../types/User";
import {AlreadyExistsError, InternalError} from "../../types/errors";
import axios from "axios";
import {ENTITIES_ORION_API_URL} from "../../globals/constants";
import bcrypt from 'bcrypt';
import {UserCounterSingleton} from "../counters/Counter";
import {generateNewId} from "../globalServices";
import {addToBlacklist, isTokenBlacklisted} from "../../utils/blacklists";
import jwt, {Secret} from "jsonwebtoken";
import {NextFunction} from "express";
require('dotenv').config();
import { Request, Response } from "express";




export const createUser = async (user: NewUser): Promise<string> => {
    try {
        const userExists = await doesUserExists(user.email);
        if (!userExists) {
            const userId = await generateNewId(UserCounterSingleton.getInstance(), 'user')
            const userPassword = await hashPassword(user.password);
            const userPayload: User = {
                id: userId,
                type: 'User',
                name: {
                    type: 'Text',
                    value: user.name,
                    metadata: {}
                },
                lastName: {
                    type: 'Text',
                    value: user.lastName,
                    metadata: {}
                },
                password: {
                    type: 'Text',
                    value: userPassword,
                    metadata: {}
                },
                email: {
                    type: 'Text',
                    value: user.email,
                    metadata: {}
                },
                role: {

                  type: 'Text',
                    value: user.role,
                    metadata: {}
                }
            };

            const userPayloadJSON = JSON.stringify(userPayload);

            const response = await axios.post(`${ENTITIES_ORION_API_URL}`, userPayloadJSON, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status !== 201) {
                throw new InternalError('Unspecified error while creating user')
            } else {
                return userPayload.id
            }
        } else {
            throw new AlreadyExistsError(`${user.email} already exists`)
        }
    } catch (e) {
        return Promise.reject(e);
    }
}


export const doesUserExists = async (userId: string): Promise<boolean> => {
    try {
        const response = await axios.get(`${ENTITIES_ORION_API_URL}/${userId}`);
        return userId === response.data.id;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 404) {
            return false;
        } else {
            throw new InternalError("Unknown error");
        }
    }
}

export const hashPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSaltSync(12);
        return await bcrypt.hashSync(password, salt);
    } catch (e: any) {
        throw new InternalError('Unspecified error while hashing password')
    }
}

export const loginUser = async (userCredentials: {email: string, password: string}): Promise<string> => {
    try {
        // Check if user exists
        const user = await getUserByEmail(userCredentials.email);
        if (!user) {
            throw new Error("User not found");
        }

        // Verify password
        const validPassword = await bcrypt.compare(userCredentials.password, user.password.value);
        if (!validPassword) {
            throw new Error("Invalid credentials");
        }

        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error('ACCESS_TOKEN_SECRET environment variable not set');
        }

        const secret = process.env.ACCESS_TOKEN_SECRET;

        // Create token
        const token = jwt.sign({ id: user.id }, secret as Secret, {
            expiresIn: "1h"  // token will expire in 1 hour
        });

        return token;

    } catch (error) {
        return Promise.reject(error);
    }
}


const getUserByEmail = async (email: string): Promise<User> => {
    try {
        const response = await axios.get(`${ENTITIES_ORION_API_URL}/user`, {
            params: {
                q: `email==${email}`
            }
        });

        if (response.status !== 200) {
            throw new Error('Unspecified error while retrieving user');
        }

        const user = response.data;
        return user;

    } catch (error) {
        return Promise.reject(error);
    }
};

export const logoutUser = async (token: string): Promise<void> => {
    try {
        // Add the token to your blacklist.
        // This assumes you have a function addToBlacklist which handles this.
        await addToBlacklist(token);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401);

    if (isTokenBlacklisted(token)) {
        return res.sendStatus(403);
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET environment variable not set');
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;

    jwt.verify(token, secret as Secret, (err, user) => {
        if (err) return res.sendStatus(403);
        //@ts-ignore
        req.user = user;
        next();
    });
}