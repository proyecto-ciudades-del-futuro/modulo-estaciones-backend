import {DATES_OPTIONS_QUERY_PARAMS, ENTITIES_ORION_API_URL} from "../../globals/constants";
import axios, {AxiosError, AxiosResponse} from "axios";
import {createStationStateMachineInterpreter} from "../../utils/stationStateMachine";
import {Station, StationUpdate} from "../../types/Station";
import {Sensor} from "../../types/Sensor";
import {InternalError, NotFoundError} from "../../types/errors";
import {GeoJson, LocationUpdateContract} from "../../types/globals";
import  {Request} from 'express'
import {convertStringsToNumbers} from "../../utils";


export type InitialStates = 'IN_APPROVAL' | 'ENABLED' | 'DISABLED';


export type TransitionAction = { type: 'enable' } | { type: 'disable' } | { type: 're-enable' };

export const transitionActions: { [key in 'ENABLED' | 'IN_APPROVAL' | 'DISABLED']: TransitionAction } = {
  ENABLED: {type: 'enable'},
  IN_APPROVAL: {type: 're-enable'},
  DISABLED: {type: 'disable'},
};


export const getStationsIdsList = async (): Promise<any> => {
  try {
    const entityType = 'Station';
    const attribute = 'id';
    const response = await axios.get(`${ENTITIES_ORION_API_URL}/?type=${entityType}&attrs=${attribute}`);
    return response.data.map((item: { id: string, type: string }) => {
      return item.id
    });
  } catch (error) {
    return Promise.reject('An unexpected error occurred');
  }
}


export const getAvailableStates = async (stationId: string): Promise<object> => {
  const currentStationState = await getCurrentStationStateData(stationId);
  const interpreter = createStationStateMachineInterpreter(currentStationState.value)
  const nextPossibleEvents = interpreter.state.nextEvents;
  return nextPossibleEvents;
}

export const tryTransition = async (
  stationId: string,
  intendedState: 'ENABLED' | 'IN_APPROVAL' | 'DISABLED'
): Promise<boolean> => {
  const currentStationState = await getCurrentStationStateData(stationId);
  const interpreter = createStationStateMachineInterpreter(currentStationState.value);
  const action = transitionActions[intendedState];
  console.log("action -> " + action)
  console.dir(action)
  console.log("can  "+ interpreter.initialState.can(action))
  return interpreter.initialState.can(action);
};



export const getCurrentStationStateData = async (stationId: string): Promise<{ type: string; value: InitialStates; metadata: object }> => {
  const currentState = await axios.get(`${ENTITIES_ORION_API_URL}/${stationId}`);
  return currentState.data.stationState;
}

export const getStationDataById = async (stationId: string): Promise<Station> => {
  try {
    const response = await axios.get(`${ENTITIES_ORION_API_URL}/${stationId}`);
    return response.data;  // return station data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      if (axiosError.response && axiosError.response.status === 404) {
        return Promise.reject(new NotFoundError(`Station with id ${stationId} not found`));
      }
    }
    // return error if something unknown happens
    return Promise.reject(new InternalError('Unknown error occurred'));
  }
}

export async function updateStationById(stationId: string, data: StationUpdate): Promise<AxiosResponse> {
  const url = `${ENTITIES_ORION_API_URL}/${stationId}/attrs`;

  return await axios.patch(url, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}


export async function getSensorsByStation(stationId: string): Promise<Sensor[] | []> {
  try {
    const url = `${ENTITIES_ORION_API_URL}/${stationId}/attrs/sensors/value`;
    const response = await axios.get(url);
    console.log(response)
    return response.data;
  } catch (error: any) {
    return []
  }
}


export const stationExists = async (stationId: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${ENTITIES_ORION_API_URL}/${stationId}`)
    console.log("RESPONSE STATIONS EXISTS");
    console.log(response);
    return true;
  } catch (e: any) {
    if (e.response && e.response.status === 404) {
      return false;
    }
    // Return a rejected Promise with the error so that it can be caught and handled appropriately.
    return Promise.reject(new InternalError('Unknown error occurred'));

  }
}


export function checkAndCompleteLocation(data: LocationUpdateContract): GeoJson {
  const location: GeoJson = {
    type: "geo:json",
    value: {
      type: "Point",
      coordinates: convertStringsToNumbers(data.coordinates) || [0, 0]
    },
    metadata: data?.metadata || {}
  };
  console.log("RESPONSE DATA")
  console.log(location)
  return location;
}

