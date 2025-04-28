// src/pages/teacher/Classes.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Toaster, toast } from 'react-hot-toast';
import {
  createClass,
  getAllBatches,
  getClasses,
  getCoursesByBatchId,
} from '../../api/auth';

import { ZoomMtg } from '@zoom/meetingsdk';

// Configure Zoom Meeting SDK (v3.13.1)
ZoomMtg.setZoomJSLib('https://source.zoom.us/3.13.1/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

const Classes = () => {
  const [open, setOpen] = useState(false);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState({});
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({
    class_title: '',
    class_date_time: '',
    recording_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authToken = localStorage.getItem('authToken');

  // Fetch all batches
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await getAllBatches();
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
      setCourses(prev => ({ ...prev, [batchId]: data || [] }));
    } catch (err) {
      setError(err.message);
      setCourses(prev => ({ ...prev, [batchId]: [] }));
    }
  };

  // Fetch all classes
  const fetchAllClasses = async () => {
    try {
      setLoading(true);
      const res = await getClasses();
      setClasses(res.data || []);
    } catch {
      setError('Failed to load classes');
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
    if (!selectedCourseId || !newClass.class_title || !newClass.class_date_time) {
      return toast.error('Please fill all fields');
    }
    try {
      setLoading(true);
      await createClass({ ...newClass, course_id: selectedCourseId }, authToken);
      toast.success('Class created successfully');
      setNewClass({ class_title: '', class_date_time: '', recording_url: '' });
      fetchAllClasses();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Join Zoom Meeting using Meeting SDK
  const joinClass = async (cls) => {
    const m = cls.zoom_meeting_url.match(/j\/(\d+)/);
    if (!m) return toast.error('Invalid meeting URL');
    const meetingNumber = m[1];
    const meetingPassword = cls.session_passcode || '';

    // Fetch signature from backend
    let signature;
    try {
      const res = await fetch(
        'https://testapi.teachertech.in/api/zoom/generate-signature',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meetingNumber, role: 1 }), // host
        },
      );
      const data = await res.json();
      signature = data.signature;
      if (!signature) throw new Error('No signature returned');
    } catch (err) {
      console.error(err);
      return toast.error('Could not get Zoom signature');
    }
    const zmRoot = document.getElementById('zmmtg-root');
    zmRoot.style.display = 'block';
    // Initialize & join
    ZoomMtg.init({
      leaveUrl: window.location.href,
      success: () => {
        ZoomMtg.join({
          sdkKey: process.env.REACT_APP_ZOOM_SDK_KEY,
          signature,
          meetingNumber,
          passWord: meetingPassword,
          userName: 'Teacher',
          success: () => console.log('✅ Joined meeting'),
          error: err => console.error('❌ join error', err),
        });
      },
      error: err => console.error('❌ init error', err),
    });
  };

  return (
    <div className="m-0">
      <Sidebar open={open} setOpen={setOpen} />
      <Toaster />
      <div className={`transition-all duration-300 ${open ? 'md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[75%]' : 'ml-24 mr-2'} md:w-[90%] w-[95%]`}>
        <div className="p-4">
          <h2 className="text-xl font-bold">Class Management</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Batch selector */}
          <div className="border p-4 my-4">
            <h3 className="text-lg font-semibold">Select Batch</h3>
            <select
              value={selectedBatchId}
              onChange={e => setSelectedBatchId(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="">Select a batch</option>
              {batches.map(b => (
                <option key={b.batch_id} value={b.batch_id}>
                  {b.batch_name}
                </option>
              ))}
            </select>
          </div>

          {/* Course selector */}
          <div className="border p-4 my-4">
            <h3 className="text-lg font-semibold">Select Course</h3>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="" disabled={!selectedBatchId}>
                {selectedBatchId ? 'Select a course' : 'Select a batch first'}
              </option>
              {courses[selectedBatchId]?.map(c => (
                <option key={c.course_id} value={c.course_id}>
                  {c.course_name}
                </option>
              ))}
            </select>
          </div>

          {/* Create class form */}
          <div className="border p-4 my-4">
            <h3 className="text-lg font-semibold">Create Class</h3>
            <input
              type="text"
              placeholder="Class Title"
              value={newClass.class_title}
              onChange={e => setNewClass(prev => ({ ...prev, class_title: e.target.value }))}
              className="border p-2 my-2 w-full"
            />
            <input
              type="datetime-local"
              value={newClass.class_date_time}
              onChange={e => setNewClass(prev => ({ ...prev, class_date_time: e.target.value }))}
              className="border p-2 my-2 w-full"
            />
            <button
              onClick={handleCreateClass}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Class'}
            </button>
          </div>

          {/* List classes */}
          <div className="mt-6 space-y-4">
            {classes.length > 0 ? (
              classes.map(cls => (
                <div
                  key={cls.class_id}
                  className="flex justify-between items-center border rounded-lg p-5 shadow-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="w-full pr-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {cls.class_title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        📅 {new Date(cls.class_date_time).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-4 mt-2">
                      {cls.recording_url && (
                        <a
                          href={cls.recording_url}
                          className="text-blue-500 flex items-center hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Recording
                        </a>
                      )}
                      <button
                        onClick={() => joinClass(cls)}
                        className="bg-purple-600 text-white px-3 py-1 rounded flex items-center hover:bg-purple-700"
                      >
                        Join Class
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No classes available</p>
            )}
          </div>
        </div>
      </div>

      {/* Meeting SDK mount points */}
      <div id="zmmtg-root"></div>
      <div id="aria-notify-area"></div>
    </div>
  );
};

export default Classes;
