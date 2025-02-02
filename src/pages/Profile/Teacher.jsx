import { useState } from "react";
import { User, Book, FileText, ChevronDown, ChevronUp } from "lucide-react";

const TeacherProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isExpanded, setIsExpanded] = useState(false);

  const teacher = {
    name: "Dr. John Doe",
    designation: "Professor of Computer Science",
    email: "johndoe@example.com",
    phone: "+91 98765 43210",
    department: "Computer Science",
    experience: "15+ years",
    courses: [
      { code: "CS101", name: "Data Structures" },
      { code: "CS102", name: "Algorithms" },
      { code: "CS103", name: "Artificial Intelligence" },
    ],
    publications: 25,
    achievements: [
      "Best Researcher Award 2022",
      "Published 5 papers in IEEE Transactions",
      "Developed AI-based learning models",
    ],
    documents: [
      { name: "PhD Certificate", type: "PDF", size: "1.2 MB" },
      { name: "Teaching Experience Letter", type: "PDF", size: "900 KB" },
    ],
  };

  return (
    <div className="max-w-6xl mt-4 mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <User className="w-10 h-10 text-gray-500 mr-4" />
        <div>
          <h2 className="text-xl font-semibold">{teacher.name}</h2>
          <p className="text-gray-600">{teacher.designation}</p>
        </div>
      </div>

      <div className="flex border-b mb-4">
        {[
          { key: "overview", label: "Overview", icon: <User className="w-5 h-5" /> },
          { key: "academic", label: "Academic", icon: <Book className="w-5 h-5" /> },
          { key: "documents", label: "Documents", icon: <FileText className="w-5 h-5" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-all duration-300 ${
              activeTab === tab.key ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600"
            }`}
          >
            {tab.icon}
            <span className="ml-2">{tab.label}</span>
          </button>
        ))}
      </div>

      <div>
        {activeTab === "overview" && (
          <div>
            <p className="text-gray-700 mb-2"><strong>Email:</strong> {teacher.email}</p>
            <p className="text-gray-700 mb-2"><strong>Phone:</strong> {teacher.phone}</p>
            <p className="text-gray-700 mb-2"><strong>Department:</strong> {teacher.department}</p>
            <p className="text-gray-700 mb-2"><strong>Experience:</strong> {teacher.experience}</p>
          </div>
        )}

        {activeTab === "academic" && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Assigned Courses</h3>
            <ul className="mb-4">
              {teacher.courses.map((course) => (
                <li key={course.code} className="text-gray-700">{course.code} - {course.name}</li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mb-2">Achievements</h3>
            <div className="relative">
              <ul className={`${isExpanded ? "max-h-full" : "max-h-24 overflow-hidden"} transition-all duration-300`}>
                {teacher.achievements.map((achievement, index) => (
                  <li key={index} className="text-gray-700">• {achievement}</li>
                ))}
              </ul>
              <button
                className="mt-2 text-blue-600 flex items-center text-sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show Less" : "Show More"}
                {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
              </button>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Uploaded Documents</h3>
            <div className="space-y-2">
              {teacher.documents.map((doc, index) => (
                <div key={index} className="flex items-center bg-gray-100 p-4 rounded-lg">
                  <FileText className="w-6 h-6 text-gray-500 mr-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-600">{doc.type} • {doc.size}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Download</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;
