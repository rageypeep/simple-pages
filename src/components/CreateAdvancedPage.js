import React, { useEffect, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import axios from 'axios';
import Header from './Header';
import styles from './CreatePage.module.css';
import appStyles from '../App.module.css';
import { AuthContext } from '../AuthContext';

const CreateAdvancedPage = () => {
  const { loggedIn, userRole } = useContext(AuthContext);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video', 'formula'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean']
    ];

    if (!quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions
        },
      });
    }
  }, []);

  const handleSubmit = async () => {
    const quillContent = quillInstance.current.root.innerHTML;
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:3001/save-page',
        { title: 'Page Title', content: quillContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Page saved with ID:', response.data.pageId);
      navigate('/');
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  return (
    <div className={appStyles.App}>
      <Header />
      <div className={appStyles.content}>
        <div className={appStyles.card}>
          <h2>Create a New Page - Advanced Mode</h2>
          <div ref={quillRef} className={styles.quillContainer}></div>
          <button className={styles.buttonAdvanced} onClick={handleSubmit}>
            Submit
          </button>
          <div className={styles.switchEditor}>
            <Link to="/create-basic-page">Basic editor</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdvancedPage;
