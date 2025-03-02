import React from "react";
import { Crown, Award } from "lucide-react"; // Icons from lucide-react

// Dummy data representing a batch/test series rank board
const dummyRankBoard = [
  { rank: 1, name: "Alice", series: "Test Series 1", score: 98, average: 96 },
  { rank: 2, name: "Bob", series: "Test Series 1", score: 92, average: 90 },
  { rank: 3, name: "Charlie", series: "Test Series 1", score: 89, average: 88 },
  { rank: 4, name: "Daisy", series: "Test Series 1", score: 85, average: 84 },
  { rank: 5, name: "Ethan", series: "Test Series 1", score: 80, average: 78 },
];

const RankBoard = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
        Batch Rank Board
      </h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-gray-600 uppercase text-sm font-bold">
                Rank
              </th>
              <th className="px-6 py-3 text-gray-600 uppercase text-sm font-bold">
                Name
              </th>
              <th className="px-6 py-3 text-gray-600 uppercase text-sm font-bold">
                Test Series
              </th>
              <th className="px-6 py-3 text-gray-600 uppercase text-sm font-bold">
                Score
              </th>
              <th className="px-6 py-3 text-gray-600 uppercase text-sm font-bold">
                Average Score
              </th>
            </tr>
          </thead>
          <tbody>
            {dummyRankBoard.map((student) => (
              <tr
                key={student.rank}
                className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-3">
                  {student.rank === 1 ? (
                    <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                      <Crown size={18} />
                      {student.rank}
                    </span>
                  ) : student.rank === 2 ? (
                    <span className="flex items-center gap-1 text-gray-600 font-semibold">
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
                <td className="px-6 py-3">{student.name}</td>
                <td className="px-6 py-3">{student.series}</td>
                <td className="px-6 py-3">{student.score}</td>
                <td className="px-6 py-3">{student.average}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankBoard;
