import React, { useState } from "react";
import { Crown, Award } from "lucide-react"; // Icons from lucide-react
import Sidebar from "../../components/Sidebar";

// Dummy data for demonstration
const dummyResults = [
  { rank: 1, name: "Alice", score: 95, percentile: 98 },
  { rank: 2, name: "Bob", score: 90, percentile: 92 },
  { rank: 3, name: "Charlie", score: 85, percentile: 89 },
  { rank: 4, name: "Daisy", score: 80, percentile: 85 },
  { rank: 5, name: "Ethan", score: 75, percentile: 75 },
];

const highlightRow = (rank) => {
  if (rank === 1) return "bg-yellow-50";
  if (rank === 2) return "bg-blue-50";
  if (rank === 3) return "bg-orange-50";
  return "";
};

const Rank = () => {
    const [open, setOpen] = useState(false);
  return (
    <div className='m-0' >
    <Sidebar open={open} setOpen={setOpen} />
    {/* Main content */}
    <div
      className={`transition-all duration-300 ${open ? "md:ml-[20rem] ml-56 mr-4  w-[40%] md:w-[75%]" : "ml-24 mr-2"} md:w-[90%]  w-[95%] md:mt `}
    >
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4 text-gray-800">Test Results</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-gray-600 uppercase text-sm font-bold">
                Rank
              </th>
              <th className="px-6 py-3 text-gray-600 uppercase text-sm font-bold">
                Name
              </th>
              <th className="px-6 py-3 text-gray-600 uppercase text-sm font-bold">
                Score
              </th>
              <th className="px-6 py-3 text-gray-600 uppercase text-sm font-bold">
                Percentile
              </th>
            </tr>
          </thead>
          <tbody>
            {dummyResults.map((student) => (
              <tr
                key={student.rank}
                className={`border-b last:border-b-0 ${highlightRow(student.rank)}`}
              >
                {/* Rank Cell */}
                <td className="px-6 py-3">
                  {student.rank === 1 ? (
                    <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                      <Crown size={18} />
                      {student.rank}
                    </span>
                  ) : student.rank === 2 ? (
                    <span className="flex items-center gap-1 text-blue-600 font-semibold">
                      <Award size={18} />
                      {student.rank}
                    </span>
                  ) : student.rank === 3 ? (
                    <span className="flex items-center gap-1 text-orange-600 font-semibold">
                      <Award size={18} />
                      {student.rank}
                    </span>
                  ) : (
                    <span>{student.rank}</span>
                  )}
                </td>
                {/* Name Cell */}
                <td className="px-6 py-3">{student.name}</td>
                {/* Score Cell */}
                <td className="px-6 py-3">{student.score}</td>
                {/* Percentile Cell */}
                <td className="px-6 py-3">
                  {student.percentile !== undefined ? student.percentile : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Rank;
