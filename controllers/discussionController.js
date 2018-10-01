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
    res.status(200).json({
      status: 'success',
      data: discussionList
    });
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
      res.status(200).json({
        status: 'success',
        data: discussion
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'Discussion not found'
      });
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
        res.status(201).json({
          status: 'success',
          data: null
        });
      } catch(err) {
        return res.status(400).json({
          status: 'fail',
          message: err.message
        });
      }
    })
    .catch(err => res.status(400).json({
      status: 'fail',
      message: 'Invalid participant'
    }));
}

export const discussionUpdate = async (req, res, next) => {
  const { db } = req.app.locals;
  const { id } = req.params;
  const { participants } = req.body;

  const tuple = new Set(participants); // Handle duplicity
  if (tuple.size < 2) {
    try {
      const discussion = await db.collection('discussions').findOne({ _id: ObjectId(id) });
      if (discussion) {
        if (await db.collection('discussions').deleteOne(discussion)) {
          return res.status(307).json({
            status: 'success',
            message: 'Group is deleted. Minimum participants was not met.',
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
          message: 'Discussion not found'
        });
      }
    } catch (err) {
      next(err);
    }
  } 

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
        const found = await db.collection('discussions').findOne({ _id: ObjectId(id) });
        if (!found) throw new Error('Discussion Not Found.');

        await Joi.validate(discussion, discussionSchema);

        const result = await db.collection('discussions').updateOne({ _id: found._id }, { $set: discussion });
        res.status(200).json({
          status: 'success',
          data: null
        });
      } catch(err) {
        if (err.message === 'Discussion Not Found.') {
          res.status(404);
        } else {
          res.status(400);
        }

        return res.json({
            status: 'fail',
            message: err.message
        });
      }
    })
    .catch(err => res.status(400).json({
      status: 'fail',
      message: 'Invalid participant'
    }));
}

export const discussionDelete = async (req, res, next) => {
  const { db } = req.app.locals;
  const { id } = req.params;

  try {
    const discussion = await db.collection('discussions').findOne({ _id: ObjectId(id) });
    if (discussion) {
      if (await db.collection('discussions').deleteOne(discussion)) {
        return res.status(200).json({
          status: 'success',
          data: null
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
        message: 'Discussion not found'
      });
    }
  } catch (err) {
    next(err);
  }
};

