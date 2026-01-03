
import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Index.module.css';

const IndexPage = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/register');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Welcome to the Architecture & Engineering Service System
      </h1>

      <p className={styles.subtitle}>
        Click the button below to continue setup and register your account.
      </p>

      <button className={styles.continueButton} onClick={handleClick}>
        Continue Setup
      </button>
    </div>
  );
};

export default IndexPage;
