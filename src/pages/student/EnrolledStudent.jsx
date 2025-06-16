// src/components/EnrolledStudents.jsx
import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

const dummyStudents = [
  {
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "9876543210",
    batch: "Full Stack Web Dev",
    validity: "31/12/2025",
    registrationDate: "01/01/2024",
  },
  {
    name: "Priya Singh",
    email: "priya.singh@example.com",
    phone: "9123456789",
    batch: "Data Science",
    validity: "15/11/2025",
    registrationDate: "10/02/2024",
  },
  {
    name: "Amit Patel",
    email: "amit.patel@example.com",
    phone: "9988776655",
    batch: "AI & ML",
    validity: "30/06/2025",
    registrationDate: "22/03/2024",
  },
  {
    name: "Sneha Verma",
    email: "sneha.verma@example.com",
    phone: "9012345678",
    batch: "Cloud Computing",
    validity: "12/08/2025",
    registrationDate: "05/04/2024",
  },
  {
    name: "Vikram Rao",
    email: "vikram.rao@example.com",
    phone: "9870012345",
    batch: "Cybersecurity",
    validity: "20/10/2025",
    registrationDate: "18/05/2024",
  },
  {
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    phone: "9090909090",
    batch: "DevOps Engineering",
    validity: "25/12/2025",
    registrationDate: "30/06/2024",
  },
];

export default function EnrolledStudent() {
  const [open, setOpen] = useState(false);
  return (
    <div className="m-0">
      <Sidebar open={open} setOpen={setOpen} />
      <div
        className={`transition-all mt-14 pt-12 duration-300 ${
          open
            ? "md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[70%]"
            : "ml-24 mr-2 md:w-[90%]  w-[95%] px-4"
        }`}
      >
        <h2 className="text-2xl text-primary-purple font-semibold mb-4">Enrolled Students</h2>
        <div className="overflow-x-auto bg-white rounded-lg border border-primary-purple/50 shadow overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Phone no",
                  "Batch",
                  "Validity",
                  "Registration Date",
                ].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-primary-purple uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyStudents.map((stu, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {stu.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {stu.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {stu.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {stu.batch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {stu.validity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {stu.registrationDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
