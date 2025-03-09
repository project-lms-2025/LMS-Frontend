import React, { useState } from 'react'
import Batch from '../../components/Batch'
import Course from '../../components/Course'
import Sidebar from '../../components/Sidebar';

const Teacher = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className='m-0' >
      <Sidebar open={open} setOpen={setOpen} />
      {/* Main content */}
      <div
        className={`transition-all duration-300 ${open ? "md:ml-[20rem] ml-56 mr-4  w-[40%] md:w-[75%]" : "ml-24 mr-2"} md:w-[90%]  w-[95%] md:mt `}
      >
        <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-blue-600 mb-6 text-center">
              Teacher Dashboard
            </h1>
            <Batch />
            <Course />
            {/* <Class/> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Teacher