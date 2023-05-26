import Joi from "joi";

export const metadataPattern = Joi.object().pattern(Joi.string(), Joi.object({ value: Joi.alternatives().try(Joi.string(), Joi.number()).required(), type: Joi.string().optional() })).required()