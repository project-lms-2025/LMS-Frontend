import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Icons for show/hide password

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-[92.2vh] flex items-center justify-center bg-secondary-gray dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-primary-purple dark:text-primary-white">
          Create Your Account
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mt-2">
          Sign up to start your learning journey today.
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
            />
          </div>

          {/* Email */}
          <div>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
            />
          </div>

          {/* Password with Eye Toggle */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
            />
            <button
              type="button"
              className="absolute right-3 top-2 text-gray-500 dark:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password with Eye Toggle */}
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
            />
            <button
              type="button"
              className="absolute right-3 top-2 text-gray-500 dark:text-gray-300"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-primary-purple hover:bg-purple-700 rounded-lg font-semibold transition"
          >
            Sign Up
          </button>

          {/* Already have an account? */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
            Already have an account?{" "}
            <a href="/signin" className="text-primary-purple hover:underline">
              Log in here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
