const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const nodemailer = require('nodemailer');
const { text } = require('body-parser');


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


exports.forgotPassword = async (req, res) => {
    const { correo } = req.body;
    try {
        const user = await User.findOne({ correo })
        if (!user) {
            res.status(400).json({ message: "correo no encontrado" })

        }
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '7m' });


        console.log(process.env.S_EMAIL)
        console.log(user.correo)

        const transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.S_EMAIL,
                pass: process.env.S_PWD
            }

        })


        const mailOptions = {
            to: user.correo,
            from: process.env.S_EMAIL,
            subject: 'Recuperación de Contraseña',
            text: `Haz clic en el siguiente enlace para recuperar tu contraseña: http://localhost:3000/auth/reset/${token}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "correo de recuperacion enviado" })
    } catch (err) {
        res.status(200).json({ message: "correo de recuperacion enviado" })
    }
}

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                console.log("acceso denegado")
                return res.status(400).json({ message: "Token agotado" });
            }
            console.log("si hay token")

            const user = await User.findOne({ _id: decoded.id });

            if (!user) {
                return res.status(400).json({ message: 'El token de recuperación es inválido o ha expirado' });
            }

            user.password = newPassword

            console.log(user)
            await user.save();

            res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al restablecer la contraseña' });
    }
};