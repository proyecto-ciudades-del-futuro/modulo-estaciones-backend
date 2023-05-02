import Joi from 'joi';
import express from "express";

const stationEntitySchema = Joi.object({
    id: Joi.string().required(),
    type: Joi.string().required(),
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
    }),
    stationState: Joi.object({
        type: Joi.string().required(),
        metadata: Joi.object().default({}).required(),
        value: Joi.string().valid('ENABLED', 'DISABLED', 'IN APPROVAL').required()
    }),
    description: Joi.object({
        type: Joi.string().required(),
        metadata: Joi.object().default({}).required(),
        value: Joi.string().required()
    })
});

export function validateCreateStation(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { error, value } = stationEntitySchema.validate(req.body);
    if (error) {
        console.log(error)
        res.status(400).json({ error: error.details[0].message });
    } else {
        next();
    }
}
