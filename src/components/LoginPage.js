import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import styles from './LoginPage.module.css';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const { setLoggedIn, setUserRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setLoggedIn(true); // Update the loggedIn state

      // Check if the user is an admin
      const userResponse = await axios.get('http://localhost:3001/account', {
        headers: { Authorization: `Bearer ${response.data.token}` }
      });
      setUserRole(userResponse.data.role);
      navigate('/');      
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Link to='/' className={styles.link}>&#8610; Back to Simple Pages</Link>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>Sign In</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
      <div className={styles.textBox}>
        <label>OR</label>
        <Link to="/register">Register Now</Link>
      </div>
    </div>
  );
};

export default LoginPage;
