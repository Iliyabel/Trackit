import React, { useState, useMemo } from 'react';
import DashboardSection from '../components/DashboardSection';
import Modal from '../components/Modal';
import ApplicationForm from '../components/ApplicationForm';
import ApplicationStats from '../components/ApplicationStats';
import ApplicationFilters from '../components/ApplicationFilters';
import ApplicationsTable from '../components/ApplicationsTable';
import NotesModal from '../components/NotesModal';
import Header from '../components/Header';
import { filterApplications, sortApplications } from '../util/filter';
import styles from '../components/DashboardPage.module.css';

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

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);

    // Selected Appication and Edit Mode States
    const [selectedApp, setSelectedApp] = useState(null); // For viewing/editing
    const [editFormData, setEditFormData] = useState({}); // Form data for the selected app
    const [isEditModeActive, setIsEditModeActive] = useState(false); // To toggle

    // Filter States 
    const [filterPosition, setFilterPosition] = useState('');
    const [filterCompany, setFilterCompany] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    //Notes States
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [editingNotes, setEditingNotes] = useState('');
    const [notesAppId, setNotesAppId] = useState(null);


    // Status Order for sorting
    const statusOrder = ['Accepted', 'Offer-Received', 'Interviewing', 'Applied', 'Rejected'];

    // Sort State -- default to sorting by date descending
    // key: column to sort by, direction: 'ascending' or 'descending'
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });


    // Handlers for "Add Application" Modal
    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleSaveNewApplication = (newAppData) => {
        setApplications(prevApps => [
            ...prevApps,
            { ...newAppData, id: prevApps.length > 0 ? Math.max(...prevApps.map(app => app.id)) + 1 : 1 }
        ]);
        handleCloseAddModal();
    };


    // Handlers for "View/Edit Application" Modal
    const handleTableRowClick = (app) => {
        setSelectedApp(app);
        setEditFormData({ ...app }); // Populate form with selected appications data
        setIsEditModeActive(false); // default to view mode
        setIsViewEditModalOpen(true);
    };

    const handleCloseViewEditModal = () => {
        setIsViewEditModalOpen(false);
        setSelectedApp(null);
        setEditFormData({});
        setIsEditModeActive(false);
    };

    const toggleEditMode = () => {
        if (isEditModeActive) { // If switching from Edit to View
            setEditFormData({ ...selectedApp }); // Revert any unsaved changes
        }
        setIsEditModeActive(!isEditModeActive);
    };
    
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSaveChanges = () => {
        setApplications(prevApps => 
            prevApps.map(app => app.id === selectedApp.id ? { ...editFormData } : app)
        );
        setSelectedApp({...editFormData}); // Update selectedApp to reflect saved changes
        setIsEditModeActive(false); // Switch back to view mode
    };

    const handleDeleteApplication = () => {
        if (selectedApp && window.confirm(`Are you sure you want to delete the application for "${selectedApp.position}" at "${selectedApp.company}"?`)) {
            setApplications(prevApps => prevApps.filter(app => app.id !== selectedApp.id));
            handleCloseViewEditModal();
        }
    };

    const handleNotesClick = (app) => {
        setEditingNotes(app.notes || '');
        setNotesAppId(app.id);
        setIsNotesModalOpen(true);
    };

    const handleSaveNotes = () => {
    setApplications(prevApps =>
        prevApps.map(app =>
        app.id === notesAppId ? { ...app, notes: editingNotes } : app
        )
    );
    setIsNotesModalOpen(false);
    };

    // Filtering and Sorting
    const processedApplications = useMemo(() => {
        let filteredApps = filterApplications(applications, filterPosition, filterCompany, filterLocation, filterStatus);
        let sortedAndFilteredApps = sortApplications(filteredApps, sortConfig, statusOrder); 
        return sortedAndFilteredApps;
    }, [applications, filterPosition, filterCompany, filterLocation, filterStatus, sortConfig, statusOrder]);

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
        const isActive = sortConfig.key === key;
        const arrow = sortConfig.direction === 'ascending' ? '▼' : '▲';

        return <span className={`${styles.sortArrow} ${isActive ? styles.active || '' : ''}`}>{isActive ? arrow : '▼'}</span>;
    };

    return (
        <div className={styles.dashboardPage}>
            <Header></Header>

            <div className={styles.dashboardContainer}>
                <DashboardSection title="Dashboard Overview">
                    <ApplicationStats 
                        applications={applications} 
                        onStatClick={(status) =>
                            setFilterStatus(prev => (prev === status ? 'All' : status))
                        }
                        activeStatus={filterStatus}/> 
                </DashboardSection>

                <DashboardSection title="Applications" onAdd={handleOpenAddModal}>

                    <ApplicationFilters
                        filterPosition={filterPosition}
                        setFilterPosition={setFilterPosition}
                        filterCompany={filterCompany}
                        setFilterCompany={setFilterCompany}
                        filterLocation={filterLocation}
                        setFilterLocation={setFilterLocation}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        statusOrder={statusOrder}
                    />

                    <ApplicationsTable
                        processedApplications={processedApplications}
                        requestSort={requestSort}
                        getSortIndicator={getSortIndicator}
                        handleTableRowClick={handleTableRowClick}
                        handleNotesClick={handleNotesClick}
                    />

                    {processedApplications.length === 0 && applications.length > 0 && <p>No applications match your current filters.</p>}
                    {applications.length === 0 && <p>No applications added yet. Click "+ Add New" to start!</p>}
                </DashboardSection>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={handleCloseAddModal} title="Add New Job Application">
                <ApplicationForm 
                    onSubmit={handleSaveNewApplication} 
                    onCancel={handleCloseAddModal}
                />
            </Modal>

            {selectedApp && ( // Only show if a job appication is selected
                <Modal isOpen={isViewEditModalOpen} onClose={handleCloseViewEditModal} 
                    title={isEditModeActive ? "Edit Application Details" : "View Application Details"}>
                    <ApplicationForm
                        key={selectedApp.id + (isEditModeActive ? '-edit' : '-view')} 
                        initialData={editFormData} // Pass the editable form data
                        onFormChange={handleEditFormChange} // To make it controlled
                        isReadOnly={!isEditModeActive}
                        showActionButtons={false} // External buttons for this modal
                    />
                    
                    <div className="form-actions" >
                        {!isEditModeActive ? (
                            <>
                                <button type="button" className="button-primary" onClick={toggleEditMode}>Edit</button>
                                <button type="button" className="button-delete" onClick={handleDeleteApplication}>Delete</button>
                                <button type="button" className="button-secondary" onClick={handleCloseViewEditModal}>Close</button>
                            </>
                        ) : (
                            <>
                                <button type="button" className="button-primary" onClick={handleSaveChanges}>Save Changes</button>
                                <button type="button" className="button-secondary" onClick={toggleEditMode}>Cancel</button>
                            </>
                        )}
                    </div>
                </Modal>
            )}
            {isNotesModalOpen && (
            <Modal isOpen={isNotesModalOpen} onClose={() => setIsNotesModalOpen(false)} title="Notes">
                <NotesModal notes={editingNotes} onChange={setEditingNotes}/>
                <div className="form-actions">
                    <button className="button-primary" onClick={handleSaveNotes}>Save Notes</button>
                    <button className="button-secondary" onClick={() => setIsNotesModalOpen(false)}>Cancel</button>
                </div>
            </Modal>
            )}
        </div>
    );
}

export default DashboardPage;