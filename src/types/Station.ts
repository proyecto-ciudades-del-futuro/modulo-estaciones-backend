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
        type: 'Integer';
        value: number;
        metadata: object;
    };
    stationState: StationState;
    description: Description;
    sensors: SensorArray;
    dateCreated?: object
    dateModified?: object;
}

export interface StationUpdate {
    location?: GeoJson;
    user?: {
        type: 'Integer';
        value: number;
        metadata?: object;
    };
    stationState?: StationState;
    description?: Description;
    sensors?: SensorArray
}

