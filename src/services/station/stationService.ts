import {ENTITIES_ORION_API_URL} from "../../globals/constants";
import axios, {AxiosError} from "axios";
import {interpret} from 'xstate';
import {STATION_STATE} from "../../types/enums";
import {createStationStateMachineInterpreter} from "../../utils/stationStateMachine";


export type InitialStates = 'IN_APPROVAL' | 'ENABLED' | 'DISABLED';


type TransitionAction = { type: 'enable' } | { type: 'disable' } | { type: 're-enable' };

const transitionActions: { [key in 'ENABLED' | 'IN_APPROVAL' | 'DISABLED']: TransitionAction } = {
    ENABLED: { type: 'enable' },
    IN_APPROVAL: { type: 're-enable' },
    DISABLED: { type: 'disable' },
};


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
        return response.data.map((item: { id: string, type: string }) => {
            return item.id
        });
    } catch (error) {
        return Promise.reject('An unexpected error occurred');
    }
}


export const getAvailableStates = async (stationId: string): Promise<object> => {
    const currentStationState = await getCurrentStationData(stationId);
    const interpreter = createStationStateMachineInterpreter(currentStationState.value)
    const nextPossibleEvents = interpreter.state.nextEvents;
    return nextPossibleEvents;
}

export const tryTransition = async (
    stationId: string,
    intendedState: 'ENABLED' | 'IN_APPROVAL' | 'DISABLED'
): Promise<boolean> => {
    const currentStationState = await getCurrentStationData(stationId);
    const interpreter = createStationStateMachineInterpreter(currentStationState.value);
    const action = transitionActions[intendedState];
    return interpreter.initialState.can(action);
};


export const getCurrentStationData = async (stationId: string): Promise<{ type: string; value: InitialStates; metadata: object }> => {
    const currentState = await axios.get(`${ENTITIES_ORION_API_URL}/${stationId}`);
    return currentState.data.stationState;
}