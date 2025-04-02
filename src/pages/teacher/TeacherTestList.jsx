import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Eye, Plus } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Loading from '../../components/Loading';
import { getAllCourses } from '../../api/auth';
import { getAllTests } from '../../api/test';

const TeacherTestList = () => {
  const [tests, setTests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Fetch tests on mount
  useEffect(() => {
    async function fetchTests() {
      try {
        const data = await getAllTests("COURSE_TEST");
        console.log("Tests:", data);
        setTests(data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load tests");
        setLoading(false);
      }
    }
    fetchTests();
  }, []);

  // Fetch courses on mount
  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getAllCourses();
        console.log("Courses:", data);
        // Assume that getAllCourses returns either an array or an object with a data array
        if (Array.isArray(data)) {
          setCourses(data);
        } else if (data && data.success && Array.isArray(data.data)) {
          setCourses(data.data);
        } else {
          setCourses([]);
        }
      } catch (error) {
        toast.error("Failed to load courses");
      }
    }
    fetchCourses();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="m-0">
      <Sidebar open={open} setOpen={setOpen} />
      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          open ? "md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[75%]" : "ml-24 mr-2"
        } md:w-[90%] w-[95%] md:mt`}
      >
        <div className="p-6 flex justify-center min-h-[90vh]">
          <Toaster />
          <div className="w-[45rem]">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">Scheduled Tests</h1>
              <div className="flex items-center gap-4">
                {/* Course Dropdown */}
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
                {/* Create Test link includes selected course id */}
                <a
                  className="flex justify-center items-center gap-2 px-3 py-1 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
                  href={`/createtest?type=COURSE_TEST&course_id=${selectedCourseId}`}
                >
                  Create Test <Plus />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {tests.map((test) => (
                <div key={test.test_id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold mb-2">{test.title}</h2>
                    <button
                      onClick={() =>
                        window.open(`/testpreview?test_id=${test.test_id}`, '_blank')
                      }
                      className="flex justify-center items-center gap-2 px-3 py-1 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4" />
                      Watch Preview
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-10 font-bold">
                    <p className="text-gray-600 mb-1">
                      Course: <span className="font-normal">{test.course_name}</span>
                    </p>
                    <p className="text-gray-500 mb-1">
                      Date: <span className="font-normal">{test.schedule_date}</span>
                    </p>
                    <p className="text-gray-500 mb-1">
                      Time: <span className="font-normal">{test.schedule_time}pm</span>
                    </p>
                    <p className="text-gray-500">
                      Duration: <span className="font-normal">{test.duration} minutes</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherTestList;
