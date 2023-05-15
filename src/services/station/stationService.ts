import {ENTITIES_ORION_API_URL} from "../../globals/constants";
import axios, {AxiosError} from "axios";
import {interpret} from 'xstate';
import {STATION_STATE} from "../../types/enums";
import {createStationStateMachine} from "../../utils/stationStateMachine";

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


export const getAvailableStates = async (stationId: string): Promise<object> => {
    const currentStationState = await getCurrentStationData(stationId);
    const interpreter = createStationStateMachineInterpreter(currentStationState.value)
    const nextPossibleEvents = interpreter.state.nextEvents;
    console.log(" NEXT POSSIBLE EVENTS")
    console.log(nextPossibleEvents)
    console.log("EVERY EVENT")
    console.log(interpreter.state.events)
    console.log(interpreter.machine.events)
    console.log("CAN ANSWER")
    console.log(interpreter.initialState.can({type: 'enable'}))
    return {};
}

export const tryTransition = async (stationId: string, intendedState: 'ENABLE' | 'IN_APPROVAL' | 'DISABLE'): Promise<boolean> => {
    const currentStationState = await getCurrentStationData(stationId);
    const interpreter = createStationStateMachineInterpreter(currentStationState.value)
    let answer: boolean;
    switch (intendedState){
        case 'IN_APPROVAL':
            answer = interpreter.initialState.can({type: 're-enable'});
            break;
        case 'ENABLE':
            answer = interpreter.initialState.can({type: 'enable'});
            break;
        case 'DISABLE':
            answer = interpreter.initialState.can({type: 'disable'})
    }
    return answer;
}

const createStationStateMachineInterpreter = (
    initialState: 'IN_APPROVAL' | 'ENABLED' | 'DISABLED'
) => {
    const stationStateMachine = createStationStateMachine(initialState);
    return interpret(stationStateMachine).start();
};


export const getCurrentStationData = async (stationId: string): Promise<{ type: string; value: 'IN_APPROVAL' | 'ENABLED' | 'DISABLED'; metadata: object }> =>{
    const currentState = await axios.get(`${ENTITIES_ORION_API_URL}/${stationId}`);
    console.log(currentState.data.stationState);
    return currentState.data.stationState;
}