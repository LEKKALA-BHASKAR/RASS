import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI, courseAPI } from '../../services/api';
import { Users, BookOpen, TrendingUp, DollarSign, UserPlus, Settings } from 'lucide-react';
import { User, Course } from '../../types';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, coursesRes] = await Promise.all([
        userAPI.getAllUsers(),
        courseAPI.getAllCourses()
      ]);

      setUsers(usersRes.data);
      setCourses(coursesRes.data);
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

  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalInstructors = users.filter(u => u.role === 'instructor').length;
  const totalEnrollments = courses.reduce((total, course) => total + course.enrollmentCount, 0);
  const totalRevenue = courses.reduce((total, course) => total + (course.price * course.enrollmentCount), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform overview and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <UserPlus className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Instructors</p>
              <p className="text-2xl font-bold text-gray-900">{totalInstructors}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
            <button className="btn-secondary">
              Manage Users
            </button>
          </div>

          <div className="space-y-4">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'instructor' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Courses */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Popular Courses</h2>
            <button className="btn-secondary">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {courses
              .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
              .slice(0, 5)
              .map((course) => (
                <div key={course._id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-600">by {course.instructor.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{course.enrollmentCount} students</p>
                    <p className="text-sm text-gray-600">₹{course.price}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="card hover:shadow-md transition-shadow text-left">
          <div className="flex items-center mb-3">
            <UserPlus className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Add Instructor</h3>
          </div>
          <p className="text-gray-600">Invite new instructors to the platform</p>
        </button>

        <button className="card hover:shadow-md transition-shadow text-left">
          <div className="flex items-center mb-3">
            <BookOpen className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Course Management</h3>
          </div>
          <p className="text-gray-600">Review and approve course content</p>
        </button>

        <button className="card hover:shadow-md transition-shadow text-left">
          <div className="flex items-center mb-3">
            <Settings className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Platform Settings</h3>
          </div>
          <p className="text-gray-600">Configure platform-wide settings</p>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;