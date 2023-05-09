import axios from 'axios';
import MockAdapter from "axios-mock-adapter";
import { generateNewId} from "./stationService";
import {ENTITIES_ORION_API_URL} from "../../globals/constants";

const mock = new MockAdapter(axios);

describe('generateNewId test', ()=> {
    beforeEach(()=> {
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