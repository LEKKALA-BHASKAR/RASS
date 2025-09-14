import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { enrollmentAPI, notificationAPI } from '../../services/api';
import { BookOpen, Calendar, Award, Bell, Play, Clock } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const completedCourses = enrollments.filter(e => e.completed);
  const inProgressCourses = enrollments.filter(e => !e.completed);
  const totalWatchTime = enrollments.reduce((total, enrollment) => {
    return total + enrollment.progress.reduce((sum, progress) => sum + progress.watchTime, 0);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Continue your learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
              <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-600" />
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
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
              <Link to="/courses" className="text-primary-600 hover:text-primary-700 font-medium">
                Browse All Courses
              </Link>
            </div>

            {inProgressCourses.length > 0 ? (
              <div className="space-y-4">
                {inProgressCourses.slice(0, 3).map((enrollment) => (
                  <div key={enrollment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{enrollment.course.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          by {enrollment.course.instructor.name}
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{enrollment.completionPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${enrollment.completionPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <Link 
                        to={`/learn/${enrollment.course._id}`}
                        className="ml-4 btn-primary"
                      >
                        Continue
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No courses in progress</p>
                <Link to="/courses" className="btn-primary">
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Notifications & Quick Actions */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
              <Bell className="h-5 w-5 text-gray-400" />
            </div>
            
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification._id} className="border-l-4 border-primary-400 pl-3 py-2">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-xs text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No new notifications</p>
            )}
          </div>

          {/* Quick Links */}
          {/* Quick Links */}
          <div className="text-center my-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h3>
            <div className="flex flex-wrap gap-4 justify-center">

              <Link
                to="/courses"
                className="relative px-6 py-3 bg-primary-600 text-blue-900 rounded-lg shadow hover:bg-primary-700 transition"
              >
                Browse Courses
              </Link>

              <Link
                to="/profile"
                className="relative px-6 py-3 bg-primary-600 text-blue-900 rounded-lg shadow hover:bg-primary-700 transition"
              >
                Update Profile
              </Link>

              <Link
                to="/support-tickets"
                className="relative px-6 py-3 bg-primary-600 text-blue-900 rounded-lg shadow hover:bg-primary-700 transition"
              >
                Support Tickets
                {notifications.filter((n) => !n.read && n.type === "support").length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {notifications.filter((n) => !n.read && n.type === "support").length}
                  </span>
                )}
              </Link>

              <Link
                to="/student/discussion-forum"
                className="relative px-6 py-3 bg-primary-600 text-blue-900 rounded-lg shadow hover:bg-primary-700 transition"
              >
                Discussion Forum
                {notifications.filter((n) => !n.read && n.type === "discussion").length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {notifications.filter((n) => !n.read && n.type === "discussion").length}
                  </span>
                )}
              </Link>

              <Link
                to="/student/notifications"
                className="relative px-6 py-3 bg-primary-600 text-blue-900 rounded-lg shadow hover:bg-primary-700 transition"
              >
                Notifications
                {notifications.some((n) => !n.read) && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </Link>

              <Link
                to="/student/chat"
                className="relative px-6 py-3 bg-primary-600 text-blue-900 rounded-lg shadow hover:bg-primary-700 transition"
              >
                Chat with Mentor
                {notifications.filter((n) => !n.read && n.type === "chat").length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {notifications.filter((n) => !n.read && n.type === "chat").length}
                  </span>
                )}
              </Link>

              <Link
                to="/student/live-sessions"
                className="relative px-6 py-3 bg-primary-600 text-blue-900 rounded-lg shadow hover:bg-primary-700 transition"
              >
                Join Live Class
                {notifications.filter((n) => !n.read && n.type === "live-session").length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {notifications.filter((n) => !n.read && n.type === "live-session").length}
                  </span>
                )}
              </Link>

              {enrollments.length > 0 && (
                <Link
                  to={`/student/assignments/${enrollments[0].course._id}`}
                  className="relative px-6 py-3 bg-primary-600 text-blue-900 rounded-lg shadow hover:bg-primary-700 transition"
                >
                  View Assignments
                  {notifications.filter((n) => !n.read && n.type === "assignment").length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {notifications.filter((n) => !n.read && n.type === "assignment").length}
                    </span>
                  )}
                </Link>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
