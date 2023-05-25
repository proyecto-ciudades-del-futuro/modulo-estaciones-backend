import {SENSOR_COUNT_API_URL, STATION_COUNT_API_URL} from "../../globals/constants";
import axios, {AxiosResponse} from "axios";
import {InternalError} from "../../types/errors";


export abstract class Counter {
    protected API_URL: string;

    constructor(API_URL: string) {
        this.API_URL = API_URL;
    }

    async getCount(): Promise<number> {
        try {
            const response: AxiosResponse = await axios.get(this.API_URL)
            return response.data.count.value;
        } catch (e: any) {
            throw new InternalError(e);
        }
    }

    async incrementCount(): Promise<number> {
        try {
            const countValue = await this.getCount()
            const incrementPayload = { count: { value: countValue + 1 }};
            await axios.patch(`${this.API_URL}/attrs`, incrementPayload );
            return countValue + 1;
        } catch (e: any) {
            throw new  InternalError(e);
        }
    }
}


export class StationCounterSingleton extends Counter {
    private static instance: StationCounterSingleton;
    private constructor() {
        super(STATION_COUNT_API_URL);
    }

    public static getInstance(): StationCounterSingleton {
        if(!StationCounterSingleton.instance){
            StationCounterSingleton.instance = new StationCounterSingleton()
        }
        return StationCounterSingleton.instance;
    }

}


export class SensorCounterSingleton extends Counter {
    private static instance: SensorCounterSingleton;

    private constructor() {
        super(SENSOR_COUNT_API_URL);
    }

    public static getInstance(): SensorCounterSingleton {
        if(!SensorCounterSingleton.instance){
            SensorCounterSingleton.instance = new SensorCounterSingleton();
        }
        return SensorCounterSingleton.instance;
    }

}

