import axios, { AxiosResponse } from 'axios';
import { Request } from 'express';
import {DATES_OPTIONS_QUERY_PARAMS, ENTITIES_ORION_API_URL} from "../../globals/constants";

export class OrionFetcher {
  private baseURL: string;
  private entityType: string;

  constructor(baseURL: string, entityType: string) {
    this.baseURL = baseURL;
    this.entityType = entityType;
  }

  public async fetchEntities(req: Request): Promise<AxiosResponse> {
    const baseParams = `type=${this.entityType}&${DATES_OPTIONS_QUERY_PARAMS}`;
    const offset = req.query.offset ? `&offset=${req.query.offset}` : '';
    const limit = req.query.limit ? `&limit=${req.query.limit}` : '';
    const url = `${this.baseURL}?${baseParams}${offset}${limit}`;
    return await axios.get(url);
  }
}


export const stationFetcher = new OrionFetcher(ENTITIES_ORION_API_URL, 'Station');
export const sensorFetcher = new OrionFetcher(ENTITIES_ORION_API_URL, 'Sensor');
export const userFetcher = new OrionFetcher(ENTITIES_ORION_API_URL, 'User');
