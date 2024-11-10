const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Setup MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Change with your MySQL username
  password: '', // Change with your MySQL password
  database: 'user_management'
});

// Test DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected!');
});

// Register User
app.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match!" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: "Error hashing password!" });

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ message: "Error registering user!" });
      res.status(200).json({ message: "User registered successfully!" });
    });
  });
});

// Login User
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching user!" });
    if (result.length === 0) return res.status(400).json({ message: "User not found!" });

    bcrypt.compare(password, result[0].password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: "Error comparing passwords!" });
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

      res.status(200).json({ message: "Login successful!" });
    });
  });
});

// Send OTP for Password Reset
app.post('/send-otp', (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Error checking email!" });
    if (result.length === 0) return res.status(400).json({ message: "Email not found!" });

    // Save OTP in the database
    const insertOtpQuery = 'INSERT INTO otp (email, otp) VALUES (?, ?)';
    db.query(insertOtpQuery, [email, otp], (err, result) => {
      if (err) return res.status(500).json({ message: "Error saving OTP!" });

      // Send OTP to email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'your-email@gmail.com', // Change with your email
          pass: 'your-email-password' // Change with your email password
        }
      });

      const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).json({ message: "Error sending OTP!" });
        res.status(200).json({ message: "OTP sent successfully!" });
      });
    });
  });
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  const query = 'SELECT * FROM otp WHERE email = ? AND otp = ?';
  db.query(query, [email, otp], (err, result) => {
    if (err) return res.status(500).json({ message: "Error verifying OTP!" });
    if (result.length === 0) return res.status(400).json({ message: "Invalid OTP!" });

    res.status(200).json({ message: "OTP verified!" });
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
