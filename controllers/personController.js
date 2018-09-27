import Person, { personSchema } from '../models/person';
import mongoose from 'mongoose';

export const personListAll = async (req, res, next) => {
  try {
    const personList = await Person.find().exec();
    res.status(200).send(personList);
  } catch (err) {
     next(err);
  }
};

export const personListOne = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
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

export const personCreate = async (req, res, next) => {
  const { name, email, password, cpf, phone, address } = req.body;
  const person = new Person({
    name,
    email,
    password,
    cpf,
    phone,
    address,
  });

  try {
    await person.validate();
    const result = await person.save();
    res.status(200).send(result);
  } catch(err) {
    return res.status(400).send(err.message);
  }
}

export const personUpdate = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password, cpf, phone, address } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid id');
  } else {
    try {
      const person = await Person.findOne({ _id: id });

      if (!person) throw new Error('Not Found.');

      const newPerson = Object.assign(person, {
        name,
        email,
        password,
        cpf,
        phone,
        address,
      });
      await newPerson.validate();
      const result = await Person.updateOne({ _id: id }, newPerson);

      res.status(200).send(result);
    } catch(err) {
      if (err.message === 'Not Found.') {
        return res.status(404).send(err.message);
      }
      return res.status(400).send(err.message);
    }
  }
}

export const personDelete = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
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

export const personPatch = async (req, res, next) => {
  res.status(500).send('To be implemented');
}
