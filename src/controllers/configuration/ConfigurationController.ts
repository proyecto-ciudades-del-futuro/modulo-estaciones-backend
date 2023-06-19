import { Request, Response } from 'express';
import ConfigurationService from './../../services/configuration/ConfigurationService'
import {
  restructureForGetRequest,
  restructureForPatchRequest
} from "../../services/configuration/ConfigurationDataTransformService";

class ConfigurationController {
  private configurationService: ConfigurationService;

  constructor() {
    this.configurationService = new ConfigurationService();
  }

  getConfiguration = async (req: Request, res: Response) => {
    try {
      const config = await this.configurationService.getConfiguration();
      res.json(restructureForGetRequest(config));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  updateConfiguration = async (req: Request, res: Response) => {
    try {
      const newConfig = req.body;
      await this.configurationService.updateConfiguration(restructureForPatchRequest(newConfig));
      res.json({ message: 'Configuration updated successfully.' });
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  };
}

export default ConfigurationController;
