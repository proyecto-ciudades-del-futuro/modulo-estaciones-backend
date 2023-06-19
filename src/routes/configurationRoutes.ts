import express from 'express';
import ConfigurationController from '../controllers/configuration/ConfigurationController';

const configurationRouter = express.Router();
const configurationController = new ConfigurationController();

configurationRouter.get('/', configurationController.getConfiguration);
configurationRouter.patch('/', configurationController.updateConfiguration);

export default configurationRouter;
