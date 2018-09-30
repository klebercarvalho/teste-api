import { ObjectId } from 'mongodb';

const checkObjectID = (req, res, next) => {
  const { id } = req.params;

  if (id) {
    if (!ObjectId.isValid(id)) {
      return res.status(400).send('Invalid id.');
    }
  }

  next();
}

export default checkObjectID;

