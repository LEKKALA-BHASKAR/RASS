import React, { useState, useEffect } from 'react';
import { courseAPI, assignmentAPI, liveSessionAPI } from '../../services/api';
import { Plus, Edit, Trash2, Users, Calendar, FileText, Video } from 'lucide-react';
import { Course, Assignment, LiveSession } from '../../types';

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'sessions'>('overview');
  const [loading, setLoading] = useState(true);

  // Course Creation Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: 0,
    modules: [{ title: '', description: '', duration: 0, order: 1 }]
  });

  // Assignment Creation State
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxPoints: 100,
    instructions: ''
  });

  // Live Session Creation State
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    scheduledAt: '',
    duration: 60,
    meetingLink: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseData();
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getInstructorCourses();
      setCourses(response.data);
      if (response.data.length > 0 && !selectedCourse) {
        setSelectedCourse(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseData = async () => {
    if (!selectedCourse) return;
    
    try {
      const [assignmentsRes, sessionsRes] = await Promise.all([
        assignmentAPI.getCourseAssignments(selectedCourse._id),
        liveSessionAPI.getCourseSessions(selectedCourse._id)
      ]);
      
      setAssignments(assignmentsRes.data);
      setLiveSessions(sessionsRes.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await courseAPI.createCourse(newCourse);
      setShowCreateModal(false);
      setNewCourse({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        price: 0,
        modules: [{ title: '', description: '', duration: 0, order: 1 }]
      });
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    try {
      await assignmentAPI.createAssignment({
        ...newAssignment,
        course: selectedCourse._id,
        module: selectedCourse.modules[0]._id
      });
      setShowAssignmentModal(false);
      setNewAssignment({
        title: '',
        description: '',
        dueDate: '',
        maxPoints: 100,
        instructions: ''
      });
      fetchCourseData();
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    try {
      await liveSessionAPI.createSession({
        ...newSession,
        course: selectedCourse._id
      });
      setShowSessionModal(false);
      setNewSession({
        title: '',
        description: '',
        scheduledAt: '',
        duration: 60,
        meetingLink: ''
      });
      fetchCourseData();
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Course
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Course List */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Courses</h3>
            <div className="space-y-2">
              {courses.map((course) => (
                <button
                  key={course._id}
                  onClick={() => setSelectedCourse(course)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCourse?._id === course._id
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium text-gray-900">{course.title}</p>
                  <p className="text-sm text-gray-600">{course.enrollmentCount} students</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="lg:col-span-3">
          {selectedCourse ? (
            <div>
              {/* Course Header */}
              <div className="card mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h2>
                    <p className="text-gray-600 mb-4">{selectedCourse.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {selectedCourse.enrollmentCount} students
                      </span>
                      <span>₹{selectedCourse.price}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedCourse.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedCourse.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <button className="btn-secondary flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Course
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="card">
                <div className="border-b border-gray-200 mb-6">
                  <div className="flex space-x-8">
                    {['overview', 'assignments', 'sessions'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Modules</h3>
                    <div className="space-y-3">
                      {selectedCourse.modules.map((module, index) => (
                        <div key={module._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{module.title}</h4>
                              <p className="text-sm text-gray-600">{module.description}</p>
                              <p className="text-xs text-gray-500">{module.duration} minutes</p>
                            </div>
                            <button className="btn-secondary text-sm">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'assignments' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Assignments</h3>
                      <button
                        onClick={() => setShowAssignmentModal(true)}
                        className="btn-primary flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Assignment
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {assignments.map((assignment) => (
                        <div key={assignment._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}</span>
                                <span>{assignment.submissions.length} submissions</span>
                                <span>Max: {assignment.maxPoints} points</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="btn-secondary text-sm">Grade</button>
                              <button className="btn-secondary text-sm">
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'sessions' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Live Sessions</h3>
                      <button
                        onClick={() => setShowSessionModal(true)}
                        className="btn-primary flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Session
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {liveSessions.map((session) => (
                        <div key={session._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{session.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>{new Date(session.scheduledAt).toLocaleString()}</span>
                                <span>{session.duration} minutes</span>
                                <span>{session.attendees.length} attendees</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                session.status === 'live' ? 'bg-red-100 text-red-800' :
                                session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {session.status}
                              </span>
                              <button className="btn-secondary text-sm">
                                <Edit className="h-4 w-4" />
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

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  className="input-field"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    required
                    className="input-field"
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="DevOps">DevOps</option>
                    <option value="AI/ML">AI/ML</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    className="input-field"
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="input-field"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Assignment</h3>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  className="input-field"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Points</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="input-field"
                    value={newAssignment.maxPoints}
                    onChange={(e) => setNewAssignment({ ...newAssignment, maxPoints: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  rows={3}
                  className="input-field"
                  value={newAssignment.instructions}
                  onChange={(e) => setNewAssignment({ ...newAssignment, instructions: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Live Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Live Session</h3>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  className="input-field"
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="input-field"
                    value={newSession.scheduledAt}
                    onChange={(e) => setNewSession({ ...newSession, scheduledAt: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    required
                    min="15"
                    className="input-field"
                    value={newSession.duration}
                    onChange={(e) => setNewSession({ ...newSession, duration: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://meet.google.com/xxx or https://zoom.us/j/xxx"
                  value={newSession.meetingLink}
                  onChange={(e) => setNewSession({ ...newSession, meetingLink: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;