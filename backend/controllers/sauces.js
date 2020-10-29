//création d'une constante pour charger le schéma de sauce
const Sauce = require('../models/sauces');
//création de la constante fs pour gérer la manipulation des fichiers image
const fs = require('fs');
const jwt = require('jsonwebtoken');

//------------- Lecture pour une sauce via l'ID ------------\\
exports.getOneSauces = (req, res, next) => {
  //récupération de l'id par la méthode findOne
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

//------------------- Creation d'une sauce -------------------\\
exports.createSauces = (req, res, next) => {
  //création d'un objet pour mettre les paramètres de la sauce
  const sauceObject = JSON.parse(req.body.sauce);
  //Suppression de _id
  delete sauceObject._id;
  //Création de la sauce
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //Méthodes pour sauver la sauce dans la BD
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};


//------------- Modification d'une sauce --------------\\
//suite passage soutenance modification pour jouter un controle sur l'ID du user
//Met à jour la sauce et son image via son ID
exports.modifySauces = (req, res, next) => {
  //ajout du décodage de la clé token pour récupérer le user Id (correctif soutenance)
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, `${process.env.DB_USER}`);
  const userId = decodedToken.userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //Ajout de la condition IF pour le controle du user Id (correctif soutenance)
      if (sauce.userId === userId) {
        const thingObject = req.file ?
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié !' }))
          .catch(error => res.status(400).json({ error }));
      } else {
          throw 'Impossible de modifier la sauce.';
      }
    })
    .catch(error => res.status(500).json({ error }));
};


//------------- suppression d'une sauce ------------------\\
// correction suite passage soutenance pour ajouter un controle du userId via le token car le user n'est pas passé par le front
exports.deleteSauces = (req, res, next) => {
  //ajout du décodage de la clé token pour récupérer le user Id (correctif soutenance)
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, `${process.env.DB_USER}`);
  const userId = decodedToken.userId;
  //recupération de l'id avec la méthodes findOne
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        //ajout de la condition IF pour le controle du user Id (correctif soutenance)
        if (sauce.userId === userId) {
          const filename = sauce.imageUrl.split('/images/')[1];
          //suppression du fichier image avec fs et unlink
          fs.unlink(`images/${filename}`, () => {
            //suppression de la BD avec la méthode deleteOne
            Sauce.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
              .catch(error => res.status(400).json({ error })); 
        });
      } else {
        throw 'Suppression impossible de la sauce !';
      }
    })
    .catch(error => res.status(500).json({ error }));
};

//------ Lecture de toutes les sauces de la base de données -----\\
//La méthode est passée par find
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauce) => {res.status(200).json(sauce);})
  .catch((error) => {res.status(400).json({ error });});
};

//------- Gestion de la fonctionnalité likes et dislikes ---------\\
//Un clic sur likes ou dislikes = augmentation du compteur et ajout de l'id utilisateur dans la BD
//Si on re-clic sur likes ou dislikes = reduction du compteur et suppression de l'id user dans la BD
exports.likesDislikes = (req, res) => {
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      //modification suite soutenance pour mettre un controle sur le user ID lors du likes ou dislikes (correctif soutenance)
      //si l'utilisateur clic sur likes et qu'il est pas connu dans likes
      if (req.body.like === 1 && !sauce.usersLiked.includes(req.body.userId)) {    
        Sauce.updateOne({_id: req.params.id}, { $inc: {likes: 1}, $push: {usersLiked: req.body.userId}}, {_id: req.params.id})
          .then(() => res.status(200).json({message: 'Ajout du likes !'}))
          .catch(error => res.status(400).json({error}));
      //sinon si l'utilisateur clic sur dislikes et qu'il est pas connu dans dislikes
      } else if (req.body.like === -1 && !sauce.usersDisliked.includes(req.body.userId)) {  
          Sauce.updateOne({_id: req.params.id}, { $inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}}, {_id: req.params.id})
            .then(() => res.status(200).json({message: 'Ajout du dislikes !'}))
            .catch(error => res.status(400).json({error}));
      //Si l'utilisateur re-clic sur likes ou dislikes pour annuler son vote
      } else if (req.body.like === 0) {  
          //suppression de l'id du user dans la BD usersLiked et on enlève 1 au compteur des likes     
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}}, {_id: req.params.id})
              .then(() => res.status(200).json({message: 'Suppression du likes !'}))
              .catch(error => res.status(400).json({error}));
          //suppression de l'id du user dans la BD usersDisliked et on enlève 1 au compteur des dislikes
          } else if (sauce.usersDisliked.includes(req.body.userId)) {
              Sauce.updateOne({_id: req.params.id}, { $inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}}, {_id: req.params.id})
                .then(() => res.status(200).json({message: 'Suppression du dislikes !'}))
                .catch(error => res.status(400).json({error}));
          }
      }
    })
    .catch(error => {res.status(400).json({error});});
};