import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { enrollmentAPI, assignmentAPI } from "../../services/api";
import { FileText, Calendar, Upload, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Assignment } from "../../types";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";

type ExtendedAssignment = Assignment & {
  courseTitle?: string;
  courseId?: string;
};

const Assignments: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<ExtendedAssignment[]>([]);
  const [courses, setCourses] = useState<{ _id: string; title: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [submissionData, setSubmissionData] = useState<{ [key: string]: string }>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      if (courseId) {
        const response = await assignmentAPI.getCourseAssignments(courseId);
        setAssignments(response.data);
      } else {
        const enrollmentsRes = await enrollmentAPI.getMyEnrollments();
        const enrollments = enrollmentsRes.data;

        setCourses(enrollments.map((e: any) => e.course));

        let allAssignments: ExtendedAssignment[] = [];
        for (const e of enrollments) {
          const res = await assignmentAPI.getCourseAssignments(e.course._id);
          const courseAssignments = res.data.map((a: Assignment) => ({
            ...a,
            courseTitle: e.course.title,
            courseId: e.course._id,
          }));
          allAssignments = [...allAssignments, ...courseAssignments];
        }
        setAssignments(allAssignments);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (assignmentId: string) => {
    try {
      const content = submissionData[assignmentId];
      if (!content) return;

      await assignmentAPI.submitAssignment(assignmentId, { content });

      setShowSuccessPopup(true);
      setSubmissionData({ ...submissionData, [assignmentId]: "" });

      await fetchAssignments();

      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("❌ Failed to submit assignment. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const filteredAssignments =
    selectedCourseId === "all"
      ? assignments
      : assignments.filter((a) => a.courseId === selectedCourseId);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Success Popup */}
        <AnimatePresence>
          {showSuccessPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center"
              >
                <div className="bg-green-100 p-4 rounded-full inline-flex mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Assignment Submitted!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your submission has been uploaded successfully.
                </p>
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Continue
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Assignments</h2>
          {courses.length > 0 && (
            <select
              className="border rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              <option value="all">All Courses</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Assignment List */}
        {filteredAssignments.length > 0 ? (
          <div className="grid gap-8">
            {filteredAssignments.map((assignment) => (
              <motion.div
                key={assignment._id}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
              >
                <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                  <h3 className="text-xl font-semibold">{assignment.title}</h3>
                  <p className="text-sm opacity-90">
                    {assignment.courseTitle || "Unknown Course"}
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-gray-700">{assignment.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    {assignment.dueDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-indigo-600" />
                        <span>
                          Due:{" "}
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1 text-indigo-600" />
                      <span>Max Points: {assignment.maxPoints}</span>
                    </div>
                  </div>

                  {/* Submission */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Submit Assignment
                    </h4>
                    <textarea
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Enter your submission link or content"
                      value={submissionData[assignment._id] || ""}
                      onChange={(e) =>
                        setSubmissionData({
                          ...submissionData,
                          [assignment._id]: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={() => handleSubmit(assignment._id)}
                      disabled={!submissionData[assignment._id]}
                      className="mt-3 w-full flex items-center justify-center px-5 py-3 
                        bg-gradient-to-r from-indigo-600 to-blue-600 
                        text-white font-medium rounded-lg shadow-md 
                        hover:shadow-lg transition disabled:opacity-50"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Submit Assignment
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No assignments yet
            </h3>
            <p className="text-gray-600">
              Assignments will appear here when posted by your instructor.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Assignments;
