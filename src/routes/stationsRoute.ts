import express from 'express';
import {StationController} from '../controllers/station/StationController';
import {validateCreateStation} from "../validators/stationsValidator";

const stationRouter = express.Router();
const stationController = new StationController();

// Define routes for CRUD operations
stationRouter.post('/', validateCreateStation ,stationController.create);
stationRouter.get('/:id', stationController.read);
stationRouter.get('/', stationController.read);
stationRouter.patch('/:id', stationController.update);
stationRouter.delete('/:id', stationController.delete);

export default stationRouter;