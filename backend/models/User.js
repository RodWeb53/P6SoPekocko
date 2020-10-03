//Import de mongoose
const mongoose = require('mongoose');
//Import de mongoose-unique-validator pour vérifier qu'il n'y a pas d'adresse mail en double
const uniqueValidator = require('mongoose-unique-validator');

//création du schéma pour les utilisateur dean la BD
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);