import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { enrollmentAPI, notificationAPI } from '../../services/api';
import { BookOpen, Calendar, Award, Bell, Play, Clock, ChevronRight, TrendingUp, Users, FileText, MessageSquare, Video } from 'lucide-react';
import { Enrollment, Notification } from '../../types';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [enrollmentsRes, notificationsRes] = await Promise.all([
        enrollmentAPI.getMyEnrollments(),
        notificationAPI.getNotifications()
      ]);

      setEnrollments(enrollmentsRes.data);
      setNotifications(notificationsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const completedCourses = enrollments.filter(e => e.completed);
  const inProgressCourses = enrollments.filter(e => !e.completed);
  const totalWatchTime = enrollments.reduce((total, enrollment) => {
    return total + enrollment.progress.reduce((sum, progress) => sum + progress.watchTime, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-4">
          <h1 className="text-4xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-lg text-gray-600 mt-2">Continue your learning journey</p>
          
          {/* Date and quick stats */}
          <div className="flex items-center mt-4 text-gray-500">
            <Calendar className="h-5 w-5 mr-2" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-100">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-green-100">
                <Play className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressCourses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-amber-100">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedCourses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-indigo-100">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Watch Time</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(totalWatchTime / 3600)}h</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
                <Link to="/courses" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                  Browse All Courses
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {inProgressCourses.length > 0 ? (
                <div className="space-y-4">
                  {inProgressCourses.slice(0, 3).map((enrollment) => (
                    <div key={enrollment._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-blue-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{enrollment.course.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            by {enrollment.course.instructor.name}
                          </p>
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{enrollment.completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                                style={{ width: `${enrollment.completionPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <Link 
                          to={`/learn/${enrollment.course._id}`}
                          className="ml-6 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                          Continue
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-5">
                    <BookOpen className="h-12 w-12 text-blue-600" />
                  </div>
                  <p className="text-gray-600 mb-6 text-lg">No courses in progress</p>
                  <Link to="/courses" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all inline-flex items-center">
                    Browse Courses
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400 mr-2" />
                  <Link to="/student/notifications" className="text-sm text-primary-600 hover:text-primary-700">
                    View All
                  </Link>
                </div>
              </div>
              
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification._id} className="border-l-4 border-primary-400 pl-4 py-3 bg-blue-50 rounded-r-lg">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No new notifications</p>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Quick Access</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/courses"
                  className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all transform hover:-translate-y-1"
                >
                  <div className="p-2 bg-blue-100 rounded-lg mb-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Browse Courses</span>
                </Link>
            
                <Link
                  to="/profile"
                  className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all transform hover:-translate-y-1"
                >
                  <div className="p-2 bg-green-100 rounded-lg mb-2">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Update Profile</span>
                </Link>

                <Link
                  to="/support-tickets"
                  className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all transform hover:-translate-y-1 relative"
                >
                  <div className="p-2 bg-amber-100 rounded-lg mb-2">
                    <MessageSquare className="h-6 w-6 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Support</span>
                  {notifications.filter((n) => !n.read && n.type === "support").length > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                      {notifications.filter((n) => !n.read && n.type === "support").length}
                    </span>
                  )}
                </Link>

                <Link
                  to="/student/discussion-forum"
                  className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all transform hover:-translate-y-1 relative"
                >
                  <div className="p-2 bg-purple-100 rounded-lg mb-2">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Discussions</span>
                  {notifications.filter((n) => !n.read && n.type === "discussion").length > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                      {notifications.filter((n) => !n.read && n.type === "discussion").length}
                    </span>
                  )}
                </Link>
                <Link
  to="/student/assignments"
  className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all transform hover:-translate-y-1 relative"
>
  <div className="p-2 bg-purple-100 rounded-lg mb-2">
    <Users className="h-6 w-6 text-purple-600" />
  </div>
  <span className="text-sm font-medium text-gray-700">Assignments</span>
  {notifications.filter((n) => !n.read && n.type === "assignment").length > 0 && (
    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
      {notifications.filter((n) => !n.read && n.type === "assignment").length}
    </span>
  )}
</Link>

                <Link
                  to="/student/chat"
                  className="flex flex-col items-center justify-center p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-all transform hover:-translate-y-1 relative"
                >
                  <div className="p-2 bg-pink-100 rounded-lg mb-2">
                    <MessageSquare className="h-6 w-6 text-pink-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Chat</span>
                  {notifications.filter((n) => !n.read && n.type === "chat").length > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                      {notifications.filter((n) => !n.read && n.type === "chat").length}
                    </span>
                  )}
                </Link>

                <Link
                  to="/student/live-sessions"
                  className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-all transform hover:-translate-y-1 relative"
                >
                  <div className="p-2 bg-red-100 rounded-lg mb-2">
                    <Video className="h-6 w-6 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Live Classes</span>
                  {notifications.filter((n) => !n.read && n.type === "live-session").length > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                      {notifications.filter((n) => !n.read && n.type === "live-session").length}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;