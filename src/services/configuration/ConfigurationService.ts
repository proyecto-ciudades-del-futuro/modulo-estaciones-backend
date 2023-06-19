import axios from 'axios';
import {ENTITIES_ORION_API_URL} from "../../globals/constants";

class ConfigurationService {
  private ORION_SERVER_URL = ENTITIES_ORION_API_URL;

  public async createConfigurationIfNotExists() {
    try {
      await axios.get(`${this.ORION_SERVER_URL}/Configuration`);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        const config = {
          id: "Configuration",
          type: "Configuration",
          NoData: {
            type: "Integer",
            value: 0
          },
          Regular: {
            type: "Integer",
            value: 0
          },
          Bad: {
            type: "Integer",
            value: 0
          },
          Good: {
            type: "Integer",
            value: 0
          }
        };
        await axios.post(`${this.ORION_SERVER_URL}`, config);
      }
    }
  }

  public async getConfiguration() {
    const response = await axios.get(`${this.ORION_SERVER_URL}/Configuration`);
    return response.data;
  }

  public async updateConfiguration(config: any) {
    const response = await axios.patch(`${this.ORION_SERVER_URL}/Configuration/attrs`, config);
    console.log(response)
    return response.data;
  }
}

export default ConfigurationService;



