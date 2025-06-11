let apiUrl = import.meta.env.VITE_DB_API_URL;
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
function getApplications(authToken, applicationId = null, retries = 3, base_delay = 300) {
    return retry(() => _getApplications(authToken, applicationId), retries, base_delay)
        .catch(error => {
            console.error("Failed to fetch applications after retries:", error);
            throw error;
        });
}

function _getApplications(authToken, applicationId = null) {
    console.log("Fetching applications");
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
 * Deletes an application for a user.
 * 
 * @param {string} authToken JWT token for authentication. Also used to identify the user.
 * @param {string} applicationId ID of the application to be deleted.
 * @returns Promise resolving to the deleted application data.
 * @throws {Error} If the response is not ok, throws an error with the status code.
 */
function deleteApplication(authToken, applicationId, retries = 3, base_delay = 300) {
    return retry(() => _deleteApplication(authToken, applicationId), retries, base_delay)
        .catch(error => {
            console.error("Failed to delete application after retries:", error);
            throw error;
        });
}

function _deleteApplication(authToken, applicationId) {
    console.log("Deleting application");
    return fetch(endpoints.applications + `?Application-Id=${applicationId}`, {
        method: 'DELETE',
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
function postApplication(authToken, application, retries = 3, base_delay = 300) {
    return retry(() => _postApplication(authToken, application), retries, base_delay)
        .catch(error => {
            console.error("Failed to post application after retries:", error);
            throw error;
        });
}

function _postApplication(authToken, application) {
    console.log("Posting application");
    const headers = {'Authorization': `Bearer ${authToken}`,};

    // If application has an ID, include it in the headers
    if (application && application.applicationId) {
        headers['Application-Id'] = application.applicationId;
    } 
    
    return fetch(`${apiUrl}/applications`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(application)
    })
    .then(response => {
        if (!response.ok) throw new Error(`${response.status}`);
        return response.json();
    })
}

/**
 * Fetch user profile from the API.
 *
 * @param {string} authToken JWT token for authentication. Also used to identify the user.
 * @returns Promise resolving to the user profile data.
 * @throws {Error} If the response is not ok, throws an error with the status code.
 */
function getUserProfile(authToken, retries = 3, base_delay = 300) {
    return retry(() => _getUserProfile(authToken), retries, base_delay)
        .catch(error => {
            console.error("Failed to fetch user profile after retries:", error);
            throw error;
        });
}

function _getUserProfile(authToken) {
    console.log("Fetching user profile");
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
function postUserProfile(authToken, profile, retries = 3, base_delay = 300) {
    return retry(() => _postUserProfile(authToken, profile), retries, base_delay)
        .catch(error => {
            console.error("Failed to post user profile after retries:", error);
            throw error;
        });
}

function _postUserProfile(authToken, profile) {
    console.log("Posting user profile");
    return fetch(endpoints.profiles, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
    })
    .then(response => {
        if (!response.ok) throw new Error(`${response.status}`);
    });
}

async function retry(func, retries = 3, base_delay = 300) {
    let finalError;
    for (let i = 0; i < retries; i++) {
        try {
            return await func();
        } catch (error) {
            finalError = error;
            console.warn(`Retrying... (${i + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, base_delay * (i + 1)));
        }
    }
    throw finalError;
}

export { getApplications, postApplication, getUserProfile, postUserProfile };