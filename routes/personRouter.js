import express from 'express';
import moongose from 'mongoose';
import Person from '../models/person';

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const personList = await Person.find().exec();
    res.status(200).send(personList);
  } catch (err) {
     next(err);
  }
});

router.get('/:id', async (req, res, next) => {
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
});

router.post('/', (req, res, next) => {
  res.status(200).send('POST a new person');
});

router.put('/:id', (req, res, next) => {
  res.status(200).send('PUT new information on the expecified person');
});

router.delete('/:id', async (req, res, next) => {
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
});

export default router;