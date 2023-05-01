import {STATION_STATE} from "./enums";

export interface NewStation {
    location: {locationId: string};
    userId: { userId: string}
    lastUpdate: { lastUpdate: string};
    stationState?: { stationState: string};
    description: { description: string};
    type: string
}


export interface Station {
    id: string;
    location: {locationId: string};
    userId: { userId: string}
    lastUpdate: { lastUpdate: string};
    stationState?: { stationState: string};
    description: { description: string};
    type: string
}