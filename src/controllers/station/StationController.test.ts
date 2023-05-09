import axios from 'axios';
import MockAdapter from "axios-mock-adapter";
import {generateNewId} from "../../services/station/stationService";
import {ENTITIES_ORION_API_URL} from "../../globals/constants";
import {Request, Response} from 'express';
import {StationController} from "./StationController";

const mock = new MockAdapter(axios);

jest.mock('../../services/stationService', () => ({
    generateNewId: jest.fn(),
}));

const createMocks = (): { req: Partial<Request>; res: Partial<Response> } => {
    const req = {} as Partial<Request>;
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
    } as Partial<Response>;
    return {req, res}
}

describe('StationController', () => {
    let stationController: StationController;

    beforeEach(() => {
        stationController = new StationController();
        mock.reset();
    })

    describe('create', () => {
        it('Should create a new station successfully', async () => {
            const {req, res} = createMocks();
            req.body = {
                id: 'station_1',
                description: 'Test station',
                stationState: 'active',
                location: {
                    type: 'Point',
                    coordinates: [1, 1],
                },
                user: 'user1',
            };
            (generateNewId as jest.Mock).mockResolvedValue('station 1');

            mock.onPost(ENTITIES_ORION_API_URL).reply(201, {
                id: 'station_1',
            });

            await stationController.create(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({id: 'station_1'})
        })
    });
})