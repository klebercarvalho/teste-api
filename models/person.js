import mongoose from 'mongoose';

export const personSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  cpf: String,
  phone: String,
  address: String,
});

const Person = mongoose.model('Person', personSchema);
export default Person;
