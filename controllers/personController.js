import { ObjectId } from 'mongodb';
import Joi from 'joi';

import { personSchema } from '../models/person';

export const personListAll = async (req, res, next) => {
  const { db } = req.app.locals;

  try {
    const personList = await db.collection('people')
      .find({})
      .toArray();
    res.status(200).send(personList);
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
      res.status(200).send(person);
    } else {
      res.status(404).send('Person not found');
    }
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
    res.status(201).end();
  } catch(err) {
    return res.status(400).send(err.message);
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
    if (!found) throw new Error('Not Found.');

    await Joi.validate(person, personSchema);

    const result = await db.collection('people').updateOne({ _id: found._id }, { $set: person });

    res.status(200).send(result);
  } catch(err) {
    if (err.message === 'Not Found.') {
      return res.status(404).send(err.message);
    }
    return res.status(400).send(err.message);
  }
}

export const personDelete = async (req, res, next) => {
  const { db } = req.app.locals;
  const { id } = req.params;

  try {
    const person = await db.collection('people').findOne({ _id: ObjectId(id) });
    if (person) {
      if (await db.collection('people').deleteOne(person)) {
        return res.status(200).send();
      } else {
        return res.status(400).send('Could not delete');
      }
    } else {
      return res.status(404).send('Person not found');
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
    if (!person) throw new Error('Not Found');

    const result = await db.collection('people').updateOne({ _id: person._id }, { $set: set });

    res.status(200).send(result);
  } catch(err) {
    res.status(400).send(err);
  }
}

