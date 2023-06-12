import { SensorController } from './SensorController'; // Use your actual file path
import * as services from '../../services/sensor/SensorService';
import axios from 'axios';
import { Request, Response } from 'express';
import { mocked } from 'ts-jest';
import { createResponse, createRequest } from 'node-mocks-http';

jest.mock('axios');
jest.mock('../../services/sensor/SensorService');

describe('SensorController', () => {
  let controller: SensorController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    controller = new SensorController();
    req = createRequest();
    res = createResponse();
  });

  describe('create', () => {
    it('creates a sensor and responds with 201 status', async () => {
      const sensorData = { id: '1', /* other properties... */ };
      req.body = sensorData;
      mocked(services.createSensor).mockResolvedValue(sensorData);

      await controller.create(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(res._getData()).toEqual(sensorData);
    });

    // Other test cases for create (error scenarios)...
  });

  describe('read', () => {
    it('fetches a sensor by ID and responds with 200 status', async () => {
      const sensorData = { id: '1', /* other properties... */ };
      req.params.id = '1';
      mocked(services.getSensor).mockResolvedValue(sensorData);

      await controller.read(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toEqual(sensorData);
    });

    // Other test cases for read (multiple sensors, error scenarios)...
  });

  describe('update', () => {
    it('updates a sensor and responds with 200 status', async () => {
      req.params.id = '1';
      req.body = { id: '1', /* new properties... */ };

      await controller.update(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toEqual({message: "Sensor updated successfully"});
    });

    // Other test cases for update (error scenarios)...
  });

  describe('delete', () => {
    it('deletes a sensor and responds with 204 status', async () => {
      req.params.id = '1';

      await controller.delete(req, res);

      expect(res._getStatusCode()).toBe(204);
    });

    // Other test cases for delete (error scenarios)...
  });
});
