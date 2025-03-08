import React from 'react';
import {
  Calendar,
  Star,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register the Chart.js components you need
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * A small utility to display star ratings
 * e.g. rating = 4 => ★★★★☆
 */
function Stars({ rating = 0 }) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    );
  }
  return <div className="flex">{stars}</div>;
}

export default function BatchOverview() {
  // ---------------------
  // Chart Data & Options
  // ---------------------

  // Main (large) line chart data
  const mainChartData = {
    labels: ['Jul 1', 'Jul 8', 'Jul 15', 'Jul 22', 'Jul 29'],
    datasets: [
      {
        label: 'Earnings',
        data: [1.2, 2.0, 2.8, 2.4, 3.1], // Example data (in thousands)
        borderColor: 'rgba(99, 102, 241, 1)', // Tailwind's purple-500
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const mainChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}k`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Mini chart data for "Active Students"
  const activeStudentsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Active Students',
        data: [320, 324, 329, 330, 329], // Example data
        borderColor: 'rgba(16, 185, 129, 1)', // Tailwind's green-500
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Mini chart data for "New Enrollment"
  const newEnrollmentData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'New Enrollment',
        data: [180, 185, 190, 192, 194], // Example data
        borderColor: 'rgba(16, 185, 129, 1)', // green-500
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Shared mini chart options
  const miniChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
      point: { radius: 0 },
    },
  };

  // ---------------------
  // Sample Demo Data
  // ---------------------
  const courses = [
    { id: 1, title: 'UI/UX Design with Adobe XD', label: 'WDB', price: 700.0 },
    { id: 2, title: 'Front-end Web Development with React', label: 'WDR', price: 1200.0 },
    { id: 3, title: 'Learn PHP Basics to Advance', label: 'PHP', price: 550.0 },
    { id: 4, title: 'Android Development with project', label: 'AND', price: 500.0 },
    { id: 5, title: 'Learn Node Development with React', label: 'NDR', price: 900.0 },
  ];

  const feedback = [
    { id: 1, name: 'Rajesh Sharma', email: 'rajesh.sharma@example.com', rating: 5 },
    { id: 2, name: 'Pooja Verma', email: 'pooja.verma@example.com', rating: 4 },
    { id: 3, name: 'Amit Kumar', email: 'amit.kumar@example.com', rating: 3 },
    { id: 4, name: 'Sneha Patil', email: 'sneha.patil@example.com', rating: 5 },
  ];
  

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl font-bold text-gray-800">Instructor Overview</h1>
        <button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 px-3 py-2 rounded text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          Last 30 Days
        </button>
      </div>

      {/* Top Stats + Main Chart */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
        {/* Earnings stats */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex gap-6">
            {/* Monthly */}
            <div>
              <p className="text-sm text-gray-500">Monthly</p>
              <p className="text-xl font-semibold text-gray-800">9.28K</p>
            </div>
            {/* Weekly */}
            <div>
              <p className="text-sm text-gray-500">Weekly</p>
              <p className="text-xl font-semibold text-gray-800">2.69K</p>
            </div>
            {/* Daily */}
            <div>
              <p className="text-sm text-gray-500">Daily (Avg)</p>
              <p className="text-xl font-semibold text-gray-800">0.94K</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            <p>01 Jul 2020 - 30 Jul 2020</p>
          </div>
        </div>

        {/* Main line chart */}
        <div className="h-64 w-full">
          <Line data={mainChartData} options={mainChartOptions} />
        </div>
      </div>

      {/* Smaller Stats (Active Students + New Enrollment) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Active Students */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Active Students</p>
              <p className="text-2xl font-semibold text-gray-800">329</p>
            </div>
            <div className="flex items-center text-green-500 text-sm">
              <ChevronUp className="w-4 h-4" />
              7.45% vs Last Week
            </div>
          </div>
          <div className="h-20">
            <Line data={activeStudentsData} options={miniChartOptions} />
          </div>
        </div>

        {/* New Enrollment */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">New Enrollment</p>
              <p className="text-2xl font-semibold text-gray-800">194</p>
            </div>
            <div className="flex items-center text-green-500 text-sm">
              <ChevronUp className="w-4 h-4" />
              6.8% vs Yesterday
            </div>
          </div>
          <div className="h-20">
            <Line data={newEnrollmentData} options={miniChartOptions} />
          </div>
        </div>
      </div>

      {/* Bottom: My Courses + Student's Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Courses */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">My Courses</h2>
            <span className="text-sm text-gray-400">₹ Value</span>
          </div>
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between"
              >
                {/* Course Info */}
                <div className="flex items-center gap-2">
                  <span className="bg-gray-200 text-gray-600 text-xs font-bold py-1 px-2 rounded">
                    {course.label}
                  </span>
                  <p className="text-sm text-gray-700">{course.title}</p>
                </div>
                {/* Course Price */}
                <p className="text-sm text-gray-800 font-semibold">
                ₹{course.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Student's Feedback */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Student's Feedback
          </h2>
          <div className="space-y-4">
            {feedback.map((fb) => (
              <div
                key={fb.id}
                className="flex items-center justify-between"
              >
                {/* Student Info */}
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {fb.name}
                  </p>
                  <p className="text-xs text-gray-500">{fb.email}</p>
                </div>
                {/* Star Rating */}
                <Stars rating={fb.rating} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
