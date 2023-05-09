import axios from "axios";
import {Sensor} from "../../types/Sensor";
import {ENTITIES_ORION_API_URL} from '../../globals/constants';

export class SensorService {
    async createSensor(sensor: Sensor): Promise<Sensor> {
        // Create the sensor entity in Orion Context Broker
        // You may need to adjust this request based on your specific sensor data structure
        const sensorResponse = await axios.post(`${ENTITIES_ORION_API_URL}/v2/entities`, sensor.id);

        // Add the newly created sensor to the station's sensor list
        const updatedStation = await axios.patch(
            `${ENTITIES_ORION_API_URL}/v2/entities/${stationId}/attrs`,
            {sensors: {value: [...station.sensors.value, sensorResponse.data.id]}}
        );

        return sensorResponse.data;
    }

    async getSensor(sensorId: string): Promise<Sensor> {
        // Retrieve the sensor entity from Orion Context Broker
        const response = await axios.get(`${ENTITIES_ORION_API_URL}/v2/entities/${sensorId}`);
        return response.data;
    }

    async updateSensor(sensorId: string, updatedSensor: Sensor): Promise<void> {
        // Update the sensor entity in Orion Context Broker
        await axios.patch(`${ENTITIES_ORION_API_URL}/v2/entities/${sensorId}`, updatedSensor);
    }

}

