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
function getApplications(authToken, applicationId = null) {
    return retry(() => _getApplications(authToken, applicationId), 3, 300)
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
 * Post an application to the API.
 *
 * @param {string} authToken JWT token for authentication. Also used to identify the user.
 * @param {Object} application Application data to be created.
 * @returns Promise resolving to the created application data.
 * @throws {Error} If the response is not ok, throws an error with the status code.
 */
function postApplication(authToken, application) {
    return retry(() => _postApplication(authToken, application), 3, 300)
        .catch(error => {
            console.error("Failed to post application after retries:", error);
            throw error;
        });
}

function _postApplication(authToken, application) {
    console.log("Posting application");
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
    })
}

/**
 * Fetch user profile from the API.
 *
 * @param {string} authToken JWT token for authentication. Also used to identify the user.
 * @returns Promise resolving to the user profile data.
 * @throws {Error} If the response is not ok, throws an error with the status code.
 */
function getUserProfile(authToken) {
    return retry(() => _getUserProfile(authToken), 3, 300)
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
function postUserProfile(authToken, profile) {
    return retry(() => _postUserProfile(authToken, profile), 3, 300)
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