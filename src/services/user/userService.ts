import {NewUser, User} from "../../types/User";
import {AlreadyExistsError, InternalError} from "../../types/errors";
import axios from "axios";
import {ENTITIES_ORION_API_URL} from "../../globals/constants";
import bcrypt from 'bcrypt';
import {UserCounterSingleton} from "../counters/Counter";
import {generateNewId} from "../globalServices";


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