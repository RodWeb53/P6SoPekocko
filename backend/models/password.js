//Import de password validator
var passwordValidator = require('password-validator');
 
// création du schéma
var passwordSchema = new passwordValidator();
 
// ajout des propriétés pour le mot de passe
passwordSchema
.is().min(8)                                    // Longueur minimum 8 caractères
.is().max(25)                                   // Longueur maximum 25 caractères
.has().uppercase(1)                             // Doit avoir 1 lettre majuscule minimum
.has().lowercase(1)                             // Doit avoir 1 lettre minuscule minimum
.has().digits(2)                                // Doit avoir 2 chiffres minimum
.has().not().spaces()                           // pas d'espace autorisé
.is().not().oneOf(['Passw0rd', 'Password123']); // Liste noir des mots de passe

module.exports = passwordSchema;