import { ObjectId } from 'mongodb';
import Joi from 'joi';

import { discussionSchema } from '../models/discussion';
import { personSchema } from '../models/person';

export const discussionListAll = async (req, res, next) => {
  const { db } = req.app.locals;

  try {
    const discussionList = await db.collection('discussions')
      .find({})
      .toArray();
    res.status(200).send(discussionList);
  } catch (err) {
    next(err);
  }
};

export const discussionListOne = async (req, res, next) => {
  const { db } = req.app.locals;
  const { id } = req.params;

  try {
    const discussion = await db.collection('discussions').findOne({ _id: ObjectId(id) });

    if (discussion) {
      res.status(200).send(discussion);
    } else {
      res.status(404).send('Discussion not found');
    }
  } catch (err) {
    next(err);
  }
};

export const discussionCreate = (req, res, next) => {
  const { db } = req.app.locals;
  const { participants } = req.body;

  const tuple = new Set(participants); // Handle duplicity

  const promises = Array.from(tuple).map((p) => {
    return new Promise((resolve, reject) => {
      db.collection('people').findOne({ _id: ObjectId(p) })
        .then(person => person ? resolve(person) : reject())
        .catch(err => reject(err));
    });
  });

  Promise.all(promises)
    .then(async (people) => {
      try {
        const discussion = { participants: people.map(p => ({ _id: p._id, name: p.name, email: p.email })) };
        
        await Joi.validate(discussion, discussionSchema);

        const result = await db.collection('discussions').insertOne(discussion);
        res.status(201).send(result);
      } catch(err) {
        return res.status(400).send(err.message);
      }
    })
    .catch(err => res.status(400).send('Invalid participant'));
}

export const discussionUpdate = async (req, res, next) => {
  const { db } = req.app.locals;
  const { id } = req.params;
  const { participants } = req.body;
  //const discussion = { participants };

  const tuple = new Set(participants); // Handle duplicity

  const promises = Array.from(tuple).map((p) => {
    return new Promise((resolve, reject) => {
      db.collection('people').findOne({ _id: ObjectId(p) })
        .then(person => person ? resolve(person) : reject())
        .catch(err => reject(err));
    });
  });

  Promise.all(promises)
    .then(async (people) => {
      try {
        const discussion = { participants: people.map(p => ({ _id: p._id, name: p.name, email: p.email })) };
        console.log(discussion);
        const found = await db.collection('discussions').findOne({ _id: ObjectId(id) });
        if (!found) throw new Error('Not Found.');

        await Joi.validate(discussion, discussionSchema);

        const result = await db.collection('discussions').updateOne({ _id: found._id }, { $set: discussion });
        res.status(201).send(result);
      } catch(err) {
        if (err.message === 'Not Found.') {
          return res.status(404).send(err.message);
        }
        return res.status(400).send(err.message);
      }
    })
    .catch(err => res.status(400).send('Invalid participant'));
}

export const discussionDelete = async (req, res, next) => {
  const { db } = req.app.locals;
  const { id } = req.params;

  try {
    const discussion = await db.collection('discussions').findOne({ _id: ObjectId(id) });
    if (discussion) {
      if (await db.collection('discussions').deleteOne(discussion)) {
        return res.status(200).send();
      } else {
        return res.status(400).send('Could not delete');
      }
    } else {
      return res.status(404).send('Discussion not found');
    }
  } catch (err) {
    next(err);
  }
};

export const discussionPatch = async (req, res, next) => {
  const { db } = req.app.locals;
  const { id } = req.params;
  const { name, email, password, cpf, phone, address } = req.body;
  const fields = { name, email, password, cpf, phone, address };

  const set = Object.entries(fields).reduce((acc, item) => {
    const [key, value] = item;
    return (value ? { ...acc, [key]: value } : acc);
  }, {});

  try {
    const discussion = await db.collection('discussions').findOne({ _id: ObjectId(id) });
    if (!discussion) throw new Error('Not Found');

    const result = await db.collection('discussions').updateOne({ _id: discussion._id }, { $set: set });

    res.status(200).send(result);
  } catch(err) {
    res.status(400).send(err);
  }
}

