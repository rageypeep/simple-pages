const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000, // 10 seconds
  idleTimeoutMillis: 30000, // 30 seconds
  max: 10 // Maximum number of clients in the pool
});

app.use(cors());
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  const { username, password, email, firstName, lastName, phone } = req.body;
  console.log(`Registration attempt: ${username}`);

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Username, Password, and Email are required.' });
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    // Check if the username already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, email, first_name, last_name, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [username, hashedPassword, email, firstName, lastName, phone]
    );
    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log(`Login attempt: ${username}`);
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      console.error('User not found');
      return res.status(400).json({ error: 'User not found' });
    }
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.error('Invalid password');
      return res.status(400).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('No authorization header'); // Debug statement
    return res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('No token found'); // Debug statement
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err); // Debug statement
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};


const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
};

// Get user account details
app.get('/account', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT username, email, first_name, last_name, phone, role FROM users WHERE id = $1', [req.user.userId]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Update user account details
app.put('/account', authenticateToken, async (req, res) => {
  const { email, firstName, lastName, phone } = req.body;
  try {
    await pool.query(
      'UPDATE users SET email = $1, first_name = $2, last_name = $3, phone = $4 WHERE id = $5',
      [email, firstName, lastName, phone, req.user.userId]
    );
    res.json({ message: 'Account updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update account' });
  }
});

// Change user password
app.put('/change-password', authenticateToken, async (req, res) => {
  const { password, newPassword } = req.body;
  try {
    const result = await pool.query('SELECT password FROM users WHERE id = $1', [req.user.userId]);
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Current password is incorrect' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, req.user.userId]);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Delete user account
app.delete('/account', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.user.userId]);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Admin route to manage users
app.get('/admin/users', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, role FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.put('/admin/user-role', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  const { userId, role } = req.body;
  try {
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

app.delete('/admin/user', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  const { userId } = req.body;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Endpoint to save a page
app.post('/save-page', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO pages (user_id, title, content) VALUES ($1, $2, $3) RETURNING id',
      [req.user.userId, title, content]
    );
    res.json({ pageId: result.rows[0].id });
  } catch (error) {
    console.error('Error saving page:', error);
    res.status(500).json({ error: 'Failed to save page' });
  }
});

// Endpoint to get pages
app.get('/pages', async (req, res) => {
  try {
    const result = await pool.query('SELECT p.id, p.title, p.content, u.username FROM pages p JOIN users u ON p.user_id = u.id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving pages:', error);
    res.status(500).json({ error: 'Failed to retrieve pages' });
  }
});

// Endpoint to get pages for the logged-in user
app.get('/user-pages', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title FROM pages WHERE user_id = $1', [req.user.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving user pages:', error);
    res.status(500).json({ error: 'Failed to retrieve user pages' });
  }
});

// Endpoint to get a single page by ID
app.get('/page/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT title, content FROM pages WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving page:', error);
    res.status(500).json({ error: 'Failed to retrieve page' });
  }
});

// Endpoint to delete a page by ID
app.delete('/pages/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM pages WHERE id = $1', [id]);
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
