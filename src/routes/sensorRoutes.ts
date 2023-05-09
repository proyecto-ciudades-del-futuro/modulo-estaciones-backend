import express from 'express';
import {StationController} from '../controllers/station/StationController';

import {validateCreateSensor, validateUpdateStation} from "../validators/sensorsValidator";

const sensorsRouter = express.Router();
const stationController = new StationController();

// Define routes for CRUD operations
sensorsRouter.post('/', validateCreateSensor ,stationController.create);
sensorsRouter.get('/:id', stationController.read);
sensorsRouter.get('/', stationController.read);
sensorsRouter.patch('/:id', validateUpdateStation, stationController.update);
sensorsRouter.delete('/:id', stationController.delete);

export default sensorsRouter;