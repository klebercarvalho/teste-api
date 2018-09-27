import mongoose from 'mongoose';

const checkObjectID = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid id.');
  }
  next();
}

export default checkObjectID;

