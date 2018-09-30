import express from 'express';

import checkObjectID from '../middlewares/checkObjectID';
import protectPassword from '../middlewares/protectPassword';

import { 
  personListAll, 
  personListOne, 
  personCreate, 
  personUpdate, 
  personDelete,
  personPatch,
} from '../controllers/personController';

const router = express.Router()

// Before Middlewares
router.use('/:id', checkObjectID);

// Routes
router.get('/', personListAll);

router.get('/:id', personListOne);

router.post('/', personCreate);

router.put('/:id', personUpdate);

router.delete('/:id', personDelete);

router.patch('/:id', personPatch);

//After Middlewares
router.get('*', protectPassword);

export default router;
