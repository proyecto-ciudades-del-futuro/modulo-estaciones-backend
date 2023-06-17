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
  dateCreated?: any;
  dateModified?: any;
}

export type OrionSensorPayload = {
  id: string;
  type: string;
  description: any;
  station_id: any;
  dateCreated: any;
  dateModified: any;
}


export type FlattenedSensorPayload = {
  id: string;
  description: {
    value: string;
    metadata: any
  }
  station_id: string;
  dateCreated: string;
  dateModified: string;
}

export type Pollutants = {
  co2: string;
  co: string;
  no2: string;
  o3: string;
  so2: string;
  pm2_5: string;
  pm10: string;
};

export type SensorMetadataInput = Record<string, string | Pollutants>;

export type SensorMetadataOutput = Record<
  string,
  { type: string; value: { value: string | { [key: string]: string } } }
  >;