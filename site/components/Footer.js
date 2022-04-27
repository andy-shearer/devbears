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
        className={styles.a}
      >
        Built by Andy Shearer
      </a>
      <section className={styles.footerLinks}>
        <a href="https://testnets.opensea.io/collection/world-congress-bears-v4" target="_blank" rel="noopener noreferrer">
          <img src="/opensea.svg"/>
        </a>
        <a href="https://twitter.com/devshez" target="_blank" rel="noopener noreferrer">
          <img src="/twitter.svg"/>
        </a>
      </section>
    </footer>
  );
}