import React, { useState } from 'react';

function ApplicationForm({ onSubmit, onCancel, initialData = {} }) {
    const [formData, setFormData] = useState({
        position: initialData.position || '',
        company: initialData.company || '',
        location: initialData.location || '',
        salary: initialData.salary || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        status: initialData.status || 'To Apply',
        url: initialData.url || '',
        notes: initialData.notes || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="application-form">
            <div className='form-group-row'>
                <div>
                    <div className="form-group">
                        <label htmlFor="position">Position</label>
                        <input type="text" id="position" name="position" value={formData.position} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="company">Company</label>
                        <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="salary">Salary</label>
                        <input type="text" id="salary" name="salary" value={formData.salary} onChange={handleChange} />
                    </div>
                </div>

                <div>
                    <div className="form-group">
                        <label htmlFor="date">Date Applied</label>
                        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange}>
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offer Received">Offer Received</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Accepted">Accepted</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="url">URL</label>
                        <input type="text" id="url" name="url" value={formData.url} onChange={handleChange} placeholder="https://example.com" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes">Notes</label>
                        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="button-primary">Add Application</button>
                <button type="button" onClick={onCancel} className="button-secondary">Cancel</button>
            </div>
        </form>
    );
}

export default ApplicationForm;