// src/api/auth.jsx - Modified fetchAPI function
import axios from "axios";
import { showUnauthorizedDialog } from "../utils/unauthorizedHandler";


// Helper function to handle API requests
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
        if (error.response && error.response.status === 401 && !endpoint.includes("/batch/my-batches")) {
            showUnauthorizedDialog();
            throw new Error("Unauthorized access");
        }
        console.error("API Error:", error);
        throw error.response?.data?.message || error.message || "Something went wrong";
    }
};

// Authentication API functions

/** Registers a new user with the provided data */
export const registerUser = async (userData) => {
    return fetchAPI("/auth/register", "POST", userData);
};

/** Registers a new teacher/admin with the provided data */
export const registerTeacher = async (userData) => {
    return fetchAPI("/auth/create-user", "POST", userData);
};

/** Sends an OTP to the provided email address for verification */
export const sendOtp = async (email) => {
    return fetchAPI("/auth/send-signup-otp", "POST", { email });
};


/** Sends a login OTP to the provided phone number */
export const sendLoginOtp = async (email_or_phone) => {
    if (!email_or_phone) throw new Error("Phone number is required");
    return fetchAPI("/auth/send-login-otp", "POST", { email_or_phone });
};

/** Verifies the OTP sent to the email */
export const verifyOtp = async (email, otp) => {
    return fetchAPI("/auth/verify-signup-otp", "POST", { email, otp });
};


/** Logs in a user with the provided credentials */
export const loginUser = async (credentials) => {
    return fetchAPI("/auth/login", "POST", credentials);
};

/** Logs out the user from the current session */
export const logoutUser = async (email, deviceType = "mobile") => {
    return fetchAPI("/auth/logout", "POST", { email, deviceType });
};

/** Sends a forgot password request for the provided email */
export const forgotPassword = async (email) => {
    return fetchAPI("/auth/forgot-password", "POST", { email });
};

/** Resets the password using the reset token and new password */
export const resetPassword = async (resetToken, newPassword) => {
    return fetchAPI("/auth/reset-password", "POST", { resetToken, newPassword });
};

// Batch API functions

/** Creates a new batch with the provided data */
export const createBatch = async (batchData) => {
    return fetchAPI("/batch", "POST", batchData);
};

/** Retrieves all available batches */
export const getAllBatches = async () => {
    const institutionToken = localStorage.getItem("institutionToken") || import.meta.env.VITE_INSTITUTION_TOKEN;
    console.log("institutionToken", institutionToken);
    return fetchAPI("/batch", "GET", null, false, {
        "x-Institution-Auth": institutionToken
    });
};

/** Retrieves details of a specific batch by its ID */
export const getBatchById = async (batchId) => {
    return fetchAPI(`/batch/${batchId}`, "GET");
};

/** Updates an existing batch with new data by its ID */
export const updateBatchById = async (batchId, batchData) => {
    return fetchAPI(`/batch/${batchId}`, "PUT", batchData);
};

/** Deletes a specific batch by its ID */
export const deleteBatchById = async (batchId) => {
    return fetchAPI(`/batch/${batchId}`, "DELETE");
};

// Course API functions

/** Creates a new course with the provided data */
export const createCourse = async (courseData) => {
    return fetchAPI("/course", "POST", { ...courseData, allow_notes_download: true });
};

/** Retrieves details of a specific course by its ID */
export const getCourseById = async (courseId) => {
    return fetchAPI(`/course/${courseId}`);
};

/** Updates an existing course with new data by its ID */
export const updateCourse = async (courseId, courseData) => {
    return fetchAPI(`/course/${courseId}`, "PUT", courseData);
};

/** Deletes a specific course by its ID */
export const deleteCourse = async (courseId) => {
    return fetchAPI(`/course/${courseId}`, "DELETE");
};

/** Retrieves all courses for a specific batch */
export const getCoursesByBatchId = async (batchId) => {
    return fetchAPI(`/course/batch/${batchId}`);
};

/** Retrieves all available courses */
export const getAllCourses = async () => {
    return fetchAPI(`/course/courses`, "GET");
};

// Class API functions

/** Creates a new class with the provided data */
export const createClass = async (classData) => {
    return fetchAPI("/class/classes", "POST", classData);
};

/** Retrieves all available classes */
export const getAllClasses = async () => {
    return fetchAPI('/class/classes', 'GET');
};
export const getClasses = async () => {
    return fetchAPI('/class/classes/my-classes', 'GET');
};

/** Retrieves details of a specific class by its ID */
export const getClassById = async (classId) => {
    return fetchAPI(`/class/classes/${classId}`, "GET");
};

/** Updates an existing class with new data by its ID */
export const updateClass = async (classId, updatedData) => {
    return fetchAPI(`/class/classes/${classId}`, "PUT", updatedData);
};

/** Retrieves all classes for a specific course */
export const getClassesByCourseId = async (courseId) => {
    return fetchAPI(`/class/course/${courseId}`, "GET");
};

/** Deletes a specific class by its ID */
export const deleteClass = async (classId) => {
    return fetchAPI(`/class/classes/${classId}`, "DELETE");
};

// User API functions

/** Retrieves a user by email */
export const getUserByEmail = async (email) => {
    return fetchAPI(`/user/${encodeURIComponent(email)}`, "GET");
};

/** Retrieves the current user's profile */
export const getUserProfile = async () => {
    return fetchAPI("/auth/user/profile", "GET");
};

/** Uploads files (profile picture, etc.) for the user */
export const uploadFiles = async (formData) => {
    return fetchAPI("/user/upload", "POST", formData, true);
};

export const contactUs = async (contactData) => {
    return fetchAPI("/contact", "POST", contactData);
};

// Enrollment API functions

/** Enrolls a user in a course or batch */
export const enrollUser = async (enrollmentData) => {
    return fetchAPI("/enrollment/enroll-user", "POST", enrollmentData);
};

/** Retrieves the list of batches the user is enrolled in */
export const getEnrollmentBatches = async () => {
    return fetchAPI("/batch/my-batches", "GET");
};

/** Retrieves the list of courses the user is enrolled in */
export const getEnrolledCourses = async () => {
    return fetchAPI("/course/enrolled-courses", "GET");
};

/** Creates a new payment order with the provided data */
export const createPaymentOrder = async (paymentData) => {
    return fetchAPI("/payment/create-order", "POST", paymentData, false);
};
