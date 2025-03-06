const API_BASE_URL = "https://testapi.teachertech.in/api"; // Added /api prefix

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
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
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

// Create a new test along with its questions
export const createTestWithQuestions = async (testData) => {
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage
    return fetchAPI("/test/tests", "POST", testData, false, authToken);
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


