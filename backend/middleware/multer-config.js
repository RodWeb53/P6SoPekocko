//Import de multer
const multer = require('multer');
//Création d'un objet pour gérer les type d'extention
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//--------fonction pour la céation du nom du fichier---------\\

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    //constatnte pour le remplacement des espaces du nom du fichier pour le remplacer par _
    const name = file.originalname.split(' ').join('_');
    //Constante pour stocker l'extension
    const extension = MIME_TYPES[file.mimetype];
    //création du nom de fichier le nom + la date et heure à la miniseconde + extension
    callback(null, name + Date.now() + '.' + extension);
  }
});
//export du nom de fichier en spécifiant qu'il sagit d'une image
module.exports = multer({storage: storage}).single('image');