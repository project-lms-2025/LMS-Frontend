import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Upload, CheckCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
function Register() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    parentPhoneNumber: "",
    parentEmail: "",
    address: "",
    pinCode: "",
    state: "",
    tenthPercentage: "",
    twelfthPercentage: "",
    graduationCGPA: "",
    profileImage: null,
    tenthCertificate: null,
    twelfthCertificate: null,
    graduationCertificate: null,
    hasPreviousYearCertificate: false, // Add this to track checkbox state
    lastYearCertificate: null,
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData({
      ...formData,
      hasPreviousYearCertificate: checked,
    });
  };


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Set the form submission status to true
    setIsSubmitted(true);

    // Wait for 1 second, then redirect to the home page
    setTimeout(() => {
      // Using history.push to navigate to the home page
      navigate('/');  // '/' is the home page route
    }, 1000); // 1 second delay
  };


  if (isSubmitted) {
    return (
      <div className="min-h-[92vh] bg-gradient-to-br from-secondary-gray to-primary-purple flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full">
          <CheckCircle className="w-20 h-20 text-accent-yellow mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold text-primary-purple dark:text-primary-white mb-3 text-center">
            Thank You!
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-center text-lg">
            Your registration has been successfully completed.
          </p>
        </div>
      </div>
    );
  }

  const renderProgressBar = () => {
    const progress = ((step - 1) / 2) * 100;
    return (
      <div className="relative w-full h-1 bg-secondary-gray dark:bg-gray-600 rounded-full mb-4">
        <div
          className="absolute left-0 top-0 h-full bg-primary-purple dark:bg-accent-yellow rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };


  return (
    <div className="min-h-[92vh] bg-gradient-to-br from-blue-50 to-indigo-50 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="dark:bg-gray-400 rounded-2xl shadow-xl p-8">
          <div className="">
            <h2 className="text-3xl font-bold text-primary-purple dark:text-primary-white mb-6 text-center">
              Student Registration
            </h2>
            <div className="relative mb-4">
              {/* Background Progress Bar */}
              <div className="absolute mt-4 mx-6 inset-0 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>

              {/* Progress Bar (Dynamic Width) */}
              <div
                className="absolute mt-4 mx-6 inset-0 h-1 bg-primary-purple dark:bg-accent-yellow rounded-full transition-all duration-300"
                style={{
                  width: `${(step - 1) * 44.33}%`,
                }}
              ></div>

              <div className="flex justify-between items-center z-10 relative">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex flex-col items-center z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-out ${step >= num
                        ? "bg-accent-yellow dark:bg-primary-purple text-gray-900 dark:text-primary-white scale-110"
                        : "bg-secondary-gray dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                    >
                      {num}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium transition-all ${step >= num
                        ? "text-primary-purple dark:text-accent-yellow"
                        : "text-gray-500 dark:text-gray-400"
                        }`}
                    >
                      {num === 1 ? "Personal" : num === 2 ? "Academic" : "Documents"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            {step === 1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                      required
                    />
                  </div>
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                    Parent's Phone Number
                  </label>
                  <input
                    type="tel"
                    name="parentPhoneNumber"
                    value={formData.parentPhoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                    Parent's Email
                  </label>
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                    Address
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
                <div>
                  <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                    State
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
                <div>
                  <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                    10th Percentage
                  </label>
                  <input
                    type="text"
                    name="tenthPercentage"
                    value={formData.tenthPercentage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                    12th Percentage
                  </label>
                  <input
                    type="text"
                    name="twelfthPercentage"
                    value={formData.twelfthPercentage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                    Graduation CGPA
                  </label>
                  <input
                    type="text"
                    name="graduationCGPA"
                    value={formData.graduationCGPA}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                    required
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                    Profile Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-primary-purple bg-secondary-gray dark:bg-gray-700 rounded-lg cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-primary-purple dark:text-accent-yellow" />
                  </div>
                </div>

                {/* Tenth Certificate */}
                <div>
                  <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                    Tenth Certificate
                  </label>
                  <input
                    type="file"
                    name="tenthCertificate"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                    required
                  />
                </div>

                {/* Twelfth Certificate */}
                <div>
                  <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                    Twelfth Certificate
                  </label>
                  <input
                    type="file"
                    name="twelfthCertificate"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                    required
                  />
                </div>

                {/* Graduation Certificate */}
                <div>
                  <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                    Graduation Certificate
                  </label>
                  <input
                    type="file"
                    name="graduationCertificate"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                    required
                  />
                </div>

                {/* Checkbox for Previous Year Certificate */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="previousYearCertificate"
                    checked={formData.hasPreviousYearCertificate}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 accent-primary-purple dark:accent-accent-yellow cursor-pointer"
                  />
                  <label
                    htmlFor="previousYearCertificate"
                    className="text-sm text-primary-purple dark:text-accent-yellow"
                  >
                    If you have a previous year certificate, please upload it
                  </label>
                </div>

                {/* Last Year Certificate (conditional render based on checkbox) */}
                {formData.hasPreviousYearCertificate && (
                  <div>
                    <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow">
                      Last Year Certificate
                    </label>
                    <input
                      type="file"
                      name="lastYearCertificate"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-2">
              {/* Previous Button */}
              <button
                type="button"
                onClick={prevStep}
                className={`px-4 py-2 rounded-lg transition-all duration-300 
      ${step === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-secondary-gray hover:bg-primary-purple hover:text-white text-primary-purple dark:bg-gray-700 dark:text-white dark:hover:bg-accent-yellow"}`
                }
                disabled={step === 1}
              >
                <ChevronLeft />
              </button>

              {/* Conditionally render buttons based on the current step */}
              {step === 4 ? (
                <button
                  type="submit" // This is where the form submits
                  className="px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-primary-dark transition-all duration-300"
                >
                  Submit
                </button>
              ) : (
                <button
                  type="button" // This moves to the next step
                  onClick={nextStep}
                  className="px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-primary-dark transition-all duration-300"
                >
                  Next
                </button>
              )}
            </div>



          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
