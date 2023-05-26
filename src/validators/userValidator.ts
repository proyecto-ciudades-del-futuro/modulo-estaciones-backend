import Joi from 'joi';
import express from "express";


const userCreateSchema = Joi.object({
    name: Joi.object({
        value: Joi.string().required(),
        metadata: Joi.object().default({}).optional(),
    }).required(),
    lastName: Joi.object({
        value: Joi.string().required(),
        metadata: Joi.object().default({}).optional()
    }).required(),
    password: Joi.object({
        value: Joi.string().required(),
        metadata: Joi.object().default({}).optional(),
    }).required(),
    username: Joi.object({
        value: Joi.string().required(),
        metadata: Joi.object().default({}).optional(),
    }).required(),
    email: Joi.object({
        value: Joi.string().email().required(),
        metadata: Joi.object().default({}).optional(),
    }).required(),
})



const userUpdateSchema = Joi.object({
    name: Joi.object({
        value: Joi.string().required(),
        metadata: Joi.object().default({}).optional(),
    }).optional(),
    lastName: Joi.object({
        value: Joi.string().required(),
        metadata: Joi.object().default({}).optional()
    }).optional(),
    password: Joi.object({
        value: Joi.string().required(),
        metadata: Joi.object().default({}).optional(),
    }).optional(),
    username: Joi.object({
        value: Joi.string().required(),
        metadata: Joi.object().default({}).optional(),
    }).optional(),
    email: Joi.object({
        value: Joi.string().email().required(),
        metadata: Joi.object().default({}).optional(),
    }).optional(),
});

export function validateCreateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    const {error} = userCreateSchema.validate(req.body);
    if (error) {
        console.log(error)
        res.status(400).json({error: error.details[0].message});
    } else {
        next();
    }
}

export function validateUpdateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    const {error} = userUpdateSchema.validate(req.body);
    if (error) {
        res.status(400).json({error: error.details[0].message});
    } else {
        next();
    }
}


