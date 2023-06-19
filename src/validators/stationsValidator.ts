import Joi from 'joi';
import express from "express";
import {SensorSchema} from "./sensorsValidator";


const stationCreateSchema = Joi.object({
    location: Joi.object({
        coordinates: Joi.alternatives().try(
            Joi.array().items(Joi.string()).length(2),
            Joi.array().items(Joi.number()).length(2)
        ),
        metadata: Joi.object().default({}).required().optional(),
    }).required(),
    user: Joi.object({
        value: Joi.string().required(),
        metadata: Joi.object()
    }).required(),
    description: Joi.object({
        metadata: Joi.object().default({}),
        value: Joi.string().required()
    }).required(),
})


const stationUpdateSchema = Joi.object({
    location: Joi.object({
        coordinates: Joi.alternatives().try(
            Joi.array().items(Joi.string()).length(2),
            Joi.array().items(Joi.number()).length(2)
        ).optional(),
        metadata: Joi.object().default({}).optional(),
    }).optional(),
    user: Joi.object({
        value: Joi.string().required(),
        metadata: Joi.object()
    }).optional(),
    stationState: Joi.object({
        metadata: Joi.object().default({}),
        value: Joi.string().valid('ENABLED', 'DISABLED', 'IN_APPROVAL', 'REJECTED').required()
    }).optional(),
    description: Joi.object({
        metadata: Joi.object().default({}),
        value: Joi.string().required().messages({
            'any.required': `if you want to update {{#label}} is missing, the 'value' property is required`
        })
    }).optional(),
    sensors: Joi.object({
        value: Joi.array().items(SensorSchema).required(),
        metadata: Joi.object().default({}).optional()
    }).optional()
});

export function validateCreateStation(req: express.Request, res: express.Response, next: express.NextFunction) {
    const {error} = stationCreateSchema.validate(req.body);
    if (error) {
        console.log(error)
        res.status(400).json({error: error.details[0].message});
    } else {
        next();
    }
}

export function validateUpdateStation(req: express.Request, res: express.Response, next: express.NextFunction) {
    const {error} = stationUpdateSchema.validate(req.body);
    if (error) {
        res.status(400).json({error: error.details[0].message});
    } else {
        next();
    }
}


