import { Request, Response } from "express";
import {
    createSensor,
    deleteSensorFromStation, getEverySensor,
    getSensor,
    updateSensor
} from '../../services/sensor/SensorService'
import { handleHttpErrors } from "../../utils/errorHandling";
import { ENTITIES_ORION_API_URL } from "../../globals/constants";
import axios from "axios";
import {OrionSensorPayload, Sensor} from "../../types/Sensor";
import {flattenSensorArrayPayload, flattenSensorPayload} from "../../services/sensor/SensorDataTransformationServices";
import {sensorFetcher} from "../../services/orionFetcher";

export class SensorController {

    async create(req: Request, res: Response): Promise<void> {
        try {
            const createdSensor = await createSensor(req.body);
            res.status(201).json(createdSensor);
        } catch (error: any) {
            if (error?.code === 409) {
                res.status(409).json({ error: error.message });
            } else if (error?.code === 404) {
                res.status(404).json({ error: error.message });
            } else {
                // Handle errors accordingly
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    async read(req: Request, res: Response): Promise<void> {
        try {
            if (req.params.id) {
                const sensor = await getSensor(req.params.id);
                console.log(sensor)
                res.status(200).json(flattenSensorPayload(sensor));
            } else {
                const sensors = await getEverySensor();
                res.status(200).json(flattenSensorArrayPayload(sensors));
            }
        } catch (error: any) {
            // Handle errors accordingly
            console.log(error)
            if (error?.response?.status === 404) {
                res.status(404).json({ error: "Sensor Not found" });
                return;
            }
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        const sensorId = req.params.id;
        const updatedSensor = req.body;

        try {
            await updateSensor(sensorId, updatedSensor);
            res.status(200).json({ message: "Sensor updated successfully" });
        } catch (error) {
            // Handle errors accordingly
            handleHttpErrors(res, error)
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        const sensorId = req.params.id;
        console.log(sensorId)
        try {
            // Eliminar el sensor de la estación
            const sensor = await getSensor(sensorId)
            await deleteSensorFromStation(sensor.station_id.value, sensorId)
            //Eliminar el sensor
            await axios.delete(`${ENTITIES_ORION_API_URL}/${sensorId}`);
            // Send response with success status
            res.status(204).send();
        }
        catch (error: any) {
            // Handle errors
            handleHttpErrors(res, error);
        }
    }
        
    /*
    async delete(req: Request, res: Response): Promise<void> {
        const sensorId = req.params.id;

        try {
            await deleteSensor(sensorId);
            res.status(204).send();
        } catch (error) {
            // Handle errors accordingly
            res.status(500).json({ error: "Internal server error" });
        }
    }

     */
}

