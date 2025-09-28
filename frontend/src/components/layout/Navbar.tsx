import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  BookOpen,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
} from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const { unreadCount, notifications, markAsRead, markAllAsRead } =
    useNotification();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileDropdownOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "instructor":
        return "/instructor/dashboard";
      case "student":
        return "/student/dashboard";
      default:
        return "/";
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.1 }}
              
            >
            </motion.div>
            <img 
  src="/logo.webp" 
  alt="RASS Academy Logo" 
  className="h-12 w-auto"
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
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition"
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
            <Link
              to="/companies"
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Companies
            </Link>
            <Link
              to="/universities"
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Universities
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4 relative">
                <Link
                  to={getDashboardLink()}
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>

                {/* Notification Bell */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifDropdown((p) => !p)}
                  className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </motion.button>

                {/* Notification Dropdown */}
                <AnimatePresence>
                  {showNotifDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-12 w-80 bg-white shadow-xl rounded-xl border overflow-hidden z-50"
                    >
                      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b">
                        <span className="font-semibold text-gray-700">
                          Notifications
                        </span>
                        <button
                          onClick={async () => {
                            await markAllAsRead();
                          }}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-sm text-gray-500">
                            No notifications
                          </p>
                        ) : (
                          <ul className="divide-y">
                            {notifications.map((n) => (
                              <motion.li
                                key={n._id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                                  !n.read ? "bg-indigo-50" : ""
                                }`}
                                onClick={async () => {
                                  await markAsRead(n._id);
                                  if (n.type === "chat") navigate("/instructor/chats");
                                  if (n.type === "support")
                                    navigate("/instructor/tickets");
                                  if (n.type === "forum")
                                    navigate("/instructor/discussions");
                                  if (n.type === "assignment")
                                    navigate("/instructor/courses?tab=assignments");
                                  if (n.type === "enrollment")
                                    navigate("/instructor/courses");
                                  setShowNotifDropdown(false);
                                }}
                              >
                                <p className="text-sm font-medium text-gray-800">
                                  {n.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {n.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(n.createdAt).toLocaleString()}
                                </p>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
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

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200"
                      >
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {user?.role}
                          </p>
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
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 shadow transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 p-1 rounded-md hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6 text-gray-700" />
              </button>
            </div>
            <div className="flex flex-col p-4 space-y-4">
              <Link to="/courses" className="text-gray-700 font-medium" onClick={() => setIsMenuOpen(false)}>Courses</Link>
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardLink()} className="text-gray-700 font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                  <Link to="/companies" className="text-gray-700 font-medium" onClick={() => setIsMenuOpen(false)}>Companies</Link>
                  <Link to="/universities" className="text-gray-700 font-medium" onClick={() => setIsMenuOpen(false)}>Universities</Link>
                  <button onClick={handleLogout} className="flex items-center text-red-600 font-medium">
                    <LogOut className="h-5 w-5 mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 shadow text-center" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
