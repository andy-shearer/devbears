import React from "react"
import styles from '../styles/Home.module.css'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        href="https://github.com/andy-shearer"
        target="_blank"
        rel="noopener noreferrer"
      >
        Built by Andy Shearer
      </a>
    </footer>
  );
}