import {Response} from 'express';

export const handleHttpStationErrors = (res: Response, error: any): void => {
    if (error.response && error.response.status === 404) {
        res.status(404).json({ error: 'Entity not found' });
    } else {
        res.status(500).json({ error: error.message });
    }
};