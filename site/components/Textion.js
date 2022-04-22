import React from "react";
import styles from "../styles/Home.module.css"

export default function Textion (props) {
  const title = props.title;
  const text = props.children;

  return (
    <section className={styles.textBox}>
      <h2 className={styles.textHeading}>{title}</h2>
      <p className={styles.textContent}>{text}</p>
    </section>
  )
}