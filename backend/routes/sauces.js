//Import de express
const express = require('express');
//déclartion du routeur
const router = express.Router();
//Import du controllers sauce
const sauceCtrl = require('../controllers/sauces');
//import du controllers auth
const auth = require('../middleware/auth');
//Import du middleware multer config pour la création des nom de fichier
const multer = require('../middleware/multer-config');
//Import du middleware validation sauce pour le controle des saisies dans les champs
const champSauce = require('../middleware/validationSauce');

//déclaration des routes
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, champSauce.sauce, sauceCtrl.createSauces);
router.get('/:id', auth, sauceCtrl.getOneSauces);
router.put('/:id', auth, multer, champSauce.sauce, sauceCtrl.modifySauces);
router.delete('/:id', auth, sauceCtrl.deleteSauces);
router.post('/:id/like', auth, sauceCtrl.likesDislikes);

module.exports = router;