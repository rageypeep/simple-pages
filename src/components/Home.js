// src/components/Home.js
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import Header from './Header';
import styles from './Home.module.css';


const Home = () => {
  const { loggedIn } = useContext(AuthContext);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (loggedIn) {
      const fetchPages = async () => {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Debug statement
        try {
          const response = await axios.get('http://localhost:3001/user-pages', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPages(response.data);
        } catch (error) {
          console.error('Error fetching user pages:', error);
        }
      };

      fetchPages();
    }
  }, [loggedIn]);

  return (
    <div className={styles.content}>
      <Header />
      <div>
        {loggedIn ? (
          <div className={styles.boxContainer}>
            {pages.map((page) => (
              <Link to={`/page/${page.id}`} key={page.id} className={styles.box}>
                {page.title}
              </Link>
            ))}
            <Link to="/create-basic-page" className={styles.box}>
              Create a new Page
            </Link>
          </div>
        ) : (
          <div className={styles.boxContainer}>
            <h2>Welcome to Simple Pages</h2>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Home;
