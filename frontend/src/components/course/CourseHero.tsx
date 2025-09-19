import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import { BookOpen, Clock, Users, Star, Play, Award } from "lucide-react";
import { Course, Enrollment } from "../../types";
import { useAuth } from "../../context/AuthContext";

interface Props {
  course: Course;
  enrollment?: Enrollment | null;
  onEnroll?: () => Promise<void>;
}

const CourseHero: React.FC<Props> = ({ course, enrollment, onEnroll }) => {
  const { isAuthenticated } = useAuth();
  const [enrolling, setEnrolling] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleEnrollClick = async () => {
    if (!isAuthenticated || !onEnroll) return;
    setEnrolling(true);
    try {
      await onEnroll(); // ✅ delegate to parent
    } catch (err) {
      console.error("Enroll error:", err);
    } finally {
      setEnrolling(false);
    }
  };

  const rating = course.rating?.average ?? 0;
  const ratingCount = course.rating?.count ?? 0;
  const firstVideo = course.modules?.[0]?.videoUrl;

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-7xl mx-auto px-6 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left / Main */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              {course.title}
            </h1>

            <p className="mt-4 text-gray-700 max-w-3xl leading-relaxed">
              {course.description}
            </p>

            {/* quick stats */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> {course.totalDuration} mins
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" /> {course.enrollmentCount} students
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                {rating.toFixed(1)} ({ratingCount})
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="capitalize">{course.level}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {enrollment ? (
                <Link
                  to={`/learn/${course._id}`}
                  className="px-5 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow hover:bg-indigo-700 transition"
                >
                  Continue Learning
                </Link>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  disabled={enrolling}
                  className="px-5 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow hover:bg-indigo-700 transition disabled:opacity-60"
                >
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </button>
              )}

              <button
                onClick={() => setShowPreview(true)}
                className="px-4 py-3 border rounded-lg text-sm hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Play className="h-4 w-4" /> Preview
              </button>
            </div>
          </div>

          {/* Right / Price Box */}
          <aside>
            <div className="bg-white rounded-2xl p-6 shadow border text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-4">
                {course.price === 0 ? "Free" : `₹${course.price}`}
              </div>

              {enrollment ? (
                <Link
                  to={`/learn/${course._id}`}
                  className="w-full inline-block px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition"
                >
                  Go to Course
                </Link>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  disabled={enrolling}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition disabled:opacity-60"
                >
                  {enrolling ? "Enrolling..." : "Enroll — Start Now"}
                </button>
              )}
            </div>
          </aside>
        </div>
      </motion.section>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="text-lg font-medium">Course Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-sm px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              {firstVideo ? (
                <div className="aspect-video">
                  <ReactPlayer url={firstVideo} controls width="100%" height="100%" />
                </div>
              ) : (
                <p className="py-12 text-center text-gray-600">
                  Preview not available.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseHero;
