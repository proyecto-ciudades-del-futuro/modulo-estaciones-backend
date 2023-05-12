import {createMachine, GuardPredicate} from 'xstate';
import {STATION_STATE} from "../types/enums";


export const stationStateMachine = createMachine({
    id: "stations_state_machine",
    initial: "IN_APPROVAL",
    states: {
        IN_APPROVAL: {
            on: {
                "enable": {
                    target: STATION_STATE.ENABLED,
                },
                adminOverride: {
                    target: [STATION_STATE.IN_APPROVAL, STATION_STATE.ENABLED, STATION_STATE.DISABLED]
                },
            },
        },
        ENABLED: {
            on: {
                "disable": {
                    target: STATION_STATE.DISABLED,
                },
                adminOverride: {
                    target: [STATION_STATE.IN_APPROVAL, STATION_STATE.ENABLED, STATION_STATE.DISABLED], // allow to go to any state
                },
            },
        },
        DISABLED: {
            on: {
                "re-enable": {
                    target: STATION_STATE.IN_APPROVAL,
                },
                adminOverride: {
                    target: [STATION_STATE.IN_APPROVAL, STATION_STATE.ENABLED, STATION_STATE.DISABLED], // allow to go to any state
                },
            },
        },
    },
    schema: {events: {} as { type: "enable" } | { type: "disable" } | { type: "re-enable" } | { type: "adminOverride", target: STATION_STATE.IN_APPROVAL | STATION_STATE.ENABLED | STATION_STATE.DISABLED }},
    predictableActionArguments: true,
    preserveActionOrder: true,
});

