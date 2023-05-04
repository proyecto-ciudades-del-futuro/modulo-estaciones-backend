import {Request, Response} from 'express';
import axios, {AxiosError} from 'axios';
import {NewStation, Station} from '../../types/Station';
import {ENTITIES_ORION_API_URL} from "../../globals/constants";

export class StationController {
    async create(req: Request, res: Response): Promise<void> {
        const {id, type, description, stationState, location, user} = req.body;
        // Build payload for POST request to Orion Context Broker API
        const stationPayload: Station = {
            id,
            type,
            description,
            location,
            user,
            stationState,
        };

        const stationPayloadJSON = JSON.stringify(stationPayload);
        try {
            // Send POST request to Orion Context Broker API to create new entity
            const response = await axios.post(
                ENTITIES_ORION_API_URL,
                stationPayloadJSON,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            res.status(201).json({id: response.data.id});

        } catch (error: any) {
            res.status(error.response.status).json({error: `${error.code} | ${error.response.data.description}`});
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
        } catch (error:any) {
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
            await axios.delete(`http://
  localhost:1026/v2/entities/${stationId}`);

            // Send response with success status
            res.status(204).send();
        } catch (error) {
            // Handle errors
            if (error.response && error.response.status === 404) {
                res.status(404).json({error: 'Entity not found'});
            } else {
                res.status(500).json({error: error.message});
            }
        }

    }

}