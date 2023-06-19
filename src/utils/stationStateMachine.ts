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
        REJECTED: {}
    };
};

type StationEvent =
    | { type: 'enable' }
    | { type: 'disable' }
    | { type: 're-enable' }
    | { type: 'reject' }
    | { type: 'adminOverride'; target: 'IN_APPROVAL' | 'ENABLED' | 'DISABLED' | 'REJECTED' };

export const createStationStateMachineInterpreter = (
  initialState: 'IN_APPROVAL' | 'ENABLED' | 'DISABLED' | 'REJECTED'
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
                    reject: {
                        target: 'REJECTED',
                    },
                    enable: {
                        target: 'ENABLED',
                    },
                    adminOverride: {
                        target: ['IN_APPROVAL', 'ENABLED', 'DISABLED', 'REJECTED'],
                    },
                },
            },
            REJECTED: {
                on: {
                    enable: {
                        target: 'ENABLED',
                    },
                    adminOverride: {
                        target: ['IN_APPROVAL', 'ENABLED', 'DISABLED', 'REJECTED'],
                    },
                },
            },
            ENABLED: {
                on: {
                    disable: {
                        target: 'DISABLED',
                    },
                    adminOverride: {
                        target: ['IN_APPROVAL', 'ENABLED', 'DISABLED', 'REJECTED'],
                    },
                },
            },
            DISABLED: {
                on: {
                    'enable': {
                        target: 'ENABLED',
                    },
                    adminOverride: {
                        target: ['IN_APPROVAL', 'ENABLED', 'DISABLED', 'REJECTED'],
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


