import {
  CalendarClock,
  Clock,
  File,
  Video,
  Pencil,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge, Calendar } from "rsuite";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import AttempedTestList from "./AttempedTestList";
import Announcement from "../../components/Announcement";
import StudentTestList from "./StudentTestList";
import EnrolledBatches from "./EnrolledBatches";
import Rank from "./Rank";
import { getClasses, getFileStream } from "../../api/auth";

// Function to get classes for a specific date
function getClassesForDate(date, classes) {
  if (!date || !classes || !classes.length) return [];

  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  return classes.filter((cls) => {
    const classDate = new Date(cls.class_date_time);
    classDate.setHours(0, 0, 0, 0);
    return classDate.getTime() === selectedDate.getTime();
  });
}

// Function to check if a date has classes
function hasClasses(date, classes) {
  return getClassesForDate(date, classes).length > 0;
}

// Helper for pagination
const itemsPerPage = 3;

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("class");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [videoUrl, setVideoUrl] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  // Initialize empty arrays for test data that will come from API
  const upcomingTests = [];
  const ongoingTests = [];
  const attemptedTests = [];
  const missedTests = [];

  const maxUpcomingPage = 0;
  const maxOngoingPage = 0;
  const maxAttemptedPage = 0;
  const maxMissedPage = 0;
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Custom cell renderer to show dots for dates with classes
  const renderCell = (date) => {
    const hasClass = hasClasses(date, classes);

    return (
      <div className="relative w-full h-full">
        {hasClass && (
          <div className="absolute bottom-4 right-0 h-2 w-2 rounded-full bg-primary-purple"></div>
        )}
      </div>
    );
  };

  const leaderboardData = [
    { ranking: 1, name: "John Smith", marks: 1195 },
    { ranking: 2, name: "Jolie Hoskins", marks: 1195 },
    { ranking: 3, name: "Pennington Joy", marks: 1196 },
    { ranking: 4, name: "Millie Marsden", marks: 1185 },
    { ranking: 5, name: "John Smith", marks: 1185 },
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
    <div className="min-h-screen bg-secondar dark:bg-gray-900 p-6 mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar: Greeting & Date */}
        <div className="flex items-center justify-between ">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            👋 Welcome, Naira!
          </h1>
          <span className="text-gray-500 text-xl dark:text-gray-400">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Main Content Row */}
        <div className="flex flex-col w-full justify-between lg:flex-row gap-6 my-6">
          {/* Left: Test Series Card */}
          <div className="w-2/3 bg-primary-white dark:bg-gray-800 rounded-lg shadow p-6 ">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Gate AI–CSE 2026 Online Test Series
            </h2>
            <div className="flex items-center justify-between">
              <div className="w-2/3">
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  56 of 466 completed (18%)
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-primary-purple h-2.5 rounded-full"
                    style={{ width: "18%" }}
                  ></div>
                </div>
                <button className="mt-4 px-4 py-2 bg-primary-purple text-white rounded hover:bg-primary-purple/80 transition-colors">
                  Resume
                </button>
              </div>
              <img
                src="/progress.png"
                alt="Test Series Illustration"
                className="w-40"
              />
            </div>
          </div>

          {/* Right: RSuite Calendar */}
          <div className="w-[80%] flex bg-primary-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="relative">
              <div className="rs-theme-dark">
                <style jsx global>{`
                  /* Hover styles */
                  .rs-calendar-table-cell:hover
                    .rs-calendar-table-cell-content {
                    background-color: #f3f4f6 !important; /* light gray for light mode */
                  }
                  .rs-calendar-table-cell:hover .rs-calendar-table-cell-day {
                    color: #1f2937 !important; /* dark text for better contrast */
                  }
                  .dark
                    .rs-calendar-table-cell:hover
                    .rs-calendar-table-cell-content {
                    background-color: #374151 !important; /* darker gray for dark mode */
                  }
                  .dark
                    .rs-calendar-table-cell:hover
                    .rs-calendar-table-cell-day {
                    color: #f9fafb !important; /* light text for dark mode */
                  }

                  /* Calendar header and navigation */
                  .rs-calendar-header-title {
                    color: #000000 !important; /* Black text for month/year */
                  }
                  .rs-calendar-header-backward,
                  .rs-calendar-header-forward {
                    color: #000000 !important; /* Black arrows */
                  }
                  .rs-calendar-header-backward:hover,
                  .rs-calendar-header-forward:hover {
                    color: #4b5563 !important; /* Slightly lighter on hover */
                  }

                  /* Week day names */
                  .rs-calendar-table-header-row .rs-calendar-table-cell {
                    color: #000000 !important; /* Black text for week days */
                  }

                  /* Ensure text remains black in dark mode */
                  .dark .rs-calendar-header-title,
                  .dark .rs-calendar-header-backward,
                  .dark .rs-calendar-header-forward,
                  .dark .rs-calendar-table-header-row .rs-calendar-table-cell {
                    color: #000000 !important;
                  }
                `}</style>
                <Calendar
                  compact
                  renderCell={renderCell}
                  onSelect={setSelectedDate}
                  value={selectedDate}
                  style={{ width: 320 }}
                  className="pr-4"
                  cellClass={(date) =>
                    "relative hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                />
              </div>
              {/* <div className="absolute bottom-0 left-6">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary-purple mr-1"></div>
                  <span className="text-xs text-gray-500">Class</span>
                </div>
              </div> */}
            </div>
            <div className="flex-1 pl-4 overflow-y-auto max-h-80 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white my-2">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>

              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-purple"></div>
                </div>
              ) : (
                <div className="space-y-3 mb-2 pr-2">
                  {getClassesForDate(selectedDate, classes).length > 0 ? (
                    getClassesForDate(selectedDate, classes).map((cls) => {
                      const classTime = new Date(cls.class_date_time);
                      const timeString = classTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      });

                      return (
                        <div
                          key={cls.class_id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 py-2 border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm dark:text-white">
                                {cls.class_title}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                                🕒 {timeString}
                              </p>
                            </div>
                            {cls.class_url && (
                              <a
                                href={cls.class_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-primary-purple hover:bg-primary-purple/90"
                              >
                                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                Join Class
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700">
                        <CalendarClock className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        No classes scheduled
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        There are no classes scheduled for this date.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex justify-center text-sm space-x-8 border-b border-gray-300 pb-2 mb-4 text-gray-600 dark:text-gray-300">
          <button
            className={`${
              activeTab === "upcoming-batch"
                ? "text-white px-3 py-2 rounded-xl font-semibold bg-primary-purple"
                : "hover:text-primary-purple bg-gray-100 px-3 py-2 rounded-xl"
            } `}
            onClick={() => setActiveTab("upcoming-batch")}
          >
            Upcoming Batches
            <sup className=" bg-red-500 text-white px-1 py-1 rounded-full ml-1">
              New
            </sup>
          </button>
          <button
            className={`${
              activeTab === "class"
                ? "text-white px-3 py-2 rounded-xl font-semibold bg-primary-purple"
                : "hover:text-primary-purple bg-gray-100 px-3 py-2 rounded-xl"
            } `}
            onClick={() => setActiveTab("class")}
          >
            Classes
          </button>
          <button
            className={`${
              activeTab === "test"
                ? "text-white px-3 py-2 rounded-xl font-semibold bg-primary-purple"
                : "hover:text-primary-purple bg-gray-100 px-3 py-2 rounded-xl"
            } `}
            onClick={() => setActiveTab("test")}
          >
            Test
          </button>
          <button
            className={`${
              activeTab === "result"
                ? "text-white px-3 py-2 rounded-xl font-semibold bg-primary-purple"
                : "hover:text-primary-purple bg-gray-100 px-3 py-2 rounded-xl"
            } `}
            onClick={() => setActiveTab("result")}
          >
            Result
          </button>
          <button
            className={`${
              activeTab === "leaderboard"
                ? "text-white px-3 py-2 rounded-xl font-semibold bg-primary-purple"
                : "hover:text-primary-purple bg-gray-100 px-3 py-2 rounded-xl"
            } `}
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard
          </button>
          <button
            className={`${
              activeTab === "announcement"
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
          </>
        )}

        {activeTab === "class" && (
          <div className="mt-6 space-y-4">
            {/* Video Player Modal */}
            <Transition appear show={showVideo} as={Fragment}>
              <Dialog as="div" className="relative z-50" onClose={() => {
                setShowVideo(false);
                if (videoUrl) {
                  URL.revokeObjectURL(videoUrl);
                  setVideoUrl(null);
                }
              }}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                        <div className="flex justify-between items-center mb-4">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                          >
                            Class Recording
                          </Dialog.Title>
                          <button
                            type="button"
                            className="rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
                            onClick={() => {
                              setShowVideo(false);
                              if (videoUrl) {
                                URL.revokeObjectURL(videoUrl);
                                setVideoUrl(null);
                              }
                            }}
                          >
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="mt-2">
                          <video
                            controls
                            autoPlay
                            controlsList="nodownload"
                            className="w-full rounded-lg bg-black aspect-video"
                            src={videoUrl}
                          />
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-purple"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Loading classes...
                  </p>
                </div>
              ) : classes.length > 0 ? (
                classes.map((cls) => (
                  <div
                    key={cls.class_id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {cls.class_title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            🗓️{" "}
                            {new Date(cls.class_date_time).toLocaleString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                        {new Date(cls.class_date_time) > new Date() ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Upcoming
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Completed
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        {cls.class_url && (
                          <a
                            href={cls.class_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-purple hover:bg-primary-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple"
                          >
                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                            Join Class
                          </a>
                        )}

                        {cls.recording_url &&
                          cls.recording_url !== "string" && (
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                try {
                                  setLoading(true);
                                  const blob = await getFileStream(
                                    cls.recording_url
                                  );
                                  const url = URL.createObjectURL(blob);
                                  setVideoUrl(url);
                                  setShowVideo(true);
                                } catch (error) {
                                  console.error("Error fetching video:", error);
                                  // Handle error (e.g., show error message)
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                              disabled={loading}
                            >
                              <Video className="h-3.5 w-3.5 mr-1.5" />
                              {loading ? "Loading..." : "View Recording"}
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700">
                    <CalendarClock className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No classes scheduled
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You don't have any classes scheduled yet.
                  </p>
                </div>
              )}
            </div>
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
