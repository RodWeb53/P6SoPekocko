//import de express
const express = require('express');
//création de l'application app
const app = express();
//Import de body parser
const bodyParser = require('body-parser');
//Import de mongoose pour la connexion avec la BD mongo
const mongoose = require('mongoose');
//Import des routes por l'authantification
const userRoutes = require('./routes/user');
//import de dotenv pour gérer des variables cachées
require('dotenv').config();

//Connexion a la BD avec protection des données les variables de dotenv
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//création des header pour donner acces et ne pas avoir d'érreur de CORS (Cross-origin resource sharing)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//body parser permet la transformation des corps de la requête en json
app.use(bodyParser.json());



app.use('/api/auth', userRoutes);

//Export de l'application app
module.exports = app;