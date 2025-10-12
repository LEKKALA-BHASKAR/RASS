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
      await onEnroll();
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
        className="max-w-7xl mx-auto px-6 py-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left / Info */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-snug">
              {course.title}
            </h1>
            
            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            <p className="mt-4 text-lg text-gray-700 max-w-3xl leading-relaxed">
              {course.description}
            </p>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" /> {course.totalDuration} mins
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" /> {course.enrollmentCount} students
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" /> {rating.toFixed(1)} ({ratingCount})
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <span className="capitalize">{course.level}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {enrollment ? (
                <Link
                  to={`/learn/${course._id}`}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow hover:bg-indigo-700 transition"
                >
                  Continue Learning
                </Link>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  disabled={enrolling}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow hover:bg-indigo-700 transition disabled:opacity-60"
                >
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </button>
              )}

              <button
                onClick={() => setShowPreview(true)}
                className="px-5 py-3 border rounded-lg text-sm hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Play className="h-4 w-4" /> Preview Course
              </button>
            </div>
          </div>

          {/* Right / Price Box */}
          <aside>
            <div className="bg-white rounded-2xl p-8 shadow-md border text-center sticky top-24">
              <div className="text-4xl font-bold text-indigo-600 mb-4">
                {course.price === 0 ? "Free" : `₹${course.price}`}
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Lifetime access, certificate, mentorship & placement support
              </p>
              {enrollment ? (
                <Link
                  to={`/learn/${course._id}`}
                  className="w-full inline-block px-5 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                >
                  Go to Course
                </Link>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  disabled={enrolling}
                  className="w-full px-5 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-60"
                >
                  {enrolling ? "Processing..." : "Enroll & Start Learning"}
                </button>
              )}
              <div className="mt-6 flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Award className="h-4 w-4 text-yellow-500" /> Industry Certificate
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4 text-green-600" /> Community Support
                </div>
              </div>
            </div>
          </aside>
        </div>
      </motion.section>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
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
                <p className="py-12 text-center text-gray-600">Preview not available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseHero;