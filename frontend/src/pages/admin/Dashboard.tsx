import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI, courseAPI } from '../../services/api';
import { Users, BookOpen, TrendingUp, DollarSign, UserPlus, Settings, ChevronRight, Eye, Search, Filter, MoreHorizontal, Calendar, ArrowUpRight, BarChart3, Plus, Download, Activity, ChevronDown, Bell, Menu, X, Home, FileText, PieChart, MessageSquare, HelpCircle } from 'lucide-react';
import { User, Course } from '../../types';
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalInstructors = users.filter(u => u.role === 'instructor').length;
  const totalEnrollments = courses.reduce((total, course) => total + course.enrollmentCount, 0);
  const totalRevenue = courses.reduce((total, course) => total + (course.price * course.enrollmentCount), 0);
  
  const studentGrowth = 12.5;
  const revenueGrowth = 8.3;
  const enrollmentGrowth = 5.7;

  return (
    <div className="max-h-screen bg-gray-50 ">
      {/* Main Content */}
      <div className="">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                  <p className="text-gray-600">Welcome back, {user?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-500 hover:text-gray-700">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'courses', 'reports', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 ml-1">{studentGrowth}%</span>
                    <span className="text-sm text-gray-500 ml-2">from last week</span>
                  </div>
                </div>
                <div className="bg-indigo-100 p-3 rounded-xl">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Instructors</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalInstructors}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 ml-1">2.1%</span>
                    <span className="text-sm text-gray-500 ml-2">from last week</span>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{courses.length}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 ml-1">{enrollmentGrowth}%</span>
                    <span className="text-sm text-gray-500 ml-2">from last week</span>
                  </div>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 ml-1">{revenueGrowth}%</span>
                    <span className="text-sm text-gray-500 ml-2">from last week</span>
                  </div>
                </div>
                <div className="bg-amber-100 p-3 rounded-xl">
                  <DollarSign className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
                <button
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  onClick={() => navigate("/admin/users")}
                >
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>

              <div className="space-y-4">
                {users.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "instructor"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Courses */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Popular Courses</h2>
                <button 
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  onClick={() => navigate("/admin/courses")}
                >
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>

              <div className="space-y-4">
                {courses
                  .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
                  .slice(0, 5)
                  .map((course) => (
                    <div key={course._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
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
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 text-left group"
                onClick={() => navigate("/admin/add-user")}
              >
                <div className="flex items-center mb-3">
                  <div className="bg-indigo-100 p-3 rounded-xl group-hover:bg-indigo-200 transition-colors">
                    <UserPlus className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-md font-semibold text-gray-900 ml-3">Add Instructor</h3>
                </div>
                <p className="text-sm text-gray-600">Invite new instructors to the platform</p>
              </button>

              <button 
                className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 text-left group"
                onClick={() => navigate("/admin/add-course")}
              >
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-md font-semibold text-gray-900 ml-3">Course Management</h3>
                </div>
                <p className="text-sm text-gray-600">Review and approve course content</p>
              </button>

              <button className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 text-left group">
                <div className="flex items-center mb-3">
                  <div className="bg-gray-100 p-3 rounded-xl group-hover:bg-gray-200 transition-colors">
                    <Settings className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="text-md font-semibold text-gray-900 ml-3">Platform Settings</h3>
                </div>
                <p className="text-sm text-gray-600">Configure platform-wide settings</p>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { action: 'created', subject: 'new course', user: 'John Doe', time: '2 hours ago' },
                { action: 'updated', subject: 'profile settings', user: 'Sarah Wilson', time: '5 hours ago' },
                { action: 'purchased', subject: 'Python Masterclass', user: 'Michael Chen', time: '1 day ago' },
                { action: 'completed', subject: 'Web Development course', user: 'Emma Roberts', time: '2 days ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center py-2">
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <Activity className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action} a {activity.subject}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;