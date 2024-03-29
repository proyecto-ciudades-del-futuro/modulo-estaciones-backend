import axios from "axios";
import {NewSensor, Sensor, SensorMetadataInput, SensorMetadataOutput} from "../../types/Sensor";
import {DATES_OPTIONS_QUERY_PARAMS, ENTITIES_ORION_API_URL} from '../../globals/constants';
import {getStationDataById, stationExists, updateStationById} from "../station/StationService";
import {Station} from "../../types/Station";
import {InternalError, NotFoundError} from "../../types/errors";
import {generateNewId} from "../globalServices";
import {SensorCounterSingleton} from "../counters/Counter";
import {transformInputMetadata, transformSensorPayload} from "./SensorDataTransformationServices";
import {sensorFetcher} from "../orionFetcher";
import {Request} from 'express';


export const createSensor = async (sensor: NewSensor): Promise<{message: string, sensor_id: string}> => {
  try {
    const stationData: Station | string = await getStationDataById(sensor.station_id);
    if (typeof stationData === "string") {
      return Promise.reject({code: 404, message: `Station with id ${sensor.station_id} not found`});
    }
    const newId = await generateNewId(SensorCounterSingleton.getInstance(), 'sensor')

    const sensorMetadata: SensorMetadataOutput = transformInputMetadata(sensor.description.metadata as SensorMetadataInput)
    const sensorPayLoad = {
      id: newId,
      station_id: {
        type: "String",
        value: sensor.station_id
      },
      type: "Sensor",
      description: {
        type: "String",
        value: sensor.description?.value,
        metadata: sensorMetadata
      }
    }

    const sensorPayloadJSON = JSON.stringify(sensorPayLoad);
    const sensorResponse = await axios.post(`${ENTITIES_ORION_API_URL}`, sensorPayloadJSON, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Retrieve existing sensors
    const existingSensors = stationData.sensors?.value ?? [];

    const sensorToUpdate = {
      ...sensor,
      id: newId
    }
    // Add new sensor to the list of existing sensors using spread operator
    const updatedSensors = [...existingSensors, sensorToUpdate];

    await axios.patch(
      `${ENTITIES_ORION_API_URL}/${sensorToUpdate.station_id}/attrs`,
      {sensors: {value: updatedSensors}}
    );
    return {message: sensorResponse.statusText, sensor_id: newId}
  } catch (e: any) {
    if (e.response && e.response.status === 404) {
      return Promise.reject({code: 404, message: e.response.data})
    }
    if (e.response && e.response.status === 400) {
      return Promise.reject('Invalid sensor data');
    }
    // Add more conditions to handle different types of error

    // If the error does not match any conditions, reject with the original error
    return Promise.reject(e);
  }
}


export const getSensor = async (sensorId: string): Promise<Sensor> => {
  // Retrieve the sensor entity from Orion Context Broker
  try {
    const response = await axios.get(`${ENTITIES_ORION_API_URL}/${sensorId}?${DATES_OPTIONS_QUERY_PARAMS}`);
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response && e.response.status === 404) {
      return Promise.reject(new NotFoundError('Sensor not found or doesn\'t exist'))
    } else {
      return Promise.reject(new InternalError('Unknown error occurred'));
    }
  }
}

export const getEverySensor = async (req: Request): Promise<Sensor[]> => {
  const sensors = await sensorFetcher.fetchEntities(req)
  return sensors.data;
}

export const updateSensor = async (sensorId: string, sensorUpdatePayload: NewSensor): Promise<void> => {
  try {
    const sensor = await getSensor(sensorId);

    if (sensor.station_id.value !== sensorUpdatePayload.station_id) {
      const doesStationExists: boolean = await stationExists(sensorUpdatePayload.station_id);
      if (doesStationExists) {
        await deleteSensorFromStation(sensor.station_id.value, sensorId);
        await addSensorToStation(sensorUpdatePayload.station_id, sensor);
      } else {
        throw new NotFoundError('Station not found or doesn\'t exist');
      }
    }
    const payloadForUpdate = transformSensorPayload(sensorUpdatePayload, sensor)

    await axios.patch(`${ENTITIES_ORION_API_URL}/${sensorId}/attrs`, payloadForUpdate);
  } catch (e: any) {
    if (e instanceof NotFoundError) {
      throw new NotFoundError(e.message);
    } else {
      throw new InternalError('Internal Server Error');
    }
  }

}


export const sensorExists = async (sensorId: string): Promise<boolean> => {
  try {
    await axios.get(`${ENTITIES_ORION_API_URL}/${sensorId}`)
    return true;
  } catch (e: any) {
    if (e.response && e.response.status === 404) {
      return false;
    }
    // Return a rejected Promise with the error so that it can be caught and handled appropriately.
    return Promise.reject(e);
  }
}


function replaceSensor(station: Station, oldSensorId: string, newSensor: Sensor): Station {
  const sensorIndex = station.sensors.value.findIndex((sensor) => sensor.id === oldSensorId);

  if (sensorIndex > -1) {
    station.sensors.value[sensorIndex] = newSensor;
  } else {
    console.log(`Sensor with id ${oldSensorId} not found.`);
  }
  return station;
}


export const deleteSensorFromStation = async (stationId: string, sensorId: string): Promise<void> => {
  try {
    const station = await getStationDataById(stationId);
    const sensorIndex = station.sensors.value.findIndex((sensor) => sensor.id === sensorId);
    if (sensorIndex > -1) {
      station.sensors.value.splice(sensorIndex, 1);
      await updateStationById(stationId, {sensors: {value: station.sensors.value}});
    }
  } catch (e: any) {
    if (e.code === 404) {
      throw new NotFoundError(e.message)
    } else {
      throw new InternalError(e.message)
    }
  }
}

export const addSensorToStation = async (stationId: string, sensor: Sensor): Promise<void> => {
  try {
    const station = await getStationDataById(stationId);
    const stationSensors = getSensorsArrayFromStation(station)
    stationSensors.push(sensor)
    await updateStationById(stationId, {sensors: {value: stationSensors}})
  } catch (e: any) {
    if (e.code === 404) {
      throw new NotFoundError(e.message)
    } else {
      throw new InternalError(e.message)
    }
  }
}

export const getSensorsArrayFromStation = (station: Station): Sensor[] => {
  return station.sensors.value;
}


