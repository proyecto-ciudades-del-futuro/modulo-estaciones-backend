import {Request, Response} from 'express';
import axios from 'axios';
import {NewStation, Station} from '../../types/Station';

export class StationController {
    async create(req: Request, res: Response): Promise<void> {

        const {description, state, locationId, userId} = req.body;
        // Build payload for POST request to Orion Context Broker API
        const stationPayload: Station = {
            id: 'station-1',
            type: 'station',
            description: { description: description},
            location: {locationId: locationId},
            userId: {userId: userId},
            lastUpdate: { lastUpdate: Date.now().toString()}
        };


        try {
            // Send POST request to Orion Context Broker API to create new entity
            const stationPayloadJSON = JSON.stringify(stationPayload);
            console.log("interacting with context broker")
            console.log(stationPayloadJSON)
            const response = await axios.post(
                'http://localhost:1026/v2/entities',
                stationPayloadJSON,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );



            // Send response with entity ID
            res.status(201).json({id: response.data.id});
        } catch (error: any) {
            // Handle errors
            res.status(500).json({error: error.message});
        }
    }

    async read(req: Request, res: Response): Promise<void> {
        const stationId = req.params.id;

        try {
            // Send GET request to Orion Context Broker API to retrieve entity by ID
            const response = await axios.get(
                `http://localhost:1026/v2/entities/${stationId}`
            );

            // Send response with entity data
            res.json(response.data);
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
        const {description, state, locationId, userId} = req.body;

        // Build payload for PATCH request to Orion Context Broker API
        /*
        const payload = {};
        if (payloaddescription) {
            payload.description = {value: description};
        }
        if (state) {
            payload.state = {value: state};
        }
        if (locationId) {
            payload.locationId = {value: locationId};
        }
        if (userId) {
            payload.userId = {value: userId};
        }

        try {
            // Send PATCH request to Orion Context Broker API to update entity by ID
            await axios.patch(
                `http://localhost:1026/v2/entities/${stationId}/attrs`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

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

         */
    }

    async delete(req: Request, res: Response): Promise<void> {
        const stationId = req.params.id;
        /*
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
         */

    }

}