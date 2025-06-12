import React from "react";
import styles from "./NotFoundPage.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import sadFace from "../assets/sadFace.png";

function NotFoundPage() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <img src={sadFace} alt="Sad face" className={styles.img} />
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
