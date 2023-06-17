import {Request, Response} from "express";
import {handleHttpErrors} from "../../utils/errorHandling";
import {createUser, loginUser, logoutUser} from "../../services/user/UserService";

export class UserController {

    async create(req: Request, res: Response): Promise<void> {
        try {
            const user = await createUser(req.body);
            console.log(user);
            res.status(201).json(user);
        } catch (error: any) {
            if (error?.code === 409) {
                res.status(409).json({error: error.message});
            } else if (error?.code === 404) {
                res.status(404).json({error: error.message});
            } else {
                // Handle errors accordingly
                res.status(500).json({error: "Internal server error"});
            }
        }
    }
    /*
    async read(req: Request, res: Response): Promise<void> {
        try {
            if (req.params.id) {
                const sensor = await getSensor(req.params.id);
                res.status(200).json(sensor);
            } else {
                const sensors = await getEverySensor();
                res.status(200).json(sensors);
            }
        } catch (error: any) {
            // Handle errors accordingly
            if (error?.response?.status === 404) {
                res.status(404).json({error: "Sensor Not found"});
                return;
            }
            res.status(500).json({error: "Internal server error"});
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        const sensorId = req.params.id;
        const updatedSensor = req.body;

        try {
            await updateSensor(sensorId, updatedSensor);
            res.status(200).json({message: "Sensor updated successfully"});
        } catch (error) {
            // Handle errors accordingly
            handleHttpErrors(res, error)
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


    async login(req: Request, res: Response): Promise<void> {
        try {
            const token = await loginUser(req.body);
            console.log(token);
            res.status(200).json({token});
        } catch (error: any) {
            // Handle errors accordingly
            res.status(401).json({error: "Unauthorized"});
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            await logoutUser(req.body.token);
            res.status(200).json({message: 'Successfully logged out'});
        } catch (error: any) {
            // Handle errors accordingly
            res.status(500).json({error: "Internal server error"});
        }
    }
}
