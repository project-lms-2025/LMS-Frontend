import React, { useState } from 'react';
import { Search, Plus, MoreVertical } from 'lucide-react';

// Sample data for demonstration
const sampleTeachers = [
    {
      id: 8,
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@example.com',
      phone: '+91 999-111-2222',
      country: 'India',
      description: 'Experienced in teaching full-stack web development.',
      activeCourses: 5,
      status: 'Active',
      avatarColor: 'bg-blue-500',
    },
    {
      id: 9,
      name: 'Pooja Verma',
      email: 'pooja.verma@example.com',
      phone: '+91 988-654-7890',
      country: 'India',
      description: 'Expert in AI and Data Science.',
      activeCourses: 3,
      status: 'Active',
      avatarColor: 'bg-purple-500',
    },
    {
      id: 10,
      name: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      phone: '+91 912-345-6789',
      country: 'India',
      description: 'Specialist in Cybersecurity and Ethical Hacking.',
      activeCourses: 2,
      status: 'Suspend',
      avatarColor: 'bg-red-500',
    },
    {
      id: 11,
      name: 'Sneha Patil',
      email: 'sneha.patil@example.com',
      phone: '+91 923-456-7890',
      country: 'India',
      description: 'Passionate about teaching UI/UX Design.',
      activeCourses: 4,
      status: 'Active',
      avatarColor: 'bg-teal-500',
    },
  ];
  

// Utility to get initials from a name
function getInitials(name = '') {
  const [first = '', second = ''] = name.split(' ');
  return (first[0] + (second[0] || '')).toUpperCase();
}

export default function TeacherList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [teachers] = useState(sampleTeachers);

  // Filtered teachers based on searchTerm and status
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = teacher.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter
      ? teacher.status.toLowerCase() === statusFilter.toLowerCase()
      : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h1 className="text-xl font-bold text-gray-800">Instructors</h1>

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
            <option value="Pending">Pending</option>
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
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Active courses</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-4 text-center text-sm text-gray-500"
                  colSpan={8}
                >
                  No instructors found.
                </td>
              </tr>
            ) : (
              filteredTeachers.map((teacher) => (
                <tr
                  key={teacher.id}
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
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white uppercase text-sm ${teacher.avatarColor}`}
                      >
                        {getInitials(teacher.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {teacher.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {teacher.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {teacher.phone}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {teacher.country}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {teacher.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {teacher.activeCourses}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {/* Status Pill */}
                    <span
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium 
                        ${
                          teacher.status.toLowerCase() === 'active'
                            ? 'bg-green-100 text-green-600'
                            : teacher.status.toLowerCase() === 'pending'
                            ? 'bg-yellow-100 text-yellow-600'
                            : teacher.status.toLowerCase() === 'suspend'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-600'
                        }
                      `}
                    >
                      {teacher.status}
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
