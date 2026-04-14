const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const auth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};

// Get all genres
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM genres ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add genre (Protected)
router.post('/', auth, async (req, res) => {
    console.log('POST new genre');
    const { name } = req.body;
    try {
        const [result] = await db.execute('INSERT INTO genres (name) VALUES (?)', [name]);
        res.json({ id: result.insertId, name });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update genre (Protected)
router.put('/:id', auth, async (req, res) => {
    console.log(`PUT genre request for ID: ${req.params.id}`);
    const { name } = req.body;
    try {
        await db.execute('UPDATE genres SET name = ? WHERE id = ?', [name, req.params.id]);
        res.json({ id: req.params.id, name });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete genre (Protected)
router.delete('/:id', auth, async (req, res) => {
    console.log(`DELETE genre request for ID: ${req.params.id}`);
    try {
        await db.execute('DELETE FROM genres WHERE id = ?', [req.params.id]);
        res.json({ message: 'Genre deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error (likely linked to books)', error: error.message });
    }
});

module.exports = router;
