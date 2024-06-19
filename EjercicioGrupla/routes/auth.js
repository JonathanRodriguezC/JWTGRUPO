const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//login
router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: 'public' });
});
router.post('/login', authController.login);

//register
router.get('/register', (req, res) => {
    res.sendFile('register.html', { root: 'public' });
});
router.post('/register', authController.register);

//recuperacion de password
router.get('/forgot', (req, res) => {
    res.sendFile('forgot.html', { root: 'public' });
})
router.get('/reset/:token', (req, res) => {
    res.sendFile('resetPassword.html', { root: 'public' });
})

router.post('/forgot', authController.forgotPassword);
router.post('/reset/:token', authController.resetPassword);
module.exports = router;