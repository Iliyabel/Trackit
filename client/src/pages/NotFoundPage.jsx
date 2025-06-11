import React from "react";
import logo from "../assets/logo.svg";
import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
  return (
    <div className={styles.container}>
      <img src={logo} alt="App Logo" className={styles.logo} />
      <h1 className={styles.heading}>404 Error</h1>
      <p className={styles.subtext}>Page Not Found</p>
    </div>
  );
}

export default NotFoundPage;
