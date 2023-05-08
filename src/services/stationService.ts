import {ENTITIES_ORION_API_URL} from "../globals/constants";
import axios, {AxiosError} from "axios";


export const generateNewId = async (stationId: string): Promise<string> => {
    try {
        const response = await axios.get(`${ENTITIES_ORION_API_URL}/${stationId}`);

        // b) If the axios.get() returns an object, it means that the entity with the newId exists.
        // Reject the creation to the user.
        return Promise.reject('id already exists');
    } catch (error) {
        // Check if error is an instance of AxiosError
        if (axios.isAxiosError(error)) {
            const axiosError: AxiosError = error;

            // a) If the axios.get() request gets a 404 error, it means the entity doesn't exist.
            // Return the stationId, because it is valid.
            if (axiosError.response && axiosError.response.status === 404) {
                return stationId;
            }
        }

        // c) If any other error occurs, catch it and handle it appropriately.
        // You can throw an error or return an appropriate message.
        return Promise.reject('An unexpected error occurred');
    }
};

export const getEveryStationById = async (): Promise<any> => {
    try {
        const entityType = 'Station';
        const attribute = 'id';
        const response = await axios.get(`${ENTITIES_ORION_API_URL}/?type=${entityType}&attrs=${attribute}`);
        return response.data.map((item: { id: string, type: string})=> {
            return item.id
        });
    } catch (error) {
        return Promise.reject('An unexpected error occurred');
    }
}
