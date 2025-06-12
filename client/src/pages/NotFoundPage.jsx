import React from "react";
import styles from "./NotFoundPage.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function NotFoundPage() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <img src="src/assets/sadFace.png" alt="Sad face" className={styles.img} />
        <h1 className={styles.heading}>404 Error</h1>
        <p className={styles.subtext}>Page Not Found</p>
        <button className={styles.homeButton} onClick={() => window.location.href = '/'}>
          Go to Home
        </button>
      </div>
      <Footer />
    </>
  );
}

export default NotFoundPage;
