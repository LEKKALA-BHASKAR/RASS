// frontend/src/pages/instructor/InstructorDashboard.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  courseAPI,
  assignmentAPI,
  liveSessionAPI,
  chatAPI,
  forumAPI,
  supportTicketAPI,
} from "../../services/api";
import {
  BookOpen,
  Users,
  TrendingUp,
  Plus,
  Eye,
  MessageSquare,
  MessagesSquare,
  Calendar,
  Clock,
  LifeBuoy,
  FolderOpen,
} from "lucide-react";
import { Course, Assignment, LiveSession, SupportTicket } from "../../types";
import { motion } from "framer-motion";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";

type RecentSubmission = {
  _id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  content?: string;
  submittedAt: string;
};

const InstructorDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<LiveSession[]>([]);
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [recentDiscussions, setRecentDiscussions] = useState<any[]>([]);
  const [recentTickets, setRecentTickets] = useState<SupportTicket[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
    loadTickets();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const courseRes = await courseAPI.getInstructorCourses();
      const coursesData: Course[] = courseRes.data || [];
      setCourses(coursesData);

      const [assignmentsResults, sessionsResults] = await Promise.all([
        Promise.all(
          coursesData.map((c) =>
            assignmentAPI
              .getCourseAssignments(c._id)
              .then((r) => ({ course: c, assignments: r.data }))
              .catch(() => ({ course: c, assignments: [] }))
          )
        ),
        Promise.all(
          coursesData.map((c) =>
            liveSessionAPI
              .getCourseSessions(c._id)
              .then((r) => ({ course: c, sessions: r.data }))
              .catch(() => ({ course: c, sessions: [] }))
          )
        ),
      ]);

      // Submissions
      const submissionsFlat: RecentSubmission[] = [];
      for (const res of assignmentsResults) {
        const course = res.course;
        for (const a of res.assignments || []) {
          for (const s of a.submissions || []) {
            const student =
              typeof s.student === "string"
                ? { _id: s.student, name: "Student" }
                : s.student || { _id: "", name: "Student" };
            submissionsFlat.push({
              _id: s._id || `${a._id}-${student._id}`,
              assignmentId: a._id,
              assignmentTitle: a.title,
              courseId: course._id,
              courseTitle: course.title,
              studentId: student._id,
              studentName:
                (student as any).name || (student as any).email || "Student",
              content: s.content,
              submittedAt: s.submittedAt || new Date().toISOString(),
            });
          }
        }
      }
      submissionsFlat.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      setRecentSubmissions(submissionsFlat.slice(0, 6));

      // Sessions
      const now = new Date();
      const sessionsFlat: LiveSession[] = [];
      for (const res of sessionsResults) {
        for (const s of res.sessions || []) {
          if (s.scheduledAt && new Date(s.scheduledAt) > now) {
            (s as any).courseTitle = res.course.title;
            sessionsFlat.push(s);
          }
        }
      }
      sessionsFlat.sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      );
      setUpcomingSessions(sessionsFlat.slice(0, 5));

      // Chats (limit 3)
      const chatRes = await chatAPI.getMentorChats();
      const flatChats = chatRes.data
        .flatMap((c: any) =>
          c.messages.map((m: any) => ({
            ...m,
            student: c.student,
            course: c.course || {},
          }))
        )
        .sort(
          (a: any, b: any) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      setRecentChats(flatChats.slice(0, 3));

      // Discussions (limit 3)
      if (coursesData.length > 0) {
        const forumRes = await forumAPI.getCourseForums(coursesData[0]._id);
        setRecentDiscussions(forumRes.data.slice(0, 3));
      }
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadTickets = async () => {
    try {
      const res = await supportTicketAPI.getAllTickets();
      const sorted = (res.data || []).sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentTickets(sorted.slice(0, 3));
    } catch (err) {
      console.error("Error loading tickets:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const totalStudents = courses.reduce(
    (t, c) => t + (c.enrollmentCount || 0),
    0
  );
  const publishedCourses = courses.filter((c) => c.isPublished).length;
  const avgRating =
    courses.reduce((total, c) => total + (c.rating?.average || 0), 0) /
    (courses.length || 1);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-2xl shadow-md"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Instructor Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your courses, students & sessions
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => navigate("/instructor/courses")}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
            >
              Manage Courses
            </button>
            <button
              onClick={() => navigate("/instructor/courses?tab=assignments")}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" /> New Assignment
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: <BookOpen className="h-6 w-6 text-blue-600" />,
              label: "Courses",
              value: courses.length,
            },
            {
              icon: <Users className="h-6 w-6 text-green-600" />,
              label: "Students",
              value: totalStudents,
            },
            {
              icon: <Eye className="h-6 w-6 text-amber-600" />,
              label: "Published",
              value: publishedCourses,
            },
            {
              icon: <TrendingUp className="h-6 w-6 text-indigo-600" />,
              label: "Avg Rating",
              value: avgRating.toFixed(1),
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4"
            >
              <div className="p-3 bg-gray-100 rounded-xl">{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Assigned Courses */}
        <motion.div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <FolderOpen className="h-5 w-5 mr-2 text-purple-600" /> Assigned
              Courses
            </h3>
            <Link
              to="/instructor/courses"
              className="text-sm text-indigo-600 hover:underline"
            >
              View All
            </Link>
          </div>
          {courses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              You don't have any assigned courses yet.
            </p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((c) => (
                <li
                  key={c._id}
                  className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                >
                  <p className="font-medium text-gray-900 truncate">{c.title}</p>
                  <p className="text-sm text-gray-500">
                    {c.enrollmentCount || 0} students
                  </p>
                  <button
                    onClick={() => navigate("/instructor/courses")}
                    className="mt-3 w-full bg-indigo-600 text-white rounded-lg py-1.5 text-sm hover:bg-indigo-700"
                  >
                    Manage
                  </button>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chats */}
          <motion.div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600" /> Recent
                Chats
              </h3>
              <Link
                to="/instructor/chats"
                className="text-sm text-indigo-600 hover:underline"
              >
                Open
              </Link>
            </div>
            {recentChats.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No chat activity.</p>
            ) : (
              <ul className="space-y-3">
                {recentChats.map((c, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    <p className="text-sm font-medium">
                      {c.student?.name || "Student"}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {c.content}
                    </p>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Discussions */}
          <motion.div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MessagesSquare className="h-5 w-5 mr-2 text-green-600" /> Recent
                Discussions
              </h3>
              <Link
                to="/instructor/discussions"
                className="text-sm text-indigo-600 hover:underline"
              >
                View
              </Link>
            </div>
            {recentDiscussions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No active discussions.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentDiscussions.map((d, i) => (
                  <motion.li
                    key={d._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    <p className="font-medium">{d.title}</p>
                    <p className="text-sm text-gray-600 truncate">{d.content}</p>
                    <p className="text-xs text-gray-400">by {d.author?.name}</p>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Support Tickets */}
          <motion.div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <LifeBuoy className="h-5 w-5 mr-2 text-red-600" /> Support
                Tickets
              </h3>
              <Link
                to="/instructor/tickets"
                className="text-sm text-indigo-600 hover:underline"
              >
                View All
              </Link>
            </div>
            {recentTickets.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                Manage all the Support Tickets Here.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentTickets.map((t) => (
                  <li
                    key={t._id}
                    className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {t.subject}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
                        {t.status}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full capitalize">
                        {t.priority}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Students */}
          <motion.div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-600" /> Students & Handlers
              </h3>
              <Link
                to="/instructor/students"
                className="text-sm text-indigo-600 hover:underline"
              >
                Manage
              </Link>
            </div>
            {totalStudents === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No students enrolled yet.
              </p>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  View Students and Handlers : {totalStudents}
                </p>
                <ul className="space-y-2">
                  {courses
                    .flatMap((c) => c.students || [])
                    .slice(0, 3)
                    .map((s: any) => (
                      <li
                        key={s._id}
                        className="p-2 border rounded-lg bg-gray-50"
                      >
                        <p className="font-medium text-sm">
                          {s.name || "Unnamed Student"}
                        </p>
                        <p className="text-xs text-gray-500">{s.email}</p>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InstructorDashboard;
