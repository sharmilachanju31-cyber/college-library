const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET /api/books - Get all books (public)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    const [books] = await db.execute(query, params);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/books/:id - Get single book
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Book not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/books - Add book (admin only)
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { isbn, title, author, category, publisher, year_published, total_copies } = req.body;
    if (!isbn || !title || !author) return res.status(400).json({ message: 'ISBN, title and author required.' });

    await db.execute(
      'INSERT INTO books (isbn, title, author, category, publisher, year_published, total_copies, available_copies) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [isbn, title, author, category || null, publisher || null, year_published || null, total_copies || 1, total_copies || 1]
    );
    res.status(201).json({ message: 'Book added successfully.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'ISBN already exists.' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/books/:id - Update book (admin only)
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const { title, author, category, publisher, year_published, total_copies } = req.body;
    await db.execute(
      'UPDATE books SET title=?, author=?, category=?, publisher=?, year_published=?, total_copies=? WHERE id=?',
      [title, author, category, publisher, year_published, total_copies, req.params.id]
    );
    res.json({ message: 'Book updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/books/:id - Delete book (admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await db.execute('DELETE FROM books WHERE id = ?', [req.params.id]);
    res.json({ message: 'Book deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
