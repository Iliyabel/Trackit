let apiUrl = import.meta.env.DB_API_URL;
let endpoints = {
    applications: `${apiUrl}/applications`,
    profiles: `${apiUrl}/profiles`,
};

/**
 * Fetch applications from the API.
 *
 * @param {string} authToken JWT token for authentication. Also used to identify the user.
 * @param {string} applicationId Optional param to fetch a specific application by ID.
 * @returns Promise resolving to the applications data.
 * @throws {Error} If the response is not ok, throws an error with the status code.
 */
function getApplications(authToken, applicationId = null) {
    console.log(`Fetching applications from ${apiUrl}/applications with token: ${authToken}`);
    let url = endpoints.applications;
    if (applicationId) url += `?Application-Id=${applicationId}`; // Append Application-Id if provided

    return fetch(url, {
        headers: {
            'Authorization': `Bearer ${authToken}`,
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`${response.status}`);
        return response.json();
    });
}

/**
 * Post an application to the API.
 *
 * @param {string} authToken JWT token for authentication. Also used to identify the user.
 * @param {Object} application Application data to be created.
 * @returns Promise resolving to the created application data.
 * @throws {Error} If the response is not ok, throws an error with the status code.
 */
function postApplication(authToken, application) {
    return fetch(`${apiUrl}/applications`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            ...(application.id && { 'Application-Id': application.id }) // Include Application-Id if it exists
        },
        body: JSON.stringify(application)
    })
    .then(response => {
        if (!response.ok) throw new Error(`${response.status}`);
        return response.json();
    });
}

/**
 * Fetch user profile from the API.
 *
 * @param {string} authToken JWT token for authentication. Also used to identify the user.
 * @returns Promise resolving to the user profile data.
 * @throws {Error} If the response is not ok, throws an error with the status code.
 */
function getUserProfile(authToken) {
    return fetch(endpoints.profiles, {
        headers: {
            'Authorization': `Bearer ${authToken}`,
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`${response.status}`);
        return response.json();
    });
}

/**
 * Post user profile to the API.
 *
 * @param {string} authToken JWT token for authentication. Also used to identify the user.
 * @param {Object} profile Profile object to be posted.
 * @returns Promise resolving to the created profile data.
 * @throws {Error} If the response is not ok, throws an error with the status code.
 */
function postUserProfile(authToken, profile) {
    return fetch(endpoints.profiles, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(profile)
    })
    .then(response => {
        if (!response.ok) throw new Error(`${response.status}`);
        return response.json();
    });
}

export { getApplications, postApplication, getUserProfile, postUserProfile };