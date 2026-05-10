const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();


// ================================
// STUDENT REGISTER
// ================================
router.post('/register', async (req, res) => {

  try {

    const {
      student_id,
      name,
      email,
      phone,
      department,
      year,
      password
    } = req.body;

    // CHECK REQUIRED FIELDS
    if (!student_id || !name || !email || !password) {
      return res.status(400).json({
        message: 'All required fields must be filled'
      });
    }

    // CHECK EXISTING USER
    const [existing] = await db.execute(
      'SELECT id FROM students WHERE email = ? OR student_id = ?',
      [email, student_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: 'Email or Student ID already exists'
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // INSERT STUDENT
    await db.execute(
      `INSERT INTO students
      (student_id, name, email, phone, department, year, password)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        name,
        email,
        phone || '',
        department || '',
        year || '',
        hashedPassword
      ]
    );

    res.status(201).json({
      message: 'Registration successful'
    });

  } catch (err) {

    console.log('REGISTER ERROR:', err);

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
});


// ================================
// STUDENT LOGIN
// ================================
router.post('/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    const [rows] = await db.execute(
      'SELECT * FROM students WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const student = rows[0];

    const isMatch = await bcrypt.compare(
      password,
      student.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // CREATE TOKEN
    const token = jwt.sign(
      {
        id: student.id,
        email: student.email,
        role: 'student',
        name: student.name
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h'
      }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        student_id: student.student_id,
        department: student.department,
        role: 'student'
      }
    });

  } catch (err) {

    console.log('LOGIN ERROR:', err);

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
});


// ================================
// ADMIN LOGIN
// ================================
router.post('/admin/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    const [rows] = await db.execute(
      'SELECT * FROM admins WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // CREATE TOKEN
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: 'admin',
        name: admin.name
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h'
      }
    );

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });

  } catch (err) {

    console.log('ADMIN LOGIN ERROR:', err);

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
});


module.exports = router;