import {Station, StationDescription, StationResponse, User} from "../../types/Station";
import {STATION_STATE} from "../../types/enums";
import {GeoJson} from "../../types/globals";
import {AxiosResponse} from "axios/index";

export const  createStationPayload = (
  newId: string,
  description: StationDescription,
  coords: number[],
  location: GeoJson,
  user: User,
): Station => {
  return {
    id: newId,
    type: 'Station',
    description: {
      type: "String",
      value: description.value,
      metadata: description.metadata ?? {}
    },
    location: {
      type: "geo:json",
      value: {
        type: "Point",
        coordinates: coords,
      },
      metadata: location.metadata ?? {}
    },
    user: {
      type: "Relationship",
      value: user.value,
      metadata: user.metadata ?? {}
    },
    stationState: {
      type: "String",
      metadata: {},
      value: STATION_STATE.IN_APPROVAL
    },
    sensors: {
      type: "Array",
      value: [],
      metadata: {}
    }
  };
};
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