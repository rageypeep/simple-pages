// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './AuthContext';
import globalStyles from './index.module.css'
import styles from './quillStyles.css'

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);
