import Person from '../models/person';
import mongoose from 'mongoose';

export const personListAll = async (req, res, next) => {
  try {
    const personList = await Person.find().exec();
    res.status(200).send(personList);
  } catch (err) {
     next(err);
  }
};

export const personListOne = await (req, res, next) => {
  const { id } = req.params;
  if (!moongose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid id');
  } else {
    try {
      const person = await Person.findOne({ _id: id });
      if (person) {
        res.status(200).send(person);
      } else {
        res.status(404).send('Person not found');
      }
    } catch (err) {
      next(err);
    }
  }
};

export const personCreate = await (req, res, next) => {
  res.status(200).send('POST a new person');
}

export const personUpdate = await (req, res, next) => {
  res.status(200).send('PUT new information on the expecified person');
}

export const personDelete = await (req, res, next) => {
  const { id } = req.params;
  if (!moongose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid id');
  } else {
    try {
      const person = await Person.findOne({ _id: id }).exec();
      if (person) {
        if (await Person.deleteOne(person)) {
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
  }
};
