import React, { useState, useMemo } from 'react';
import DashboardSection from '../components/DashboardSection';
import Modal from '../components/Modal';
import ApplicationForm from '../components/ApplicationForm';

function DashboardPage() {
    const [applications, setApplications] = useState([
        // Filler data
        { id: 1, position: 'Software Engineer', company: 'Tech Corp', location: 'Remote', salary: '$120k', date: '2024-05-01', status: 'Applied', url: 'techcorp.com/careers', notes: 'First round interview scheduled.' },
        { id: 2, position: 'Data Analyst', company: 'Alpha Inc', location: 'New York', salary: '$130k', date: '2024-05-15', status: 'Interviewing', url: 'alpha.com', notes: 'Second round next week.' },
        { id: 3, position: 'UX Designer', company: 'Beta LLC', location: 'San Francisco', salary: '$110k', date: '2024-04-20', status: 'Offer-Received', url: 'beta.com', notes: 'Negotiating salary.' },
        { id: 4, position: 'Project Manager', company: 'Gamma Co', location: 'Remote', salary: '$140k', date: '2024-03-10', status: 'Rejected', url: 'gamma.com', notes: 'Not a good fit.' },
        { id: 5, position: 'Frontend Developer', company: 'Delta Solutions', location: 'Austin', salary: '$125k', date: '2024-05-20', status: 'Accepted', url: 'delta.com', notes: 'Start date June 1st.' },
        { id: 6, position: 'Backend Developer', company: 'Tech Corp', location: 'Remote', salary: '$135k', date: '2024-04-10', status: 'Applied', url: 'techcorp.com/careers', notes: 'Waiting for response.' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter States 
    const [filterPosition, setFilterPosition] = useState('');
    const [filterCompany, setFilterCompany] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Sort State -- default to sorting by date descending
    // key: column to sort by, direction: 'ascending' or 'descending'
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    
    const handleSaveApplication = (formData) => {
        const newApplication = {
            id: applications.length > 0 ? Math.max(...applications.map(app => app.id)) + 1 : 1,
            ...formData
        };
        setApplications(prevApplications => [...prevApplications, newApplication]);
        handleCloseModal();
    };

    // Filtering and Sorting Logic 
    const statusOrder = ['Accepted', 'Offer-Received', 'Interviewing', 'Applied', 'To Apply', 'Rejected'];

    const processedApplications = useMemo(() => {
        let filteredApps = [...applications];

        // Apply text filters
        if (filterPosition) {
            filteredApps = filteredApps.filter(app => 
                app.position.toLowerCase().includes(filterPosition.toLowerCase())
            );
        }
        if (filterCompany) {
            filteredApps = filteredApps.filter(app => 
                app.company.toLowerCase().includes(filterCompany.toLowerCase())
            );
        }
        if (filterLocation) {
            filteredApps = filteredApps.filter(app => 
                app.location.toLowerCase().includes(filterLocation.toLowerCase())
            );
        }

        // Apply status filter
        if (filterStatus !== 'All') {
            filteredApps = filteredApps.filter(app => app.status === filterStatus);
        }

        // Apply sorting
        if (sortConfig.key) {
            filteredApps.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'date') {
                    // Convert to Date objects for correct comparison
                    aValue = aValue ? new Date(aValue) : new Date(0);
                    bValue = bValue ? new Date(bValue) : new Date(0);

                } else if (sortConfig.key === 'status') {
                    // Use predefined order to sort statuses
                    aValue = statusOrder.indexOf(a.status);
                    bValue = statusOrder.indexOf(b.status);

                } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                    // Use localeCompare for alphabetical for strings
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }

                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }

                return 0;
            });
        }
        return filteredApps;
    }, [applications, filterPosition, filterCompany, filterLocation, filterStatus, sortConfig]);

    // Sort Request Handler 
    const requestSort = (key) => {
        let direction = 'ascending';
        // If sorting by the same key, toggle direction
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } 

        // Default to descending for date if it's the first click or switching to date
        else if (key === 'date' && (sortConfig.key !== 'date' || sortConfig.direction === 'ascending')) {
            direction = 'descending';
        }

        // Default to ascending for status if it's the first click or switching to status
        else if (key === 'status' && (sortConfig.key !== 'status' || sortConfig.direction === 'descending')) {
            direction = 'ascending';
        }
        
        setSortConfig({ key, direction });
    };

    // Helper to get sort direction indicator
    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
        }

        return '';
    };

    return (
        <div className="dashboard-page">
            <header className='logo-header'>
                <img className="logo" src={'../assets/logoText.svg'} alt="Trackit logo" />
            </header>

            <div className='dashboard-container'>
                <DashboardSection title="Dashboard Overview">
                    <p>This is where our overview content will go.</p>
                    <p>We can add charts.</p>
                </DashboardSection>

                <DashboardSection title="Applications" onAdd={handleOpenModal}>

                    <div className="filters-container">
                        <input 
                            type="text" 
                            placeholder="Filter by Position..." 
                            value={filterPosition} 
                            onChange={(e) => setFilterPosition(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Filter by Company..." 
                            value={filterCompany} 
                            onChange={(e) => setFilterCompany(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Filter by Location..." 
                            value={filterLocation} 
                            onChange={(e) => setFilterLocation(e.target.value)} 
                        />
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="All">All Statuses</option>
                            {statusOrder.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => requestSort('position')}>Job Position{getSortIndicator('position')}</th>
                                <th onClick={() => requestSort('company')}>Company{getSortIndicator('company')}</th>
                                <th onClick={() => requestSort('location')}>Location{getSortIndicator('location')}</th>
                                <th onClick={() => requestSort('date')}>Date{getSortIndicator('date')}</th>
                                <th onClick={() => requestSort('status')}>Status{getSortIndicator('status')}</th>
                                <th>Salary</th>
                                <th>Url</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedApplications.map(app => (
                                <tr key={app.id}>
                                    <td>{app.position || 'N/A'}</td>
                                    <td>{app.company || 'N/A'}</td>
                                    <td>{app.location || 'N/A'}</td>
                                    <td>{app.date || 'N/A'}</td>
                                    <td>
                                        <span className={`status-cell status-${app.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                            {app.status || 'N/A'}
                                        </span>
                                    </td>
                                    <td>{app.salary || 'N/A'}</td>
                                    <td>{app.url ? <a href={app.url.startsWith('http') ? app.url : `https://${app.url}`} target="_blank" rel="noopener noreferrer" style={{color: '#88C0D0'}}>Link</a> : 'N/A'}</td>
                                    <td>{app.notes || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {processedApplications.length === 0 && applications.length > 0 && <p>No applications match your current filters.</p>}
                    {applications.length === 0 && <p>No applications added yet. Click "+ Add New" to start!</p>}
                </DashboardSection>
            </div>

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