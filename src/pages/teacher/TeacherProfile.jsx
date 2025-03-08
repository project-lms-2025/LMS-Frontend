import React, { useState } from 'react';
import { Edit, MapPin, CheckCircle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

export default function FacultyProfile() {
  const [open, setOpen] = useState(false);
  return (
    <div className='m-0' >
      <Sidebar open={open} setOpen={setOpen} />
      {/* Main content */}
      <div
        className={`transition-all duration-300 ${open ? "md:ml-[20rem] ml-56 mr-4  w-[40%] md:w-[75%]" : "ml-24 mr-2"} md:w-[90%]  w-[95%] md:mt `}
      >
        <div className="w-full pt-6  ">
          {/* Top Section (Header) */}
          <div className="bg-purple-700 rounded-t-lg p-6 flex flex-col md:flex-row items-center relative">
            {/* Avatar */}
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              {/* Replace this with the faculty's actual avatar/image */}
              <img
                src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1380"
                alt="Faculty Avatar"
                className="w-24 h-24 rounded-full border-4 border-purple-300"
              />
            </div>

            {/* Faculty Info */}
            <div className="text-white">
              <h1 className="text-2xl font-bold">Manoj kumar</h1>
              <p className="text-sm">GATE AIR-13</p>
              <div className="flex items-center gap-1 text-sm mt-1">
                <MapPin className="w-4 h-4" />
                <span>Delhi</span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              className="absolute top-6 right-6 flex items-center gap-1 text-white hover:text-gray-200"
              title="Edit Profile"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          {/* Main Content (White Card) */}
          <div className="bg-white rounded-b-lg shadow p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column: Basic Info */}
              <div className="md:w-1/3 border-r pr-6">
                {/* Current Title */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Current Title:</p>
                  <p className="text-lg font-semibold">Associate Professor</p>
                </div>
                {/* Department */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Department:</p>
                  <p className="text-lg font-semibold">Math,Aptitude</p>
                </div>
                {/* Years of Experience (Circle) */}
                <div className="mb-2 flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mx-auto">
                  <span className="text-2xl font-bold text-gray-800">8</span>
                </div>
                <p className="text-center text-sm font-semibold">Years Experience</p>
                <p className="text-center text-xs text-gray-500 mb-4">
                  Dedicated to student success
                </p>
                {/* Joined Date */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Joined:</p>
                  <p className="text-lg font-semibold">28 Oct 2023</p>
                </div>
                {/* Publications Count */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Publications:</p>
                  <p className="text-lg font-semibold">5</p>
                </div>
              </div>

              {/* Right Column: About, Courses Taught, Achievements */}
              <div className="md:w-2/3">
                {/* About Section */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-1">About</h2>
                  <p className="text-sm text-gray-600">
                    An experienced educator with a passion for teaching students to clear exam.
                  </p>
                </div>

                {/* Courses Taught */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Courses Taught</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Course 1 */}
                    <div className="border p-3 rounded">
                      <h3 className="font-semibold">Aptitude</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Introductory Course • Freshmen Level
                      </p>
                      <div className="bg-gray-200 rounded-full h-2 my-2">
                        {/* Example "semester progress": 40% */}
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: '40%' }}
                        />
                      </div>
                      <p className="text-xs">40% of semester complete</p>
                    </div>
                    {/* Course 2 */}
                    <div className="border p-3 rounded">
                      <h3 className="font-semibold">Basic Math</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Advanced Course • Upperclassmen Level
                      </p>
                      <div className="bg-gray-200 rounded-full h-2 my-2">
                        {/* Example "semester progress": 20% */}
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: '20%' }}
                        />
                      </div>
                      <p className="text-xs">20% of semester complete</p>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h2 className="text-lg font-semibold mb-2">Achievements</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Achievement 1 */}
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Awarded "Teacher of the Year" 2023
                    </div>
                    {/* Achievement 2 */}
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Published 10+ Research Papers
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
