import axios from "axios";
// Helper function to handle API requests
const fetchAPI = async (endpoint, method = "GET", body = null, isFormData = false, additionalHeaders = {}) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || "https://testapi.teachertech.in/api/v2";
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage

    const headers = {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }), // Add Authorization header if token exists
        ...additionalHeaders // Add any additional headers passed to the function
    };

    try {
        const response = await axios({
            method,
            url: `${baseURL}${endpoint}`,
            data: body,
            headers,
            withCredentials: true
        });
        
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            showUnauthorizedDialog();
            throw new Error("Unauthorized access");
        }
        console.error("API Error:", error);
        throw error.response?.data?.message || error.message || "Something went wrong";
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
    return fetchAPI("/test-series", "GET", null, false, {
        "x-Institution-Auth": localStorage.getItem("institutionToken") || import.meta.env.VITE_INSTITUTION_TOKEN,
    });
};

// Get all tests in a specific test series
export const getAllTestInSeries = async (seriesId) => {
    return fetchAPI(`/test/tests/entity?series_id=${seriesId}`, "GET");
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
    return fetchAPI(`/test/results/${testId}/leaderboard`, "GET", null, false);
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
export const uploadImageToS3 = async (
    imageFile,
    testId,
    type,
    id,
    testType,
    course_id,
    batch_id,
    institution_id
) => {
    try {
        if (!imageFile.type || !imageFile.type.includes("/")) {
            throw new Error("Invalid file type");
        }

        const fileType = imageFile.type.split("/")[1];
        const filename = `${id}.${fileType}`;
        const category = type;
        const metadata = {
            batch_id,
            test_id: testId,
            course_id,
            institution_id,
            testType
        };

        const requestBody = {
            category,
            filename,
            fileType: imageFile.type,
            metadata,
        };

        // Call API to get presigned URL
        const response = await fetch("https://testapi.teachertech.in/api/v2/s3/generate-upload-url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();
        console.log("Result:", result);
        const presignedUrl = result?.data?.uploadURL;

        if (!presignedUrl) {
            throw new Error("No presigned URL returned");
        }

        console.log("Presigned URL:", presignedUrl);

        // Upload the image file directly to S3
        const uploadResponse = await fetch(presignedUrl, {
            method: "PUT",
            headers: {
                "Content-Type": imageFile.type,
            },
            body: imageFile,
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error("Upload failed:", errorText);
            throw new Error("Error uploading image to S3");
        }

        // Return the public URL (without query params)
        const publicUrl = presignedUrl.split("?")[0];
        console.log("Uploaded Batch Image URL:", publicUrl);
        return publicUrl;
    } catch (error) {
        console.error("Error during batch image upload:", error);
        throw error;
    }
};

export const uploadBatchImageToS3 = async (imageFile, batch_id) => {
    try {
        if (!imageFile.type || !imageFile.type.includes("/")) {
            throw new Error("Invalid file type");
        }

        const fileType = imageFile.type.split("/")[1];
        const filename = `batch_${batch_id}.${fileType}`;
        const category = "banner_image";
        const metadata = {
            batch_id
        };

        const requestBody = {
            category,
            filename,
            fileType: imageFile.type,
            metadata,
        };

        console.log("Upload metadata:", requestBody);

        // Call API to get presigned URL
        const response = await fetch("https://testapi.teachertech.in/api/v2/s3/generate-upload-url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();
        console.log("Result:", result);
        const presignedUrl = result?.data?.uploadURL;
console.log("Presigned URL:", presignedUrl);
        if (!presignedUrl) {
            throw new Error("No presigned URL returned");
        }

        console.log("Presigned URL:", presignedUrl);

        // Upload the image file directly to S3
        const uploadResponse = await fetch(presignedUrl, {
            method: "PUT",
            headers: {
                "Content-Type": imageFile.type,
            },
            body: imageFile,
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error("Upload failed:", errorText);
            throw new Error("Error uploading image to S3");
        }

        // Return the public URL (without query params)
        const publicUrl = presignedUrl.split("?")[0];
        console.log("Uploaded Batch Image URL:", publicUrl);
        return publicUrl;
    } catch (error) {
        console.error("Error during batch image upload:", error);
        throw error;
    }
};