
export interface Sensor {
    id: string;
    station_id: string;
    type: string;
    description?: {
        type: string;
        value: string;
        metadata: object;
    }
}