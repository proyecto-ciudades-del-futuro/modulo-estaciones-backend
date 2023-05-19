import axios, {AxiosError} from "axios";
import {Sensor} from "../../types/Sensor";
import {ENTITIES_ORION_API_URL} from '../../globals/constants';
import {getStationDataById, updateStationById} from "../station/stationService";
import {Station, StationState} from "../../types/Station";
import {InternalError, NotFoundError} from "../../types/errors";


export const createSensor = async (sensor: Sensor): Promise<string> => {
    try {
        const sensorExistsResult = await sensorExists(sensor.id);
        if (!sensorExistsResult) {
            const stationData: Station | string = await getStationDataById(sensor.station_id.value);
            if (typeof stationData === "string") {
                return Promise.reject({code: 404, message: `Station with id ${sensor.station_id.value} not found`});
            }

            const sensorPayloadJSON = JSON.stringify(sensor);
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
                `${ENTITIES_ORION_API_URL}/${sensor.station_id.value}/attrs`,
                {sensors: {value: updatedSensors}}
            );
            return sensorResponse.statusText
        } else {
            return Promise.reject({code: 409, message: `Sensor with id ${sensor.id} already exists`})
        }
    } catch (e: any) {
        console.log(e)
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
        const response = await axios.get(`${ENTITIES_ORION_API_URL}/${sensorId}`);
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
    const sensors = await axios.get(`${ENTITIES_ORION_API_URL}?type=Sensor`);
    return sensors.data;
}

export const updateSensor = async (sensorId: string, sensorUpdatePayload: Sensor): Promise<void> => {
    try {
        if (!(sensorUpdatePayload?.station_id.value === "undefined")) {
            const sensor = await getSensor(sensorId);

            if (sensor.station_id.value !== sensorUpdatePayload.station_id.value) {
                console.log("getting station data by id")
                const station = await getStationDataById(sensorUpdatePayload.station_id.value);
                console.log(station)

                let replacedStation = replaceSensor(station, sensorId, sensorUpdatePayload); // assuming replaceSensor function is updated.
                // You should probably save this updated station back to your data source here.
                console.log("replacedStation sensors", replacedStation.sensors.value);
                const stationSensorsPayload = { sensors: {value: replacedStation.sensors.value}};
                updateStationById(replacedStation.id, stationSensorsPayload ) // call the function that updates the station in the database
            }
            const updatedSensor = await axios.patch(`${ENTITIES_ORION_API_URL}/${sensorId}/attrs`, sensorUpdatePayload);
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