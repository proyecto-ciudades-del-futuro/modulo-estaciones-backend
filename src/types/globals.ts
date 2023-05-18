import {Sensor} from "./Sensor";

export type GeoJson = {
    type: 'geo:json';
    value: {
        type: 'Point';
        coordinates: [number, number];
    };
    metadata?: object;
};


export type Description = {
    type: string;
    metadata?: object;
    value: string;
};

export type SensorArray = {
    type?: 'Array';
    value: Sensor[];
    metadata?: object;
};


