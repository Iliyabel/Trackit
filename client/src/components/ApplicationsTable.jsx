import styles from './ApplicationsTable.module.css';

function ApplicationsTable({
    processedApplications,
    requestSort,
    getSortIndicator,
    handleTableRowClick,
    handleNotesClick
}) {
    return (
        <div className={styles.tableWrapper}>
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
                    {processedApplications.map(app => {
                        const statusClassName = `status${app.status.toLowerCase().replace(/\s+/g, '').replace(/-/g, '')}`;
                        return (
                            <tr key={app.id} onClick={() => handleTableRowClick(app)}>
                                <td>{app.position || 'N/A'}</td>
                                <td>{app.company || 'N/A'}</td>
                                <td>{app.location || 'N/A'}</td>
                                <td>{app.date || 'N/A'}</td>
                                <td>
                                    <span className={`${styles.statusCell} ${styles[statusClassName] || ''}`}>
                                        {app.status || 'N/A'}
                                    </span>
                                </td>
                                <td>{app.salary || 'N/A'}</td>
                                <td>
                                    {app.url ? (
                                        <a className={styles.urlCell}
                                            href={app.url.startsWith('http') ? app.url : `https://${app.url}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()} // Prevent row click when clicking link
                                        >
                                            Link
                                        </a>
                                    ) : 'N/A'}
                                </td>
                                <td 
                                    className={styles.notesCell} 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent row click when clicking notes cell
                                        handleNotesClick(app);
                                    }}
                                >
                                    {app.notes ? 'View/Edit' : 'Add Notes'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default ApplicationsTable;