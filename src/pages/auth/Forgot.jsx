import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../api/auth"; // Import the forgotPassword function

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword(email);

      if (response.success) {
        toast.success("Reset link sent to your email!");
      } else {
        toast.error(response.message || "Failed to send reset link.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92.2vh] flex items-center justify-center bg-secondary-gray dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 py-14 rounded-2xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-primary-purple dark:text-primary-white">
          Forgot Password
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your email, and we'll send you a reset link.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-purple focus:border-primary-purple"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white bg-primary-purple hover:bg-purple-700 rounded-lg font-semibold transition ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Remember your password?{" "}
            <Link to="/signin" className="text-primary-purple hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
