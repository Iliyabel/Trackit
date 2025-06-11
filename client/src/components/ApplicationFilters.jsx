import React from 'react';
import styles from './ApplicationFilters.module.css'; 

function ApplicationFilters({
    filterPosition,
    setFilterPosition,
    filterCompany,
    setFilterCompany,
    filterLocation,
    setFilterLocation,
    filterStatus,
    setFilterStatus,
    statusOrder
}) {
    return (
        <div className={styles.filtersContainer}>
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
    );
}

export default ApplicationFilters;