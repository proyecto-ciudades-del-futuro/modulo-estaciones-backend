export interface NewSensor {
    id: string;
    station_id: string;
    description: {
        value: string;
        metadata: object;
    }
}



export interface Sensor {
    id: string;
    station_id: {
        type: string;
        value: string;
    };
    type: string;
    description?: {
        type: string;
        value: string;
        metadata: object;
    }
}