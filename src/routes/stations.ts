import express from 'express';
import {StationController} from '../controllers/station/StationController';

const stationRouter = express.Router();
const stationController = new StationController();

// Define routes for CRUD operations
stationRouter.post('/', stationController.create);
stationRouter.get('/:id', stationController.read);
stationRouter.patch('/:id', stationController.update);
stationRouter.delete('/:id', stationController.delete);

export default stationRouter;