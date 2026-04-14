const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

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

// Get all site info
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM website_info');
        const info = rows.reduce((acc, row) => {
            acc[row.info_key] = row.info_value;
            return acc;
        }, {});
        res.json(info);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update site info (Protected)
router.post('/', auth, async (req, res) => {
    const { site_title, about_us, contact_email } = req.body;
    try {
        await db.execute('UPDATE website_info SET info_value = ? WHERE info_key = "site_title"', [site_title]);
        await db.execute('UPDATE website_info SET info_value = ? WHERE info_key = "about_us"', [about_us]);
        await db.execute('UPDATE website_info SET info_value = ? WHERE info_key = "contact_email"', [contact_email]);
        res.json({ message: 'Info updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
