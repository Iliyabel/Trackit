import React from 'react';

function DashboardSection({ title, children, onAdd }) {
  return (
    <div className="dashboard-section">
      <div className="dashboard-section-header"> 
        {title && <h2 className="dashboard-section-title">{title}</h2>}

        {onAdd && (
          <button onClick={onAdd} className="dashboard-section-add-button">
            + Add Job Application
          </button>
        )}
      </div>
      <div className="dashboard-section-content">
        {children}
      </div>
    </div>
  );
}


export default DashboardSection;