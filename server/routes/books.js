const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const jwt = require('jsonwebtoken');

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

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

// Get all books or filter by genre
router.get('/', async (req, res) => {
    const { genre_id } = req.query;
    try {
        let query = 'SELECT b.*, g.name as genre_name FROM books b LEFT JOIN genres g ON b.genre_id = g.id';
        let params = [];
        if (genre_id) {
            query += ' WHERE b.genre_id = ?';
            params.push(genre_id);
        }
        query += ' ORDER BY b.created_at DESC';
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single book
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT b.*, g.name as genre_name FROM books b LEFT JOIN genres g ON b.genre_id = g.id WHERE b.id = ?',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Book not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add book (Protected)
router.post('/', auth, upload.fields([
    { name: 'cover_image', maxCount: 1 },
    { name: 'book_file', maxCount: 1 }
]), async (req, res) => {
    const { title, publisher, genre_id, description } = req.body;
    const cover_image = req.files['cover_image'] ? req.files['cover_image'][0].filename : null;
    const file_path = req.files['book_file'] ? req.files['book_file'][0].filename : null;

    try {
        const [result] = await db.execute(
            'INSERT INTO books (title, publisher, genre_id, description, cover_image, file_path) VALUES (?, ?, ?, ?, ?, ?)',
            [title, publisher, genre_id, description, cover_image, file_path]
        );
        res.json({ id: result.insertId, title, cover_image, file_path });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update book (Protected)
router.put('/:id', auth, upload.fields([
    { name: 'cover_image', maxCount: 1 },
    { name: 'book_file', maxCount: 1 }
]), async (req, res) => {
    const { title, publisher, genre_id, description } = req.body;
    const { id } = req.params;

    try {
        // Get existing book to handle file cleanup
        const [existing] = await db.execute('SELECT cover_image, file_path FROM books WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Book not found' });

        let cover_image = existing[0].cover_image;
        let file_path = existing[0].file_path;

        // If new files uploaded, delete old ones
        if (req.files['cover_image']) {
            if (cover_image) {
                const oldPath = path.join(__dirname, '../uploads', cover_image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            cover_image = req.files['cover_image'][0].filename;
        }

        if (req.files['book_file']) {
            if (file_path) {
                const oldPath = path.join(__dirname, '../uploads', file_path);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            file_path = req.files['book_file'][0].filename;
        }

        await db.execute(
            'UPDATE books SET title = ?, publisher = ?, genre_id = ?, description = ?, cover_image = ?, file_path = ? WHERE id = ?',
            [title, publisher, genre_id, description, cover_image, file_path, id]
        );

        res.json({ message: 'Book updated successfully', id, title });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete book (Protected)
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        // Get book for file cleanup
        const [existing] = await db.execute('SELECT cover_image, file_path FROM books WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Book not found' });

        // Delete files
        const { cover_image, file_path } = existing[0];
        if (cover_image) {
            const p = path.join(__dirname, '../uploads', cover_image);
            if (fs.existsSync(p)) fs.unlinkSync(p);
        }
        if (file_path) {
            const p = path.join(__dirname, '../uploads', file_path);
            if (fs.existsSync(p)) fs.unlinkSync(p);
        }

        await db.execute('DELETE FROM books WHERE id = ?', [id]);
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;
