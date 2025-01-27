import React, { useState } from 'react';
import { User, BookOpen, Award, Calendar, MapPin, Phone, Mail, School, FileText, Clock } from 'lucide-react';

export const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const studentData = {
    personalInfo: {
      name: "Rahul Kumar",
      rollNumber: "2024CS0123",
      dateOfBirth: "15 August 2003",
      gender: "Male",
      bloodGroup: "B+",
      address: "123, Park Street, Bangalore, Karnataka - 560001",
      phone: "+91 98765 43210",
      email: "rahul.kumar@example.com",
      parentName: "Rajesh Kumar",
      parentPhone: "+91 98765 43211"
    },
    academicInfo: {
      branch: "Computer Science Engineering",
      semester: "4th Semester",
      batch: "2022-2026",
      cgpa: "8.9",
      attendance: "92%",
      currentCourses: [
        { code: "CS201", name: "Data Structures", credits: 4, grade: "A" },
        { code: "CS202", name: "Computer Networks", credits: 3, grade: "A+" },
        { code: "CS203", name: "Database Systems", credits: 4, grade: "A" }
      ]
    },
    achievements: [
      "First Prize in National Coding Competition 2023",
      "Member of College Technical Club",
      "Published paper in International Conference on ML"
    ]
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-16 h-16 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{studentData.personalInfo.name}</h1>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center text-gray-600">
                <BookOpen className="w-5 h-5 mr-2" />
                <span>{studentData.academicInfo.branch}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Award className="w-5 h-5 mr-2" />
                <span>CGPA: {studentData.academicInfo.cgpa}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{studentData.academicInfo.batch}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>{studentData.academicInfo.semester}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {['overview', 'academic', 'documents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === 'overview' && (
          <>
            {/* Personal Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500">Roll Number</label>
                    <p className="font-medium">{studentData.personalInfo.rollNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Date of Birth</label>
                    <p className="font-medium">{studentData.personalInfo.dateOfBirth}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Gender</label>
                    <p className="font-medium">{studentData.personalInfo.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Blood Group</label>
                    <p className="font-medium">{studentData.personalInfo.bloodGroup}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-500">Address</label>
                    <p className="font-medium">{studentData.personalInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{studentData.personalInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{studentData.personalInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Parent/Guardian</p>
                    <p className="font-medium">{studentData.personalInfo.parentName}</p>
                    <p className="text-sm text-gray-600">{studentData.personalInfo.parentPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'academic' && (
          <>
            {/* Current Semester Courses */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Current Semester Courses</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Credits
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentData.academicInfo.currentCourses.map((course) => (
                        <tr key={course.code}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {course.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.credits}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.grade}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Academic Stats */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Academic Statistics</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Attendance</span>
                      <span className="text-sm font-medium text-gray-700">{studentData.academicInfo.attendance}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: studentData.academicInfo.attendance }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">CGPA</span>
                      <span className="text-sm font-medium text-gray-700">{studentData.academicInfo.cgpa}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(parseFloat(studentData.academicInfo.cgpa) / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Achievements</h2>
                <ul className="space-y-3">
                  {studentData.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <Award className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-600">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {activeTab === 'documents' && (
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Academic Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: '10th Marksheet', type: 'PDF', size: '2.3 MB' },
                  { name: '12th Marksheet', type: 'PDF', size: '1.8 MB' },
                  { name: 'Aadhar Card', type: 'PDF', size: '1.2 MB' },
                  { name: 'Transfer Certificate', type: 'PDF', size: '956 KB' },
                  { name: 'Last Semester Marksheet', type: 'PDF', size: '1.5 MB' },
                  { name: 'Bonafide Certificate', type: 'PDF', size: '890 KB' }
                ].map((doc, index) => (
                  <div key={index} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                    <FileText className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
