import {ENUM_CONNECTION_PROTOCOL} from "./enums";

export interface Connection {
    id: string;
    connection_type: ENUM_CONNECTION_PROTOCOL;
    description: string;
}