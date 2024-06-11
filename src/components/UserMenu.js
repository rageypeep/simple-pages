import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './UserMenu.module.css';
import { AuthContext } from '../AuthContext';

function UserMenu({ userRole }) {
  const { setLoggedIn } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false); // Update the loggedIn state
    navigate('/');
  };

  return (
    <div className={styles.avatarContainer} onClick={toggleDropdown}>
      <img src="https://placehold.co/42x42" alt="User Avatar" className={styles.avatar} />
      <span>&#9662;</span>
      <div className={`${styles.dropdownMenu} ${dropdownOpen ? styles.show : ''}`}>
        <Link to="/account">Account</Link>
        <Link to="/manage-pages">Manage Pages</Link>
        <Link to="/help">Help Centre</Link>
        {(userRole === 'admin' || userRole === 'moderator') && (
          <Link to="/admin">Admin</Link>
        )}
        <a href="/" onClick={handleLogout}>Logout</a>
      </div>
    </div>
  );
}

export default UserMenu;
