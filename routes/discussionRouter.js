import express from 'express';

import checkObjectID from '../middlewares/checkObjectID';

import {
  discussionListAll,
  discussionListOne,
  discussionCreate,
  discussionUpdate,
  discussionDelete,
} from '../controllers/discussionController';

const router = express.Router()

// Before Middlewares
router.use('/:id', checkObjectID);

// Routes
router.get('/', discussionListAll);

router.get('/:id', discussionListOne);

router.post('/', discussionCreate);

router.put('/:id', discussionUpdate);

router.delete('/:id', discussionDelete);

export default router;
