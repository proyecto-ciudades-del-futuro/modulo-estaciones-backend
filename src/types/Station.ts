import {STATION_STATE} from "./enums";
import {GeoJson, SensorArray, Description} from "./globals";

export type ValidStringTypes = 'Text' | 'Number' | 'Integer' | 'Boolean' | 'Date' | 'URL' | 'GeoJSON' | 'StructuredValue';

export type StationState = {
    type: string;
    metadata?: object;
    value: 'ENABLED' | 'DISABLED' | 'IN_APPROVAL';
};

export interface Station {
    id: string;
    type: string;
    location: GeoJson;
    user: {
        type: 'Relationship';
        value: string;
        metadata: object;
    };
    stationState: StationState;
    description: Description;
    sensors: SensorArray;
    dateCreated?: {value: string}
    dateModified?: { value: string };
}

export interface StationUpdate {
    location?: GeoJson;
    user?: {
        type: 'Relationship';
        value: string;
        metadata?: object;
    };
    stationState?: StationState;
    description?: Description;
    sensors?: SensorArray
}


export interface StationResponse {
    id: string;
    location: string[2];
    description: {
        value: string;
        metadata: object;
    }
    sensors: SensorArray;
    stationState: string;
    user: string;
    dateCreated: string;
    dateModified: string;
}


export interface StationDescription {
    value: string;
    metadata?: object;
}

export interface User {
    value: string;
    metadata?: object;
}