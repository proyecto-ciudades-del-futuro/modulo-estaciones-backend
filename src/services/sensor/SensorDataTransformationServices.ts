import {
  FlattenedSensorPayload,
  OrionSensorPayload,
  Pollutants,
  Sensor,
  SensorMetadataInput,
  SensorMetadataOutput
} from "../../types/Sensor";

export const flattenSensorPayload = (payload: OrionSensorPayload | Sensor): FlattenedSensorPayload => {
  let flatPayload: FlattenedSensorPayload = {
    id: payload.id,
    description: {
      value: payload.description.value,
      metadata: {}
    },
    station_id: payload.station_id.value,
    dateCreated: payload.dateCreated.value,
    dateModified: payload.dateModified.value
  }

  Object.keys(payload.description.metadata).forEach(key => {
    if (key === 'pollutants') {
      flatPayload.description.metadata[key] = payload.description.metadata[key].value.value;
    } else {
      flatPayload.description.metadata[key] = payload.description.metadata[key].value.value;
    }
  });
  return flatPayload;
}
export const flattenSensorArrayPayload = (payloads: Array<OrionSensorPayload | Sensor>): Array<FlattenedSensorPayload> => {
  return payloads.map(payload => flattenSensorPayload(payload));
}
export const transformSensorPayload = (payload: any, currentSensorData: Sensor): any => {

  const orionPayload = {
    description: {
      type: 'String',
      value: payload.description?.value ?? currentSensorData.description?.value,
      metadata: payload.description && payload.description.metadata ? {
        ...Object.entries(payload.description.metadata).reduce((result: Record<string, any>, [key, value]) => {
          if (key !== 'pollutants') {
            result[key] = {
              type: 'StructuredValue',
              value: {value},
            };
          } else {
            result[key] = {
              type: 'StructuredValue',
              value: {value},
            };
          }
          return result;
        }, {}),
      } : currentSensorData.description?.metadata,
    },
    station_id: {
      type: 'String',
      value: payload.station_id ?? currentSensorData.station_id.value,
      metadata: {}
    },
  };
  return orionPayload;
}
export const transformInputMetadata = (input: SensorMetadataInput): SensorMetadataOutput => {
  const output: SensorMetadataOutput = {};

  for (const key in input) {
    if (key === "pollutants" && typeof input[key] === "object") {
      const pollutantObj = input[key] as Pollutants;
      let transformedPollutants: { [key: string]: string } = {};

      for (const pollutant in pollutantObj) {
        transformedPollutants[pollutant] = (pollutantObj as any)[pollutant];
      }

      output[key] = {
        type: "StructuredValue",
        value: {value: transformedPollutants},
      };
    } else {
      output[key] = {
        type: "StructuredValue",
        value: {value: input[key] as string},
      };
    }
  }

  return output;
};