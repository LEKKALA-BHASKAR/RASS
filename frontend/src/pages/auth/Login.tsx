import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  BookOpen,
  Eye,
  EyeOff,
  LogIn,
  Github,
  Twitter,
  Facebook,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-white shadow-2xl"
      >
        <div className="mx-auto w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-600 mb-6 transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to home
          </Link>

          <div className="text-center mb-6">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-6"
            >
              <BookOpen className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome back 👋
            </h2>
            <p className="mt-2 text-gray-600">
              Sign in to continue your learning journey
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="mt-1 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4..."
                  ></path>
                </svg>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" /> Sign In
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-3">
              {[Github, Twitter, Facebook].map((Icon, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="flex justify-center items-center py-2 px-4 border rounded-lg bg-white shadow-sm hover:bg-gray-50 transition"
                >
                  <Icon
                    className={`h-5 w-5 ${
                      Icon === Twitter
                        ? "text-sky-400"
                        : Icon === Facebook
                        ? "text-blue-600"
                        : "text-gray-800"
                    }`}
                  />
                </motion.button>
              ))}
            </div>

            {/* Signup link */}
            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </form>
        </div>
      </motion.div>

      {/* Right Side - Illustration */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-indigo-100 lg:to-purple-100 p-12"
      >
        <div className="max-w-md text-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-6 bg-white rounded-2xl shadow-lg inline-block mb-8"
          >
            <BookOpen className="h-16 w-16 text-indigo-600" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Unlock Your Potential 🚀
          </h3>
          <p className="text-gray-600">
            Join thousands of learners on RASS Academy. Gain skills, get
            certified, and grow your career.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={item}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <div className="h-3 bg-indigo-200 rounded mb-2"></div>
                <div className="h-2 bg-indigo-100 rounded"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
    <Footer />
    </div>
  );
};

export default Login;
