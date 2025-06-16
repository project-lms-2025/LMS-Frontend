// src/components/EnrolledStudents.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { getAllBatches, getBatchStudents } from "../../api/auth";
import { toast } from "react-hot-toast";

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
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all batches on component mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const response = await getAllBatches();
        if (response && response.success && Array.isArray(response.data)) {
          setBatches(response.data);
          if (response.data.length > 0) {
            setSelectedBatch(response.data[0].batch_id);
          }
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
        toast.error("Failed to load batches");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  // Fetch students when selectedBatch changes
  useEffect(() => {
    if (selectedBatch) {
      fetchStudents(selectedBatch);
    }
  }, [selectedBatch]);

  const fetchStudents = async (batchId) => {
    try {
      setLoading(true);
      const response = await getBatchStudents(batchId);
      if (response && response.success && Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        setStudents([]);
        toast.error("No students found in this batch");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value);
  };

  return (
    <div className="m-0">
      <Sidebar open={open} setOpen={setOpen} />
      <div
        className={`transition-all mt-14 pt-6 duration-300 ${
          open
            ? "md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[70%]"
            : "ml-24 mr-2 md:w-[90%] w-[95%] "
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Enrolled Students</h1>
            <div className="w-64">
              <select
                value={selectedBatch}
                onChange={handleBatchChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {batches.map((batch) => (
                  <option key={batch.batch_id} value={batch.batch_id}>
                    {batch.batch_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {students.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No students enrolled in this batch</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.user_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                {student.name ? student.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.name || 'No Name'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{student.email || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{student.phoneNumber || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {student.selected_exam || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
