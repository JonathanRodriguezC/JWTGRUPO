const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: 'public' });
});

router.post('/login', authController.login);

router.get('/register', (req, res) => {
    res.sendFile('register.html', { root: 'public' });
});

router.post('/register', authController.register);

module.exports = router;