// src/components/Home.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import styles from '../App.module.css';
import { AuthContext } from '../AuthContext';

function Home() {
  const { loggedIn, userRole } = useContext(AuthContext);

  return (
    <div className={styles.App}>
      <Header />
      <div className={styles.content}>
        {loggedIn && (
          <div className={styles.boxContainer}>
            <Link to="/create-basic-page" className={styles.box}>Create a new page</Link>
            <Link to="/create-basic-page" className={styles.box}>Create a new page</Link>
            <Link to="/create-basic-page" className={styles.box}>Create a new page</Link>
          </div>
        )}
        <h2>Welcome to Simple Pages</h2>
      </div>
    </div>
  );
}

export default Home;
