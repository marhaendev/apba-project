const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'YOUR_SECRET_KEY';

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Tidak diizinkan: Token tidak ditemukan' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Dilarang: Token tidak valid' });
        req.user = decoded;
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Dilarang: Akses admin diperlukan' });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };
