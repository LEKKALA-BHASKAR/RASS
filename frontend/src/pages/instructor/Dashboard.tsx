// frontend/src/pages/instructor/InstructorDashboard.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { courseAPI, assignmentAPI, liveSessionAPI, chatAPI, forumAPI } from "../../services/api";
import { BookOpen, Users, TrendingUp, Plus, Eye, MessageSquare, MessagesSquare } from "lucide-react";
import { Course, Assignment, LiveSession } from "../../types";
import { motion } from "framer-motion";

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
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const courseRes = await courseAPI.getInstructorCourses();
      const coursesData: Course[] = courseRes.data || [];
      setCourses(coursesData);

      // Load assignments + sessions for each course
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

      // Recent Submissions
      const submissionsFlat: RecentSubmission[] = [];
      for (const res of assignmentsResults) {
        const course = res.course;
        const assignments: Assignment[] = res.assignments || [];
        for (const a of assignments) {
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
              studentName: (student as any).name || (student as any).email || "Student",
              content: s.content,
              submittedAt: s.submittedAt || new Date().toISOString(),
            });
          }
        }
      }
      submissionsFlat.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      setRecentSubmissions(submissionsFlat.slice(0, 8));

      // Upcoming Sessions
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
        (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      );
      setUpcomingSessions(sessionsFlat.slice(0, 6));

      // Chats (recent messages)
      const chatRes = await chatAPI.getMentorChats();
      const flatChats = chatRes.data
        .flatMap((c: any) =>
          c.messages.map((m: any) => ({
            ...m,
            student: c.student,
            course: c.course || {},
          }))
        )
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentChats(flatChats.slice(0, 5));

      // Discussions (latest posts)
      if (coursesData.length > 0) {
        const forumRes = await forumAPI.getCourseForums(coursesData[0]._id);
        setRecentDiscussions(forumRes.data.slice(0, 5));
      }
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const totalStudents = courses.reduce((t, c) => t + (c.enrollmentCount || 0), 0);
  const publishedCourses = courses.filter((c) => c.isPublished).length;
  const avgRating =
    courses.reduce((total, c) => total + (c.rating?.average || 0), 0) /
    (courses.length || 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-600">Track courses, students, activity & messages.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/instructor/courses")}
            className="btn-secondary px-4 py-2 hover:shadow-md"
          >
            Manage Courses
          </button>
          <button
            onClick={() => navigate("/instructor/courses?tab=assignments")}
            className="btn-primary flex items-center px-4 py-2 hover:shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" /> New Assignment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.05 }} className="stat-card bg-gradient-to-r from-blue-50 to-blue-100">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Courses</p>
            <p className="text-2xl font-semibold">{courses.length}</p>
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="stat-card bg-gradient-to-r from-green-50 to-green-100">
          <Users className="h-6 w-6 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Students</p>
            <p className="text-2xl font-semibold">{totalStudents}</p>
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="stat-card bg-gradient-to-r from-amber-50 to-amber-100">
          <Eye className="h-6 w-6 text-amber-600" />
          <div>
            <p className="text-sm text-gray-500">Published</p>
            <p className="text-2xl font-semibold">{publishedCourses}</p>
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="stat-card bg-gradient-to-r from-indigo-50 to-indigo-100">
          <TrendingUp className="h-6 w-6 text-indigo-600" />
          <div>
            <p className="text-sm text-gray-500">Avg Rating</p>
            <p className="text-2xl font-semibold">
              {Number.isFinite(avgRating) ? avgRating.toFixed(1) : "0.0"}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions */}
        <motion.div whileHover={{ scale: 1.01 }} className="lg:col-span-2 card p-6 shadow-md hover:shadow-lg transition">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">📑 Recent Submissions</h3>
            <Link to="/instructor/courses?tab=assignments" className="text-primary-600 text-sm">
              View all
            </Link>
          </div>
          {recentSubmissions.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No submissions yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentSubmissions.map((sub, idx) => (
                <motion.li
                  key={sub._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="p-4 border rounded-lg flex justify-between bg-white hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm text-gray-600">
                      {sub.courseTitle} • {sub.assignmentTitle}
                    </p>
                    <p className="font-medium">{sub.studentName}</p>
                    <p className="text-xs text-gray-500 truncate" title={sub.content || ""}>
                      {sub.content || "— no link provided —"}
                    </p>
                  </div>
                  <button
                    className="btn-secondary text-sm"
                    onClick={() =>
                      navigate(`/instructor/courses?course=${sub.courseId}&tab=assignments`)
                    }
                  >
                    Grade
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Sessions */}
        <motion.div whileHover={{ scale: 1.01 }} className="card p-6 shadow-md hover:shadow-lg transition">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">📅 Upcoming Sessions</h3>
            <Link to="/instructor/courses?tab=sessions" className="text-primary-600 text-sm">
              Manage
            </Link>
          </div>
          {upcomingSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sessions scheduled.</p>
          ) : (
            <ul className="space-y-3">
              {upcomingSessions.map((s) => (
                <li key={s._id} className="p-3 border rounded-lg flex justify-between bg-white hover:bg-gray-50">
                  <div>
                    <p className="text-sm text-gray-600">{(s as any).courseTitle}</p>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(s.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    className="btn-primary text-sm"
                    onClick={() => window.open(s.meetingLink || "#", "_blank")}
                  >
                    Join
                  </button>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>

      {/* Chats & Discussions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chats */}
        <motion.div whileHover={{ scale: 1.01 }} className="card p-6 shadow-md hover:shadow-lg transition">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-600" /> Chats
            </h3>
            <Link to="/instructor/chats" className="text-primary-600 text-sm">Open</Link>
          </div>
          {recentChats.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No chat messages yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentChats.map((chat, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="p-3 border rounded-lg bg-white hover:bg-gray-50"
                >
                  <p className="text-sm text-gray-600">{chat.student?.name || "Student"}</p>
                  <p className="text-xs text-gray-500 truncate">{chat.content}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(chat.timestamp).toLocaleTimeString()}
                  </p>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Discussions */}
        <motion.div whileHover={{ scale: 1.01 }} className="card p-6 shadow-md hover:shadow-lg transition">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <MessagesSquare className="h-5 w-5 mr-2 text-green-600" /> Discussions
            </h3>
            <Link to="/instructor/discussions" className="text-primary-600 text-sm">Go</Link>
          </div>
          {recentDiscussions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No discussions started yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentDiscussions.map((d, idx) => (
                <motion.li
                  key={d._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="p-3 border rounded-lg bg-white hover:bg-gray-50"
                >
                  <p className="font-medium">{d.title}</p>
                  <p className="text-sm text-gray-600 truncate">{d.content}</p>
                  <p className="text-xs text-gray-400">by {d.author?.name}</p>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
        <motion.div whileHover={{ scale: 1.01 }} className="card p-6 shadow-md">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            🎫 Support Tickets
          </h3>
          <Link to="/instructor/tickets" className="text-primary-600 text-sm">
            View
          </Link>
        </div>
        <p className="text-gray-500 text-center py-8">View student support tickets here.</p>
      </motion.div>
      <motion.div whileHover={{ scale: 1.01 }} className="card p-6 shadow-md hover:shadow-lg transition">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">👨‍🎓 Students</h3>
          <Link to="/instructor/students" className="text-primary-600 text-sm">Manage</Link>
        </div>
        <p className="text-gray-500 text-center py-8">
          View course admins, students, progress, and submissions.
        </p>
      </motion.div>

      </div>
    </div>
  );
};

export default InstructorDashboard;
