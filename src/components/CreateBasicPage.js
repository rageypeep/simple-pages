import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import styles from './CreatePage.module.css';
import { AuthContext } from '../AuthContext';

const CreateBasicPage = () => {
  const { loggedIn, userRole } = useContext(AuthContext);
  const [header, setHeader] = useState('');
  const [sections, setSections] = useState([{ subheader: '', text: '' }]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleHeaderChange = (e) => {
    setHeader(e.target.value);
  };

  const handleSectionChange = (index, key, value) => {
    const newSections = [...sections];
    newSections[index][key] = value;
    setSections(newSections);
  };

  const handleAddSection = () => {
    setSections([...sections, { subheader: '', text: '' }]);
  };

  const handleRemoveSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const handleSubmit = async () => {
    if (!header || sections.some(section => !section.subheader || !section.text)) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    const content = sections.map(section => `<h2>${section.subheader}</h2><p>${section.text}</p>`).join('');
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:3001/save-page',
        { title: header, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Page saved with ID:', response.data.pageId);
      setErrorMessage('');
      navigate('/');
    } catch (error) {
      console.error('Error saving page:', error);
      setErrorMessage('Failed to save page');
    }
  };

  // Placeholder for handlePreview function
  const handlePreview = () => {
    console.log('Previewing page:', { header, sections });
  };

  return (
    <div className={styles.App}>
      <Header />
      <div className={styles.content}>
        <div className={styles.card}>
          <h2>Create a New Page - Basic Mode</h2>
          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
          <div className={styles.basicMode}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Page Header"
                value={header}
                onChange={handleHeaderChange}
                className={styles.input}
                aria-label="Page Header"
              />
            </div>
            {sections.map((section, index) => (
              <div key={index} className={styles.section}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Subheader"
                    value={section.subheader}
                    onChange={(e) =>
                      handleSectionChange(index, 'subheader', e.target.value)
                    }
                    className={styles.input}
                    aria-label={`Subheader ${index + 1}`}
                  />
                  <textarea
                    placeholder="Text"
                    value={section.text}
                    onChange={(e) =>
                      handleSectionChange(index, 'text', e.target.value)
                    }
                    className={`${styles.input} ${styles.largeTextarea}`}
                    aria-label={`Text ${index + 1}`}
                  />
                  <button
                    className={`${styles.button} ${styles.removeButton}`}
                    onClick={() => handleRemoveSection(index)}
                    aria-label={`Remove Section ${index + 1}`}
                  >
                    Remove Section
                  </button>
                </div>
              </div>
            ))}
            <button className={styles.button} onClick={handleAddSection} aria-label="Add Section">
              Add Section
            </button>
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.submitButton} onClick={handleSubmit} aria-label="Submit">
              Submit
            </button>
            <button className={styles.previewButton} onClick={handlePreview} aria-label="Preview">
              Preview
            </button>
          </div>
          <div className={styles.switchEditor}>
            <Link to="/create-advanced-page" aria-label="Advanced editor">Advanced editor</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBasicPage;
