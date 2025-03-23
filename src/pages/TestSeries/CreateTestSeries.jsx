import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTestSeries } from '../../api/testSeries';
import Sidebar from '../../components/Sidebar';

const CreateTestSeries = () => {
  // Optionally, you can get the teacher_id from localStorage or AuthContext.
  const storedTeacherId = localStorage.getItem("teacher_id") || "default-teacher-id";
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    series_id: uuidv4(),
    teacher_id: storedTeacherId,
    title: "",
    description: "",
    total_tests: 0,
    created_at: new Date().toISOString()
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createTestSeries(formData);
      toast.success("Test series created successfully!");
      // Reset the form (generate a new series_id and update created_at)
      setFormData({
        series_id: uuidv4(),
        teacher_id: storedTeacherId,
        title: "",
        description: "",
        total_tests: 0,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      toast.error(error.message || "Error creating test series.");
    }
  };

  return (
    <div className='m-0' >
      <Sidebar open={open} setOpen={setOpen} />
      {/* Main content */}
      <div
        className={`transition-all duration-300 ${open ? "md:ml-[20rem] ml-56 mr-4  w-[40%] md:w-[75%]" : "ml-24 mr-2"} md:w-[90%]  w-[95%] md:mt `}
      >
        <div className="min-h-screen bg-secondary-gray dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="max-w-xl mx-auto bg-primary-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-primary-purple dark:text-primary-white mb-6">
              Create Test Series
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter test series title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-primary-purple text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Create Test Series
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTestSeries;
