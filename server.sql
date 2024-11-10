CREATE DATABASE user_management;

USE user_management;

-- Table for storing user details
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing OTP information
CREATE TABLE otp (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  otp VARCHAR(6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
