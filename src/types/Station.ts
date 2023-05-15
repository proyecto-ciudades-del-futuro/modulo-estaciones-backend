import {STATION_STATE} from "./enums";
import {Sensor} from "./Sensor";

export type ValidStringTypes = 'Text' | 'Number' | 'Integer' | 'Boolean' | 'Date' | 'URL' | 'GeoJSON' | 'StructuredValue';




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
        value: 'ENABLED' | 'DISABLED' | 'IN_APPROVAL';
    };
    description: {
        type: string;
        metadata: object;
        value: string;
    };
    sensors?: {
        value: Sensor[],
        metadata: object,
        type: "Array"
    }
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
        value: 'ENABLED' | 'DISABLED' | 'IN_APPROVAL';
    };
    description?: {
        type: string;
        metadata?: object;
        value: string;
    };
    sensors?: {
        type: "Array",
        value: Sensor[]
        metadata?: object;
    }
}