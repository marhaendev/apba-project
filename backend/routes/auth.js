const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const User = require('../models/User');

const { verifyToken } = require('../middleware/authMiddleware');
const SECRET_KEY = process.env.SECRET_KEY || 'YOUR_SECRET_KEY';

// Login (Mock Encrypted Payload)
router.post('/login', async (req, res) => {
    try {
        const { encryptedData } = req.body;

        let username, password;

        if (encryptedData) {
            try {
                const bytes = CryptoJS.AES.decrypt(encryptedData, 'SecretPassphrase');
                const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                username = decryptedData.username;
                password = decryptedData.password;
            } catch (e) {
                return res.status(400).json({ message: 'Dekripsi gagal', error: e.message });
            }
        } else {
            username = req.body.username;
            password = req.body.password;
        }

        const user = await User.findOne({ where: { username } });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Kredensial tidak valid' });
        }

        const expirySeconds = parseInt(process.env.JWT_EXPIRY_SECONDS) || 86400;

        // Add hakakses as role to payload
        const token = jwt.sign({
            id: user.id_user,
            username: user.username,
            role: user.hakakses
        }, SECRET_KEY, { expiresIn: expirySeconds });

        res.cookie('token', token, { httpOnly: true, maxAge: expirySeconds * 1000 });
        res.json({ message: 'Login berhasil', token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/logout', verifyToken, (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout berhasil' });
});

router.get('/decrypt', (req, res) => {
    const { encryptedData, key } = req.query;
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, key || 'SecretPassphrase');
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        res.json({ decrypted: originalText });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.post('/encrypt', (req, res) => {
    const { data } = req.body;
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'SecretPassphrase').toString();
    res.json({ encryptedData: ciphertext });
});


module.exports = router;
