import Joi from 'joi';
import express from "express";


const userCreateSchema = Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    metadata: Joi.object().default({}).optional(),
})



const userUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    lastName: Joi.string().optional(),
    password: Joi.string().optional(),
    email: Joi.string().email().optional(),
    metadata: Joi.object().default({}).optional(),
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


