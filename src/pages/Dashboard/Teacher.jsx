import React, { useState } from 'react';

const Teacher = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [newClass, setNewClass] = useState('');
  const [newStudent, setNewStudent] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const teacherDashboardData = {
    teacher: {
      id: "T001",
      name: "John Doe",
      email: "john.doe@example.com",
      profileImage: "https://via.placeholder.com/150",
    },
    classes: [
      {
        id: "C001",
        name: "Math 101",
        students: [
          { id: "S001", name: "Alice Johnson", email: "alice.johnson@example.com" },
          { id: "S002", name: "Bob Smith", email: "bob.smith@example.com" },
        ],
        quizzes: [
          { id: "Q001", name: "Algebra Basics", date: "2025-01-20", totalMarks: 50 },
          { id: "Q002", name: "Geometry Quiz", date: "2025-01-15", totalMarks: 40 },
        ],
        courses: [
          { id: "CRS001", title: "Introduction to Algebra", duration: "6 weeks" },
          { id: "CRS002", title: "Basics of Geometry", duration: "4 weeks" },
        ],
      },
      {
        id: "C002",
        name: "Physics 202",
        students: [
          { id: "S003", name: "Charlie Brown", email: "charlie.brown@example.com" },
          { id: "S004", name: "Diana Prince", email: "diana.prince@example.com" },
        ],
        quizzes: [
          { id: "Q003", name: "Newton's Laws", date: "2025-01-18", totalMarks: 60 },
          { id: "Q004", name: "Thermodynamics Quiz", date: "2025-01-10", totalMarks: 45 },
        ],
        courses: [
          { id: "CRS003", title: "Basics of Mechanics", duration: "5 weeks" },
          { id: "CRS004", title: "Thermodynamics Simplified", duration: "7 weeks" },
        ],
      },
    ],
    quizzesConducted: [
      { id: "Q001", name: "Algebra Basics", date: "2025-01-20", classId: "C001" },
      { id: "Q003", name: "Newton's Laws", date: "2025-01-18", classId: "C002" },
      { id: "Q002", name: "Geometry Quiz", date: "2025-01-15", classId: "C001" },
      { id: "Q004", name: "Thermodynamics Quiz", date: "2025-01-10", classId: "C002" },
    ],
  };
  

  const handleAddClass = () => {
    if (newClass.trim()) {
      setClasses([...classes, newClass]);
      setNewClass('');
    }
  };

  const handleAddStudent = () => {
    if (newStudent.trim() && selectedClass) {
      setStudents([...students, { name: newStudent, class: selectedClass }]);
      setNewStudent('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-12 text-center">Teacher Dashboard</h1>

        {/* Create Class Section */}
        <section className="mb-12 bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create a Class</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Enter class name"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleAddClass}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Class
            </button>
          </div>
        </section>

        {/* List of Classes */}
        <section className="mb-12 bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">List of Classes</h2>
          {classes.length > 0 ? (
            <ul className="list-disc pl-6 text-gray-700">
              {classes.map((cls, index) => (
                <li key={index}>{cls}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No classes added yet.</p>
          )}
        </section>

        {/* Add Students Section */}
        <section className="mb-12 bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Students</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Class</option>
              {classes.map((cls, index) => (
                <option key={index} value={cls}>{cls}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Enter student name"
              value={newStudent}
              onChange={(e) => setNewStudent(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleAddStudent}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Student
            </button>
          </div>
        </section>

        {/* List of Students */}
        <section className="mb-12 bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">List of Students</h2>
          {students.length > 0 ? (
            <ul className="list-disc pl-6 text-gray-700">
              {students.map((student, index) => (
                <li key={index}>
                  {student.name} - <span className="italic text-gray-500">{student.class}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No students added yet.</p>
          )}
        </section>

        {/* List of Quizzes */}
        <section className="mb-12 bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">List of Quizzes</h2>
          {quizzes.length > 0 ? (
            <ul className="list-disc pl-6 text-gray-700">
              {quizzes.map((quiz, index) => (
                <li key={index}>{quiz}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No quizzes conducted yet.</p>
          )}
        </section>

        {/* Courses Section */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Courses</h2>
          <p className="text-gray-600">Feature under development.</p>
        </section>
      </div>
    </div>
  );
};

export default Teacher;
