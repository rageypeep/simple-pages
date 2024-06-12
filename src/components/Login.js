// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css';
import appStyles from '../App.module.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      setToken(response.data.token);
      setError('');
      alert('Login successful');
      localStorage.setItem('token', response.data.token); // Save token
    } catch (error) {
      console.error('Login error:', error.response || error.message);
      setError(error.response ? error.response.data.error : error.message);
      alert('Login failed');
    }
  };

  return (
    <div className={appStyles.card}>
      <h2>Login</h2>
      <div className={styles.form}>
        <input
          type="text"
          className={appStyles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className={appStyles.input}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={appStyles.button} onClick={handleLogin}>Login</button>
        {error && <div className={`${appStyles.alert} ${appStyles.alertError}`}>{error}</div>}
        {token && <div className={`${appStyles.alert} ${appStyles.alertSuccess}`}>Logged in with token: {token}</div>}
      </div>
    </div>
  );
}

export default Login;
