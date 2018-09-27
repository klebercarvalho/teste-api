import mongoose from 'mongoose';

export const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpf: String,
  phone: String,
  address: String,
});

const Person = mongoose.model('Person', personSchema);
export default Person;
