import React from 'react';
import styles from './NotesModal.module.css'; 

function NotesModal({ notes, onChange }) {
  return (
    <div className={styles.notesModal}>
      <label htmlFor="notes-area">Notes:</label>
      <textarea
        id="notes-area"
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        style={{ width: '100%', padding: '10px', fontSize: '1rem', resize: 'vertical' }}
        placeholder="Write your notes here..."
      />
    </div>
  );
}

export default NotesModal;
