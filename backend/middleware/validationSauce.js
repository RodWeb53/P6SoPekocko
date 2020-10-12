//import de API/joi pour le controle des valeurs entrées dans les champs de saisie de la sauce
const Joi = require('joi');

//-------------- Definition du schéma de controle des données ---------------------\\
//Controle uniquement sur les champs de saisie
const sauceSchema = Joi.object({
  userId: Joi.string().trim().length(24).required(),      //User id longueur maxi 24 caractères
  name: Joi.string().trim().min(1).required(),            //Nom de la sauce mini 1 caractère
  manufacturer: Joi.string().trim().min(1).required(),    //Nom du fabricant mini 1 caractère
  description: Joi.string().trim().min(1).required(),     //Description mini 1 caractère
  mainPepper: Joi.string().trim().min(1).required(),      //Nom du composant mini 1 caractère
  heat: Joi.number().integer().min(1).max(10).required()  //Note de la sauce mini 1 maxi 10
})
//export du schéma sauce apres validation des données
exports.sauce = (req, res, next) => {
  let sauce;
  if (req.file) {
      sauce = JSON.parse(req.body.sauce);
  } else {
      sauce = req.body;
  }
  
  const {error} = sauceSchema.validate(sauce);
  if (error) {
      res.status(422).json({ error: "Les données entrées sont incorrecte" });
  } else {
      next();
  }
}