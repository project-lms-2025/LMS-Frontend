import React, { useState } from 'react';
import { Search, Plus, MoreVertical } from 'lucide-react';

// Sample data for demonstration

const sampleStudents = [
    {
      id: 6,
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      enrolledCourses: 'Full Stack Development',
      phone: '+91 99876-54321',
      country: 'India',
      status: 'Active',
      avatarColor: 'bg-blue-500',
    },
    {
      id: 7,
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      enrolledCourses: 'Data Science with Python',
      phone: '+91 91234-56789',
      country: 'India',
      status: 'Inactive',
      avatarColor: 'bg-purple-500',
    },
    {
      id: 8,
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      enrolledCourses: 'Cybersecurity Fundamentals',
      phone: '+91 88776-55443',
      country: 'India',
      status: 'Active',
      avatarColor: 'bg-red-500',
    },
    {
      id: 9,
      name: 'Neha Verma',
      email: 'neha.verma@example.com',
      enrolledCourses: 'Machine Learning & AI',
      phone: '+91 95544-33221',
      country: 'India',
      status: 'Suspend',
      avatarColor: 'bg-yellow-500',
    },
  ];
  
// Utility to get initials from a name
function getInitials(name = '') {
  const [first = '', second = ''] = name.split(' ');
  return (first[0] + (second[0] || '')).toUpperCase();
}

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [students] = useState(sampleStudents);

  // Filtered students based on searchTerm and status
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter
      ? student.status.toLowerCase() === statusFilter.toLowerCase()
      : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h1 className="text-xl font-bold text-gray-800">Students</h1>

        {/* Right Controls: Search, Status Filter, Add Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name"
              className="pl-9 pr-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="border border-gray-300 rounded py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Suspend">Suspend</option>
          </select>

          {/* Add Button */}
          <button className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm">
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white shadow rounded overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="border-b bg-gray-100">
            <tr className="text-left">
              <th className="px-4 py-3 w-12">
                <input type="checkbox" className="h-4 w-4" />
              </th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Enrolled Courses</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-4 text-center text-sm text-gray-500"
                  colSpan={7}
                >
                  No students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="h-4 w-4" />
                  </td>
                  {/* User Info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {/* Avatar Circle (using initials + background color) */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white uppercase text-sm ${student.avatarColor}`}
                      >
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {student.enrolledCourses}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {student.phone}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {student.country}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {/* Status Pill */}
                    <span
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium 
                        ${
                          student.status.toLowerCase() === 'active'
                            ? 'bg-green-100 text-green-600'
                            : student.status.toLowerCase() === 'inactive'
                            ? 'bg-yellow-100 text-yellow-600'
                            : student.status.toLowerCase() === 'cancelled'
                            ? 'bg-red-100 text-red-600'
                            : student.status.toLowerCase() === 'suspend'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-600'
                        }
                      `}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
