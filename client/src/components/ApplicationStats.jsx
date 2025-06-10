import React from 'react';
import styles from './ApplicationStats.module.css'; 

function ApplicationStats({ applications, onStatClick, activeStatus }) {
  if (!applications) {
    return null; 
  }

  const totalApplications = applications.length;
  const interviewingCount = applications.filter(app => app.status === 'Interviewing').length;
  const offerReceivedCount = applications.filter(app => app.status === 'Offer-Received').length;
  const rejectedCount = applications.filter(app => app.status === 'Rejected').length;
  const acceptedCount = applications.filter(app => app.status === 'Accepted').length;

  const stats = [
    { label: 'Total Applications', count: totalApplications, className: 'statTotal', status: 'All' },
    { label: 'Interviewing', count: interviewingCount, className: 'statInterviewing', status: 'Interviewing' },
    { label: 'Offers Received', count: offerReceivedCount, className: 'statOffer', status: 'Offer-Received'  },
    { label: 'Accepted', count: acceptedCount, className: 'statAccepted', status: 'Accepted' },
    { label: 'Rejected', count: rejectedCount, className: 'statRejected', status: 'Rejected' },
  ];

  return (
    <div className={styles.applicationStatsContainer}>
      {stats.map(stat => {
        const isActive = activeStatus === stat.status;

        return (
          <div
            key={stat.label}
            className={`${styles.statItem} ${styles[stat.className] || ''} ${isActive ? styles.activeStat || '' : ''}`}
            onClick={() => onStatClick?.(stat.status)}
            style={{ cursor: 'pointer' }}
          >
            <span className={styles.statCount}>{stat.count}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default ApplicationStats;