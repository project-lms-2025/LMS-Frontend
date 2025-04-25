import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Toaster, toast } from 'react-hot-toast';
import { createClass, getAllBatches, getClasses, getCoursesByBatchId } from '../../api/auth';
import { Pencil, Trash2, Video } from "lucide-react";

const Classes = () => {
  const [open, setOpen] = useState(false);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState({});
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({
    class_title: "",
    class_date_time: "",
    recording_url: "no-url",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem("authToken");

  // Fetch all batches
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await getAllBatches();
      setBatches(response.data || []);
    } catch (err) {
      setError(err.message);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses for selected batch
  const fetchCoursesForBatch = async (batchId) => {
    try {
      const { data } = await getCoursesByBatchId(batchId);
      setCourses((prev) => ({
        ...prev,
        [batchId]: data || [],
      }));
    } catch (err) {
      setError(err.message);
      setCourses((prev) => ({
        ...prev,
        [batchId]: [],
      }));
    }
  };

  // Fetch all classes
  const fetchAllClasses = async () => {
    try {
      setLoading(true);
      const response = await getClasses();
      setClasses(response.data || []);
      console.log("Classes",response.data);
    } catch (err) {
      setError("Failed to load all classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatchId) {
      fetchCoursesForBatch(selectedBatchId);
    }
  }, [selectedBatchId]);

  useEffect(() => {
    fetchAllClasses();
  }, []);

  const handleCreateClass = async () => {
    if (!selectedCourseId || !newClass.class_title || !newClass.class_date_time) {
      alert("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const classData = { ...newClass, course_id: selectedCourseId };
      await createClass(classData, authToken);
      toast.success("Class created successfully");
      setNewClass({ class_title: "", class_date_time: "", recording_url: "" });
      fetchClassesByCourse();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClass = async (classId) => {
    const updatedTitle = prompt("Enter new class title:");
    if (!updatedTitle) return;
    try {
      setLoading(true);
      await updateClass(classId, { class_title: updatedTitle }, authToken);
      fetchClassesByCourse();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this class?");
    if (!confirmDelete) return;

    try {
      await deleteClass(classId, authToken);
      fetchAllClasses(); // Refresh class list after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="m-0">
      <Sidebar open={open} setOpen={setOpen} />
      <div className={`transition-all duration-300 ${open ? 'md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[75%]' : 'ml-24 mr-2'} md:w-[90%] w-[95%] md:mt`}>
        <Toaster />
        <div className="p-4">
          <h2 className="text-xl font-bold">Class Management</h2>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="border p-4 my-4">
            <h3 className="text-lg font-semibold">Select Batch</h3>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="">Select a batch</option>
              {batches.map((batch) => (
                <option key={batch.batch_id} value={batch.batch_id}>
                  {batch.batch_name}
                </option>
              ))}
            </select>
          </div>


          {/* Disable course selection until batch is selected */}
          <div className="border p-4 my-4">
            <h3 className="text-lg font-semibold">Select Course</h3>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="" disabled={loading || !selectedBatchId}>
                {loading || !selectedBatchId ? "Select a batch first" : "Select a course"}
              </option>
              {courses[selectedBatchId]?.map((course) => (
                <option key={course.course_id} value={course.course_id} disabled={loading}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>

          <div className="border p-4 my-4">
            <h3 className="text-lg font-semibold">Create Class</h3>
            <input
              type="text"
              placeholder="Enter class title"
              value={newClass.class_title}
              onChange={(e) => setNewClass({ ...newClass, class_title: e.target.value })}
              className="border p-2 my-2 w-full"
            />
            <input
              type="datetime-local"
              value={newClass.class_date_time}
              onChange={(e) => setNewClass({ ...newClass, class_date_time: e.target.value })}
              className="border p-2 my-2 w-full"
            />
            <button
              onClick={handleCreateClass}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Class"}
            </button>
          </div>


          <div className="mt-6 space-y-4">
            {classes.length > 0 ? (
              classes.map((cls) => (
                <div key={cls.class_id} className="flex justify-between items-center border rounded-lg p-5 shadow-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <div className="w-full pr-4 ">
                    <div className="flex justify-between items-center w-full">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{cls.class_title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        📅 {new Date(cls.class_date_time).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      {cls.recording_url && (
                        <a href={cls.recording_url} className="text-blue-500 flex items-center mt-2 hover:underline" target="_blank" rel="noopener noreferrer">
                          <Video size={18} className="mr-2" />
                          View Recording
                        </a>
                      )}
                      {cls.zoom_meeting_url && (
                        <a href={cls.zoom_meeting_url} className="text-blue-500 flex items-center mt-2 hover:underline" target="_blank" rel="noopener noreferrer">
                          <Video size={18} className="mr-2" />
                          Join Zoom
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center space-x-3 mt-4">
                    <button onClick={() => handleUpdateClass(cls.class_id)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDeleteClass(cls.class_id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No classes available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;
