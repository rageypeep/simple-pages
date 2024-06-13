// src/components/Account.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Account.module.css';
import appStyles from '../App.module.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Account() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the server
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/account', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Set the fetched data to userData state
        setUserData({
          username: response.data.username,
          email: response.data.email,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          phone: response.data.phone,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleUpdate = async () => {
    if (!validateEmail(userData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3001/account', userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Account updated successfully.');
      setError('');
    } catch (error) {
      console.error('Error updating account:', error);
      setError('Failed to update account.');
    }
  };

  const handleChangePassword = async () => {
    if (!password || !newPassword) {
      setError('Both current and new passwords are required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:3001/change-password',
        { password, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Password changed successfully.');
      setError('');
      setPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3001/account', {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account.');
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.card}>
        <Link to='/' className={styles.link}>&#8610; Back to Simple Pages</Link>
        <h2>Account Settings</h2>
        <div className={styles.form}>
          <label>Username: {userData.username}</label>
          <input
            type="email"
            name="email"
            
            placeholder="Email"
            value={userData.email || ''}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="firstName"
            
            placeholder="First Name"
            value={userData.firstName || ''}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            
            placeholder="Last Name"
            value={userData.lastName || ''}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={userData.phone || ''}
            onChange={handleInputChange}
          />
          <button className={appStyles.button} onClick={handleUpdate}>
            Update Account
          </button>
          <h3>Change Password</h3>
          <input
            type="password"
            
            placeholder="Current Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className={appStyles.button} onClick={handleChangePassword}>
            Change Password
          </button>
          <h3>Delete Account</h3>
          <button className={appStyles.button} onClick={handleDeleteAccount}>
            Delete Account
          </button>
          {error && <div className={`${appStyles.alert} ${appStyles.alertError}`}>{error}</div>}
          {message && <div className={`${appStyles.alert} ${appStyles.alertSuccess}`}>{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default Account;
