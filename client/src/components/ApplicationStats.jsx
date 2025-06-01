import React from 'react';

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
    { label: 'Total Applications', count: totalApplications, className: 'stat-total', status: 'All' },
    { label: 'Interviewing', count: interviewingCount, className: 'stat-interviewing', status: 'Interviewing' },
    { label: 'Offers Received', count: offerReceivedCount, className: 'stat-offer', status: 'Offer-Received'  },
    { label: 'Accepted', count: acceptedCount, className: 'stat-accepted', status: 'Accepted' },
    { label: 'Rejected', count: rejectedCount, className: 'stat-rejected', status: 'Rejected' },
  ];

  return (
    <div className="application-stats-container">
      {stats.map(stat => {
        const isActive = activeStatus === stat.status;

        return (
          <div
            key={stat.label}
            className={`stat-item ${stat.className} ${isActive ? 'active-stat' : ''}`}
            onClick={() => onStatClick?.(stat.status)}
            style={{ cursor: 'pointer' }}
          >
            <span className="stat-count">{stat.count}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default ApplicationStats;