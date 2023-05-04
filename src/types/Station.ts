import {STATION_STATE} from "./enums";

export type ValidStringTypes = 'Text' | 'Number' | 'Integer' | 'Boolean' | 'Date' | 'URL' | 'GeoJSON' | 'StructuredValue';


export type NewStation = Omit<Station, 'id' | 'type'>;


export interface Station {
    id: string;
    type: string;
    location: {
        type: 'geo:json';
        value: {
            type: 'Point';
            coordinates: [number, number];
        };
        metadata: object;
    };
    user: {
        type: 'Integer';
        value: number;
        metadata: object;
    };
    stationState: {
        type: string;
        metadata: object;
        value: 'ENABLED' | 'DISABLED' | 'IN APPROVAL';
    };
    description: {
        type: string;
        metadata: object;
        value: string;
    };
}

export interface StationUpdate {
    location?: {
        type: 'geo:json';
        value: {
            type: 'Point';
            coordinates: [number, number];
        };
        metadata?: object;
    };
    user?: {
        type: 'Integer';
        value: number;
        metadata?: object;
    };
    stationState?: {
        type: string;
        metadata?: object;
        value: 'ENABLED' | 'DISABLED' | 'IN APPROVAL';
    };
    description?: {
        type: string;
        metadata?: object;
        value: string;
    };
}