const express = require('express');
const router = express.Router();
const db = require('../config/db');


// ================================
// GET ALL STUDENTS
// ================================
router.get('/', async (req, res) => {

  try {

    const [students] = await db.execute(
      `SELECT 
        id,
        student_id,
        name,
        email,
        department
      FROM students`
    );

    res.json(students);

  } catch (err) {

    console.log('STUDENT ERROR:', err);

    res.status(500).json({
      message: 'Server error'
    });
  }
});


module.exports = router;