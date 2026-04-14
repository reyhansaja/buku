-- Database initialization for E-book Library

CREATE DATABASE IF NOT EXISTS buku_db;
USE buku_db;

-- Genres Table
CREATE TABLE IF NOT EXISTS genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books Table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    cover_image VARCHAR(255),
    publisher VARCHAR(255),
    genre_id INT,
    description TEXT,
    file_path VARCHAR(255), -- For downloads
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL
);

-- Website Info Table
CREATE TABLE IF NOT EXISTS website_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    info_key VARCHAR(50) NOT NULL UNIQUE,
    info_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Data
INSERT IGNORE INTO genres (name) VALUES ('Fiction'), ('Non-Fiction'), ('Science'), ('Technology'), ('History');

INSERT IGNORE INTO website_info (info_key, info_value) VALUES 
('site_title', 'My Premium Library'),
('about_us', 'This is a premium e-book library where you can explore various genres and download your favorite books.'),
('contact_email', 'admin@buku.com');

-- Default Admin: admin/admin123
INSERT IGNORE INTO admins (username, password) VALUES ('admin', '$2b$10$L8PfHQbDdOBXRDVeFk.6r.SB3MdAAr724dYGlSiCr8hoP0DECV2/a');
