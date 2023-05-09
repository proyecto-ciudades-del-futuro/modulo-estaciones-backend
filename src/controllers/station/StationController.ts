import {Request, Response} from 'express';
import axios from 'axios';
import {Station} from '../../types/Station';
import {ENTITIES_ORION_API_URL} from "../../globals/constants";
import {generateNewId, getEveryStationById} from "../../services/station/stationService";
import {STATION_STATE} from "../../types/enums";

export class StationController {
    async create(req: Request, res: Response): Promise<void> {
        const {id, description, location, user} = req.body;
        // Build payload for POST request to Orion Context Broker API

        try {
            const newId = await generateNewId(id);

            const stationPayload: Station = {
                id: newId,
                type: 'Station',
                description,
                location,
                user,
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
            res.status(201).json({id: response.data.id});
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
                    `${ENTITIES_ORION_API_URL}/${stationId}`
                );
                // Send response with entity data
                res.json(response.data);
            } else if (req.query.fields === 'id') {
                const response = await getEveryStationById();
                res.json(response);
            } else {
                // Send GET request to Orion Context Broker API to retrieve all entities of type "Station"
                const response = await axios.get(
                    `${ENTITIES_ORION_API_URL}?type=Station`
                );
                // Send response with list of entities
                res.json(response.data);
            }
        } catch (error: any) {
            // Handle errors
            if (error.response && error.response.status === 404) {
                res.status(404).json({error: 'Entity not found'});
            } else {
                res.status(500).json({error: error.message});
            }
        }
    }


    async update(req: Request, res: Response): Promise<void> {
        const stationId = req.params.id;
        try {
            // Send PATCH request to Orion Context Broker API to update entity by ID
            let response = await axios.patch(
                `http://localhost:1026/v2/entities/${stationId}/attrs`,
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
            // Handle errors
            if (error.response && error.response.status === 404) {
                res.status(404).json({error: 'Entity not found'});
            } else {
                res.status(500).json({error: error.message});
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        const stationId = req.params.id;
        try {
            // Send DELETE request to Orion Context Broker API to delete entity by ID
            await axios.delete(`${
                ENTITIES_ORION_API_URL}/${stationId}`);
            // Send response with success status
            res.status(204).send();
        } catch (error: any) {
            // Handle errors
            if (error.response && error.response.status === 404) {
                res.status(404).json({error: 'Entity not found'});
            } else {
                res.status(500).json({error: error.message});
            }
        }

    }

}