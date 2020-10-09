//Import de bcrypt pour le hachage du mot de passe
const bcrypt = require('bcrypt');
//Import du modèle
const User = require('../models/User');
//Import de Jsonwebtoken pour le haschage du token
const jwt = require('jsonwebtoken');
//import de dotenv pour gérer des variables cachées
require('dotenv').config();

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      //masquage de l'adresse mail avant l'envoie dans la BD avec un chiffrement base 64
      let buf = new Buffer.from(req.body.email);
      let emailCacher = buf.toString('base64');
      const user = new User({
        email: emailCacher,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  //création d'un chiffrement base 64 sur l'adresse mail avant la vérification de l'adresse mail
  let buf = new Buffer.from(req.body.email);
  let emailCacher = buf.toString('base64');
  User.findOne({ email: emailCacher })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              //la cle token est cachée par dotenv
              `${process.env.DB_USER}`,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};