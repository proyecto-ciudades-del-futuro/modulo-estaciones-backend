import { Request, Response } from "express";
import { SensorService } from "../services/SensorService";

export class SensorController {


    async create(req: Request, res: Response): Promise<void> {
        const { stationId, sensor } = req.body;

        try {
            const createdSensor = await createSensor(stationId, sensor);
            res.status(201).json(createdSensor);
        } catch (error) {
            // Handle errors accordingly
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async read(req: Request, res: Response): Promise<void> {
        const sensorId = req.params.id;

        try {
            const sensor = await getSensor(sensorId);
            res.status(200).json(sensor);
        } catch (error) {
            // Handle errors accordingly
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
            res.status(500).json({ error: "Internal server error" });
        }
    }

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
}
