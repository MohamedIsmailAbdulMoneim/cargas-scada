import React from 'react';
import styles from './Spinner.module.scss'; // For styling

const Spinner = () => {
  return (
    <div className={styles['spinner-container']}>
      <div className={styles['spinner']}></div>
    </div>
  );
};

export default Spinner;
