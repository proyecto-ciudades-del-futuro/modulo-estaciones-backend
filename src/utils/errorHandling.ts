import {Response} from 'express';
import {NotFoundError} from "../types/errors";

export const handleHttpErrors = (res: Response, error: any): void => {
    if(error instanceof NotFoundError){
        res.status(404).json({ error: error.message });
    } else if(error.response && error.response.status === 404 || error.code === 404) {
        res.status(404).json({ error: 'Entity not found' });
    } else {
        res.status(500).json({ error: error.message });
    }
};


