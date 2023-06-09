import {Sensor} from "./Sensor";

export enum Role {
  ADMIN = 'ADMIN',
  COLABORATOR = 'COLABORATOR'
}


export type GeoJson = {
  type: 'geo:json';
  value: {
    type: 'Point';
    coordinates: number[] | string[];
  };
  metadata?: object;
};

export type LocationUpdateContract =
  {
    coordinates: [number, number]
    metadata?: object
  }


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

export type StationCount = {
  id: "stationCount";
  type: "Counter";
  count: {
    value: number,
    type: "Integer"
  }
}


export type SensorCount = {
  id: "sensorCount";
  type: "Counter";
  count: {
    value: number,
    type: "Integer"
  }
}