import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Loader } from "lucide-react";
import { registerUser, sendOtp, verifyOtp } from "../../api/auth"; // Ensure API functions are correctly imported

function Register() {
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    examRegisteredFor: "",
    is_email_verified: false,
    otp: "", // Added OTP field
  });

  // Handles input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Sends OTP to Email
  const sendOtpToEmail = async () => {
    try {
      setIsOtpSending(true); // Start loader
      await sendOtp(formData.email);
      setOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error("Error sending OTP: " + error.message);
      console.error(error.message);
    } finally {
      setIsOtpSending(false); // Stop loader
    }
  };

  // Verifies OTP
  const verifyOtpAndSubmit = async (e) => {
    e.preventDefault(); // Prevents form submission when clicking Verify OTP
    try {
      await verifyOtp(formData.email, formData.otp);
      setFormData((prevState) => ({
        ...prevState,
        is_email_verified: true,
      }));
      toast.success("OTP verified successfully!");
    } catch (error) {
      toast.error("Error verifying OTP: " + error.message);
      console.error(error);
    }
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.is_email_verified) {
      return toast.error("Please verify your email before submitting!");
    }
    try {
      await registerUser(formData);
      console.log(formData)
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Registration failed!");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center dark:bg-primary-purple bg-white py-3 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-primary-purple dark:text-primary-white mb-6 text-center">
          Student Registration
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                required
              />
            </div>

            {/* Exam Registered For */}
            <div className="relative">
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                Exam Registered For
              </label>
              <div className="relative">
                <select
                  name="examRegisteredFor"
                  value={formData.examRegisteredFor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple appearance-none pr-10"
                  required
                >
                  <option value="" disabled>Select an exam</option>
                  <option value="JEE">JEE</option>
                  <option value="NEET">NEET</option>
                  <option value="GATE">GATE</option>
                  <option value="CAT">CAT</option>
                  <option value="UPSC">UPSC</option>
                  <option value="Other">Other</option>
                </select>
                {/* Custom Dropdown Arrow */}
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown className="text-primary-purple dark:text-purple-400 " />
                </div>
              </div>
            </div>



            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                required
              />
            </div>

            {/* Email and OTP Section */}
            <div>
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                required
              />
            </div>

            {/* OTP Verification */}
            <div className="flex items-center gap-2 ">
              {!otpSent ? (
                <button
                  onClick={sendOtpToEmail}
                  disabled={isOtpSending}
                  className={`w-full bg-primary-purple text-white h-[2.6rem] rounded-lg flex justify-center items-center ${isOtpSending ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {isOtpSending ? (
                    <Loader className="animate-spin w-5 h-5" />
                  ) : (
                    "Send OTP"
                  )}
                </button>
              ) : (
                <>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="w-2/3 px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                    placeholder="Enter OTP"
                    required
                  />
                  <button
                    onClick={verifyOtpAndSubmit}
                    className="w-1/3 bg-primary-purple text-white px-4 py-2 rounded-lg"
                  >
                    Verify
                  </button>
                </>
              )}
            </div>

            {/* Submit Button */}
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-2 bg-primary-purple text-white rounded-lg hover:bg-primary-dark transition-all duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
