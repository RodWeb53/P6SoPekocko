//import de express
const express = require('express');
//création de l'application app
const app = express();
//Import de body parser
const bodyParser = require('body-parser');
//Import de mongoose pour la connexion avec la BD mongo
const mongoose = require('mongoose');
//Import des routes pour l'authantification
const userRoutes = require('./routes/user');
//Import des routes pour les sauces
const saucesRoutes = require('./routes/sauces');
//Import du path pour pouvoir touver les images de la directory images
const path = require('path');
//import de dotenv pour gérer des variables cachées
require('dotenv').config();
//Import de helmet pour la sécurisation contre les injections
const helmet = require("helmet");
//import de mongo sanitize
const mongoSanitize = require('express-mongo-sanitize');

//Connexion a la BD avec protection des données les variables de dotenv
mongoose.set('useCreateIndex', true);
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  //Création de header pour autoriser l'acces et enlever les erreurs de CORS (Cross Origin Resource Sharing)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Utilisation de helmet contre les injections de scripts
app.use(helmet());
//body parser permet la transformation des corps de la requête en json
app.use(bodyParser.json());
//Utilisation de mongoSanitize pour remplacer les caractères illicite en _
app.use(mongoSanitize({ replaceWith: '_' }));
//------------Création de middleware ---------------------\\
//Middleware pour gérer les liens vers la directory des images
app.use('/images', express.static(path.join(__dirname, 'images')));
//Middleware pour gérer le lien vers les sauces via le controllers
app.use('/api/sauces', saucesRoutes);
//Middleware pour gérer le lien vers l'authentification utilisateur via le controllers
app.use('/api/auth', userRoutes);


//Export de l'application app
module.exports = app;