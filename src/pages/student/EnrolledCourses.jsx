import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Loading from '../../components/Loading';
import { getEnrolledCourses } from '../../api/auth';
import toast, { Toaster } from 'react-hot-toast';

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
console.log(courses)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getEnrolledCourses();
        console.log("Raw enrolled courses response:", response);
        if (response && response.success) {
          // If the API returns a single course object, wrap it in an array.
          const courseData = Array.isArray(response.data)
            ? response.data
            : [response.data];
          console.log(courseData);
          setCourses(courseData);
        } else {
          setCourses([]);
          setError("No courses found.");
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load enrolled courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="m-0">
      <Sidebar open={open} setOpen={setOpen} />
      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          open
            ? "md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[75%]"
            : "ml-24 mr-2"
        } md:w-[90%] w-[95%]`}
      >
        <div className="min-h-[90vh] py-12 px-4 sm:px-6 lg:px-8">
          <Toaster />
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-purple mb-6">
              Enrolled Courses
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {courses.length > 0 ? (
              <div className="bg-primary-white rounded-xl shadow-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {courses.map((course) => (
                    <div
                      key={course.course_id}
                      className="p-6 hover:bg-secondary-gray transition-colors duration-200"
                    >
                      <h2 className="text-xl font-semibold text-primary-purple">
                        {course.course_name}
                      </h2>
                      <p className="text-gray-600">
                        Teacher ID: {course.teacher_id}
                      </p>
                      <p className="text-gray-600">
                        Batch ID: {course.batch_id}
                      </p>
                      <p className="text-gray-600">
                        Allow Notes Download:{" "}
                        {course.allow_notes_dov !== null
                          ? course.allow_notes_dov
                            ? "Yes"
                            : "No"
                          : "N/A"}
                      </p>
                      <p className="text-gray-600">
                        Created at: {new Date(course.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No enrolled courses available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourses;
