'use client';

import React, { useState } from 'react';
import styles from './main-header.module.scss';
import logo from '@/assets/logo.png';
import Image from 'next/image';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <Image width={50} height={20} src={logo} alt="Brand Logo" />
        </div>

        {/* Navigation Menu */}
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>

        {/* Menu Toggle for Mobile */}
        <div
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div
            className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`}
          ></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
