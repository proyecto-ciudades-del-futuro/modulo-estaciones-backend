import axios, {AxiosError} from "axios";
import {Sensor} from "../../types/Sensor";
import {ENTITIES_ORION_API_URL} from '../../globals/constants';
import {getStationDataById} from "../station/stationService";


export const createSensor = async (sensor: Sensor): Promise<string> => {
    try {
        const sensorExistsResult = await sensorExists(sensor.id);
        if (!sensorExistsResult) {
            const sensorPayloadJSON = JSON.stringify(sensor);
            const sensorResponse = await axios.post(`${ENTITIES_ORION_API_URL}`, sensorPayloadJSON, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const stationData = await getStationDataById(sensor.station_id.value);

            if (stationData === "No station found with the provided id") {
                return Promise.reject({code: 404, message: `Station with id ${sensor.station_id.value} not found`});
            }
            await axios.patch(
                `${ENTITIES_ORION_API_URL}/${sensor.station_id.value}/attrs`,
                {sensors: {value: [sensor, sensorResponse.data.id]}}
            );
            return sensorResponse.statusText
        } else {
            return Promise.reject({code: 409, message: `Sensor with id ${sensor.id} already exists`})
        }
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
    const response = await axios.get(`${ENTITIES_ORION_API_URL}/${sensorId}`);
    return response.data;
}

export const getEverySensor = async (): Promise<Sensor[]> => {
    const sensors = await axios.get(`${ENTITIES_ORION_API_URL}?type=Sensor`);
    return sensors.data;
}

export const updateSensor = async (sensorId: string, updatedSensor: Sensor): Promise<void> => {
    // Update the sensor entity in Orion Context Broker
    await axios.patch(`${ENTITIES_ORION_API_URL}/${sensorId}`, updatedSensor);
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
