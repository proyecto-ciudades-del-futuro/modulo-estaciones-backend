import express from 'express';

import {validateCreateSensor, validateUpdateStation} from "../validators/sensorsValidator";
import {SensorController} from "../controllers/sensor/SensorController";

const sensorsRouter = express.Router();
const sensorController = new SensorController();

// Define routes for CRUD operations
sensorsRouter.post('/', validateCreateSensor ,sensorController.create);
sensorsRouter.get('/:id', sensorController.read);
sensorsRouter.get('/', sensorController.read);
sensorsRouter.patch('/:id', validateUpdateStation, sensorController.update);
sensorsRouter.delete('/:id', sensorController.delete);

export default sensorsRouter;