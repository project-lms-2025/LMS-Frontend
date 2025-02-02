const API_BASE_URL = "http://localhost:5000/api";

// Helper function to handle API requests
const fetchAPI = async (endpoint, method = "GET", body = null, isFormData = false) => {
    const options = {
        method,
        headers: isFormData
            ? {} // Let the browser set Content-Type for FormData
            : { "Content-Type": "application/json" },
        credentials: "include", // Send cookies for authentication
    };

    if (body) {
        options.body = isFormData ? body : JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        // Check for non-JSON responses
        const contentType = response.headers.get("Content-Type");
        let data = {};

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            // Handle other response types (e.g., text or empty response)
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
export const registerUser = async (formData) => {
    return fetchAPI("/auth/register", "POST", formData, true);
};

export const sendOtp = async (email) => {
    const body = { email };
    return fetchAPI("/otp/send", "POST", body);
};

// Function to verify OTP
export const verifyOtp = async (email, otp) => {
    const body = { email, otp };
    return fetchAPI("/otp/verify", "POST", body);
};

export const loginUser = async (credentials) => {
    return fetchAPI("/auth/login", "POST", credentials);
};

export const forgotPassword = async (email) => {
    return fetchAPI("/auth/forgot-password", "POST", { email });
};

export const resetPassword = async (resetToken, newPassword) => {
    return fetchAPI("/auth/reset-password", "POST", { resetToken, newPassword });
};

// User APIs
export const getUserByEmail = async (email) => {
    return fetchAPI(`/user/${encodeURIComponent(email)}`);
};


export const updateUserProfile = async (userData) => {
    return fetchAPI("/user/profile", "PUT", userData);
};

// File Upload API (Profile Picture & PDF)
export const uploadFiles = async (formData) => {
    return fetchAPI("/auth/register", "POST", formData, true);
};
