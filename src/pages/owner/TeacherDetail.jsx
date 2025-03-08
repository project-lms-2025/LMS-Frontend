import React from "react";
import { Edit, PlusCircle } from "lucide-react"; // Importing icons from lucide-react

const TeacherDetail = () => {
  return (
    <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Instructor/ Abu Bin Ishtiyak</h1>
        <button className="text-purple-600 hover:text-purple-800">
          <Edit size={20} />
        </button>
      </div>

      {/* Personal Information Section */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700">Personal Information</h2>
        <div className="mt-4 grid grid-cols-2 gap-x-10">
          <div className="text-gray-600 space-y-4">
            <p><span className="font-semibold">Title:</span> Mr.</p>
            <p><span className="font-semibold">Full Name:</span> Abu Bin Ishtiyak</p>
            <p><span className="font-semibold">Date of Birth:</span> 10 Aug, 1980</p>
            <p><span className="font-semibold">Mobile Number:</span> +811 758-756433</p>
          </div>
          <div className="text-gray-600 space-y-4">
            <p><span className="font-semibold">Surname:</span> IO</p>
            <p><span className="font-semibold">Email Address:</span> info@softnio.com</p>
            <p><span className="font-semibold">Joining Date:</span> 08-16-2018 09:04PM</p>
            <p><span className="font-semibold">Country:</span> United States</p>
          </div>
        </div>
      </div>

      {/* Admin Note Section */}
      <div className="border-t border-gray-300 pt-4">
        <h2 className="text-lg font-medium text-gray-700">Admin Note</h2>
        <div className="bg-gray-100 p-4 mt-2 rounded-md">
          <p className="text-sm text-gray-700">
            Aporin at metus et dolor tincidunt feugiat eu id quam. Pellentesque habitant morbi tristique senectus et
            netus et malesuada fames ac turpis egestas. Aenean sollicitudin nunc vel pharetra.
          </p>
        </div>
        <div className="flex justify-end mt-2">
          <button className="text-red-500 hover:text-red-700 text-sm">
            Delete Note
          </button>
        </div>
      </div>

      {/* Add Note Button */}
      <div className="mt-6 flex justify-end">
        <button className="text-purple-600 hover:text-purple-800 flex items-center">
          <PlusCircle size={20} className="mr-2" /> Add Note
        </button>
      </div>
    </div>
  );
};

export default TeacherDetail;
