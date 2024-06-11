import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import UserMenu from './UserMenu';
import { AuthContext } from '../AuthContext';

const Header = () => {
  const { loggedIn, userRole } = useContext(AuthContext);

  return (
    <header className={styles.header}>
      <Link to='/' className={styles.link}><h1 className={styles.title}>Simple Pages</h1></Link>
      <div className={styles.formContainer}>
        {loggedIn ? (
          <UserMenu userRole={userRole} />
        ) : (
          <Link to="/login" className={styles.button}>Sign In</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
