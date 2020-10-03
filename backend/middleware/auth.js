//Import de jsonwebtoken pour faire les vérification de token lors d'une connexion
const jwt = require('jsonwebtoken');
//import de dotenv pour gérer des variables cachées
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${process.env.DB_USER}`);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({ 
      error: new Error('Invalid request!')
    });
  }
};