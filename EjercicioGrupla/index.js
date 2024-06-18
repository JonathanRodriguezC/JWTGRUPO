require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser')
//rutas
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');


const app = express();
app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));

//conexion con mongo

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conectado a MongoDB');
    }).catch((err) => {
        console.error('Error conectando a MongoDB', err);
    });

// Rutas
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});