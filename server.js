const express = require("express");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// Body Parser
app.use(bodyParser.json());

// MySQL Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",  // change according to your db credentials
  password: "",
  database: "login_app",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected!");
});

// API to handle login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.execute(query, [email, password], (err, results) => {
    if (err) return res.json({ success: false, message: "Database error" });
    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  });
});

// API to handle registration
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.execute(query, [name, email, password], (err, results) => {
    if (err) return res.json({ success: false, message: "Database error" });
    res.json({ success: true });
  });
});

// API to handle forgot password
app.post("/api/forgot-password", (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP

  // Sending OTP via email using Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com",  // Use your email
      pass: "your-email-password",   // Use your email password
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.json({ success: false, message: "Error sending OTP." });
    } else {
      res.json({ success: true, otp }); // Send OTP to frontend for verification
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
