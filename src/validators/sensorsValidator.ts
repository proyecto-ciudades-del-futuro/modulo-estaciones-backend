import Joi from 'joi';
import express from "express";

export const SensorSchema = Joi.object({
    id: Joi.string()
        .pattern(/^sensor_([1-9]\d*)$/, 'no-leading-zero policy. Sensors should not be like this: sensor_01 instead, sensor_1 is the correct')
        .required(),
    station_id: Joi.object({
        type: Joi.string(),
        value: Joi.string().pattern(/^station_([1-9]\d*)$/, 'no-leading-zero policy. Sensors should not be like this: station_01 instead, station_1 is the correct')
            .required(),
    }),
    type: Joi.string().required(),
    description: Joi.object({
        type: Joi.string().valid('String').required(),
        value: Joi.string().required(),
        metadata: Joi.object().unknown().required()
    })
})


const SensorUpdateSchema = Joi.object({
    station_id: Joi.object({
        value: Joi.string().pattern(/^station_([1-9]\d*)$/, 'no-leading-zero policy. Sensors should not be like this: station_01 instead, station_1 is the correct')
            .required(),
    }).optional(),
    description: Joi.object({
        type: Joi.string().valid('String').required(),
        value: Joi.string().required(),
        metadata: Joi.object().unknown().required()
    }).optional()
});

export function validateCreateSensor(req: express.Request, res: express.Response, next: express.NextFunction) {
    const {error} = SensorSchema.validate(req.body);
    if (error) {
        console.log(error)
        res.status(400).json({error: error.details[0].message});
    } else {
        console.log("VALIDATION PASSED")
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


