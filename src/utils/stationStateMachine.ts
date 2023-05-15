import { createMachine, MachineConfig, EventObject } from 'xstate';
import {STATION_STATE} from "../types/enums";

/*
export const stationStateMachine = createMachine({
    id: "stations_state_machine",
    initial: "IN_APPROVAL",
    states: {
       "IN_APPROVAL" : {
            on: {
                "enable": {
                    target: "ENABLED",
                },
                adminOverride: {
                    target: ["IN_APPROVAL", "ENABLED", "DISABLED"]
                },
            },
        },
        "ENABLED": {
            on: {
                "disable": {
                    target: "DISABLED",
                },
                adminOverride: {
                    target: ["IN_APPROVAL", "ENABLED", "DISABLED"], // allow to go to any state
                },
            },
        },
        "DISABLED": {
            on: {
                "re-enable": {
                    target: "IN_APPROVAL",
                },
                adminOverride: {
                    target: ["IN_APPROVAL", "ENABLED", "DISABLED"], // allow to go to any state
                },
            },
        },
    },
    schema: {events: {} as { type: "enable" } | { type: "disable" } | { type: "re-enable" } | { type: "adminOverride", target: "IN_APPROVAL" | "ENABLED" | "DISABLED" }},
    predictableActionArguments: true,
});



 */



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

export const createStationStateMachine = (
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
                    're-enable': {
                        target: 'IN_APPROVAL',
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

    return createMachine(machineConfig);
};
/*
// Usage
const initialState = 'ENABLED'; // Example initial state
const stationStateMachine = createStationStateMachine(initialState);


 */