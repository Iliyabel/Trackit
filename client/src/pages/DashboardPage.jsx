import React, { useState, useMemo, useEffect, useContext } from 'react';
import { filterApplications, sortApplications } from '../util/filter';
import { getApplications, postApplication, deleteApplication } from '../util/ApiProvider.js';
import { AuthContext } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import DashboardSection from '../components/DashboardSection';
import Modal from '../components/Modal';
import ApplicationForm from '../components/ApplicationForm';
import ApplicationStats from '../components/ApplicationStats';
import ApplicationFilters from '../components/ApplicationFilters';
import ApplicationsTable from '../components/ApplicationsTable';
import NotesModal from '../components/NotesModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './DashboardPage.module.css';

function DashboardPage() {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [error, setError] = useState(null); 

    const { user } = useContext(AuthContext);


    // Fetch applications when the component mounts
    useEffect(() => {
        const fetchInitialApplications = async () => {
            if (!user.isAuthenticated) { 
                setError("User not authenticated. Cannot fetch applications.");
                navigate('/login'); // Redirect to login if not authenticated
                return;
            }
            try {
                setError(null);
                // Pass the user's token to the API call
                const data = await getApplications(user.token);
                if (Array.isArray(data)) {
                    setApplications(data);
                } else {
                    console.error("Received non-array data from getApplications:", data);
                    setApplications([]);
                    setError("Failed to load applications: Invalid data format from server.");
                }
            } catch (err) {
                console.error("Error fetching applications:", err);
                let errorMessage = "An unknown error occurred while fetching applications.";
                if (err.message === '401' || err.message === '403') {
                    errorMessage = "Authentication failed. Please log in again.";
                } else if (err.message === '404') {
                    errorMessage = "Could not find applications. The API endpoint might be incorrect or no data exists.";
                } else if (err.message) {
                    errorMessage = err.message;
                }
                setError(errorMessage);
                setApplications([]);
            } 
        };

        if (user && user.token) { 
            fetchInitialApplications();
        } else {
            setApplications([]); 
        }

        fetchInitialApplications();
    }, [user]); 

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

    // Selected Appication and Edit Mode States
    const [selectedApp, setSelectedApp] = useState(null); // For viewing/editing
    const [editFormData, setEditFormData] = useState({}); // Form data for the selected app
    const [isEditModeActive, setIsEditModeActive] = useState(false); // To toggle

    // Filter States 
    const [filterPosition, setFilterPosition] = useState('');
    const [filterCompany, setFilterCompany] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Notes States
    const [editingNotes, setEditingNotes] = useState(''); // set notes text
    const [notesAppId, setNotesAppId] = useState(null);


    // Status Order for sorting
    const statusOrder = ['Accepted', 'Offer-Received', 'Interviewing', 'Applied', 'Rejected'];

    // Sort State -- default to sorting by date descending
    // key: column to sort by, direction: 'ascending' or 'descending'
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });


    // Handlers for "Add Application" Modal
    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleSaveNewApplication = async (newApplicationDataFromForm) => {
        if (!user || !user.token) {
            setError("Authentication required to save application."); 
            return;
        }
        
        try {
            const savedAppFromServer = await postApplication(user.token, newApplicationDataFromForm);
            setApplications(prevApps => [...prevApps, savedAppFromServer]);
            
            handleCloseAddModal();
        } catch (apiError) {
            console.error("Failed to save new application:", apiError);
            // Update a state to show an error message to the user
            setError(apiError.message || "Could not save application. Please try again."); 
        } 
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

    const handleSaveChanges = async () => {
        if (!user || !user.token) {
            setError("Authentication required to save application."); 
            return;
        }

        try {
            const updatedAppFromServer = await postApplication(user.token, editFormData);

            setApplications(prevApps => 
                prevApps.map(app => app.applicationId === updatedAppFromServer.applicationId ? updatedAppFromServer : app)
            );
            setSelectedApp(updatedAppFromServer); // Update selectedApp to reflect saved changes
            handleCloseAddModal();
        } catch (apiError) {
            console.error("Failed to save new application:", apiError);
            // Update a state to show an error message to the user
            setError(apiError.message || "Could not save application. Please try again."); 
        } 
    };

    const handleDeleteApplication = async () => {
        if (!selectedApp || !selectedApp.applicationId) {
            setError("No application selected to delete.");
            return;
        }

        if (!user || !user.token) {
            setError("Authentication required to delete application.");
            return;
        }

        if (window.confirm(`Are you sure you want to delete the application for "${selectedApp.position}" at "${selectedApp.company}"?`)) {
            try {
                await deleteApplication(user.token, selectedApp.applicationId);
                setApplications(prevApps => prevApps.filter(app => app.applicationId !== selectedApp.applicationId));
                handleCloseViewEditModal();
            } catch (apiError) {
                console.error("Failed to delete application:", apiError);
                setError(apiError.message || "Could not delete application. Please try again.");
            }
        }
    };

    const handleNotesClick = (app) => {
        setEditingNotes(app.notes || '');
        setNotesAppId(app.applicationId);
        setIsNotesModalOpen(true);
    };

    const handleSaveNotes = () => {
    setApplications(prevApps =>
        prevApps.map(app =>
        app.applicationId === notesAppId ? { ...app, notes: editingNotes } : app
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

                    {processedApplications.length === 0 && applications.length > 0 && <p className={styles.missingApplications}>No applications match your current filters.</p>}
                    {applications.length === 0 && <p className={styles.missingApplications}>No applications added yet. Click "+ Add New" to start!</p>}
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
                        key={selectedApp.applicationId + (isEditModeActive ? '-edit' : '-view')} 
                        initialData={editFormData} // Pass the editable form data
                        onFormChange={handleEditFormChange} // To make it controlled
                        isReadOnly={!isEditModeActive}
                        showActionButtons={false} // External buttons for this modal
                    />
                    
                    <div className={styles.formActions} >
                        {!isEditModeActive ? (
                            <>
                                <button type="button" className={styles.primaryButton} onClick={toggleEditMode}>Edit</button>
                                <button type="button" className={styles.secondaryButtonDelete} onClick={handleDeleteApplication}>Delete</button>
                                <button type="button" className={styles.secondaryButton} onClick={handleCloseViewEditModal}>Close</button>
                            </>
                        ) : (
                            <>
                                <button type="button" className={styles.primaryButton} onClick={handleSaveChanges}>Save Changes</button>
                                <button type="button" className={styles.secondaryButton} onClick={toggleEditMode}>Cancel</button>
                            </>
                        )}
                    </div>
                </Modal>
            )}
            {isNotesModalOpen && (
            <Modal isOpen={isNotesModalOpen} onClose={() => setIsNotesModalOpen(false)} title="Notes">
                <NotesModal notes={editingNotes} onChange={setEditingNotes}/>
                <div className={styles.formActions}>
                    <button className={styles.primaryButton} onClick={handleSaveNotes}>Save Notes</button>
                    <button className={styles.secondaryButton} onClick={() => setIsNotesModalOpen(false)}>Cancel</button>
                </div>
            </Modal>
            )}
            <div style={{ height: '2rem' }} />
            <Footer />
        </div>
    );
}

export default DashboardPage;