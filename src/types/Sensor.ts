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