import express from 'express';
import ConfigurationController from '../controllers/configuration/ConfigurationController';
import {validateUpdateConfiguration} from "../validators/configurationValidator";

const configurationRouter = express.Router();
const configurationController = new ConfigurationController();

configurationRouter.get('/', configurationController.getConfiguration);
configurationRouter.patch('/', validateUpdateConfiguration, configurationController.updateConfiguration);

export default configurationRouter;
