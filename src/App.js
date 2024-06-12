// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import LoginPage from './components/LoginPage';
import Account from './components/Account';
import Admin from './components/Admin';
import CreateBasicPage from './components/CreateBasicPage';
import CreateAdvancedPage from './components/CreateAdvancedPage';
import Home from './components/Home';
import ViewPage from './components/ViewPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={<Account />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/create-basic-page" element={<CreateBasicPage />} />
      <Route path="/create-advanced-page" element={<CreateAdvancedPage />} />
      <Route path="/page/:id" element={<ViewPage />} />
    </Routes>
  );
}

export default App;
