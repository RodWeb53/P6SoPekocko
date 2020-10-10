const express = require('express');
const router = express.Router();
const verifiePass =require('../middleware/passwordVerify');
const userCtrl = require('../controllers/user');

router.post('/signup', verifiePass, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;