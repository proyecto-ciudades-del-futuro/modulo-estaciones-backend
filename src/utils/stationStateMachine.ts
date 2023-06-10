import {createMachine, MachineConfig, EventObject, interpret} from 'xstate';
import {STATION_STATE} from "../types/enums";


type StationContext = {
    // Define your context properties here
};

type StationStateSchema = {
    states: {
        IN_APPROVAL: {};
        ENABLED: {};
        DISABLED: {};
    };
};

type StationEvent =
    | { type: 'enable' }
    | { type: 'disable' }
    | { type: 're-enable' }
    | { type: 'adminOverride'; target: 'IN_APPROVAL' | 'ENABLED' | 'DISABLED' };

export const createStationStateMachineInterpreter = (
    initialState: 'IN_APPROVAL' | 'ENABLED' | 'DISABLED'
) => {
    const machineConfig: MachineConfig<
        StationContext,
        StationStateSchema,
        StationEvent
        > = {
        id: 'stations_state_machine',
        initial: initialState,
        states: {
            IN_APPROVAL: {
                on: {
                    enable: {
                        target: 'ENABLED',
                    },
                    adminOverride: {
                        target: ['IN_APPROVAL', 'ENABLED', 'DISABLED'],
                    },
                },
            },
            ENABLED: {
                on: {
                    disable: {
                        target: 'DISABLED',
                    },
                    adminOverride: {
                        target: ['IN_APPROVAL', 'ENABLED', 'DISABLED'],
                    },
                },
            },
            DISABLED: {
                on: {
                    'enable': {
                        target: 'ENABLED',
                    },
                    adminOverride: {
                        target: ['IN_APPROVAL', 'ENABLED', 'DISABLED'],
                    },
                },
            },
        },
        schema: {
            events: {
                type: 'enable' as const,
            },
        },
        predictableActionArguments: true,
    };

    const machine = createMachine(machineConfig);
    return interpret(machine).start();
};



/*
// Usage
const initialState = 'ENABLED'; // Example initial state
const stationStateMachine = createStationStateMachineInterpreter(initialState);


 */