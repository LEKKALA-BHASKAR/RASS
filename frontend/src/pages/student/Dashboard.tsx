import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  enrollmentAPI,
  notificationAPI,
  assignmentAPI,
} from "../../services/api";
import {
  BookOpen,
  Calendar,
  Award,
  Bell,
  Play,
  Clock,
  ChevronRight,
  Users,
  MessageSquare,
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Enrollment, Notification, Assignment } from "../../types";
import { motion } from "framer-motion";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsOpen, setStatsOpen] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [enrollmentsRes, notificationsRes] = await Promise.all([
        enrollmentAPI.getMyEnrollments(),
        notificationAPI.getNotifications(),
      ]);

      setEnrollments(enrollmentsRes.data);
      setNotifications(notificationsRes.data.slice(0, 5));

      const assignmentsAll: Assignment[] = [];
      for (const e of enrollmentsRes.data) {
        const courseId = typeof e.course === "string" ? e.course : e.course._id;
        const res = await assignmentAPI.getCourseAssignments(courseId);
        assignmentsAll.push(...res.data);
      }
      setAssignments(assignmentsAll);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const completedCourses = enrollments.filter((e) => e.completed);
  const inProgressCourses = enrollments.filter((e) => !e.completed);
  const totalWatchTime = enrollments.reduce(
    (total, e) =>
      total + e.progress.reduce((sum, p) => sum + (p.watchTime || 0), 0),
    0
  );

  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <header className="text-center sm:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900"
          >
            Welcome back, {user?.name}!
          </motion.h1>
          <p className="text-lg text-gray-600 mt-2">
            Track your progress and continue learning
          </p>
          <div className="flex justify-center sm:justify-start items-center mt-4 text-gray-500">
            <Calendar className="h-5 w-5 mr-2" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Quick Links*/}
          <section>
            <div className="flex flex-wrap gap-3">
              {[
                { name: "Courses", icon: BookOpen, path: "/courses", type: null },
                { name: "Profile", icon: Users, path: "/profile", type: null },
                { name: "Assignments", icon: FileText, path: "/student/assignments", type: "assignment" },
                { name: "Support", icon: MessageSquare, path: "/support-tickets", type: "support" },
                { name: "Discussions", icon: MessageSquare, path: "/student/discussion-forum", type: "discussion" },
                { name: "Chat", icon: MessageSquare, path: "/student/chat", type: "chat" },
                { name: "Live Sessions", icon: Video, path: "/student/live-sessions", type: "live-session" },
              ].map((item, idx) => {
                const Icon = item.icon;
                const unreadCount = item.type
                  ? notifications.filter((n) => !n.read && n.type === item.type).length
                  : 0;

                return (
                  <Link
                    key={idx}
                    to={item.path}
                    className="relative flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:bg-indigo-50 transition"
                  >
                    <Icon className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>

                    {/* Unread Notification Badge */}
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full shadow">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>


        {/* Stats - collapsible KPI bar */}
        <section>
          <div className="bg-white rounded-xl shadow p-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setStatsOpen(!statsOpen)}
            >
              <h3 className="text-sm font-semibold text-gray-800">Your Stats</h3>
              {statsOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
            {statsOpen && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    icon: <BookOpen className="h-6 w-6 text-blue-600" />,
                    label: "Enrolled",
                    value: enrollments.length,
                  },
                  {
                    icon: <Play className="h-6 w-6 text-green-600" />,
                    label: "In Progress",
                    value: inProgressCourses.length,
                  },
                  {
                    icon: <Award className="h-6 w-6 text-amber-600" />,
                    label: "Completed",
                    value: completedCourses.length,
                  },
                  {
                    icon: <Clock className="h-6 w-6 text-indigo-600" />,
                    label: "Watch Time",
                    value: `${Math.round(totalWatchTime / 3600)}h`,
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center bg-gray-50 rounded-lg p-3"
                  >
                    {stat.icon}
                    <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Continue Learning */}
        <section>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
              <Link
                to="/courses"
                className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
              >
                Browse All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {inProgressCourses.length > 0 ? (
              <div className="space-y-4">
                {inProgressCourses.slice(0, 2).map((e) => {
                  const course =
                    typeof e.course === "string" ? { _id: e.course } : e.course;

                  return (
                    <motion.div
                      key={e._id}
                      whileHover={{ scale: 1.02 }}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md bg-gradient-to-r from-white to-indigo-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {(course as any).title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            by {(course as any).instructor?.name}
                          </p>

                          {/* Progress bar */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{e.completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${e.completionPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <Link
                          to={`/learn/${course._id}`}
                          className="ml-6 px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:shadow-lg"
                        >
                          Continue
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No active courses right now.</p>
            )}
          </div>
        </section>

        {/* Notifications */}
        <section>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Notifications
              </h3>
              <Bell className="h-5 w-5 text-gray-400" />
            </div>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((n) => (
                  <motion.div
                    key={n._id}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg"
                  >
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No new notifications</p>
            )}
          </div>
        </section>
      </div>
      </div>
            <Footer />
    </div>

  );
};

export default StudentDashboard;
