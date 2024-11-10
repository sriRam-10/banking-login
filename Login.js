import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      alert(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "Error logging in!");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => window.location.href = '/forgot-password'}>Forgot Password?</button>
      <button onClick={() => window.location.href = '/register'}>Create Account</button>
    </div>
  );
};

export default Login;
