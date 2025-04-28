// Helper function to handle API requests
const fetchAPI = async (endpoint, method = "GET", body = null, isFormData = false) => {
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage

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


// Fetch all tests
export const getAllTests = async (testType) => {
    return fetchAPI(`/test/tests?test_type=${testType}`, "GET");
};

// Get a specific test by ID
export const getTestById = async (testId) => {
    return fetchAPI(`/test/tests/${testId}`, "GET");
};

// Submit answers for a specific test
export const submitTest = async (testId, responses) => {
    return fetchAPI(`/test/tests/${testId}/submit`, "POST", { responses });
};

// Create a new test with questions
export const createTestWithQuestions = async (testData) => {
    return fetchAPI("/test/tests", "POST", testData);
};

// API service related to test series
// Create a new test series
export const createTestSeries = async (testSeriesData) => {
    return fetchAPI("/test-series", "POST", testSeriesData);
};

export const getAllTestSeries = async () => {
    return fetchAPI("/test-series", "GET");
};

// Get all tests in a specific test series
export const getAllTestInSeries = async (seriesId) => {
    return fetchAPI(`/test/tests/${seriesId}?test_type=SERIES_TEST`, "GET");
};

// Get specific test series by ID
export const getTestSeriesById = async (seriesId) => {
    return fetchAPI(`/test-series/${seriesId}`, "GET");
};

// Update a test series
export const updateTestSeries = async (seriesId, updatedData) => {
    return fetchAPI(`/test-series/${seriesId}`, "PUT", updatedData);
};

// Delete a test series
export const deleteTestSeries = async (seriesId) => {
    return fetchAPI(`/test-series/${seriesId}`, "DELETE");
};



// Get all enrolled tests
export const getEnrolledTests = async () => {
    return fetchAPI("/test/tests/enrolled", "GET", null, false);
};

// Get leaderboard for a specific test
export const getLeaderboard = async (testId) => {
    return fetchAPI(`/test/tests/${testId}/leaderboard`, "GET", null, false);
};

// Get tests that have been attempted by the user
export const attemptedTest = async () => {
    return fetchAPI("/test/tests/attempted", "GET", null, false);
};

// Get detailed test results for a specific student and result
export const getTestResultDetails = async (resultId, studentId) => {
    return fetchAPI(`/test/results/${resultId}/${studentId}`, "GET", null, false);
};

// Get all enrolled test series for the current user
export const getEnrolledTestSeries = async () => {
    return fetchAPI("/test-series/my-series", "GET", null, false);
};

// Get a specific test in a test series
export const getTestInSeries = async (seriesId, testId) => {
    return fetchAPI(`/test-series/${seriesId}/tests/${testId}`, "GET", null, false);
};


// Upload an image file to S3 using a presigned URL and return that URL
export const uploadImageToS3 = async (imageFile, testId, type, id) => {
    try {
        // Determine the file extension from the image file type
        console.log("TEST ID", testId)
        console.log("type ID", type)
        console.log("ID", id)
        const fileType = imageFile.type.split('/')[1];
        let imageName = '';

        // Construct the image path based on the type (option or question)
        if (type === 'option') {
            imageName = `${testId}/options/${id}.${fileType}`;
        } else if (type === 'question') {
            imageName = `${testId}/questions/${id}.${fileType}`;
        } else {
            throw new Error('Invalid image type');
        }

        // Construct the endpoint with query parameters as per the provided curl
        const endpoint = `/generatePresignedUrl?fileName=${encodeURIComponent(imageName)}&fileType=${encodeURIComponent(imageFile.type)}`;

        // Call fetchAPI using GET (no body required)
        const { presignedUrl } = await fetchAPI(endpoint, "GET");

        // Upload the image file directly to S3 using the presigned URL
        const uploadResponse = await fetch(presignedUrl, {
            method: "PUT",
            headers: {
                "Content-Type": imageFile.type,
            },
            body: imageFile,
        });

        if (!uploadResponse.ok) {
            throw new Error("Error uploading image to S3");
        }

        // Return the presigned URL upon successful upload
        const publicUrl = presignedUrl.split('?')[0];
        console.log(publicUrl);
        return publicUrl;
    } catch (error) {
        console.error("Error during image upload:", error);
        throw error;
    }
};