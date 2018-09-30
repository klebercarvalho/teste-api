import Joi from 'joi';

export const personSchema = Joi.object({
  _id: Joi.string(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  cpf: Joi.string(),
  phone: Joi.string(),
  address: Joi.string(),
});

