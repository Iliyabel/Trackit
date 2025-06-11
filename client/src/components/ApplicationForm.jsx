import React, { useState } from 'react';
import styles from './ApplicationForm.module.css';

function ApplicationForm({ 
    onSubmit, 
    onCancel, 
    initialData = {}, 
    onFormChange, // For controlled component behavior
    isReadOnly = false, // If true, form fields are read-only
    showActionButtons = true // Default to true for "Add New" case
}) {

    // Initialize formData with initialData or default values
    const [formData, setFormData] = useState({
        position: '',
        company: '',
        location: '',
        salary: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Applied', // Default status
        url: '',
        notes: '',
        ...initialData 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (onFormChange) { 
            onFormChange(e); // Pass the event up
        } else { 
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            // If onFormChange is used, parent holds the true formData.
            // Otherwise, internal formData is used.
            onSubmit(onFormChange ? initialData : formData); // Pass the correct data
        }
    };

    // Use initialData directly if the form is meant to be fully controlled by parent for display
    const displayData = onFormChange ? initialData : formData;


    return (
        <form onSubmit={handleSubmit} className={styles.applicationForm}>
            <div className={styles.formGroupRow}>
                <div> {/* Column 1 */}
                    <div className={styles.formGroup}>
                        <label htmlFor="position">Position</label>
                        <input type="text" id="position" name="position" value={displayData.position || ''} onChange={handleChange} readOnly={isReadOnly} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="company">Company</label>
                        <input type="text" id="company" name="company" value={displayData.company || ''} onChange={handleChange} readOnly={isReadOnly} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="location">Location</label>
                        <input type="text" id="location" name="location" value={displayData.location || ''} onChange={handleChange} readOnly={isReadOnly} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="salary">Salary</label>
                        <input type="text" id="salary" name="salary" value={displayData.salary || ''} onChange={handleChange} readOnly={isReadOnly} />
                    </div>
                </div>
                <div> {/* Column 2 */}
                    <div className={styles.formGroup}>
                        <label htmlFor="date">Date Applied</label>
                        <input type="date" id="date" name="date" value={displayData.date || ''} onChange={handleChange} readOnly={isReadOnly} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="status">Status</label>
                        <select id="status" name="status" value={displayData.status || 'To Apply'} onChange={handleChange} disabled={isReadOnly}>
                            <option value="To Apply">To Apply</option>
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offer-Received">Offer Received</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Accepted">Accepted</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="url">URL</label>
                        <input type="text" id="url" name="url" value={displayData.url || ''} onChange={handleChange} readOnly={isReadOnly} placeholder="https://example.com" />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="notes">Notes</label>
                        <textarea id="notes" name="notes" value={displayData.notes || ''} onChange={handleChange} readOnly={isReadOnly} rows="3"></textarea>
                    </div>
                </div>
            </div>

            {showActionButtons && (
                <div className={styles.formActions}>
                    <button type="submit" className={styles.primaryButton}>Add Application</button>
                    <button type="button" onClick={onCancel} className={styles.secondaryButton}>Cancel</button>
                </div>
            )}
        </form>
    );
}

export default ApplicationForm;