import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, sendLoginOtp } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
    otp: "",
    deviceType: "mobile",
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendOtpToPhone = async () => {
    if (!formData.phoneNumber.trim()) {
      toast.error("Please enter a valid phone number");
      return;
    }
    try {
      setIsOtpSending(true);
      const response = await sendLoginOtp(formData.phoneNumber);
      const data = response.data;
      if (response.success && data.email) {
        localStorage.setItem("email", data.email);
        setFormData((prev) => ({ ...prev, email: data.email })); // Update email in formData
        setOtpSent(true); // OTP has been sent, show login button
        toast.success(`OTP sent successfully to ${data.email}!`);
      } else {
        toast.error(response.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error(error.message || "Error sending OTP");
      console.error("OTP Error:", error);
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(formData);
      console.log(response);
      const data = response.data;
      if (response.success && data.authToken) {
        localStorage.setItem("authToken", data.authToken);
        localStorage.setItem("role", data.role);
        login(data.role); // Update role in AuthContext
        toast.success("Login successful!");

        // Navigate after a 1-second delay according to user role
        setTimeout(() => {
          if (data.role === "student") {
            navigate("/studentClass"); // adjust student route as needed
          } else if (data.role === "teacher") {
            navigate("/teacherDashboard"); // adjust teacher route as needed
          } else {
            navigate("/"); // default route
          }
        }, 1000);
      } else {
        toast.error(response.message || "Login failed!");
      }
    } catch (error) {
      toast.error(error.message || "Login failed!");
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92.2vh] w-full flex items-center justify-center bg-secondary-gray dark:bg-gray-900">
      <Toaster/>
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 py-14 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-primary-purple dark:text-primary-white">
            Log in to Your Account
          </h2>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Access your personalized learning experience.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Phone Number Input */}
            <div>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
              />
            </div>

            {/* OTP Input */}
            <div className="flex items-center gap-2">
              {!otpSent ? (
                <button
                  type="button"
                  onClick={sendOtpToPhone}
                  className="w-full bg-primary-purple text-white h-[2.6rem] rounded-lg flex justify-center items-center"
                  disabled={isOtpSending}
                >
                  {isOtpSending ? "Sending..." : "Send OTP"}
                </button>
              ) : (
                <div className="w-full" >
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                    placeholder="Enter OTP"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-4 text-white bg-primary-purple hover:bg-purple-700 rounded-lg font-semibold transition flex justify-center items-center mt-4"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Log In"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Don't have a student account?{" "}
              <Link to="/studentSignup" className="text-primary-purple hover:underline">
                Create one here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
