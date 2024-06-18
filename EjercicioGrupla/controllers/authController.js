const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')


exports.register = async (req, res) => {
    const { username, password, name, lastname, correo } = req.body;
    console.log(req.body)
    const existUser = await User.findOne({
        $or: [
            { username: username },
            { correo: correo }
        ]
    });
    if (existUser) {
        console.log("existe:", existUser)
        return res.status(400).json({ message: 'El nombre de usuario o el correo electrónico ya están en uso' });
    }
    try {
        console.log("pasa")
        const user = new User({ username, password, name, lastname, correo });
        await user.save();
        res.redirect('/auth/login');
    } catch (error) {

        res.status(400).json({ message: 'Error al registrar usuario' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(400).send('Usuario no encontrado');
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1m' });
        //guardar en cookie
        res
            .cookie('access_token', token, {
                httpOnly: true,//la cookie solo se puede acceder en el servidor
                secure: process.env.NODE_ENV === 'production',//solo por https
                sameSite: 'strict'//mismo dominio
            }).send({ username: user.username })
        // res.json({ token });

    } catch (error) {
        res.status(400).send('Error al iniciar sesión');
    }
};