import {Request, Response} from 'express';
import axios from 'axios';
import {Station} from '../../types/Station';
import {DATES_OPTIONS_QUERY_PARAMS, ENTITIES_ORION_API_URL} from "../../globals/constants";
import {
    adaptResponseForClient, adaptResponseForClientList, checkAndCompleteLocation,
    getAvailableStates, getSensorsByStation,
    getStationsIdsList, tryTransition,
} from "../../services/station/stationService";
import {STATION_STATE} from "../../types/enums";
import {handleHttpErrors} from "../../utils/errorHandling";
import {generateNewId} from "../../services/globalServices";
import {StationCounterSingleton} from "../../services/counters/Counter";
import {parseToIntArray} from "../../utils";

export class StationController {
    async create(req: Request, res: Response): Promise<void> {
        const {description, location, user} = req.body;
        // Build payload for POST request to Orion Context Broker API
        try {
            const coords = parseToIntArray(location.coordinates);
            const newId = await generateNewId(StationCounterSingleton.getInstance(), 'station');
            const stationPayload: Station = {
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
            const stationPayloadJSON = JSON.stringify(stationPayload);
            // Send POST request to Orion Context Broker API to create new entity
            const response = await axios.post(ENTITIES_ORION_API_URL, stationPayloadJSON, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            res.status(201).json({id: stationPayload.id});
        } catch (error: any) {
            if (error === 'id already exists') {
                res.status(409).json({error});
            } else if (error === 'An unexpected error occurred') {
                // Handle the unexpected error as needed, e.g., log the error and return a custom status and message
                console.error('Unexpected error:', error);
                res.status(500).json({error: 'Internal server error'});
            } else {
                console.log("Handling other axios errors");
                // Handle other Axios errors
                res.status(error.response.status).json({error: `${error.code} | ${error.response.data.description}`});
            }
        }
    }

    async read(req: Request, res: Response): Promise<void> {
        try {
            if (req.params.id) {
                // Send GET request to Orion Context Broker API to retrieve entity by ID
                const stationId = req.params.id;
                const response = await axios.get(
                    `${ENTITIES_ORION_API_URL}/${stationId}/?${DATES_OPTIONS_QUERY_PARAMS}`
                );
                // Send response with entity data
                console.log(response.data);
                res.json(adaptResponseForClient(response));
            } else if (req.query.fields === 'id') {
                const response = await getStationsIdsList();
                res.json(response);
            } else {
                // Send GET request to Orion Context Broker API to retrieve all entities of type "Station"
                const response = await axios.get(
                    `${ENTITIES_ORION_API_URL}?type=Station&${DATES_OPTIONS_QUERY_PARAMS}`
                );
                // Send response with list of entities
                res.json(adaptResponseForClientList(response));
            }
        } catch (error: any) {
            handleHttpErrors(res, error);
        }
    }


    async update(req: Request, res: Response): Promise<void> {
        const stationId = req.params.id;
        const {stationState} = req.body;
        const {location} = req.body;
        try {
            if (stationState) {
                if (!await tryTransition(stationId, stationState.value)) {
                    res.status(400).json({error: 'State transition not allowed'})
                    return;
                }
            }

            if(location){
                req.body.location = checkAndCompleteLocation(req.body).location;
            }

            // Send PATCH request to Orion Context Broker API to update entity by ID
            let response = await axios.patch(
                `${ENTITIES_ORION_API_URL}/${stationId}/attrs`,
                req.body,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Send response with success status
            res.status(204).send();
        } catch (error: any) {
            handleHttpErrors(res, error);
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        const stationId = req.params.id;
        try {
            const hasSensors = await getSensorsByStation(req.params.id)

            // Send DELETE request to Orion Context Broker API to delete entity by ID
            if (hasSensors.length > 0) {
                res.status(400).json({error: 'Station has sensors, first remove or unbound sensors that depend on this station'})
            } else {
                await axios.delete(`${
                    ENTITIES_ORION_API_URL}/${stationId}`);
                // Send response with success status
                res.status(204).send();
            }

        } catch (error: any) {
            // Handle errors
            handleHttpErrors(res, error);
        }

    }

    async readAvailableStates(req: Request, res: Response): Promise<void> {
        const stationId = req.params.id;
        try {
            const availableStates = await getAvailableStates(stationId)
            res.status(200).json(availableStates)
        } catch (error) {
            console.log(error)
            handleHttpErrors(res, error);
        }
    }

}