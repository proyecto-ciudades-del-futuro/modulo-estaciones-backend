import {ENTITIES_ORION_API_URL} from "../../globals/constants";
import axios, {AxiosError, AxiosResponse} from "axios";
import {createStationStateMachineInterpreter} from "../../utils/stationStateMachine";
import {Station, StationResponse, StationUpdate} from "../../types/Station";
import {Sensor} from "../../types/Sensor";
import {InternalError, NotFoundError} from "../../types/errors";
import {GeoJson, LocationUpdateContract} from "../../types/globals";


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
    await axios.get(`${ENTITIES_ORION_API_URL}/${stationId}`)
    return true;
  } catch (e: any) {
    if (e.response && e.response.status === 404) {
      return false;
    }
    // Return a rejected Promise with the error so that it can be caught and handled appropriately.
    return Promise.reject(new InternalError('Unknown error occurred'));

  }
}


export const adaptResponseForClient = (response: AxiosResponse): StationResponse => {
  return {
    id: response.data.id,
    user: response.data.user.value,
    description: {
      value: response.data.description.value,
      metadata: response.data.description.metadata
    },
    location: response.data.location.value.coordinates,
    sensors: response.data.sensors.value,
    stationState: response.data.stationState.value,
    dateCreated: response.data.dateCreated.value,
    dateModified: response.data.dateModified.value
  }
}

export const adaptResponseForClientList = (response: AxiosResponse): StationResponse[] => {
  return response.data.map((station: Station) => {
    console.log(station)
    return {
      id: station.id,
      user: station.user.value,
      description: {
        value: station.description.value,
        metadata: station.description.metadata
      },
      location: station.location.value.coordinates,
      sensors: station.sensors.value,
      stationState: station.stationState.value,
      dateCreated: station.dateCreated?.value,
      dateModified: station.dateModified?.value
    }
  })
}


export function checkAndCompleteLocation(data: LocationUpdateContract): GeoJson {
  console.log("DATA")
  console.log(data)
  const location: GeoJson = {
    type: "geo:json",
    value: {
      type: "Point",
      coordinates: data?.coordinates || [0, 0]
    },
    metadata: data?.metadata || {}
  };
  console.log("RESPONSE DATA")
  console.log(location)
  return location;
}