import { ObjectId } from 'mongodb';
import Joi from 'joi';

import { personSchema } from '../models/person';

export const personListAll = async (req, res, next) => {
  const { db } = req.app.locals;

  try {
    const personList = await db.collection('people')
      .find({})
      .toArray();
    res.status(200);
    res.body = { personList };
    next();
  } catch (err) {
    next(err);
  }
};

export const personListOne = async (req, res, next) => {
  const { db } = req.app.locals;
  const { id } = req.params;

  try {
    const person = await db.collection('people').findOne({ _id: ObjectId(id) });

    if (person) {
      res.status(200);
      res.body = person;
      next();
    } else {
      return res.status(404).json({
        status: 'fail',
        message:'Person not found' 
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const personCreate = async (req, res, next) => {
  const { db } = req.app.locals;
  const { name, email, password, cpf, phone, address } = req.body;
  const person = {
    name,
    email,
    password,
    cpf,
    phone,
    address,
  };

  try {
    await Joi.validate(person, personSchema);

    const result = await db.collection('people').insertOne(person);
    res.status(201).json({
      status: 'success',
      message:'Person was created' 
    });
  } catch(err) {
    return res.status(400).send({
      status: 'fail',
      message: err.message,
    });
  }
}

export const personUpdate = async (req, res, next) => {
  const { db } = req.app.locals;
  const { id } = req.params;
  const { name, email, password, cpf, phone, address } = req.body;
  const person = {
    name,
    email,
    password,
    cpf,
    phone,
    address,
  };

  try {
    const found = await db.collection('people').findOne({ _id: ObjectId(id) });
    if (!found) throw new Error('Person Not Found.');

    await Joi.validate(person, personSchema);

    const result = await db.collection('people').updateOne({ _id: found._id }, { $set: person });

    res.status(200).send(result);
  } catch(err) {
    if (err.message === 'Person Not Found.') {
      res.status(404);
    } else {
      res.status(400);
    }
    return res.json({
        status: 'fail',
        message: err.message,
      });
  }
}

export const personDelete = async (req, res, next) => {
  const { db } = req.app.locals;
  const { id } = req.params;

  try {
    const person = await db.collection('people').findOne({ _id: ObjectId(id) });
    if (person) {
      if (await db.collection('people').deleteOne(person)) {
        return res.status(200).json({
          status: 'success',
          data: null,
        });
      } else {
        return res.status(400).json({
          status: 'fail',
          message: 'Could not delete'
        });
      }
    } else {
      return res.status(404).json({
        status: 'fail',
        message: 'Person not found'
      });
    }
  } catch (err) {
    next(err);
  }
};

export const personPatch = async (req, res, next) => {
  const { db } = req.app.locals;
  const { id } = req.params;
  const { name, email, password, cpf, phone, address } = req.body;
  const fields = { name, email, password, cpf, phone, address };

  const set = Object.entries(fields).reduce((acc, item) => {
    const [key, value] = item;
    return (value ? { ...acc, [key]: value } : acc);
  }, {});

  try {
    const person = await db.collection('people').findOne({ _id: ObjectId(id) });
    if (!person) throw new Error('Person Not Found');

    const result = await db.collection('people').updateOne({ _id: person._id }, { $set: set });

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: 'Person Not Found'
    });
  }
}

