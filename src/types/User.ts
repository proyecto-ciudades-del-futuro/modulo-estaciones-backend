import {Role} from "./globals";

export interface NewUser {
    name: string;
    lastName: string;
    password: string;
    email: string;
    metadata?: object;
    role: Role
}



export interface User {
    id: string;
    type: 'User';
    name: {
        type: 'Text';
        value: string;
        metadata?: object;
    },
    lastName: {
        type: 'Text';
        value: string;
        metadata?: object;
    },
    password: {
        type: 'Text';
        value: string;
        metadata?: object;
    },
    email: {
        type: 'Text';
        value: string;
        metadata?: object
    },
    role: {
        type: 'Text';
        value: Role;
        metadata?: object;
    }
    dateCreated?: object;
    dateModified?: object;
}
