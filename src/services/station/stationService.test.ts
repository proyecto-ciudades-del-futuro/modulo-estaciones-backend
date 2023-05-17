import axios from 'axios';
import MockAdapter from "axios-mock-adapter";
import {generateNewId, getAvailableStates, getCurrentStationStateData} from "./stationService";
import {ENTITIES_ORION_API_URL} from "../../globals/constants";
import {createStationStateMachineInterpreter} from "../../utils/stationStateMachine";

const mock = new MockAdapter(axios);

describe('generateNewId test', () => {
    beforeEach(() => {
        mock.reset();
    })

    it('should return the same ID if it does not exist', async () => {
        const stationId = 'station_123';

        mock.onGet(`${ENTITIES_ORION_API_URL}/${stationId}`).reply(404);

        const newId = await generateNewId(stationId);
        expect(newId).toBe(stationId);
    });

    it('should reject with "id already exists" if the ID already exists', async () => {
        const stationId = 'station_123';

        mock.onGet(`${ENTITIES_ORION_API_URL}/${stationId}`).reply(200);

        try {
            await generateNewId(stationId);
        } catch (error) {
            expect(error).toBe('id already exists');
        }
    });

    it('should reject with "An unexpected error occurred" on other errors', async () => {
        const stationId = 'station_123';

        // Set up the mock for a 500 response (server error)
        mock.onGet(`${ENTITIES_ORION_API_URL}/${stationId}`).reply(500);

        try {
            await generateNewId(stationId);
        } catch (error) {
            expect(error).toBe('An unexpected error occurred');
        }
    });

})
/*
const mockcreateStationStateMachineInterpreter = jest.fn();
const mockGetAvailableStates = jest.fn();

jest.mock('../../utils/stationStateMachine', ()=> ({
    createStationStateMachineInterpreter: mockcreateStationStateMachineInterpreter
}));

jest.mock('./stationService', () => ({
    getAvailableStates: mockGetAvailableStates,
    getCurrentStationStateData: jest.fn()
}));


describe('State transitions tests', () => {
    it('checking set up', ()=> {

        expect(createStationStateMachineInterpreter).toHaveBeenCalled()
    })

})

 */