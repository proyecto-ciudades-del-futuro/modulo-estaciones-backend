import Joi from "joi";

export const metadataPattern = Joi.object().pattern(Joi.string(), Joi.object({
  value: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.object()).required(),
  type: Joi.string().optional()
})).optional()