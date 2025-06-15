// src/pages/teacher/Classes.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { Toaster, toast } from "react-hot-toast";
import {
  createClass,
  deleteClass,
  getAllBatches,
  getClasses,
  getCoursesByBatchId,
  updateClass,
} from "../../api/auth";
import { Edit, ExternalLink, Paperclip, Trash2 } from "lucide-react";

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
    recording_url: "",
  });
  const [editingClass, setEditingClass] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authToken = localStorage.getItem("authToken");

  // Fetch all batches
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await getAllBatches();
      console.log(res);
      setBatches(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses for a batch
  const fetchCoursesForBatch = async (batchId) => {
    try {
      const { data } = await getCoursesByBatchId(batchId);
      setCourses((prev) => ({ ...prev, [batchId]: data || [] }));
    } catch (err) {
      setError(err.message);
      setCourses((prev) => ({ ...prev, [batchId]: [] }));
    }
  };

  // Fetch all classes
  const fetchAllClasses = async () => {
    try {
      setLoading(true);
      const res = await getClasses();
      console.log(res);
      setClasses(res.data || []);
    } catch {
      setError("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchAllClasses();
  }, []);

  useEffect(() => {
    if (selectedBatchId) fetchCoursesForBatch(selectedBatchId);
  }, [selectedBatchId]);

  // Create a new class
  const handleCreateClass = async () => {
    if (
      !selectedCourseId ||
      !newClass.class_title ||
      !newClass.class_date_time
    ) {
      return toast.error("Please fill all fields");
    }
    try {
      setLoading(true);
      await createClass(
        { ...newClass, course_id: selectedCourseId },
        authToken
      );
      toast.success("Class created successfully");
      setNewClass({ class_title: "", class_date_time: "", recording_url: "" });
      fetchAllClasses();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit class
  const handleEditClass = (cls) => {
    setEditingClass(cls);
    setNewClass({
      class_title: cls.class_title,
      class_date_time: cls.class_date_time
        ? new Date(cls.class_date_time).toISOString().slice(0, 16)
        : "",
      recording_url: cls.recording_url || "",
    });
    setIsEditing(true);
    setSelectedCourseId(cls.course_id);
  };

  // Update class
  const handleUpdateClass = async () => {
    if (
      !selectedCourseId ||
      !newClass.class_title ||
      !newClass.class_date_time
    ) {
      return toast.error("Please fill all required fields");
    }
    try {
      setLoading(true);
      await updateClass(editingClass.class_id, {
        ...newClass,
        course_id: selectedCourseId,
      });
      toast.success("Class updated successfully");
      setNewClass({ class_title: "", class_date_time: "", recording_url: "" });
      setIsEditing(false);
      setEditingClass(null);
      fetchAllClasses();
    } catch (err) {
      toast.error(err.message || "Failed to update class");
    } finally {
      setLoading(false);
    }
  };

  // Delete class
  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    try {
      setLoading(true);
      await deleteClass(classId);
      toast.success("Class deleted successfully");
      fetchAllClasses();
    } catch (err) {
      toast.error(err.message || "Failed to delete class");
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingClass(null);
    setNewClass({ class_title: "", class_date_time: "", recording_url: "" });
  };

  return (
    <div className="m-0">
      <Sidebar open={open} setOpen={setOpen} />
      <Toaster />
      <div
        className={`transition-all mt-14 pt-12  duration-300 ${
          open ? "md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[70%]" : "ml-24 mr-2"
        } md:w-[90%] w-[95%]`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold text-primary-purple ">
            Class Management
          </h2>
          {/* Batch selector */}
          <div className="border rounded-2xl  gap-4 p-4 my-4">
            <div className="flex gap-4">
            <div className="w-full">
              <h3 className="text-lg font-semibold">Select Batch</h3>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="border p-2 w-full"
              >
                <option value="">Select a batch</option>
                {batches.map((b) => (
                  <option key={b.batch_id} value={b.batch_id}>
                    {b.batch_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <h3 className="text-lg font-semibold">Select Course</h3>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="border p-2 w-full"
                disabled={!selectedBatchId}
              >
                <option value="">Select a course</option>
                {courses[selectedBatchId]?.map((c) => (
                  <option key={c.course_id} value={c.course_id}>
                    {c.course_name}
                  </option>
                ))}
              </select>
            </div>
            </div>

            {/* Create/Edit class form */}
            <div className="  mt-4">
              <h3 className="text-lg font-semibold">
                {isEditing ? "Edit Class" : "Create New Class"}
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Class Title"
                  value={newClass.class_title}
                  onChange={(e) =>
                    setNewClass((prev) => ({
                      ...prev,
                      class_title: e.target.value,
                    }))
                  }
                  className="border p-2 my-3 w-full"
                />
                <input
                  type="datetime-local"
                  value={newClass.class_date_time}
                  onChange={(e) =>
                    setNewClass((prev) => ({
                      ...prev,
                      class_date_time: e.target.value,
                    }))
                  }
                  className="border p-2 my-3 w-full"
                />
                <input
                  type="text"
                  placeholder="Recording URL"
                  value={newClass.recording_url}
                  onChange={(e) =>
                    setNewClass((prev) => ({
                      ...prev,
                      recording_url: e.target.value,
                    }))
                  }
                  className="border p-2 my-3 w-full"
                />
                <div className="w-full gap-2 ">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleUpdateClass}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        disabled={loading}
                      >
                        Update Class
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleCreateClass}
                      className="bg-primary-purple w-full text-white px-4 py-2 rounded"
                      disabled={loading || !selectedCourseId}
                    >
                      Create Class
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Classes list */}
          <div className="my-4">
            {/* <h3 className="text-lg font-semibold">Classes</h3> */}
            {classes.length === 0 ? (
              <p>No classes available</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {classes
                  .sort((a, b) => new Date(b.class_date_time) - new Date(a.class_date_time))
                  .map((cls) => (
                  <div key={cls.class_id} className="border p-4 rounded-xl ">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{cls.class_title}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClass(cls)}
                          className="bg-yellow-500 text-white p-2 rounded text-sm"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClass(cls.class_id)}
                          className="bg-red-500 text-white p-2 rounded text-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p>
                      Date: {new Date(cls.class_date_time).toLocaleString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {cls.recording_url && (
                        <a
                          href={cls.recording_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <Paperclip className="h-3.5 w-3.5 mr-1.5" />
                          Recording
                        </a>
                      )}
                      {cls.class_url && (
                        <a
                          href={cls.class_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-primary-purple hover:bg-primary-purple/90"
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                          Join Class
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;
