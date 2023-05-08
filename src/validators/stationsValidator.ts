import Joi from 'joi';
import express from "express";

const stationCreateSchema = Joi.object({
    id: Joi.string()
        .pattern(/^station_([1-9]\d*)$/, 'no-leading-zero policy. Stations should not be like this: station_01 instead, station_1 is the correct')
        .required(),
    location: Joi.object({
        type: Joi.string().valid('geo:json').required(),
        value: Joi.object({
            type: Joi.string().valid('Point').required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required(),
        }),
        metadata: Joi.object().default({}).required(),
    }).required(),
    user: Joi.object({
        type: Joi.string().valid('Integer').required(),
        value: Joi.number().required(),
        metadata: Joi.object()
    }).required(),
    stationState: Joi.object({
        type: Joi.string().required(),
        metadata: Joi.object().default({}).required(),
        value: Joi.string().valid('ENABLED', 'DISABLED', 'IN APPROVAL').required()
    }).required(),
    description: Joi.object({
        type: Joi.string().required(),
        metadata: Joi.object().default({}).required(),
        value: Joi.string().required()
    }).required()
});


const stationUpdateSchema = Joi.object({
    location: Joi.object({
        type: Joi.string().valid('geo:json'),
        value: Joi.object({
            type: Joi.string().valid('Point'),
            coordinates: Joi.array().items(Joi.number()).length(2).required().messages({
                'any.required': `Coordinates should be provided as an array`
            }),
        }).required(),
        metadata: Joi.object().default({}),
    }).optional(),
    user: Joi.object({
        type: Joi.string().valid('Integer'),
        value: Joi.number().required(),
        metadata: Joi.object()
    }).optional(),
    stationState: Joi.object({
        type: Joi.string(),
        metadata: Joi.object().default({}),
        value: Joi.string().valid('ENABLED', 'DISABLED', 'IN APPROVAL').required()
    }).optional(),
    description: Joi.object({
        type: Joi.string(),
        metadata: Joi.object().default({}),
        value: Joi.string().required().messages({
            'any.required': `if you want to update {{#label}} is missing, the 'value' property is required`
        })
    }).optional()
})

export function validateCreateStation(req: express.Request, res: express.Response, next: express.NextFunction) {
    const {error} = stationCreateSchema.validate(req.body);
    if (error) {
        console.log(error)
        res.status(400).json({error: error.details[0].message});
    } else {
        console.log("VALIDATION PASSED")
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


