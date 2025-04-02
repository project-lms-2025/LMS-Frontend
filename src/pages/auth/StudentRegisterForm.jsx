import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Upload, CheckCircle, GraduationCap } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import { CountrySelect, StateSelect, CitySelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

import { registerUser, sendOtp, verifyOtp } from "../../api/auth";
import { count } from "rsuite/esm/internals/utils/ReactChildren";
function StudentRegister() {
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    dob: "",
    email: "",
    password: "",
    parentPhoneNumber: "",
    parentEmail: "",
    address: "",
    pincode: "",
    state: "",
    marks10: "",  // Added for 10th marks
    marks12: "",  // Added for 12th marks
    profilePicture: null,
    pdf10th: null,
    pdf12th: null,
    pdfHigherDegrees: [], // You may upload multiple higher degree certificates
    pdfPreviousYear: null,  // For previous year scorecard
    otp: "",  // OTP input
    examRegisteredFor: "",  // Added to track the exam user is registering for
    higherDegreeScore: "",  // For higher degree score
    previousYearScore: 20,  // For previous year score
    is_email_verified: false,  // Default to false until OTP is verified
  });
  const [country, setCountry] = useState(101);
  const [currentState, setCurrentState] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);
  console.log(country)
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData({
      ...formData,
      hasPreviousYearCertificate: checked,
    });
  };

  const sendOtpToEmail = async () => {
    try {
      await sendOtp(formData.email); // Call the API to send OTP
      setOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error("Error sending OTP: " + error.message);
      console.log(error.message)
    }
  };

  const verifyOtpAndSubmit = async () => {
    try {
      // Verify the OTP using your API (e.g., through the `verifyOtp` function)
      await verifyOtp(formData.email, formData.otp); // Assuming verifyOtp is an API function
      // After successful OTP verification, set is_email_verified to true
      setFormData(prevState => ({
        ...prevState,
        is_email_verified: true, // Mark email as verified
      }));
      toast.success("OTP verified successfully!");
    } catch (error) {
      toast.error("Error verifying OTP: " + error.message);
      console.log(error.message)

    }
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
    console.log("Next button pressed")
    setStep((prev) => Math.min(prev + 1, 4)); // Ensure step does not go beyond 4
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1)); // Ensure step does not go below 1
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    const form = new FormData();
    // Log formData before appending to FormData
    console.log("Form data before appending:", formData);
    // Append all form data to FormData object for file submission
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        // Log the current key and value being appended
        console.log(`Appending field: ${key} =>`, formData[key]);

        if (key === 'pdfHigherDegrees' && Array.isArray(formData[key])) {
          formData[key].forEach((file, index) => {
            form.append(key, file);
            // Log each file being appended
            console.log(`Appending higher degree file ${index + 1}:`, file);
          });
        } else {
          form.append(key, formData[key]);
        }
      }
    });
    // Log the final FormData object (this will log the fields, not the file contents)
    console.log("Form data after appending:", form);
    try {
      const response = await registerUser(form);  // Send the registration request
      toast.success("Registration successful!");
      console.log("Registration successful:", response);
      navigate("/");  // Redirect on success (replace with your redirect URL)
    } catch (error) {
      toast.error(error.message || "Registration failed!");
      console.error("Registration Error:", error);
    }
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

  return (
    <div className="min-h-[92.2vh] flex  justify-center items-center dark:bg-primary-purple bg-white py-3 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border p-8">
          <div className="">
            <h2 className="text-3xl font-bold flex justify-center items-center text-black dark:text-primary-white mb-6 text-center">
              <GraduationCap className="w-12 h-12 text-primary-purple dark:text-accent-yellow" /> TeacherTech
            </h2>
            <h2 className="text-3xl font-bold flex justify-center items-center text-black dark:text-primary-white mb-2 text-center">
              Welcome To Teacher Tech
            </h2>
            <h4 className="text-center text-lg mb-6 dark:text-primary-white" >Kindly fill in your details below to create an account</h4>
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
                      {/* {num === 1 ? "Personal" : num === 2 ? "Academic" : "Documents"} */}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="">
            {step === 1 && (
              <div className="space-y-3 w-[36rem">
                <div className="flex justify-between  gap-6">
                  <div className="w-full" >
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
                  {/* <div className="w-full" >
                    <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                      Date of Birth
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
                  <div className="w-full" >
                    <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                      Exam registered for
                    </label>
                    <input
                      type="text"
                      name="examRegisteredFor"
                      value={formData.examRegisteredFor}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                      required
                    />
                  </div> */}
                </div>
                <div className="flex justify-between gap-6">
                  <div className="w-full" >
                    <label className="block text-sm  font-medium text-primary-purple dark:text-accent-yellow mb-1">
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
                  <div className="w-full">
                    <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                      Exam registered for
                    </label>
                    <select
                      name="examRegisteredFor"
                      value={formData.examRegisteredFor}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                      required
                    >
                      <option value="">Select Exam</option>
                      <option value="JEE">JEE</option>
                      <option value="GATE">GATE</option>
                    </select>
                  </div>

                  {/* <div className="w-full">
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
                  </div> */}
                  {/* <div className="w-full">
                    <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div> */}
                </div>

                <div className="flex justify-between items-center gap-6">
                  <div className="w-full" >
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
                  <div className="flex mt-6 w-full">
                    {!otpSent ? (
                      <>
                        <button
                          onClick={sendOtpToEmail}
                          className=" w-full  bg-primary-purple text-white h-[2.6rem] rounded-lg"
                        >
                          Send OTP
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          name="otp"
                          value={formData.otp}
                          onChange={handleInputChange}
                          className="w-full md:w-2/3 px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                          placeholder="Enter OTP"
                          required
                        />
                        <button
                          onClick={verifyOtpAndSubmit}
                          className="ml-2 w-[60%]  bg-primary-purple text-white px-6 py-2 rounded-lg"
                        >
                          Verify OTP
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* <div className="flex justify-between gap-6">
                  <div className="w-full" >
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
                  <div className="w-full" >
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
                </div> */}

              </div>
            )}

            {step === 2 && (
              <div className="space-y-3 w-[36rem">
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
                <div className="flex justify-between ">
                <div className="w-full" >
                    <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                      State
                    </label>
                  <StateSelect
                    countryid={101}
                    containerClassName="form-group"
                    inputClassName="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition duration-200"
                    onChange={(_state) => setCurrentState(_state)}
                    onTextChange={(_txt) => console.log(_txt)}
                    defaultValue={currentState}
                    className="text-blue-400"
                    placeHolder="Select State"
                  />
                  </div>
                  <div className="w-full" >
                    <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                      City
                    </label>
                  <CitySelect
                    countryid={101}
                    inputClassName="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition duration-200"
                    stateid={currentState?.id}
                    onChange={(_city) => setCurrentCity(_city)}
                    defaultValue={currentCity}
                    placeHolder="Select City"
                    className=""
                  />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                    Pin Code
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

                {/* <div className="flex justify-between gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                      10th Percentage
                    </label>
                    <input
                      type="text"
                      name="marks10"
                      value={formData.marks10}
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
                      name="marks12"
                      value={formData.marks12}
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
                      name="higherDegreeScore"
                      value={formData.higherDegreeScore}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                      required
                    />
                  </div>
                </div> */}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3  ">

                {/* Tenth Certificate */}
                <div>
                  <label className="block text-sm font-medium text-primary-purple dark:text-accent-yellow mb-1">
                    Tenth Certificate
                  </label>
                  <input
                    type="file"
                    name="pdf10th"
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
                    name="pdf12th"
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
                    name="pdfHigherDegrees"
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
                    By creating an account, you agree to our Terms & Conditions
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
                      name="pdfPreviousYear"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 rounded-lg border border-primary-purple bg-secondary-gray dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-6">
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
              {step === 3 ? (
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

export default StudentRegister;
