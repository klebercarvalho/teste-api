import Joi from 'joi';

//import personSchema from './person';

export const discussionSchema = Joi.object({
  _id: Joi.string(),
  participants: Joi.array().required().min(2),
});

