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
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/page/${id}`);
        setPage(response.data);
    
        if (response.data && response.data.content) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.data.content, 'text/html');
          const headers = doc.querySelectorAll('h2');
    
          headers.forEach(header => {
            header.setAttribute('id', header.textContent);
          });
    
          const updatedContent = doc.documentElement.outerHTML;
          setPage(prevPage => ({ ...prevPage, content: updatedContent }));
    
          const paragraphs = doc.querySelectorAll('p');
          const parsedSections = Array.from(headers).map((header, index) => ({
            subheader: header.textContent,
            text: paragraphs[index] ? paragraphs[index].textContent : ''
          }));
    
          setSections(parsedSections);
        }
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
        <div className={styles.pageWrapper}>
          <header className={styles.title}>
            <h1>{page.title}</h1>
          </header>
          <div className={styles.mainContent}>
            <div className={styles.headerLinksContainer}>
              <h2>Links</h2>
              <ul className={styles.headerLinks}>
                {sections.map((section) => (
                <li key={section.subheader}><a href={`#${section.subheader}`}>{section.subheader}</a></li>
                ))}
              </ul>
            </div>
            <div
              className={styles.pageContent}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content) }}
            />
          </div>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

export default ViewPage;
