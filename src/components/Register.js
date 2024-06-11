// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import appStyles from '../App.module.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleRegister = async () => {
    if (!username || !password || !email) {
      setError('Username, Password, and Email are required.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/register', {
        username, password, email, firstName, lastName, phone
      });
      const token = response.data.token;
      localStorage.setItem('token', token); // Save the token to localStorage
      setError('');
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Registration error:', error.response || error.message);
      setError(error.response ? error.response.data.error : 'Registration failed. ' + error.message);
    }
  };

  return (
    <div className={appStyles.card}>
      <h2>Register</h2>
      <div className={styles.form}>
        <input
          type="text"
          className={appStyles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className={appStyles.input}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="email"
          className={appStyles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          className={appStyles.input}
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          className={appStyles.input}
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="text"
          className={appStyles.input}
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button className={appStyles.button} onClick={handleRegister}>Register</button>
        {error && <div className={`${appStyles.alert} ${appStyles.alertError}`}>{error}</div>}
      </div>
    </div>
  );
}

export default Register;
