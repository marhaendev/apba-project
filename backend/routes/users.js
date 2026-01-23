const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// CREATE (Protected)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { username } = req.body;
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username sudah digunakan' });
        }

        const user = await User.create(req.body);
        res.json({
            success: true,
            message: 'Pengguna berhasil dibuat',
            data: user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ (Public)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            offset,
            limit
        });

        res.json({
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
            data: rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ ONE (Public/Protected?)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE (Protected)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            if (req.body.username && req.body.username !== user.username) {
                const existingUser = await User.findOne({ where: { username: req.body.username } });
                if (existingUser) {
                    return res.status(400).json({ message: 'Username sudah digunakan' });
                }
            }

            await user.update(req.body);
            res.json({ message: 'Pengguna diperbarui' });
        } else {
            res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE (Protected)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.json({ message: 'Pengguna dihapus' });
        } else {
            res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
