import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
} from 'lucide-react';
import { useNotification } from "../../context/NotificationContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // ✅ use unreadCount + notifications list from context
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotification();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'instructor':
        return '/instructor/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const getNotificationsLink = () => {
    if (!user) return "/notifications"; // fallback
    switch (user.role) {
      case "student":
        return "/student/notifications";
      case "instructor":
        return "/instructor/notifications";
      case "admin":
        return "/admin/notifications";
      default:
        return "/notifications";
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-100">
  <div className="max-w-9xl mx-auto px-16 sm:px-19 lg:px-125">
    <div className="flex justify-between items-center h-18">
      {/* Logo - Fixed sizing and display */}
      <Link to="/" className="flex items-center space-x-15 flex-shrink-10">
        <img 
          src="../logo.webp" 
          alt="RASS Academy Logo" 
          className="h-12 w-45 max-w-none object-contain"
          onError={(e) => {
            // Fallback in case image fails to load
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjQ4IiB2aWV3Qm94PSIwIDAgMTUwIDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjQ4IiBmaWxsPSIjNDU2OUZGIiByeD0iOCIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+UkFTUyBBY2FkZW15PC90ZXh0Pgo8L3N2Zz4=";
          }}
        />
      </Link>

      {/* Search Bar - Desktop */}
      <div className="hidden md:flex flex-1 max-w-lg mx-8">
        <form onSubmit={handleSearch} className="relative w-full">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <Link
          to="/courses"
          className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
        >
          Courses
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center space-x-4 relative">
            <Link
              to={getDashboardLink()}
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Dashboard
            </Link>

            {/* Desktop Notification Bell */}
            <button
              onClick={() => setShowNotifDropdown((p) => !p)}
              className="relative p-1 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifDropdown && (
              <div className="absolute right-0 top-10 w-80 bg-white shadow-lg rounded-lg border max-h-96 overflow-y-auto z-50">
                <div className="flex justify-between items-center px-4 py-2 border-b">
                  <span className="font-semibold text-gray-700">Notifications</span>
                  <button
                    onClick={async () => {
                      await markAllAsRead();
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">No notifications</p>
                ) : (
                  <ul className="divide-y">
                    {notifications.map((n) => (
                      <li
                        key={n._id}
                        className={`p-3 cursor-pointer hover:bg-gray-50 ${
                          !n.read ? "bg-blue-50" : ""
                        }`}
                        onClick={async () => {
                          await markAsRead(n._id);
                          if (n.type === "chat") navigate("/instructor/chats");
                          if (n.type === "support") navigate("/instructor/tickets");
                          if (n.type === "forum") navigate("/instructor/discussions");
                          if (n.type === "assignment")
                            navigate("/instructor/courses?tab=assignments");
                          if (n.type === "enrollment") navigate("/instructor/courses");
                          setShowNotifDropdown(false);
                        }}
                      >
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-gray-500">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="font-medium">{user?.name}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="flex md:hidden items-center space-x-4">
        {isAuthenticated && (
          <button
            onClick={() => setShowNotifDropdown((p) => !p)}
            className="relative p-1 text-gray-600"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        )}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-700 p-1 rounded-md hover:bg-gray-100"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </div>
  </div>
</nav>
  );
};

export default Navbar;
