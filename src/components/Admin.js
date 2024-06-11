// src/components/Admin.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';
import appStyles from '../App.module.css';

function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:3001/admin/user-role',
        { userId, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('User role updated successfully.');
      setError('');
      setUsers(users.map(user => user.id === userId ? { ...user, role } : user));
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3001/admin/user', {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId }
      });
      setMessage('User deleted successfully.');
      setError('');
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user.');
    }
  };

  return (
    <div className={appStyles.content}>
      <div className={appStyles.card}>
      <a href='/'>&#8610; Back to Simple Pages</a>
        <h2>Admin Panel</h2>
        {error && <div className={`${appStyles.alert} ${appStyles.alertError}`}>{error}</div>}
        {message && <div className={`${appStyles.alert} ${appStyles.alertSuccess}`}>{message}</div>}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    className={appStyles.button}
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
