import React, { useState, useEffect } from "react";
import { courseAPI, assignmentAPI, liveSessionAPI } from "../../services/api";
import { Plus, Edit, Trash2, Users, FileText } from "lucide-react";
import { Course, Assignment, LiveSession, Module } from "../../types";

// ---- Form Types ---- //
type AssignmentForm = Partial<
  Pick<Assignment, "title" | "description" | "dueDate" | "maxPoints" | "instructions">
>;
type SessionForm = Partial<
  Pick<LiveSession, "title" | "description" | "scheduledAt" | "duration" | "meetingLink">
>;
type ModuleForm = Partial<
  Pick<Module, "title" | "description" | "videoUrl" | "duration" | "order" | "resources">
>;

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [modules, setModules] = useState<Module[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);

  const [activeTab, setActiveTab] = useState<"overview" | "assignments" | "sessions">("overview");
  const [loading, setLoading] = useState(true);

  // Edit States
  const [editModule, setEditModule] = useState<Module | null>(null);
  const [editAssignment, setEditAssignment] = useState<Assignment | null>(null);
  const [editSession, setEditSession] = useState<LiveSession | null>(null);

  // Form States
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [newModule, setNewModule] = useState<ModuleForm>({
    title: "",
    description: "",
    videoUrl: "",
    duration: 0,
    order: 1,
    resources: [],
  });

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState<AssignmentForm>({
    title: "",
    description: "",
    dueDate: "",
    maxPoints: 100,
    instructions: "",
  });

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [newSession, setNewSession] = useState<SessionForm>({
    title: "",
    description: "",
    scheduledAt: "",
    duration: 60,
    meetingLink: "",
  });

  // ---- Grading ---- //
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedAssignmentForGrading, setSelectedAssignmentForGrading] = useState<Assignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState("");

  // ---- Fetch Data ---- //
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getInstructorCourses();
      setCourses(response.data);
      if (response.data.length > 0 && !selectedCourse) {
        handleSelectCourse(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
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
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  // ---- CRUD: Modules ---- //
  const handleCreateOrUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (error) {
      console.error("Error saving module:", error);
      alert("❌ Failed to save module.");
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!selectedCourse) return;
    try {
      await courseAPI.deleteModule(selectedCourse._id, id);
      fetchCourseData(selectedCourse._id);
    } catch (error) {
      console.error("Error deleting module:", error);
      alert("❌ Failed to delete module.");
    }
  };

  // ---- CRUD: Assignments ---- //
  const handleCreateOrUpdateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    try {
      if (editAssignment) {
        await assignmentAPI.updateAssignment(editAssignment._id, newAssignment);
      } else {
        const payload: any = {
          ...newAssignment,
          course: selectedCourse._id,
        };
        if (modules.length > 0) {
          payload.module = modules[0]._id;
        }
        await assignmentAPI.createAssignment(payload);
      }
      setShowAssignmentModal(false);
      setEditAssignment(null);
      resetAssignmentForm();
      fetchCourseData(selectedCourse._id);
    } catch (error) {
      console.error("Error saving assignment:", error);
      alert("❌ Failed to save assignment.");
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!selectedCourse) return;
    try {
      await assignmentAPI.deleteAssignment(id);
      fetchCourseData(selectedCourse._id);
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("❌ Failed to delete assignment.");
    }
  };

  // ---- CRUD: Sessions ---- //
const handleCreateOrUpdateSession = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedCourse) return;

    if (editSession) {
      await liveSessionAPI.updateSession(editSession._id, {
        ...newSession,
        course: selectedCourse._id,
      });
    } else {
      const res = await liveSessionAPI.createSession(selectedCourse._id, newSession);
      console.log("✅ Session created:", res.data);
    }

    alert("✅ Session saved successfully!");

    setShowSessionModal(false);
    setEditSession(null);
    resetSessionForm();
    fetchCourseData(selectedCourse._id);
  
};


  const handleDeleteSession = async (id: string) => {
    if (!selectedCourse) return;
    try {
      await liveSessionAPI.deleteSession(id);
      fetchCourseData(selectedCourse._id);
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("❌ Failed to delete session.");
    }
  };

  // ---- Reset Forms ---- //
  const resetModuleForm = () =>
    setNewModule({ title: "", description: "", videoUrl: "", duration: 0, order: 1, resources: [] });

  const resetAssignmentForm = () =>
    setNewAssignment({ title: "", description: "", dueDate: "", maxPoints: 100, instructions: "" });

  const resetSessionForm = () =>
    setNewSession({ title: "", description: "", scheduledAt: "", duration: 60, meetingLink: "" });

  // ---- Populate forms on edit ---- //
  const prepareModuleForEdit = (m: Module) =>
    setNewModule({
      title: m.title,
      description: m.description,
      videoUrl: m.videoUrl,
      duration: m.duration,
      order: m.order,
      resources: m.resources || [],
    });

  const prepareAssignmentForEdit = (a: Assignment) =>
    setNewAssignment({
      title: a.title,
      description: a.description,
      dueDate: a.dueDate ? new Date(a.dueDate).toISOString().slice(0, 16) : "",
      maxPoints: a.maxPoints,
      instructions: a.instructions,
    });

  const prepareSessionForEdit = (s: LiveSession) =>
    setNewSession({
      title: s.title,
      description: s.description,
      scheduledAt: s.scheduledAt ? new Date(s.scheduledAt).toISOString().slice(0, 16) : "",
      duration: s.duration,
      meetingLink: s.meetingLink,
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Courses</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Courses</h3>
            <div className="space-y-2">
              {courses.map((course) => (
                <button
                  key={course._id}
                  onClick={() => handleSelectCourse(course)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCourse?._id === course._id
                      ? "bg-primary-50 border border-primary-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <p className="font-medium text-gray-900">{course.title}</p>
                  <p className="text-sm text-gray-600">{course.enrollmentCount} students</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-3">
          {selectedCourse ? (
            <div>
              {/* Course Header */}
              <div className="card mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h2>
                <p className="text-gray-600 mb-4">{selectedCourse.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {selectedCourse.enrollmentCount} students
                  </span>
                  <span>₹{selectedCourse.price}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedCourse.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedCourse.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="card">
                <div className="border-b border-gray-200 mb-6">
                  <div className="flex space-x-8">
                    {["overview", "assignments", "sessions"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab
                            ? "border-primary-500 text-primary-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Overview → Module Management */}
                {activeTab === "overview" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Course Modules</h3>
                      <button
                        className="btn-primary flex items-center"
                        onClick={() => {
                          resetModuleForm();
                          setEditModule(null);
                          setShowModuleModal(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Module
                      </button>
                    </div>
                    <div className="space-y-3">
                      {modules.map((m) => (
                        <div key={m._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{m.title}</h4>
                              <p className="text-sm text-gray-600">{m.description}</p>
                              <p className="text-xs text-gray-500">
                                {m.duration} min | Order: {m.order}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                className="btn-secondary text-sm"
                                onClick={() => {
                                  setEditModule(m);
                                  setNewModule(m);
                                  setShowModuleModal(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                className="btn-secondary text-sm"
                                onClick={() => handleDeleteModule(m._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assignments */}
                  {activeTab === "assignments" && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Assignments</h3>
                        <button
                          onClick={() => {
                            resetAssignmentForm();
                            setEditAssignment(null);
                            setShowAssignmentModal(true);
                          }}
                          className="btn-primary flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Create Assignment
                        </button>
                      </div>
                      <div className="space-y-4">
                        {assignments.map((a) => {
                          // Count graded submissions
                          const gradedCount = a.submissions.filter((s) => s.grade !== undefined).length;
                          const ungradedCount = a.submissions.length - gradedCount;

                          return (
                            <div key={a._id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900">{a.title}</h4>
                                  <p className="text-sm text-gray-600 mb-2">{a.description}</p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span>
                                      Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "No due date"}
                                    </span>
                                    <span>{a.submissions.length} submissions</span>
                                    <span>{gradedCount} graded</span>
                                    <span>{ungradedCount} pending</span>
                                    <span>Max: {a.maxPoints} points</span>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    className="btn-secondary text-sm"
                                    onClick={() => {
                                      setEditAssignment(a);
                                      setNewAssignment(a);
                                      setShowAssignmentModal(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="btn-secondary text-sm"
                                    onClick={() => handleDeleteAssignment(a._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="btn-primary text-sm"
                                    onClick={() => {
                                      setSelectedAssignmentForGrading(a);
                                      setShowGradeModal(true);
                                    }}
                                  >
                                    View Submissions
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}


                {/* Sessions */}
                {activeTab === "sessions" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Live Sessions</h3>
                      <button
                        onClick={() => {
                          resetSessionForm();
                          setEditSession(null);
                          setShowSessionModal(true);
                        }}
                        className="btn-primary flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Schedule Session
                      </button>
                    </div>
                    <div className="space-y-4">
                      {liveSessions.map((s) => (
                        <div key={s._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{s.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{s.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>{s.scheduledAt ? new Date(s.scheduledAt).toLocaleString() : ""}</span>
                                <span>{s.duration} minutes</span>
                                <span>{s.attendees.length} attendees</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                className="btn-secondary text-sm"
                                onClick={() => {
                                  setEditSession(s);
                                  setNewSession(s);
                                  setShowSessionModal(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                className="btn-secondary text-sm"
                                onClick={() => handleDeleteSession(s._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No course selected</h3>
              <p className="text-gray-600">Select a course from the sidebar to manage its content</p>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 Modals for Module / Assignment / Session (same structure you had before) */}
      {/* Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editModule ? "Edit Module" : "Add Module"}
            </h3>
            <form onSubmit={handleCreateOrUpdateModule} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                required
                className="input-field"
                value={newModule.title}
                onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
              />
              <textarea
                rows={3}
                placeholder="Description"
                className="input-field"
                value={newModule.description}
                onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
              />
              <input
                type="url"
                placeholder="Video URL"
                className="input-field"
                value={newModule.videoUrl}
                onChange={(e) => setNewModule({ ...newModule, videoUrl: e.target.value })}
              />
              <input
                type="number"
                placeholder="Duration (min)"
                className="input-field"
                value={newModule.duration}
                onChange={(e) => setNewModule({ ...newModule, duration: Number(e.target.value) })}
              />
              <input
                type="number"
                placeholder="Order"
                className="input-field"
                value={newModule.order}
                onChange={(e) => setNewModule({ ...newModule, order: Number(e.target.value) })}
              />
              <div className="flex justify-end space-x-4">
                <button type="button" className="btn-secondary" onClick={() => setShowModuleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editModule ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editAssignment ? "Edit Assignment" : "Create Assignment"}
            </h3>
            <form onSubmit={handleCreateOrUpdateAssignment} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                required
                className="input-field"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              />
              <textarea
                rows={3}
                placeholder="Description"
                required
                className="input-field"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              />
              <input
                type="datetime-local"
                className="input-field"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              />
              <input
                type="number"
                placeholder="Max Points"
                required
                className="input-field"
                value={newAssignment.maxPoints}
                onChange={(e) => setNewAssignment({ ...newAssignment, maxPoints: Number(e.target.value) })}
              />
              <textarea
                rows={3}
                placeholder="Instructions"
                className="input-field"
                value={newAssignment.instructions}
                onChange={(e) => setNewAssignment({ ...newAssignment, instructions: e.target.value })}
              />
              <div className="flex justify-end space-x-4">
                <button type="button" className="btn-secondary" onClick={() => setShowAssignmentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editAssignment ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editSession ? "Edit Session" : "Schedule Live Session"}
            </h3>
            <form onSubmit={handleCreateOrUpdateSession} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                required
                className="input-field"
                value={newSession.title}
                onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
              />
              <textarea
                rows={3}
                placeholder="Description"
                className="input-field"
                value={newSession.description}
                onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
              />
              <input
  type="datetime-local"
  required
  className="input-field"
  value={
    newSession.scheduledAt
      ? new Date(newSession.scheduledAt).toISOString().slice(0, 16) // ✅ for input
      : ""
  }
  onChange={(e) =>
    setNewSession({
      ...newSession,
      scheduledAt: new Date(e.target.value).toISOString(), // ✅ store as ISO
    })
  }
/>


              <input
                type="number"
                placeholder="Duration (min)"
                required
                className="input-field"
                value={newSession.duration}
                onChange={(e) => setNewSession({ ...newSession, duration: Number(e.target.value) })}
              />
              <input
                type="url"
                placeholder="Meeting Link"
                className="input-field"
                value={newSession.meetingLink}
                onChange={(e) => setNewSession({ ...newSession, meetingLink: e.target.value })}
              />
              <div className="flex justify-end space-x-4">
                <button type="button" className="btn-secondary" onClick={() => setShowSessionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editSession ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 🔥 Grading Modal */}
      {showGradeModal && selectedAssignmentForGrading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Submissions for: {selectedAssignmentForGrading.title}
            </h3>

            {selectedAssignmentForGrading.submissions.length === 0 ? (
              <p className="text-gray-600">No submissions yet.</p>
            ) : (
              <div className="space-y-4">
                {selectedAssignmentForGrading.submissions.map((sub) => (
                  <div
                    key={sub._id}
                    className={`border rounded-lg p-4 ${
                      selectedSubmission?._id === sub._id ? "border-primary-400 bg-primary-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{sub.student?.name || "Unknown Student"}</p>
                        <p className="text-sm text-gray-600">{sub.student?.email}</p>
                        <p className="text-xs text-gray-500">
                          Submitted: {new Date(sub.submittedAt).toLocaleString()}
                        </p>
                        {sub.fileUrl && (
                          <a
                            href={sub.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 text-sm underline"
                          >
                            View File
                          </a>
                        )}
                        {sub.content && (
                          <p className="text-gray-700 mt-2">💬 {sub.content}</p>
                        )}
                      </div>
                      <button
                        className="btn-secondary text-xs"
                        onClick={() => {
                          setSelectedSubmission(sub);
                          setGrade(sub.grade || 0);
                          setFeedback(sub.feedback || "");
                        }}
                      >
                        {sub.grade ? "Edit Grade" : "Grade"}
                      </button>
                    </div>
                    {sub.grade && (
                      <p className="mt-2 text-sm text-green-600">
                        ✅ Graded: {sub.grade} / {selectedAssignmentForGrading.maxPoints}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Grade Form */}
            {selectedSubmission && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await assignmentAPI.gradeAssignment(selectedAssignmentForGrading._id, {
                      studentId: selectedSubmission.student._id,
                      grade,
                      feedback,
                    });
                    alert("✅ Grade saved successfully!");
                    setShowGradeModal(false);
                    setSelectedSubmission(null);
                    if (selectedCourse?._id) {
                      fetchCourseData(selectedCourse._id); // ✅ correct refresh
                    }
                  } catch (err) {
                    console.error("Error grading:", err);
                    alert("❌ Failed to save grade.");
                  }
                }}
                className="mt-6 border-t pt-4"
              >
                <h4 className="font-medium mb-2">Grade Submission</h4>
                <input
                  type="number"
                  placeholder="Grade"
                  className="input-field mb-2"
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                />
                <textarea
                  rows={3}
                  placeholder="Feedback"
                  className="input-field mb-2"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setSelectedSubmission(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">Save Grade</button>
                </div>
              </form>
            )}

            <div className="flex justify-end mt-6">
              <button className="btn-secondary" onClick={() => setShowGradeModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CourseManagement;
