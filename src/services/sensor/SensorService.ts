import axios, {AxiosError} from "axios";
import {NewSensor, Sensor} from "../../types/Sensor";
import {DATES_OPTIONS_QUERY_PARAMS, ENTITIES_ORION_API_URL} from '../../globals/constants';
import {getStationDataById, stationExists, updateStationById} from "../station/stationService";
import {Station, StationState} from "../../types/Station";
import {InternalError, NotFoundError} from "../../types/errors";
import {generateNewId} from "../globalServices";
import {SensorCounterSingleton} from "../counters/Counter";


export const createSensor = async (sensor: NewSensor): Promise<string> => {
    try {
        const stationData: Station | string = await getStationDataById(sensor.station_id);
        if (typeof stationData === "string") {
            return Promise.reject({code: 404, message: `Station with id ${sensor.station_id} not found`});
        }
        const newId = await generateNewId(SensorCounterSingleton.getInstance(), 'sensor')
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
                metadata: sensor.description?.metadata ?? {}
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

        // Add new sensor to the list of existing sensors using spread operator
        const updatedSensors = [...existingSensors, sensor];

        await axios.patch(
            `${ENTITIES_ORION_API_URL}/${sensor.station_id}/attrs`,
            {sensors: {value: updatedSensors}}
        );
        return sensorResponse.statusText
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

export const getEverySensor = async (): Promise<Sensor[]> => {
    const sensors = await axios.get(`${ENTITIES_ORION_API_URL}?type=Sensor&${DATES_OPTIONS_QUERY_PARAMS}`);
    return sensors.data;
}

export const updateSensor = async (sensorId: string, sensorUpdatePayload: NewSensor): Promise<void> => {
    try {
        console.log(sensorUpdatePayload.station_id)
        if (!(typeof sensorUpdatePayload?.station_id === "undefined")) {
            const sensor = await getSensor(sensorId);
            console.log(sensor);
            if (sensor.station_id.value !== sensorUpdatePayload.station_id) {
                const doesStationExists: boolean = await stationExists(sensorUpdatePayload.station_id);
                if (doesStationExists) {
                    await deleteSensorFromStation(sensor.station_id.value, sensorId);
                    await addSensorToStation(sensorUpdatePayload.station_id, sensor);
                }
            }
            await axios.patch(`${ENTITIES_ORION_API_URL}/${sensorId}/attrs`, sensorUpdatePayload);
        }
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


