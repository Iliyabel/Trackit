export const filterApplications = (applications, filterPosition, filterCompany, filterLocation, filterStatus) => {
    let filteredApps = [...applications];

    // Apply text filters
    if (filterPosition) {
        filteredApps = filteredApps.filter(app =>
            app.position.toLowerCase().includes(filterPosition.toLowerCase())
        );
    }
    if (filterCompany) {
        filteredApps = filteredApps.filter(app =>
            app.company.toLowerCase().includes(filterCompany.toLowerCase())
        );
    }
    if (filterLocation) {
        filteredApps = filteredApps.filter(app =>
            app.location.toLowerCase().includes(filterLocation.toLowerCase())
        );
    }

    // Apply status filter
    if (filterStatus !== 'All') {
        filteredApps = filteredApps.filter(app => app.status === filterStatus);
    }

    return filteredApps;
};


export const sortApplications = (applications, sortConfig, statusOrder) => {
    const sortedApps = [...applications]; // Create a new array 

    if (sortConfig.key) {
        sortedApps.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'date') {
                    // Convert to Date objects for correct comparison
                    aValue = aValue ? new Date(aValue) : new Date(0);
                    bValue = bValue ? new Date(bValue) : new Date(0);

                } else if (sortConfig.key === 'status') {
                    // Use set order to sort statuses
                    aValue = statusOrder.indexOf(a.status);
                    bValue = statusOrder.indexOf(b.status);

                } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                    // Use localeCompare for alphabetical for strings
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }

                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }

                return 0;
        });
    }
    return sortedApps;
};