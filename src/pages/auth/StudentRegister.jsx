import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Loader, ArrowLeft, ArrowRight } from "lucide-react";
import { registerUser, sendOtp, verifyOtp } from "../../api/auth";

function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    class: "",
    dob: "",
    selected_exam: "",
    tenth_marksheet_url: "",
    twelfth_marksheet_url: "",
    graduation_url: "",
    prev_year_grade_card_url: "",
    is_email_verified: false,
    otp: "",
  });

  const totalSteps = 4;

  // Handles input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      // In a real app, you would upload this file to a server and get a URL back
      // For now, we'll just store the file object
      setFormData((prevState) => ({
        ...prevState,
        [name]: URL.createObjectURL(files[0]),
      }));
    }
  };

  // Sends OTP to Email
  const sendOtpToEmail = async () => {
    if (!formData.email) {
      return toast.error("Please enter your email address");
    }
    try {
      setIsOtpSending(true);
      await sendOtp(formData.email);
      setOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error("Error sending OTP: " + error.message);
      console.error(error.message);
    } finally {
      setIsOtpSending(false);
    }
  };

  // Verifies OTP
  const verifyOtpAndSubmit = async (e) => {
    e.preventDefault();
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
    // if (!formData.is_email_verified) {
    //   return toast.error("Please verify your email before submitting!");
    // }

    try {
      setIsSubmitting(true);
      await registerUser(formData);
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Registration failed!");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Move to next step
  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.phoneNumber) {
        return toast.error("Please fill all required fields in this step");
      }
    } else if (currentStep === 2) {
      if (!formData.address || !formData.state || !formData.city || !formData.pincode) {
        return toast.error("Please fill all required fields in this step");
      }
    } else if (currentStep === 3) {
      if (!formData.class || !formData.dob || !formData.selected_exam) {
        return toast.error("Please fill all required fields in this step");
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  // Move to previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Render form based on current step
  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="text-lg font-semibold text-primary-purple mb-4">Personal Information</h3>
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                Full Name <span className="text-red-500">*</span>
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

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                Email <span className="text-red-500">*</span>
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
            <div className="mb-4">
              <div className="flex items-center gap-2">
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={sendOtpToEmail}
                    disabled={isOtpSending || !formData.email}
                    className={`w-full bg-primary-purple text-white h-[2.6rem] rounded-lg flex justify-center items-center ${isOtpSending || !formData.email ? "opacity-50 cursor-not-allowed" : ""
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
                      type="button"
                      onClick={verifyOtpAndSubmit}
                      className="w-1/3 bg-primary-purple text-white px-4 py-2 rounded-lg"
                    >
                      Verify
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                Phone Number <span className="text-red-500">*</span>
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
          </>
        );

      case 2:
        return (
          <>
            <h3 className="text-lg font-semibold text-primary-purple mb-4">Address Information</h3>
            {/* Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                required
              />
            </div>

            {/* State */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                required
              />
            </div>

            {/* City */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                required
              />
            </div>

            {/* Pincode */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                required
              />
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h3 className="text-lg font-semibold text-primary-purple mb-4">Educational Information</h3>
            {/* Class */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                Class <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple appearance-none pr-10"
                  required
                >
                  <option value="" disabled>Select your class</option>
                  <option value="10th">10th</option>
                  <option value="11th">11th</option>
                  <option value="12th">12th</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Post Graduation">Post Graduation</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ChevronDown className="text-primary-purple dark:text-purple-400" />
                </div>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                required
              />
            </div>

            {/* Exam Registered For */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                Exam Registered For <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="selected_exam"
                  value={formData.selected_exam}
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
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ChevronDown className="text-primary-purple dark:text-purple-400" />
                </div>
              </div>
            </div>
          </>
        );

      // In the renderForm function, update case 4 (document upload step)
      case 4:
        return (
          <>
            <h3 className="text-lg font-semibold text-primary-purple mb-4">Document Upload</h3>

            {/* 10th Marksheet - show for all students */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                10th Marksheet
              </label>
              <input
                type="file"
                name="tenth_marksheet_url"
                onChange={handleFileChange}
                className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              {formData.tenth_marksheet_url && (
                <p className="text-xs text-green-600 mt-1">File uploaded successfully</p>
              )}
            </div>

            {/* 12th Marksheet - only show if student is in 12th or higher */}
            {["12th", "Graduation", "Post Graduation"].includes(formData.class) && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                  12th Marksheet
                </label>
                <input
                  type="file"
                  name="twelfth_marksheet_url"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {formData.twelfth_marksheet_url && (
                  <p className="text-xs text-green-600 mt-1">File uploaded successfully</p>
                )}
              </div>
            )}

            {/* Graduation Certificate - only show if student is in Graduation or higher */}
            {["Graduation", "Post Graduation"].includes(formData.class) && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                  Graduation Certificate
                </label>
                <input
                  type="file"
                  name="graduation_url"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {formData.graduation_url && (
                  <p className="text-xs text-green-600 mt-1">File uploaded successfully</p>
                )}
              </div>
            )}

            {/* Previous Year Grade Card - show for all students */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                Previous Year Grade Card (optional)
              </label>
              <input
                type="file"
                name="prev_year_grade_card_url"
                onChange={handleFileChange}
                className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              {formData.prev_year_grade_card_url && (
                <p className="text-xs text-green-600 mt-1">File uploaded successfully</p>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center dark:bg-primary-purple bg-white py-3 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-primary-purple dark:text-primary-white mb-6 text-center">
          Student Registration
        </h2>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary-purple h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Personal</span>
            <span>Address</span>
            <span>Education</span>
            <span>Documents</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            {renderForm()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-1 ml-auto px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-primary-dark transition-all duration-300"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center gap-1 ml-auto px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-primary-dark transition-all duration-300 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin w-5 h-5" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;