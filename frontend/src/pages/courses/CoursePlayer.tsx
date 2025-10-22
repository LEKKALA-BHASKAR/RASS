import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  PlayCircle,
  CheckCircle,
  FileText,
  Video,
  Calendar,
  Clock,
} from "lucide-react";

import {
  courseAPI,
  enrollmentAPI,
  forumAPI,
  liveSessionAPI,
} from "../../services/api";
import { Course, Enrollment, ForumPost } from "../../types";
import DiscussionForum from "../student/diss";
import Chat from "../student/Chat";
import SupportTickets from "../student/SupportTicketsPage";

const CoursePlayer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "discussions"
    | "live-sessions"
    | "resources"
    | "chat"
    | "support"
  >("overview");
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, enrollmentsRes, forumRes, sessionsRes] =
        await Promise.all([
          courseAPI.getCourse(courseId!),
          enrollmentAPI.getMyEnrollments(),
          forumAPI.getCourseForums(courseId!),
          liveSessionAPI.getCourseSessions(courseId!),
        ]);

      setCourse(courseRes.data);
      const userEnrollment = enrollmentsRes.data.find(
        (e: Enrollment) => e.course._id === courseId
      );
      setEnrollment(userEnrollment || null);
      setForumPosts(forumRes.data);
      setSessions(sessionsRes.data || []);
    } catch (error) {
      console.error("Error fetching course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleComplete = async (moduleId: string) => {
    try {
      await enrollmentAPI.updateProgress({
        courseId,
        moduleId,
        completed: true,
        watchTime: course?.modules[currentModule]?.duration || 0,
      });
      await fetchCourseData();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course not accessible
          </h2>
          <p className="text-gray-600">
            Please enroll in this course to access the content.
          </p>
        </div>
      </div>
    );
  }

  const currentModuleData = course.modules[currentModule];
  const isCurrentModuleCompleted =
    enrollment.progress.find((p) => p.moduleId === currentModuleData?._id)
      ?.completed || false;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-4">
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-1 bg-white border-r border-gray-200 h-screen overflow-y-auto"
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {course.title}
              </h2>
            </div>

            <div className="px-6 pb-6 space-y-2">
              {course.modules.map((module, index) => {
                const moduleProgress = enrollment.progress.find(
                  (p) => p.moduleId === module._id
                );
                const isCompleted = moduleProgress?.completed || false;

                return (
                  <motion.div
                    key={module._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg cursor-pointer flex items-center space-x-3 transition ${
                      currentModule === index
                        ? "bg-indigo-50 border border-indigo-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentModule(index)}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <PlayCircle className="h-5 w-5 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {module.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {module.duration} min
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="lg:col-span-3 px-6 py-6 space-y-8">
            {/* Video Player */}
            <div className="rounded-xl overflow-hidden shadow-lg bg-black">
              {currentModuleData?.videoUrl ? (
                <ReactPlayer
                  url={currentModuleData.videoUrl}
                  controls
                  width="100%"
                  height="540px"
                  playing={false}
                  config={{
                    file: {
                      attributes: {
                        preload: 'auto',
                        controlsList: 'nodownload',
                      },
                    },
                    youtube: {
                      playerVars: {
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                      },
                    },
                  }}
                  onEnded={() => handleModuleComplete(currentModuleData._id)}
                />
              ) : (
                <div className="h-[420px] flex items-center justify-center bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
                  <PlayCircle className="h-16 w-16 opacity-60" />
                  <p className="ml-3 text-lg">Video content coming soon</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-white border px-6 py-4 rounded-lg shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {currentModuleData?.title}
                </h3>
                <p className="text-gray-600">
                  {currentModuleData?.description}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentModule === 0}
                    onClick={() => setCurrentModule(currentModule - 1)}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px]"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentModule === course.modules.length - 1}
                    onClick={() => setCurrentModule(currentModule + 1)}
                    className="px-5 py-2.5 rounded-lg border border-indigo-600 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px]"
                  >
                    Next
                  </button>
                </div>
                {!isCurrentModuleCompleted && (
                  <button
                    onClick={() =>
                      handleModuleComplete(currentModuleData._id)
                    }
                    className="px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium flex items-center gap-2 hover:bg-green-700 transition-colors min-w-[160px] justify-center"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark Complete
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white px-6 py-4 rounded-lg shadow-sm border">
              <div className="flex gap-3 flex-wrap">
                {[
                  { key: "overview", label: "Overview" },
                  { key: "discussions", label: "Discussions" },
                  { key: "live-sessions", label: "Live Sessions" },
                  { key: "resources", label: "Resources" },
                  { key: "chat", label: "Chat with Mentor" },
                  { key: "support", label: "Support Tickets" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      activeTab === tab.key
                        ? "bg-indigo-600 text-white shadow"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow"
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "overview" && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Module Overview
                  </h4>
                  <p className="text-gray-700 mb-6">
                    {currentModuleData?.description}
                  </p>
                  {currentModuleData?.resources?.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">
                        Resources
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentModuleData.resources.map((resource, index) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm"
                          >
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-gray-900 text-sm">
                              {resource.title}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "discussions" && (
                <DiscussionForum courseId={course._id} />
              )}

              {activeTab === "live-sessions" && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Live Sessions
                  </h4>
                  {sessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sessions.map((session) => (
                        <motion.div
                          key={session._id}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900 flex items-center">
                                <Video className="h-5 w-5 text-red-500 mr-2" />
                                {session.title}
                              </h5>
                              <p className="text-sm text-gray-600 mt-1">
                                {session.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(
                                  session.scheduledAt
                                ).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-1" />
                                Duration: {session.duration} mins
                              </p>
                            </div>
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                            >
                              Join
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      No live sessions scheduled for this course.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "resources" && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Course Resources
                  </h4>
                  {course.modules.some((m) => m.resources?.length > 0) ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {course.modules.flatMap((m) =>
                        m.resources?.map((res, idx) => (
                          <a
                            key={idx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm"
                          >
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-gray-900 text-sm">
                              {res.title}
                            </span>
                          </a>
                        )) || []
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600">No resources available.</p>
                  )}
                </div>
              )}

              {/* Chat with Mentor */}
              {activeTab === "chat" && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Chat with Mentor
                  </h4>
                  <div className="border rounded-lg overflow-hidden">
                    <Chat courseId={course._id} embedded />
                  </div>
                </div>
              )}

              {/* Support Tickets */}
              {activeTab === "support" && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Support Tickets
                  </h4>
                  <div className="border rounded-lg overflow-hidden">
                    <SupportTickets courseId={course._id} embedded />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CoursePlayer;
