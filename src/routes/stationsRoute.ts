import express from 'express';
import {StationController} from '../controllers/station/StationController';
import {validateCreateStation, validateUpdateStation} from "../validators/stationsValidator";
import {getEveryStationById} from "../services/stationService";

const stationRouter = express.Router();
const stationController = new StationController();

// Define routes for CRUD operations
stationRouter.post('/', validateCreateStation ,stationController.create);
stationRouter.get('/:id', stationController.read);
stationRouter.get('/', stationController.read);
stationRouter.patch('/:id', validateUpdateStation, stationController.update);
stationRouter.delete('/:id', stationController.delete);

export default stationRouter;