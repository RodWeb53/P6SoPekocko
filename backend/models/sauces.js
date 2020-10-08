//Import de mongoose
const mongoose = require('mongoose');

//Création du schéma des sauces pour la création dans la BD mongoose suivant la note de cadrage
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  //initialisation de la valeur à 0 pour utiliser les fonctionnalité de like
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String], required: true },
  usersDisliked: { type: [String], required: true },
});
//export du schéma sauce
module.exports = mongoose.model('Sauce', sauceSchema);