import Joi from 'joi';
import express from "express";


const configurationUpdateSchema = Joi.object({
  bad: Joi.alternatives().try(Joi.string(), Joi.number()),
  regular: Joi.alternatives().try(Joi.string(), Joi.number()),
  good: Joi.alternatives().try(Joi.string(), Joi.number()),
  nodata: Joi.alternatives().try(Joi.string(), Joi.number()),
});


export function validateUpdateConfiguration(req: express.Request, res: express.Response, next: express.NextFunction) {
  const {error} = configurationUpdateSchema.validate(req.body);
  if (error) {
    console.log(error)
    res.status(400).json({error: error.details[0].message});
  } else {
    next();
  }
}

