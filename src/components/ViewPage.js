// src/components/ViewPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import Header from './Header';
import styles from './ViewPage.module.css';

const ViewPage = () => {
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/page/${id}`);
        setPage(response.data);
      } catch (error) {
        setError('Page not found');
      }
    };

    fetchPage();
  }, [id]);

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.content}>
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      {page ? (
        <div className={styles.pageContent}>
          <h1 className={styles.title}>{page.title}</h1>
          <div
            className={styles.pageContent}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content) }}
          />
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

export default ViewPage;
