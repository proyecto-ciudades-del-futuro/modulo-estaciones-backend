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
    }
    dateCreated?: object;
    dateModified?: object;
}