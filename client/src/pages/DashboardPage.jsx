import React, { useState } from 'react';
import DashboardSection from '../components/DashboardSection';
import Modal from '../components/Modal';
import ApplicationForm from '../components/ApplicationForm';

function DashboardPage() {
    const [applications, setApplications] = useState([
        // Filler data
        { id: 1, position: 'Software Engineer', company: 'Tech Corp', location: 'Remote', salary: '$120k', date: '2024-05-01', status: 'Applied', url: 'techcorp.com/careers', notes: 'First round interview scheduled.' },
        { id: 1, position: 'a', company: 'a', location: 'a', salary: '$130k', date: '2024-05-03', status: 'Interviewing', url: 'a.com', notes: 'This is temp.' },
        { id: 1, position: 'b', company: 'b', location: 'b', salary: '$130k', date: '2024-05-03', status: 'Offer-Received', url: 'b.com', notes: 'This is temp.' },
        { id: 1, position: 'c', company: 'c', location: 'c', salary: '$130k', date: '2024-04-03', status: 'Rejected', url: 'c.com', notes: 'This is temp.' },
        { id: 1, position: 'd', company: 'd', location: 'd', salary: '$130k', date: '2024-03-06', status: 'Accepted', url: 'd.com', notes: 'This is temp.' }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    
    const handleSaveApplication = (formData) => {
        const newApplication = {
            id: applications.length > 0 ? Math.max(...applications.map(app => app.id)) + 1 : 1, // More robust ID
            ...formData // Spread the form data
        };
        setApplications(prevApplications => [...prevApplications, newApplication]);
        handleCloseModal(); // Close modal after saving
    };

    return (
        <div className="dashboard-page">
            <header className='logo-header'>
                <img className="logo" src={'src/assets/logoText.svg'} alt="Trackit logo" />
            </header>

            <div className='dashboard-container'>
                
                <DashboardSection title="Dashboard">
                    <p>This is where our overview content will go.</p>
                    <p>We can add charts.</p>
                </DashboardSection>

                <DashboardSection title="Applications" onAdd={handleOpenModal}>
                    <table>
                        <thead>
                            <tr>
                                <th>Job Position</th>
                                <th>Company</th>
                                <th>Location</th>
                                <th>Salary</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Url</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app.id}>
                                    <td>{app.position || 'N/A'}</td>
                                    <td>{app.company || 'N/A'}</td>
                                    <td>{app.location || 'N/A'}</td>
                                    <td>{app.salary || 'N/A'}</td>
                                    <td>{app.date || 'N/A'}</td>
                                    <td>
                                        <span className={`status-cell status-${app.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                            {app.status || 'N/A'}
                                        </span>
                                    </td>
                                    <td>{app.url ? <a href={app.url} target="_blank" rel="noopener noreferrer" style={{color: '#88C0D0'}}>Link</a> : 'N/A'}</td>
                                    <td>{app.notes || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {applications.length === 0 && <p>No applications added yet. Click "+ Add New" to start!</p>}
                </DashboardSection>
            </div>

            {/* Modal for adding new application */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New Job Application">
                <ApplicationForm 
                    onSubmit={handleSaveApplication} 
                    onCancel={handleCloseModal} 
                />
            </Modal>
        </div>
    );
}

export default DashboardPage;