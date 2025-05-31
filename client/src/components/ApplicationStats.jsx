import React from 'react';

function ApplicationStats({ applications }) {
  if (!applications) {
    return null; 
  }

  const totalApplications = applications.length;
  const interviewingCount = applications.filter(app => app.status === 'Interviewing').length;
  const offerReceivedCount = applications.filter(app => app.status === 'Offer-Received').length;
  const rejectedCount = applications.filter(app => app.status === 'Rejected').length;
  const acceptedCount = applications.filter(app => app.status === 'Accepted').length;

  const stats = [
    { label: 'Total Applications', count: totalApplications, className: 'stat-total' },
    { label: 'Interviewing', count: interviewingCount, className: 'stat-interviewing' },
    { label: 'Offers Received', count: offerReceivedCount, className: 'stat-offer' },
    { label: 'Accepted', count: acceptedCount, className: 'stat-accepted' },
    { label: 'Rejected', count: rejectedCount, className: 'stat-rejected' },
  ];

  return (
    <div className="application-stats-container">
      {stats.map(stat => (
        <div key={stat.label} className={`stat-item ${stat.className}`}>
          <span className="stat-count">{stat.count}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

export default ApplicationStats;