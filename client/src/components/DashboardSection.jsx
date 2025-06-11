import React from 'react';
import styles from './DashboardSection.module.css'; 

function DashboardSection({ title, children, onAdd }) {
  return (
    <div className={styles.dashboardSection}>
      <div className={styles.dashboardSectionHeader}> 
        {title && <h2 className={styles.dashboardSectionTitle}>{title}</h2>}

        {onAdd && (
          <button onClick={onAdd} className={styles.sectionPrimaryButton}>
            + Add Job Application
          </button>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}

export default DashboardSection;