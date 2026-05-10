const express = require('express');

const router = express.Router();

const db = require('../config/db');


// ====================================
// GET ALL BORROWS
// ====================================
router.get('/', async (req, res) => {

  try {

    const [rows] = await db.execute(`

      SELECT
        borrow_records.*,
        students.name AS student_name,
        students.student_id,
        books.title

      FROM borrow_records

      JOIN students
      ON borrow_records.student_id = students.id

      JOIN books
      ON borrow_records.book_id = books.id

      ORDER BY borrow_records.id DESC

    `);

    res.json(rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: 'Server error'
    });
  }
});


// ====================================
// ISSUE BOOK
// ====================================
router.post('/issue', async (req, res) => {

  try {

    const { student_id, book_id } = req.body;

    // CHECK EMPTY
    if (!student_id || !book_id) {

      return res.status(400).json({
        message: 'Student and book required'
      });
    }

    // CHECK STUDENT
    const [students] = await db.execute(
      'SELECT * FROM students WHERE id = ?',
      [student_id]
    );

    if (students.length === 0) {

      return res.status(404).json({
        message: 'Student not found'
      });
    }

    // CHECK BOOK
    const [books] = await db.execute(
      'SELECT * FROM books WHERE id = ?',
      [book_id]
    );

    if (books.length === 0) {

      return res.status(404).json({
        message: 'Book not found'
      });
    }

    const book = books[0];

    // CHECK AVAILABLE
    if (book.available_copies <= 0) {

      return res.status(400).json({
        message: 'No copies available'
      });
    }

    // DATES
    const today = new Date();

    const due = new Date();

    due.setDate(today.getDate() + 14);

    const borrow_date =
      today.toISOString().split('T')[0];

    const due_date =
      due.toISOString().split('T')[0];

    // INSERT RECORD
    await db.execute(

      `INSERT INTO borrow_records
      (student_id, book_id, borrow_date, due_date)

      VALUES (?, ?, ?, ?)`,

      [
        student_id,
        book_id,
        borrow_date,
        due_date
      ]
    );

    // UPDATE BOOK COUNT
    await db.execute(

      `UPDATE books
      SET available_copies = available_copies - 1
      WHERE id = ?`,

      [book_id]
    );

    res.json({
      message: 'Book issued successfully',
      due_date
    });

  } catch (err) {

    console.log('ISSUE ERROR:', err);

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
});


// ====================================
// RETURN BOOK
// ====================================
router.post('/return/:id', async (req, res) => {

  try {

    const id = req.params.id;

    // FIND RECORD
    const [records] = await db.execute(
      'SELECT * FROM borrow_records WHERE id = ?',
      [id]
    );

    if (records.length === 0) {

      return res.status(404).json({
        message: 'Borrow record not found'
      });
    }

    const record = records[0];

    // UPDATE RETURN
    await db.execute(

      `UPDATE borrow_records
      SET return_date = CURDATE()
      WHERE id = ?`,

      [id]
    );

    // UPDATE BOOK COUNT
    await db.execute(

      `UPDATE books
      SET available_copies = available_copies + 1
      WHERE id = ?`,

      [record.book_id]
    );

    res.json({
      message: 'Book returned successfully'
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: 'Server error'
    });
  }
});


module.exports = router;