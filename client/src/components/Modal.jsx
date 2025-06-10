import React from 'react';
import styles from './Modal.module.css';

function Modal({ isOpen, onClose, title, children, className }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} ${className || ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;