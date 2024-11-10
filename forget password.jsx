import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/send-otp', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP!");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {message && <div>{message}</div>}
      <form onSubmit={handleSendOtp}>
        <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
