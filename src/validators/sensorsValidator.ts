import Joi from 'joi';
import express from "express";
import {metadataPattern} from "./globalVariables";

export const SensorSchema = Joi.object({
    station_id: Joi.string()
        .pattern(/^station_([1-9]\d*)$/, 'no-leading-zero policy. Sensors should not be like this: station_01 instead, station_1 is the correct')
        .required(),
    description: Joi.object({
        value: Joi.string().required(),
        metadata: metadataPattern
    })
})


const SensorUpdateSchema = Joi.object({
    description: Joi.object({
        value: Joi.string().required(),
        metadata: metadataPattern
    }).optional()
});

export function validateCreateSensor(req: express.Request, res: express.Response, next: express.NextFunction) {
    const {error} = SensorSchema.validate(req.body);
    if (error) {
        console.log(error)
        res.status(400).json({error: error.details[0].message});
    } else {
        next();
    }
}


export function validateUpdateStation(req: express.Request, res: express.Response, next: express.NextFunction) {
    const {error} = SensorUpdateSchema.validate(req.body);
    if (error) {
        res.status(400).json({error: error.details[0].message});
    } else {
        next();
    }
}


