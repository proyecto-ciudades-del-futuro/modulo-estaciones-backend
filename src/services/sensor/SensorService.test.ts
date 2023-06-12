import { updateSensor } from './SensorService'; // Use your actual file path
import * as services from './SensorService'; // Use your actual file path
import axios from 'axios';
import { NotFoundError, InternalError } from '../../types/errors';
import {ENTITIES_ORION_API_URL} from "../../globals/constants"; // Use your actual file paths

jest.mock('axios');
jest.mock('./sensor-service'); // Use your actual file path

describe('updateSensor', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockedServices = services as jest.Mocked<typeof services>;

  const sensorId = '1';
  const sensorUpdatePayload = {
    station_id: 'station1'
  };
  const sensor = { station_id: { value: 'station2' } };

  beforeEach(() => {
    mockedServices.getSensor.mockResolvedValue(sensor);
    mockedServices.stationExists.mockResolvedValue(true);
  });

  it('updates sensor and patches new data', async () => {
    await updateSensor(sensorId, sensorUpdatePayload);

    expect(mockedServices.getSensor).toHaveBeenCalledWith(sensorId);
    expect(mockedServices.stationExists).toHaveBeenCalledWith(sensorUpdatePayload.station_id);
    expect(mockedServices.deleteSensorFromStation).toHaveBeenCalledWith(sensor.station_id.value, sensorId);
    expect(mockedServices.addSensorToStation).toHaveBeenCalledWith(sensorUpdatePayload.station_id, sensor);
    expect(mockedAxios.patch).toHaveBeenCalledWith(`${ENTITIES_ORION_API_URL}/${sensorId}/attrs`, expect.any(Object));
  });

  it('throws NotFoundError if getSensor throws NotFoundError', async () => {
    mockedServices.getSensor.mockRejectedValue(new NotFoundError('Not found'));

    await expect(updateSensor(sensorId, sensorUpdatePayload)).rejects.toThrow(NotFoundError);
  });

  it('throws InternalError for other exceptions', async () => {
    mockedServices.getSensor.mockRejectedValue(new Error('Unexpected error'));

    await expect(updateSensor(sensorId, sensorUpdatePayload)).rejects.toThrow(InternalError);
  });
});
