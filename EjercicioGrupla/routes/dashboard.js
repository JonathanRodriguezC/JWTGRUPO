const express = require('express');
const router = express.Router();
//const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/enter', authMiddleware, (req, res) => {
    console.log(`bienvenido ${req.user.username}`)
    res.sendFile('dashboard.html', { root: 'public' })


});
// router.get('/enter', (req, res) => { res.sendFile('dashboard.html', { root: 'public' }) });


module.exports = router;