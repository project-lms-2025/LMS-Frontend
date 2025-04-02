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


// Authentication APIs
export const registerUser = async (userData) => {
    return fetchAPI("/auth/register", "POST", userData);
};

// Admin Register
export const registerTeacher = async (userData) => {
    const authToken = localStorage.getItem("authToken"); // Retrieve the token from localStorage
    return fetchAPI("/auth/create-user", "POST", userData, false, authToken);
};

// ye register wala ho gaya 
export const sendOtp = async (email) => {
    return fetchAPI("/otp/send", "POST", { email });
};


export const sendLoginOtp = async (phoneNumber) => {
    if (!phoneNumber) throw new Error("Phone number is required");
    return fetchAPI("/auth/send-login-otp", "POST", { phoneNumber });
};

// Function to 
export const verifyOtp = async (email, otp) => {
    return fetchAPI("/otp/verify", "POST", { email, otp });
};

export const loginUser = async (credentials) => {
    return fetchAPI("/auth/login", "POST", credentials);
};

export const logoutUser = async (email, deviceType = "mobile") => {
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage
    return fetchAPI("/auth/logout", "POST", { email, deviceType }, false, authToken);
};


export const forgotPassword = async (email) => {
    return fetchAPI("/auth/forgot-password", "POST", { email });
};

export const resetPassword = async (resetToken, newPassword) => {
    return fetchAPI("/auth/reset-password", "POST", { resetToken, newPassword });
};

// Batch APIs
export const createBatch = async (batchData) => {
    const authToken = localStorage.getItem("authToken");
    return fetchAPI("/batch", "POST", batchData, false, authToken);
};

export const getAllBatches = async () => {
    const authToken = localStorage.getItem("authToken");
    return fetchAPI("/batch", "GET", null, false, authToken);
};

export const getBatchById = async (batchId) => {
    return fetchAPI(`/batch/${batchId}`, "GET");
};

export const updateBatchById = async (batchId, batchData) => {
    const authToken = localStorage.getItem("authToken");
    return fetchAPI(`/batch/${batchId}`, "PUT", batchData, false, authToken);
};

export const deleteBatchById = async (batchId) => {
    const authToken = localStorage.getItem("authToken");
    return fetchAPI(`/batch/${batchId}`, "DELETE", null, false, authToken);
};


// Course APIs
export const createCourse = async (courseData) => {
    const authToken = localStorage.getItem("authToken");
    return fetchAPI("/course", "POST", { ...courseData, allow_notes_download: true }, false, authToken);
};

export const getCourseById = async (courseId) => {
    return fetchAPI(`/course/${courseId}`);
};

export const updateCourse = async (courseId, courseData) => {
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage
    return fetchAPI(`/course/${courseId}`, "PUT", courseData, false, authToken);
};

export const deleteCourse = async (courseId) => {
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage
    return fetchAPI(`/course/${courseId}`, "DELETE", null, false, authToken);
};

export const getCoursesByBatchId = async (batchId) => {
    return fetchAPI(`/course/batch/${batchId}`);
};
export const getAllCourses = async () => {
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage
    return fetchAPI(`/course/courses`,"GET", null, false, authToken);
};

// Class APIs
export const createClass = async (classData, authToken) => {
    return fetchAPI("/class", "POST", classData, false, authToken);
};

export const getClassById = async (classId) => {
    return fetchAPI(`/class/${classId}`, "GET");
};

export const updateClass = async (classId, updatedData, authToken) => {
    return fetchAPI(`/class/${classId}`, "PUT", updatedData, false, authToken);
};

export const getClassesByCourseId = async (courseId) => {
    return fetchAPI(`/class/course/${courseId}`, "GET");
};

export const deleteClass = async (classId, authToken) => {
    return fetchAPI(`/class/${classId}`, "DELETE", null, false, authToken);
};



// User APIs
export const getUserByEmail = async (email) => {
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage
    if (!authToken) {
        throw new Error("Authorization token is missing");
    }
    return fetchAPI(`/user/${encodeURIComponent(email)}`, "GET", null, false, authToken);
};
// Get User Profile
export const getUserProfile = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        throw new Error("Authorization token is missing");
    }
    return fetchAPI("/user/profile", "GET", null, false, authToken);
};

// File Upload API (Profile Picture & PDF)
export const uploadFiles = async (formData) => {
    return fetchAPI("/user/upload", "POST", formData, true);
};
export const enrollUser = async (enrollmentData) => {
    const authToken = localStorage.getItem("authToken");
    return fetchAPI("/enrollment/enroll-user", "POST", enrollmentData, false, authToken);
};
// Enroll User in Batch
export const getEnrollmentBatches = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        throw new Error("Authorization token is missing");
    }
    return fetchAPI("/enrollment/batch", "GET", null, false, authToken);
};
export const getEnrolledCourses = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        throw new Error("Authorization token is missing");
    }
    return fetchAPI("/course/enrolled-courses", "GET", null, false, authToken);
};

export const createPaymentOrder = async (paymentData) => {
    const authToken = localStorage.getItem("authToken");
    return fetchAPI("/payment/create-order", "POST", paymentData, false, authToken);
};