import express from 'express';

import { 
  personListAll, 
  personListOne, 
  personCreate, 
  personUpdate, 
  personDelete,
  personPatch,
} from '../controllers/personController';

const router = express.Router()

router.get('/', personListAll);

router.get('/:id', personListOne);

router.post('/', personCreate);

router.put('/:id', personUpdate);

router.delete('/:id', personDelete);

router.patch('/:id', personPatch);

export default router;
