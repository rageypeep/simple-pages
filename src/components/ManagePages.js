import React from 'react';
import axios from 'axios';
import styles from './ManagePages.module.css';
import { Link } from 'react-router-dom';

function ManagePages() {
    const [pages, setPages] = React.useState([]);
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
        const fetchPages = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/user-pages', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPages(response.data);
            } catch (error) {
                console.error('Error fetching pages:', error);
            }
        };

        fetchPages();
    }, []);