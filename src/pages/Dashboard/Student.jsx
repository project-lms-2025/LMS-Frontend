import React, { useEffect, useState } from "react";

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [quizResults, setQuizResults] = useState([]);

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
    }, []);

    return (
        <div>
            <h1>Student Dashboard</h1>
            
            <section>
                <h2>Enrolled Courses</h2>
                <ul>
                    {courses.map(course => (
                        <li key={course.id}>{course.name} (Instructor: {course.teacher})</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Quiz Results</h2>
                <ul>
                    {quizResults.map(result => (
                        <li key={result.id}>{result.course}: {result.score}%</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default StudentDashboard;
