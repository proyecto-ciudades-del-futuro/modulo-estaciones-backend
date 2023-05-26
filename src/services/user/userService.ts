import {User} from "../../types/User";
import {AlreadyExistsError, InternalError} from "../../types/errors";
import axios from "axios";
import {ENTITIES_ORION_API_URL} from "../../globals/constants";
import bcrypt from 'bcrypt';


export const createUser = async (user: User): Promise<string> => {
    try {
        const userExists = await doesUserExists(user.email.value);
        if (!userExists) {
            const userPassword = await hashPassword(user.password.value);
            const userPayload: User = {
                id: user.email.value,
                type: 'User',
                name: {
                    type: 'Text',
                    value: user.name.value,
                    metadata: user.name.metadata ?? {}
                },
                lastName: {
                    type: 'Text',
                    value: user.lastName.value,
                    metadata: user.lastName.metadata ?? {}
                },
                password: {
                    type: 'Text',
                    value: userPassword,
                    metadata: user.name.metadata ?? {}
                },
                email: {
                    type: 'Text',
                    value: user.email.value,
                    metadata: user.email.metadata ?? {}
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
            throw new AlreadyExistsError(`${user.email.value} already exists`)
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