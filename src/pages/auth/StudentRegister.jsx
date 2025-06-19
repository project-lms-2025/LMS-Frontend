import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Loader, ArrowLeft, ArrowRight } from "lucide-react";
import { registerUser, sendOtp, verifyOtp } from "../../api/auth";

function Register() {
  const navigate = useNavigate();
  // const [currentStep, setCurrentStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    institution_id: import.meta.env.VITE_Insitution_Id,
    name: "",
    email: "",
    phoneNumber: "",
    // address: "",
    // state: "",
    // city: "",
    // pincode: "",
    // class: "",
    // dob: "",
    // selected_exam: "",
    // tenth_marksheet_url: "",
    // twelfth_marksheet_url: "",
    // graduation_url: "",
    // prev_year_grade_card_url: "",
    // is_email_verified: false,
    // otp: "",
  });

  // const totalSteps = 4;

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
    // Only submit name, email, phoneNumber
    try {
      setIsSubmitting(true);
      await registerUser({
        institution_id: formData.institution_id,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      });
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

  // Render form: only Full Name, Email, Phone Number
  const renderForm = () => {
    return (
      <>
        {/* <h3 className="text-lg font-semibold text-primary-purple mb-4">Personal Information</h3> */}
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
  };


  return (
    <div className="min-h-screen flex justify-center items-center dark:bg-primary-purple bg-white py-3 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-primary-purple dark:text-primary-white mb-6 text-center">
          Student Registration
        </h2>

        {/* Progress Bar */}
        {/* Progress bar removed for single-step form */}

        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            {renderForm()}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-1 ml-auto px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-primary-dark transition-all duration-300 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;