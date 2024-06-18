const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log("agarranado cookie")
    const token = req.cookies.access_token;
    console.log("cookie obtenida")

    console.log(token)
    if (!token) {
        console.log("no hay toquen")
        return res.redirect('auth/login')
    }
    try {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log("acceso denegado")
                return res.redirect('/auth/login');
            }
            console.log("si hay token")
            req.user = decoded;

            next();
        });

    } catch (error) {
        res.clearCookie('access_token');
        return res.redirect('/auth/login');

    }
};

module.exports = verifyToken;