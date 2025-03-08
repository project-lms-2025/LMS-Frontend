import React from 'react'
import Batch from '../../components/Batch'
import Course from '../../components/Course'

const Teacher = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-6 text-center">
          Teacher Dashboard
        </h1>
        <Batch/>
        <Course/>
        {/* <Class/> */}
      </div>
    </div>
  )
}

export default Teacher