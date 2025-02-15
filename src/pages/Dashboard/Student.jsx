import React, { useEffect, useState } from "react";

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [classSchedule, setClassSchedule] = useState([]); // ✅ Define classSchedule
  const [ongoingCourses, setOngoingCourses] = useState([]); // ✅ Define ongoingCourses
  const [completedCourses, setCompletedCourses] = useState([]); // ✅ Define completedCourses

  useEffect(() => {
    // Simulated API Calls (Replace with actual API calls)
    setCourses([
      { id: 1, name: "Mathematics", teacher: "Mr. Smith" },
      { id: 2, name: "Science", teacher: "Mrs. Johnson" },
    ]);

    setQuizResults([
      { id: 1, course: "Mathematics", score: 85 },
      { id: 2, course: "Science", score: 78 },
    ]);

    setClassSchedule([
      { id: 1, course: "Mathematics", date: "Feb 5", time: "10:00 AM" },
      { id: 2, course: "Science", date: "Feb 6", time: "2:00 PM" },
    ]);

    setOngoingCourses([{ id: 1, name: "Mathematics" }]);
    setCompletedCourses([{ id: 2, name: "Science" }]);
  }, []);

        return (
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-6">
            <div className="max-w-5xl mx-auto">
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Student Dashboard
              </h1>
      
              {/* Enrolled Courses */}
              <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Enrolled Courses
                </h2>
                <ul className="space-y-3">
                  {courses.map((course) => (
                    <li
                      key={course.id}
                      className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex justify-between items-center"
                    >
                      <span className="text-gray-900 dark:text-white font-medium">
                        {course.name}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        Instructor: {course.teacher}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
      
              {/* Class Schedule */}
              <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Class Schedule
                </h2>
                <ul className="space-y-3">
                  {classSchedule.map((schedule) => (
                    <li
                      key={schedule.id}
                      className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex justify-between items-center"
                    >
                      <span className="text-gray-900 dark:text-white font-medium">
                        {schedule.course}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        {schedule.date} | {schedule.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
      
              {/* Ongoing & Completed Courses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ongoing Courses */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Ongoing Courses
                  </h2>
                  <ul className="space-y-3">
                    {ongoingCourses.map((course) => (
                      <li
                        key={course.id}
                        className="p-4 bg-blue-100 dark:bg-blue-700 rounded-lg"
                      >
                        <span className="text-gray-900 dark:text-white font-medium">
                          {course.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
      
                {/* Completed Courses */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Completed Courses
                  </h2>
                  <ul className="space-y-3">
                    {completedCourses.map((course) => (
                      <li
                        key={course.id}
                        className="p-4 bg-green-100 dark:bg-green-700 rounded-lg"
                      >
                        <span className="text-gray-900 dark:text-white font-medium">
                          {course.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
      
              {/* Quiz Results */}
              <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Quiz Results
                </h2>
                <ul className="space-y-3">
                  {quizResults.map((result) => (
                    <li
                      key={result.id}
                      className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex justify-between items-center"
                    >
                      <span className="text-gray-900 dark:text-white font-medium">
                        {result.course}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        Score: {result.score}%
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        );
      }
      

export default StudentDashboard;
