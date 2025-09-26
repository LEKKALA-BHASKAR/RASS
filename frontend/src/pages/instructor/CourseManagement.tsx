// frontend/src/pages/instructor/CourseManagement.tsx
import React, { useState, useEffect } from "react";
import { courseAPI, assignmentAPI, liveSessionAPI } from "../../services/api";
import { Plus, Edit, Trash2, Users, FileText, X } from "lucide-react";
import { Course, Assignment, LiveSession, Module } from "../../types";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
/* ----- Form Types ----- */
type AssignmentForm = Partial<
  Pick<Assignment, "title" | "description" | "dueDate" | "maxPoints" | "instructions">
>;
type SessionForm = Partial<
  Pick<LiveSession, "title" | "description" | "scheduledAt" | "duration" | "meetingLink">
>;
type ModuleForm = Partial<Pick<Module, "title" | "description" | "videoUrl" | "duration" | "order" | "resources">>;

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400";

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [modules, setModules] = useState<Module[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);

  const [activeTab, setActiveTab] = useState<"overview" | "assignments" | "sessions">("overview");
  const [loading, setLoading] = useState(false);

  /* Edit States */
  const [editModule, setEditModule] = useState<Module | null>(null);
  const [editAssignment, setEditAssignment] = useState<Assignment | null>(null);
  const [editSession, setEditSession] = useState<LiveSession | null>(null);

  /* Modal & Form States */
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [newModule, setNewModule] = useState<ModuleForm>({ title: "", description: "", videoUrl: "", duration: 0, order: 1, resources: [] });

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState<AssignmentForm>({ title: "", description: "", dueDate: "", maxPoints: 100, instructions: "" });

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [newSession, setNewSession] = useState<SessionForm>({ title: "", description: "", scheduledAt: "", duration: 60, meetingLink: "" });

  /* Grading */
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedAssignmentForGrading, setSelectedAssignmentForGrading] = useState<Assignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await courseAPI.getInstructorCourses();
      setCourses(res.data || []);
      if (res.data && res.data.length > 0 && !selectedCourse) {
        handleSelectCourse(res.data[0]);
      }
    } catch (err) {
      console.error("fetchCourses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    fetchCourseData(course._id);
  };

  const fetchCourseData = async (courseId: string) => {
    try {
      const [assignRes, sessRes, courseRes] = await Promise.all([
        assignmentAPI.getCourseAssignments(courseId),
        liveSessionAPI.getCourseSessions(courseId),
        courseAPI.getCourse(courseId),
      ]);

      setAssignments(assignRes.data || []);
      setLiveSessions(sessRes.data || []);
      setModules(courseRes.data.modules || []);
    } catch (err) {
      console.error("fetchCourseData:", err);
    }
  };

  /* ----- Modules CRUD ----- */
  const resetModuleForm = () => setNewModule({ title: "", description: "", videoUrl: "", duration: 0, order: 1, resources: [] });

  const prepareModuleForEdit = (m: Module) => {
    setEditModule(m);
    setNewModule({
      title: m.title,
      description: m.description,
      videoUrl: m.videoUrl,
      duration: m.duration,
      order: m.order,
      resources: m.resources || [],
    });
    setShowModuleModal(true);
  };

  const handleCreateOrUpdateModule = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedCourse) return;
    try {
      if (editModule) {
        await courseAPI.updateModule(selectedCourse._id, editModule._id, newModule);
      } else {
        await courseAPI.createModule(selectedCourse._id, newModule);
      }
      setShowModuleModal(false);
      setEditModule(null);
      resetModuleForm();
      fetchCourseData(selectedCourse._id);
    } catch (err) {
      console.error("handleCreateOrUpdateModule:", err);
      alert("Failed to save module.");
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!selectedCourse) return;
    if (!confirm("Delete module? This action cannot be undone.")) return;
    try {
      await courseAPI.deleteModule(selectedCourse._id, id);
      fetchCourseData(selectedCourse._id);
    } catch (err) {
      console.error("handleDeleteModule:", err);
      alert("Failed to delete module.");
    }
  };

  /* ----- Assignments CRUD ----- */
  const resetAssignmentForm = () => setNewAssignment({ title: "", description: "", dueDate: "", maxPoints: 100, instructions: "" });
  const prepareAssignmentForEdit = (a: Assignment) => {
    setEditAssignment(a);
    setNewAssignment({
      title: a.title,
      description: a.description,
      dueDate: a.dueDate ? new Date(a.dueDate).toISOString().slice(0, 16) : "",
      maxPoints: a.maxPoints,
      instructions: a.instructions,
    });
    setShowAssignmentModal(true);
  };

  const handleCreateOrUpdateAssignment = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedCourse) return;
    try {
      if (editAssignment) {
        await assignmentAPI.updateAssignment(editAssignment._id, newAssignment);
      } else {
        const payload: any = { ...newAssignment, course: selectedCourse._id };
        if (modules.length > 0) payload.module = modules[0]._id;
        await assignmentAPI.createAssignment(payload);
      }
      setShowAssignmentModal(false);
      setEditAssignment(null);
      resetAssignmentForm();
      fetchCourseData(selectedCourse._id);
    } catch (err) {
      console.error("handleCreateOrUpdateAssignment:", err);
      alert("Failed to save assignment.");
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!selectedCourse) return;
    if (!confirm("Delete assignment?")) return;
    try {
      await assignmentAPI.deleteAssignment(id);
      fetchCourseData(selectedCourse._id);
    } catch (err) {
      console.error("handleDeleteAssignment:", err);
      alert("Failed to delete assignment.");
    }
  };

  /* ----- Sessions CRUD ----- */
  const resetSessionForm = () => setNewSession({ title: "", description: "", scheduledAt: "", duration: 60, meetingLink: "" });
  const prepareSessionForEdit = (s: LiveSession) => {
    setEditSession(s);
    setNewSession({
      title: s.title,
      description: s.description,
      scheduledAt: s.scheduledAt ? new Date(s.scheduledAt).toISOString().slice(0, 16) : "",
      duration: s.duration,
      meetingLink: s.meetingLink,
    });
    setShowSessionModal(true);
  };

  const handleCreateOrUpdateSession = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedCourse) return;
    try {
      if (editSession) {
        await liveSessionAPI.updateSession(editSession._id, { ...newSession, course: selectedCourse._id });
      } else {
        await liveSessionAPI.createSession(selectedCourse._id, {
          ...newSession,
          scheduledAt: newSession.scheduledAt ? new Date(newSession.scheduledAt).toISOString() : undefined,
        });
      }
      setShowSessionModal(false);
      setEditSession(null);
      resetSessionForm();
      fetchCourseData(selectedCourse._id);
      alert("Session saved.");
    } catch (err) {
      console.error("handleCreateOrUpdateSession:", err);
      alert("Failed to save session.");
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!selectedCourse) return;
    if (!confirm("Delete session?")) return;
    try {
      await liveSessionAPI.deleteSession(id);
      fetchCourseData(selectedCourse._id);
    } catch (err) {
      console.error("handleDeleteSession:", err);
      alert("Failed to delete session.");
    }
  };

  /* ----- Grading ----- */
  const openGrading = (assignment: Assignment) => {
    setSelectedAssignmentForGrading(assignment);
    setSelectedSubmission(null);
    setGrade(0);
    setFeedback("");
    setShowGradeModal(true);
  };

  const handleSaveGrade = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedAssignmentForGrading || !selectedSubmission) return;
    try {
      await assignmentAPI.gradeAssignment(selectedAssignmentForGrading._id, {
        studentId: selectedSubmission.student._id,
        grade,
        feedback,
      });
      alert("Grade saved.");
      setShowGradeModal(false);
      if (selectedCourse?._id) fetchCourseData(selectedCourse._id);
    } catch (err) {
      console.error("handleSaveGrade:", err);
      alert("Failed to save grade.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchCourses()}
            className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              // quick create fallback: pick first course
              if (courses[0]) {
                setSelectedCourse(courses[0]);
                setActiveTab("overview");
              }
            }}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Courses */}
        <motion.aside layout className="lg:col-span-1 bg-white rounded-2xl shadow p-4">
          <h3 className="text-sm font-semibold mb-3">Your Courses</h3>
          <div className="space-y-2">
            {courses.map((c) => (
              <button
                key={c._id}
                onClick={() => handleSelectCourse(c)}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                  selectedCourse?._id === c._id ? "bg-indigo-50 border border-indigo-100" : "hover:bg-gray-50"
                }`}
              >
                <div>
                  <p className="font-medium text-sm">{c.title}</p>
                  <p className="text-xs text-gray-500">{c.enrollmentCount || 0} students</p>
                </div>
                <div className="text-xs text-gray-400">₹{c.price || 0}</div>
              </button>
            ))}
            {courses.length === 0 && <p className="text-xs text-gray-500">No courses yet</p>}
          </div>
        </motion.aside>

        {/* Main area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Course header */}
          {selectedCourse ? (
            <>
              <motion.div layout className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedCourse.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedCourse.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" /> <span>{selectedCourse.enrollmentCount || 0}</span>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${selectedCourse.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                          {selectedCourse.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveTab("overview");
                      }}
                      className={`px-3 py-2 rounded-md text-sm ${activeTab === "overview" ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-50"}`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab("assignments")}
                      className={`px-3 py-2 rounded-md text-sm ${activeTab === "assignments" ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-50"}`}
                    >
                      Assignments
                    </button>
                    <button
                      onClick={() => setActiveTab("sessions")}
                      className={`px-3 py-2 rounded-md text-sm ${activeTab === "sessions" ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-50"}`}
                    >
                      Sessions
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Active tab content */}
              <motion.div layout className="bg-white rounded-2xl shadow p-6">
                {activeTab === "overview" && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Course Modules</h3>
                      <button
                        onClick={() => {
                          resetModuleForm();
                          setEditModule(null);
                          setShowModuleModal(true);
                        }}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" /> Add Module
                      </button>
                    </div>

                    <div className="space-y-3">
                      {modules.map((m) => (
                        <motion.div key={m._id} layout className="p-4 border rounded-lg flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{m.title}</h4>
                            <p className="text-sm text-gray-600">{m.description}</p>
                            <p className="text-xs text-gray-400 mt-2">{m.duration} min • Order {m.order}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditModule(m);
                                setNewModule(m);
                                setShowModuleModal(true);
                              }}
                              className="px-3 py-1 border rounded-md"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteModule(m._id)} className="px-3 py-1 border rounded-md">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                      {modules.length === 0 && <p className="text-sm text-gray-500">No modules yet</p>}
                    </div>
                  </>
                )}

                {activeTab === "assignments" && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Assignments</h3>
                      <button
                        onClick={() => {
                          resetAssignmentForm();
                          setEditAssignment(null);
                          setShowAssignmentModal(true);
                        }}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" /> Create Assignment
                      </button>
                    </div>

                    <div className="space-y-3">
                      {assignments.map((a) => {
                        const gradedCount = a.submissions.filter((s) => s.grade !== undefined).length;
                        const pending = a.submissions.length - gradedCount;
                        return (
                          <motion.div key={a._id} layout className="p-4 border rounded-lg flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{a.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{a.description}</p>
                              <div className="text-xs text-gray-500 flex gap-3">
                                <span>Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "—"}</span>
                                <span>{a.submissions.length} submissions</span>
                                <span>{gradedCount} graded</span>
                                <span>{pending} pending</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => prepareAssignmentForEdit(a)}
                                className="px-3 py-1 border rounded-md"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDeleteAssignment(a._id)} className="px-3 py-1 border rounded-md">
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <button onClick={() => openGrading(a)} className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm">
                                View Submissions
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                      {assignments.length === 0 && <p className="text-sm text-gray-500">No assignments</p>}
                    </div>
                  </>
                )}

                {activeTab === "sessions" && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Live Sessions</h3>
                      <button
                        onClick={() => {
                          resetSessionForm();
                          setEditSession(null);
                          setShowSessionModal(true);
                        }}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" /> Schedule Session
                      </button>
                    </div>

                    <div className="space-y-3">
                      {liveSessions.map((s) => (
                        <motion.div key={s._id} layout className="p-4 border rounded-lg flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{s.title}</h4>
                            <p className="text-sm text-gray-600">{s.description}</p>
                            <p className="text-xs text-gray-400 mt-2">{s.scheduledAt ? new Date(s.scheduledAt).toLocaleString() : "—"}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => prepareSessionForEdit(s)} className="px-3 py-1 border rounded-md">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteSession(s._id)} className="px-3 py-1 border rounded-md">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                      {liveSessions.length === 0 && <p className="text-sm text-gray-500">No sessions</p>}
                    </div>
                  </>
                )}
              </motion.div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium">No course selected</h3>
              <p className="text-sm text-gray-500">Select a course from the left to manage content.</p>
            </div>
          )}
        </main>
      </div>

      {/* ---------- Modals ---------- */}

      {/* Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editModule ? "Edit Module" : "Add Module"}</h3>
              <button onClick={() => { setShowModuleModal(false); setEditModule(null); }} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateOrUpdateModule} className="space-y-3">
              <input
                required
                className={inputClass}
                placeholder="Module Title"
                value={newModule.title || ""}
                onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
              />

              <textarea
                className={inputClass}
                placeholder="Description"
                rows={3}
                value={newModule.description || ""}
                onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
              />

              <input
                type="url"
                className={inputClass}
                placeholder="Video URL (optional)"
                value={newModule.videoUrl || ""}
                onChange={(e) => setNewModule({ ...newModule, videoUrl: e.target.value })}
              />

              {/* Duration & Order with clear labels */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    ⏱ Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    className={inputClass}
                    placeholder="e.g. 15"
                    value={newModule.duration ?? ""}
                    onChange={(e) => setNewModule({ ...newModule, duration: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    #️⃣ Order (position in course)
                  </label>
                  <input
                    type="number"
                    min={1}
                    className={inputClass}
                    placeholder="e.g. 1"
                    value={newModule.order ?? ""}
                    onChange={(e) => setNewModule({ ...newModule, order: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => { setShowModuleModal(false); setEditModule(null); }}
                  className="px-3 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                  {editModule ? "Update" : "Create"}
                </button>
              </div>
            </form>

          </motion.div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editAssignment ? "Edit Assignment" : "Create Assignment"}</h3>
              <button onClick={() => { setShowAssignmentModal(false); setEditAssignment(null); }} className="p-1 rounded-full hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreateOrUpdateAssignment} className="space-y-3">
              <input
                type="text"
                required
                className={inputClass}
                placeholder="Assignment Title"
                value={newAssignment.title || ""}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              />

              <textarea
                rows={3}
                required
                className={inputClass}
                placeholder="Assignment Description"
                value={newAssignment.description || ""}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              />

              {/* Due Date */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  📅 Due Date
                </label>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={newAssignment.dueDate || ""}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                />
              </div>

              {/* Max Points */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  🏆 Maximum Points
                </label>
                <input
                  type="number"
                  min={1}
                  className={inputClass}
                  placeholder="e.g. 100"
                  value={newAssignment.maxPoints ?? ""}
                  onChange={(e) => setNewAssignment({ ...newAssignment, maxPoints: Number(e.target.value) })}
                />
              </div>

              <textarea
                rows={3}
                className={inputClass}
                placeholder="Instructions (optional)"
                value={newAssignment.instructions || ""}
                onChange={(e) => setNewAssignment({ ...newAssignment, instructions: e.target.value })}
              />

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" className="btn-secondary" onClick={() => setShowAssignmentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editAssignment ? "Update" : "Create"}
                </button>
              </div>
            </form>

          </motion.div>
        </div>
      )}

      {/* Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editSession ? "Edit Session" : "Schedule Live Session"}</h3>
              <button onClick={() => { setShowSessionModal(false); setEditSession(null); }} className="p-1 rounded-full hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleCreateOrUpdateSession} className="space-y-3">
              <input
                type="text"
                required
                className={inputClass}
                placeholder="Session Title"
                value={newSession.title || ""}
                onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
              />

              <textarea
                rows={3}
                className={inputClass}
                placeholder="Session Description"
                value={newSession.description || ""}
                onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
              />

              {/* Scheduled Date & Time */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  ⏰ Scheduled Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  className={inputClass}
                  value={
                    newSession.scheduledAt
                      ? new Date(newSession.scheduledAt).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setNewSession({ ...newSession, scheduledAt: new Date(e.target.value).toISOString() })
                  }
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  ⏱ Duration (minutes)
                </label>
                <input
                  type="number"
                  min={5}
                  className={inputClass}
                  placeholder="e.g. 60"
                  value={newSession.duration ?? ""}
                  onChange={(e) => setNewSession({ ...newSession, duration: Number(e.target.value) })}
                />
              </div>

              {/* Meeting Link */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  🔗 Meeting Link
                </label>
                <input
                  type="url"
                  className={inputClass}
                  placeholder="https://meeting-link.com"
                  value={newSession.meetingLink || ""}
                  onChange={(e) => setNewSession({ ...newSession, meetingLink: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" className="btn-secondary" onClick={() => setShowSessionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editSession ? "Update" : "Create"}
                </button>
              </div>
            </form>

          </motion.div>
        </div>
      )}

      {/* Grading Modal */}
      {showGradeModal && selectedAssignmentForGrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-3xl bg-white rounded-lg shadow p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Submissions - {selectedAssignmentForGrading.title}</h3>
              <button onClick={() => setShowGradeModal(false)} className="p-1 rounded-full hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>

            {selectedAssignmentForGrading.submissions.length === 0 ? (
              <p className="text-sm text-gray-600">No submissions yet</p>
            ) : (
              <div className="space-y-3">
                {selectedAssignmentForGrading.submissions.map((sub: any) => (
                  <div key={sub._id} className={`p-3 rounded-lg border ${selectedSubmission?._id === sub._id ? "border-indigo-300 bg-indigo-50" : "border-gray-200 bg-white"}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{sub.student?.name || "Student"}</p>
                        <p className="text-xs text-gray-500">{sub.student?.email}</p>
                        <p className="text-xs text-gray-400 mt-1">Submitted: {new Date(sub.submittedAt).toLocaleString()}</p>
                        {sub.content && <p className="mt-2 text-sm text-gray-700">💬 {sub.content}</p>}
                        {sub.fileUrl && <a className="text-indigo-600 text-sm inline-block mt-2" href={sub.fileUrl} target="_blank" rel="noreferrer">View file</a>}
                        {sub.grade && <p className="mt-2 text-sm text-green-600">Graded: {sub.grade} / {selectedAssignmentForGrading.maxPoints}</p>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <button onClick={() => { setSelectedSubmission(sub); setGrade(sub.grade || 0); setFeedback(sub.feedback || ""); }} className="px-3 py-1 border rounded-md text-sm">Select</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedSubmission && (
              <form onSubmit={handleSaveGrade} className="mt-4 border-t pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" className={inputClass} value={grade} onChange={(e) => setGrade(Number(e.target.value))} placeholder="Grade" />
                  <input readOnly className={inputClass + " bg-gray-50"} value={`${selectedAssignmentForGrading.maxPoints} max`} />
                </div>
                <textarea className={inputClass} rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Feedback (optional)"></textarea>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setSelectedSubmission(null)} className="px-3 py-2 border rounded-md">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Save Grade</button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
      <Footer />
    </div>
  );
};

export default CourseManagement;
