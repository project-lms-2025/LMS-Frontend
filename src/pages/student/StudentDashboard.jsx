import { CalendarClock, Clock, File } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge, Calendar } from "rsuite";
import AttempedTestList from "./AttempedTestList";
import Announcement from "../../components/Announcement";
import StudentTestList from "./StudentTestList";
import EnrolledBatches from "./EnrolledBatches";
import Rank from "./Rank";
import { getClasses } from "../../api/auth";
// Dummy data for tests (replace with API data as needed)
const upcomingTestsData = [
  { id: 1, title: "Module 1: Programming in Python", questionsCount: 40, date: "Mar 5, 2025, 5:00 PM", duration: "2 hours" },
  { id: 2, title: "Module 2: Advanced Python", questionsCount: 30, date: "Mar 8, 2025, 3:00 PM", duration: "2 hours" },
  { id: 3, title: "Module 3: Data Structures", questionsCount: 25, date: "Mar 9, 2025, 4:00 PM", duration: "2 hours" },
  { id: 4, title: "Module 4: OOP Concepts", questionsCount: 35, date: "Mar 12, 2025, 1:00 PM", duration: "2 hours" },
];

const ongoingTestsData = [
  { id: 5, title: "Module 5: Algorithms", questionsCount: 20, date: "Mar 2, 2025, 2:00 PM", status: "Active" },
  { id: 6, title: "Module 6: Data Science", questionsCount: 28, date: "Mar 3, 2025, 1:00 PM", status: "Active" },
  { id: 7, title: "Module 7: SQL Basics", questionsCount: 15, date: "Mar 4, 2025, 3:00 PM", status: "Active" },
  { id: 8, title: "Module 8: SQL Advanced", questionsCount: 15, date: "Mar 4, 2025, 3:00 PM", status: "Active" },
];

const attemptedTestsData = [
  { id: 9, title: "Module 9: Web Development", questionsCount: 30, date: "Feb 25, 2025, 2:00 PM" },
  { id: 10, title: "Module 10: HTML & CSS", questionsCount: 20, date: "Feb 28, 2025, 4:00 PM" },
  { id: 11, title: "Module 11: JavaScript", questionsCount: 25, date: "Mar 1, 2025, 6:00 PM" },
  { id: 12, title: "Module 12: React Basics", questionsCount: 30, date: "Mar 2, 2025, 6:00 PM" },
];

const missedTestsData = [
  { id: 13, title: "Module 13: Node.js", questionsCount: 25, date: "Feb 20, 2025, 1:00 PM" },
  { id: 14, title: "Module 14: Express.js", questionsCount: 20, date: "Feb 22, 2025, 3:00 PM" },
];

// Dummy events for the calendar (you can replace with dynamic events)
function getTodoList(date) {
  if (!date) return [];
  const day = date.getDate();
  switch (day) {
    case 10:
      return [
        { time: "10:30 am", title: "Meeting" },
        { time: "12:00 pm", title: "Lunch" },
      ];
    case 15:
      return [
        { time: "09:30 am", title: "Intro Meeting" },
        { time: "12:30 pm", title: "Client Call" },
        { time: "02:00 pm", title: "Design Discussion" },
        { time: "05:00 pm", title: "Test & Review" },
        { time: "06:30 pm", title: "Reporting" },
      ];
    default:
      return [];
  }
}

function renderCell(date) {
  const events = getTodoList(date);
  return events.length ? <Badge className="calendar-todo-item-badge" /> : null;
}

// Helper for pagination
const itemsPerPage = 3;
const paginateData = (data, page) => {
  const start = page * itemsPerPage;
  return data.slice(start, start + itemsPerPage);
};

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("test");
  const [selectedDate, setSelectedDate] = useState(null);

  // Pagination states
  const [upcomingPage, setUpcomingPage] = useState(0);
  const [ongoingPage, setOngoingPage] = useState(0);
  const [attemptedPage, setAttemptedPage] = useState(0);
  const [missedPage, setMissedPage] = useState(0);

  // Calculate paginated data for each category
  const upcomingTests = paginateData(upcomingTestsData, upcomingPage);
  const ongoingTests = paginateData(ongoingTestsData, ongoingPage);
  const attemptedTests = paginateData(attemptedTestsData, attemptedPage);
  const missedTests = paginateData(missedTestsData, missedPage);

  const maxUpcomingPage = Math.ceil(upcomingTestsData.length / itemsPerPage) - 1;
  const maxOngoingPage = Math.ceil(ongoingTestsData.length / itemsPerPage) - 1;
  const maxAttemptedPage = Math.ceil(attemptedTestsData.length / itemsPerPage) - 1;
  const maxMissedPage = Math.ceil(missedTestsData.length / itemsPerPage) - 1;
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const leaderboardData = [
    { ranking: 1, name: 'John Smith', marks: 1195 },
    { ranking: 2, name: 'Jolie Hoskins', marks: 1195 },
    { ranking: 3, name: 'Pennington Joy', marks: 1196 },
    { ranking: 4, name: 'Millie Marsden', marks: 1185 },
    { ranking: 5, name: 'John Smith', marks: 1185 },
  ];

  const fetchAllClasses = async () => {
    try {
      setLoading(true);
      const response = await getClasses();
      setClasses(response.data || []);
      console.log("Classes", response.data);
    } catch (err) {
      setError("Failed to load all classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClasses();
  }, []);

  return (
    <div className="min-h-screen bg-secondar dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar: Greeting & Date */}
        <div className="flex items-center justify-between ">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">👋 Welcome, Naira!</h1>
          <span className="text-gray-500 text-xl dark:text-gray-400">{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        {/* Main Content Row */}
        <div className="flex flex-col w-full justify-between lg:flex-row gap-6 my-6">
          {/* Left: Test Series Card */}
          <div className="w-2/3 bg-primary-white dark:bg-gray-800 rounded-lg shadow p-6 ">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Gate AI–CSE 2026 Online Test Series
            </h2>
            <div className="flex items-center justify-between" >
              <div className="w-2/3" >
                <p className="text-gray-600 dark:text-gray-300 mt-2">56 of 466 completed (18%)</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                  <div className="bg-primary-purple h-2.5 rounded-full" style={{ width: '18%' }}></div>
                </div>
                <button className="mt-4 px-4 py-2 bg-primary-purple text-white rounded hover:bg-primary-purple/80 transition-colors">
                  Resume
                </button>
              </div>
              <img src="/progress.png" alt="Test Series Illustration" className="w-40" />
            </div>
          </div>

          {/* Right: RSuite Calendar */}
          <div className="w-[80%] flex bg-primary-white dark:bg-gray-800 rounded-lg shadow p-4">
            <Calendar compact renderCell={renderCell} onSelect={setSelectedDate} style={{ width: 320 }} />
            {selectedDate && getTodoList(selectedDate).length > 0 ? (
              <div className="mt-4 w-3/4">
                <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-white">Classes</h3>
                <ul className="mt-2 space-y-1 w-full">
                  {getTodoList(selectedDate).map((item) => (
                    <li key={item.time} className="text-sm text-gray-600 border-2 rounded-full px-2 py-1 w-full dark:text-gray-300">
                      <span className="font-bold" >{item.time}</span>  - <a href="#" className="text-primary-purple">{item.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-4 w-3/4 text-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">No classes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">There is no class on the selected date.</p>
              </div>
            )}
          </div>
        </div>
        {/* Tabs */}
        <div className="flex justify-center text-sm space-x-8 border-b border-gray-300 pb-2 mb-4 text-gray-600 dark:text-gray-300">
          <button
            className={`${activeTab === "upcoming-batch"
              ? "text-white px-3 py-2 rounded-xl font-semibold bg-primary-purple"
              : "hover:text-primary-purple bg-gray-100 px-3 py-2 rounded-xl"
              } `}
            onClick={() => setActiveTab("upcoming-batch")}
          >
            Upcoming Batches
            <sup className=" bg-red-500 text-white px-1 py-1 rounded-full ml-1">New</sup>
          </button>
          <button
            className={`${activeTab === "class"
              ? "text-white px-3 py-2 rounded-xl font-semibold bg-primary-purple"
              : "hover:text-primary-purple bg-gray-100 px-3 py-2 rounded-xl"
              } `}
            onClick={() => setActiveTab("class")}
          >
            Classes
          </button>
          <button
            className={`${activeTab === "test"
              ? "text-white px-3 py-2 rounded-xl font-semibold bg-primary-purple"
              : "hover:text-primary-purple bg-gray-100 px-3 py-2 rounded-xl"
              } `}
            onClick={() => setActiveTab("test")}
          >
            Test
          </button>
          <button
            className={`${activeTab === "result"
              ? "text-white px-3 py-2 rounded-xl font-semibold bg-primary-purple"
              : "hover:text-primary-purple bg-gray-100 px-3 py-2 rounded-xl"
              } `}
            onClick={() => setActiveTab("result")}
          >
            Result
          </button>
          <button
            className={`${activeTab === "leaderboard"
              ? "text-white px-3 py-2 rounded-xl font-semibold bg-primary-purple"
              : "hover:text-primary-purple bg-gray-100 px-3 py-2 rounded-xl"
              } `}
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard
          </button>
          <button
            className={`${activeTab === "announcement"
              ? "text-white px-3 py-2 rounded-xl font-semibold bg-primary-purple"
              : "hover:text-primary-purple bg-gray-100 px-3 py-2 rounded-xl"
              } `}
            onClick={() => setActiveTab("announcement")}
          >
            Announcement
          </button>
        </div>

        {/* Conditional content based on active tab */}
        {activeTab === "test" && (
          <>
            <StudentTestList />
            {/* UPCOMING TEST SECTION */}
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-primary-white">
              Upcoming Test
            </h2>
            <div className="space-y-4 mb-6">
              {upcomingTests.length === 0 ? (
                <div className="text-gray-500">No upcoming tests.</div>
              ) : (
                upcomingTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex justify-between bg-primary-purple/70 items-center p-4  dark:bg-gray-800 rounded-lg shadow"
                  >
                    {/* Left side - test info */}
                    <div className="flex flex-col">
                      <h3 className="text-lg font-semibold mb-2 text-white dark:text-primary-white">
                        {test.title}
                      </h3>
                      <div className="flex items-center gap-4">
                        <p className="text-base items-center text-black dark:text-gray-300">
                          <File size={25} className="inline bg-white p-1 text-primary-purple rounded-lg" /> {test.questionsCount} Questions
                        </p>
                        <p className="text-sm m-0 text-black dark:text-gray-300">
                          <Clock size={25} className="inline bg-white p-1 text-primary-purple rounded-lg" /> Duration {test.duration}
                        </p>
                        <p className="text-sm m-0 text-black dark:text-gray-300">
                          <CalendarClock size={25} className="inline bg-white p-1 text-primary-purple rounded-lg" /> Held on {test.date}
                        </p>
                      </div>
                    </div>
                    {/* Right side - status label */}
                    <span className="text-sm font-semibold text-accent-yellow bg-white px-4 py-1 rounded-full">
                      Upcoming
                    </span>
                  </div>
                ))
              )}
              {/* Pagination for upcoming */}
              {upcomingTestsData.length > itemsPerPage && (
                <div className="flex justify-end items-center space-x-4 mt-2">
                  <button
                    onClick={() =>
                      setUpcomingPage((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={upcomingPage === 0}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {upcomingPage + 1} of {maxUpcomingPage + 1}
                  </span>
                  <button
                    onClick={() =>
                      setUpcomingPage((prev) =>
                        Math.min(prev + 1, maxUpcomingPage)
                      )
                    }
                    disabled={upcomingPage === maxUpcomingPage}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* ONGOING TEST SECTION */}
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-primary-white">
              Ongoing Test
            </h2>
            <div className="space-y-4 mb-6">
              {ongoingTests.length === 0 ? (
                <div className="text-gray-500">No ongoing tests.</div>
              ) : (
                ongoingTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex justify-between items-center bg-primary-purple/70 p-4  dark:bg-gray-800 rounded-lg shadow"
                  >
                    {/* Left side - test info */}
                    <div className="flex flex-col">
                      <h3 className="text-lg font-semibold mb-2 text-white dark:text-primary-white">
                        {test.title}
                      </h3>
                      <div className="flex items-center gap-4">
                        <p className="text-base items-center text-black dark:text-gray-300">
                          <File size={25} className="inline bg-white p-1 text-primary-purple rounded-lg" /> {test.questionsCount} Questions
                        </p>
                        <p className="text-sm m-0 text-black dark:text-gray-300">
                          <Clock size={25} className="inline bg-white p-1 text-primary-purple rounded-lg" /> Duration {test.duration}
                        </p>
                        <p className="text-sm m-0 text-black dark:text-gray-300">
                          <CalendarClock size={25} className="inline bg-white p-1 text-primary-purple rounded-lg" /> Held on {test.date}
                        </p>
                      </div>
                    </div>
                    {/* Right side - status and start button */}
                    <div className="flex items-center space-x-4">
                      <span className="px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
                        {test.status}
                      </span>
                      <button className="px-4 py-2 text-primary-purple bg-white rounded-lg hover:bg-primary-purple/30 transition-colors">
                        Start Test
                      </button>
                    </div>
                  </div>
                ))
              )}
              {/* Pagination for ongoing */}
              {ongoingTestsData.length > itemsPerPage && (
                <div className="flex justify-end items-center space-x-4 mt-2">
                  <button
                    onClick={() =>
                      setOngoingPage((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={ongoingPage === 0}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {ongoingPage + 1} of {maxOngoingPage + 1}
                  </span>
                  <button
                    onClick={() =>
                      setOngoingPage((prev) =>
                        Math.min(prev + 1, maxOngoingPage)
                      )
                    }
                    disabled={ongoingPage === maxOngoingPage}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* ATTEMPTED TEST SECTION */}
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-primary-white">
              Attempted Test
            </h2>
            <div className="space-y-4 mb-6">
              {attemptedTests.length === 0 ? (
                <div className="text-gray-500">No attempted tests.</div>
              ) : (
                attemptedTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex justify-between items-center bg-primary-purple/70 p-4  dark:bg-gray-800 rounded-lg shadow"
                  >
                    {/* Left side - test info */}
                    <div className="flex flex-col">
                      <h3 className="text-lg font-semibold mb-2 text-white dark:text-primary-white">
                        {test.title}
                      </h3>
                      <div className="flex items-center gap-4">
                        <p className="text-base items-center text-black dark:text-gray-300">
                          <File size={25} className="inline bg-white p-1 text-primary-purple rounded-lg" /> {test.questionsCount} Questions
                        </p>
                        <p className="text-sm m-0 text-black dark:text-gray-300">
                          <Clock size={25} className="inline bg-white p-1 text-primary-purple rounded-lg" /> Duration {test.duration}
                        </p>
                        <p className="text-sm m-0 text-black dark:text-gray-300">
                          <CalendarClock size={25} className="inline bg-white p-1 text-primary-purple rounded-lg" /> Held on {test.date}
                        </p>
                      </div>
                    </div>
                    {/* Right side - label or result button */}
                    <div className="flex items-center space-x-4">
                      <span className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                        Completed
                      </span>
                      <button className="px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-primary-purple/80 transition-colors">
                        View Result
                      </button>
                    </div>
                  </div>
                ))
              )}
              {/* Pagination for attempted */}
              {attemptedTestsData.length > itemsPerPage && (
                <div className="flex justify-end items-center space-x-4 mt-2">
                  <button
                    onClick={() =>
                      setAttemptedPage((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={attemptedPage === 0}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {attemptedPage + 1} of {maxAttemptedPage + 1}
                  </span>
                  <button
                    onClick={() =>
                      setAttemptedPage((prev) =>
                        Math.min(prev + 1, maxAttemptedPage)
                      )
                    }
                    disabled={attemptedPage === maxAttemptedPage}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* MISSED TEST SECTION */}
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-primary-white">
              Missed Test
            </h2>
            <div className="space-y-4 mb-6">
              {missedTests.length === 0 ? (
                <div className="text-gray-500">No missed tests.</div>
              ) : (
                missedTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex justify-between items-center bg-primary-purple/70 p-4  dark:bg-gray-800 rounded-lg shadow"
                  >
                    {/* Left side - test info */}
                    <div className="flex flex-col">
                      <h3 className="text-lg font-semibold mb-2 text-white dark:text-primary-white">
                        {test.title}
                      </h3>
                      <div className="flex items-center gap-4">
                        <p className="text-base items-center text-black dark:text-gray-300">
                          <File size={25} className="inline bg-white p-1 text-primary-purple rounded-lg" /> {test.questionsCount} Questions
                        </p>
                        <p className="text-sm m-0 text-black dark:text-gray-300">
                          <CalendarClock size={25} className="inline bg-white p-1 text-primary-purple rounded-lg" /> Held on {test.date}
                        </p>
                      </div>
                    </div>
                    {/* Right side - label */}
                    <span className="px-3 py-1 text-sm font-semibold text-red-700 bg-red-100 rounded-full">
                      Missed
                    </span>
                  </div>
                ))
              )}
              {/* Pagination for missed */}
              {missedTestsData.length > itemsPerPage && (
                <div className="flex justify-end items-center space-x-4 mt-2">
                  <button
                    onClick={() =>
                      setMissedPage((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={missedPage === 0}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {missedPage + 1} of {maxMissedPage + 1}
                  </span>
                  <button
                    onClick={() =>
                      setMissedPage((prev) => Math.min(prev + 1, maxMissedPage))
                    }
                    disabled={missedPage === maxMissedPage}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "classes" && (
          <div className="mt-6 space-y-4">
            {loading ? (
              <p>Loading...</p>
            ) : classes.length > 0 ? (
              classes.map((cls) => (
                <div key={cls.class_id} className="flex justify-between items-center border rounded-lg p-5 shadow-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <div className="w-full pr-4">
                    <div className="flex justify-between items-center w-full">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{cls.class_title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        📅 {new Date(cls.class_date_time).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      {cls.recording_url && (
                        <a href={cls.recording_url} className="text-blue-500 flex items-center mt-2 hover:underline" target="_blank" rel="noopener noreferrer">
                          <Video size={18} className="mr-2" />
                          View Recording
                        </a>
                      )}
                      {cls.zoom_meeting_url && (
                        <a href={cls.zoom_meeting_url} className="text-blue-500 flex items-center mt-2 hover:underline" target="_blank" rel="noopener noreferrer">
                          <Video size={18} className="mr-2" />
                          Join Zoom
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center space-x-3 mt-4">
                    <button onClick={() => handleUpdateClass(cls.class_id)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDeleteClass(cls.class_id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No classes available</p>
            )}
          </div>
        )}

        {activeTab === "batch" && (
          <div className="text-gray-700 dark:text-primary-white">
            <EnrolledBatches />
          </div>
        )}

        {activeTab === "result" && (
          <div className="text-gray-700 dark:text-primary-white">
            <AttempedTestList />
          </div>
        )}


        {activeTab === "leaderboard" && (
          <div>
            <Rank />
          </div>
        )}

        {activeTab === "announcement" && (
          <div className="text-gray-700 dark:text-primary-white">
            <Announcement />
          </div>
        )}
      </div>
    </div>
  );
}
