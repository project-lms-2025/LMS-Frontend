
// Helper function to handle API requests
const fetchAPI = async (endpoint, method = "GET", body = null, isFormData = false, authToken = null) => {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(authToken && { Authorization: `Bearer ${authToken}` }), // Add Authorization header if token exists
        },
        credentials: "include",
    };

    if (body) {
        options.body = isFormData ? body : JSON.stringify(body);
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, options);
        const contentType = response.headers.get("Content-Type");
        let data = {};

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

// Create a New Test Series
export const createTestSeries = async (testSeriesData) => {
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage
    return fetchAPI("/test-series", "POST", testSeriesData, false, authToken);
};

// Create a new test in a series along with its questions
export const createTestWithQuestions = async (testData) => {
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage
    return fetchAPI("/test/tests", "POST", testData, false, authToken);
};

// Get all Test Series
export const getAllTestSeries = async () => {
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage
    return fetchAPI("/test-series", "GET", null, false, authToken);
};

// Get a Specific Test Series
export const getTestSeriesById = async (seriesId) => {
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage
    return fetchAPI(`/test-series/${seriesId}`, "GET", null, false, authToken);
};

// Update a Test Series
export const updateTestSeries = async (seriesId, updatedData) => {
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage
    return fetchAPI(`/test-series/${seriesId}`, "PUT", updatedData, false, authToken);
};

// Delete a Test Series
export const deleteTestSeries = async (seriesId) => {
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage
    return fetchAPI(`/test-series/${seriesId}`, "DELETE", null, false, authToken);
};

// Get All Tests in a Specific Test Series
export const getAllTestsInSeries = async (seriesId) => {
    const authToken = localStorage.getItem("authToken");
    return fetchAPI(`/test-series/${seriesId}/tests`, "GET", null, false, authToken);
};


// Get a Specific Test in a Test Series
export const getTestInSeries = async (seriesId, testId) => {
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage
    return fetchAPI(`/test-series/${seriesId}/tests/${testId}`, "GET", null, false, authToken);
};
