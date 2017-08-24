const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true},
  weight: Number,
  age: Number,
  eyeColor: String,
  furColor: String,
})

const Cat = mongoose.model('Cat', catSchema);

module.exports = Cat;
