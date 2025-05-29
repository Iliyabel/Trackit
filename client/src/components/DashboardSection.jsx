import React from 'react';

function DashboardSection({ title, children }) {
    return (
        <div className="dashboard-section">
            {title && <h2 className="dashboard-section-title">{title}</h2>}
            <div className="dashboard-section-content">
                {children}
            </div>
        </div>
    );
}

export default DashboardSection;