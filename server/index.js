const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const genreRoutes = require('./routes/genres');
const infoRoutes = require('./routes/info');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/info', infoRoutes);

app.get('/', (req, res) => {
    res.send('Buku E-book Library API is running...');
});

// 404 Logger
app.use((req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
