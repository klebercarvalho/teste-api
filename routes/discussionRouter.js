import express from 'express';

const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).send('GET all discussions');
});

router.get('/:id', (req, res, next) => {
  res.status(200).send('GET the expecified discussion');
});

router.post('/', (req, res, next) => {
  res.status(200).send('POST a new discussion');
});

router.put('/:id', (req, res, next) => {
  res.status(200).send('PUT new information on the expecified discussion');
});

router.delete('/:id', (req, res, next) => {
  res.status(200).send('DELETE the expecified discussion');
});

export default router;