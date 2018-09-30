import express from 'express';

import {
  discussionListAll,
  discussionListOne,
  discussionCreate,
  discussionUpdate,
  discussionDelete,
  discussionPatch,
} from '../controllers/discussionController';

const router = express.Router()

router.get('/', discussionListAll);

router.get('/:id', discussionListOne);

router.post('/', discussionCreate);

router.put('/:id', discussionUpdate);

router.delete('/:id', discussionDelete);

router.patch('/:id', discussionPatch);

export default router;
