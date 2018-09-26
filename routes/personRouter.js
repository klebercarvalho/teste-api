import express from 'express';

import { 
  personListAll, 
  personListOne, 
  personCreate, 
  personUpdate, 
  personDelete 
} from '../controllers/person';

const router = express.Router()

router.get('/', personListAll);

router.get('/:id', personListOne);

router.post('/', personCreate);

router.put('/:id', personUpdate);

router.delete('/:id', personDelete);

export default router;
