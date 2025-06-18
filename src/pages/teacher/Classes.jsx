// src/pages/teacher/Classes.jsx
import React, { Fragment, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { Edit, ExternalLink, Paperclip, Plus, Trash2, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";

const Classes = () => {
  const [searchParams] = useSearchParams();
  const urlBatchId = searchParams.get('batchId');
  const urlCourseId = searchParams.get('courseId');
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  // Fetch all classes with optional filtering by course_id
  const fetchAllClasses = async () => {
    try {
      setLoading(true);
      const res = await getClasses();
      console.log("Fetched classes:", res);
      
      if (res?.data) {
        let filteredClasses = [...res.data];
        
        // Apply course filter if URL parameter is present
        if (urlCourseId) {
          filteredClasses = filteredClasses.filter(
            cls => cls.course_id === urlCourseId
          );
          console.log("Filtered classes by course:", filteredClasses);
        }
        
        setClasses(filteredClasses);
      } else {
        console.log("No classes data received");
        setClasses([]);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError("Failed to load classes");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  // Set initial batch and course selection from URL if present
  useEffect(() => {
    const initializeFromUrl = async () => {
      if (urlBatchId) {
        setSelectedBatchId(urlBatchId);
        // Wait for courses to be loaded for the batch
        await fetchCoursesForBatch(urlBatchId);
        
        // If courseId is in URL, set it after courses are loaded
        if (urlCourseId) {
          setSelectedCourseId(urlCourseId);
        }
      } else if (urlCourseId) {
        // If only courseId is provided, find and set the batch
        const course = classes.find(cls => cls.course_id === urlCourseId);
        if (course) {
          setSelectedBatchId(course.batch_id);
          setSelectedCourseId(urlCourseId);
        }
      }
    };
    
    fetchBatches();
    fetchAllClasses();
    initializeFromUrl();
  }, [urlBatchId, urlCourseId]);

  // Handle batch changes
  useEffect(() => {
    if (selectedBatchId) {
      fetchCoursesForBatch(selectedBatchId);
    }
  }, [selectedBatchId]);

  // Filter classes based on selected batch and course
  const filteredClasses = classes.filter((cls) => {
    if (selectedCourseId) {
      return cls.course_id === selectedCourseId;
    } else if (selectedBatchId) {
      return cls.batch_id === selectedBatchId;
    }
    return true;
  });

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
    setIsDialogOpen(true);
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

  // Reset form when dialog is closed
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setEditingClass(null);
    setNewClass({ class_title: "", class_date_time: "", recording_url: "" });
  };

  return (
    <div className="m-0">
      <Sidebar open={open} setOpen={setOpen} />
      <Toaster />
      <div
        className={`transition-all mt-14 pt-12 duration-300 ${
          open
            ? "md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[70%]"
            : "ml-24 mr-2 md:w-[90%]  w-[95%]"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary-purple">
              Class Management
            </h2>
            <div className="flex gap-3">
              <div className="w-1/2">
                <select
                  value={selectedBatchId}
                  onChange={(e) => {
                    setSelectedBatchId(e.target.value);
                    setSelectedCourseId(""); // Reset course when batch changes
                  }}
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

              <div className="w-1/2">
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
              <button
                onClick={() => setIsDialogOpen(true)}
                className="flex w-[16rem]  items-center gap-2 px-4 py-2 rounded-md bg-primary-purple text-white"
              >
                <Plus size={16} /> Create New Class
              </button>
            </div>
          </div>
          {/* Create/Edit class form */}
          <Transition.Root show={isDialogOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50"
              onClose={handleDialogClose}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/30" />
              </Transition.Child>

              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                      <Dialog.Title className="text-lg font-semibold">
                        {isEditing ? "Edit Class" : "Create New Class"}
                      </Dialog.Title>
                      <button onClick={() => setIsDialogOpen(false)}>
                        <X size={20} />
                      </button>
                    </div>

                    {/* Form body */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Class Title
                          </label>
                          <input
                            type="text"
                            value={newClass.class_title}
                            onChange={(e) =>
                              setNewClass((prev) => ({
                                ...prev,
                                class_title: e.target.value,
                              }))
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
                            placeholder="Enter class title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            value={newClass.class_date_time}
                            onChange={(e) =>
                              setNewClass((prev) => ({
                                ...prev,
                                class_date_time: e.target.value,
                              }))
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Recording URL (Optional)
                          </label>
                          <input
                            type="text"
                            value={newClass.recording_url || ""}
                            onChange={(e) =>
                              setNewClass((prev) => ({
                                ...prev,
                                recording_url: e.target.value,
                              }))
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-purple focus:ring-primary-purple sm:text-sm"
                            placeholder="https://example.com/recording"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                      <button
                        onClick={handleDialogClose}
                        className="rounded border px-4 py-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={
                          isEditing ? handleUpdateClass : handleCreateClass
                        }
                        disabled={loading}
                        className="rounded bg-primary-purple px-4 py-2 text-white"
                      >
                        {loading ? "Saving…" : isEditing ? "Update" : "Create"}
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
          {/* Classes list */}
          <div className="my-4">
            {/* <h3 className="text-lg font-semibold">Classes</h3> */}
            {filteredClasses.length === 0 ? (
              <div className="text-center pt-10 text-lg flex flex-col items-center text-primary-purple dark:text-accent-skyblue">
                <img src="/Empty.png" className="w-1/3" alt="" />
                No classes available.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {filteredClasses
                  .sort(
                    (a, b) =>
                      new Date(b.class_date_time) - new Date(a.class_date_time)
                  )
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
                        {/* {cls.recording_url && (
                        <a
                          href={cls.recording_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <Paperclip className="h-3.5 w-3.5 mr-1.5" />
                          Recording
                        </a>
                      )} */}
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
