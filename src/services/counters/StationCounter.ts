import {STATION_COUNT_API_URL} from "../../globals/constants";
import axios, {AxiosResponse} from "axios";
import {InternalError} from "../../types/errors";


export class StationCounter {
    static async getStationCount(): Promise<number> {
        try {
            const response: AxiosResponse = await axios.get(STATION_COUNT_API_URL)
            return response.data.count.value;
        } catch (e: any) {
            throw new InternalError(e);
        }
    }
    static async incrementStationCount(): Promise<number> {
        try {
            const countValue = await this.getStationCount()
            const incrementPayload = { count: { value: countValue + 1 }};
            await axios.patch(`${STATION_COUNT_API_URL}/attrs`, incrementPayload );
            return countValue+1
        } catch (e: any) {
           throw new InternalError(e);
        }
    }
}