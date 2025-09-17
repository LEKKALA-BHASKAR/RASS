import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { enrollmentAPI, assignmentAPI } from "../../services/api";
import {
  FileText,
  Calendar,
  Upload,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Assignment } from "../../types";

// Extend Assignment type for UI
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
        // Specific course
        const response = await assignmentAPI.getCourseAssignments(courseId);
        setAssignments(response.data);
      } else {
        // All enrolled courses
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

      // Refresh assignments after submit
      await fetchAssignments();

      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("❌ Failed to submit assignment. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Filter assignments by course
  const filteredAssignments =
    selectedCourseId === "all"
      ? assignments
      : assignments.filter((a) => a.courseId === selectedCourseId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Assignment Submitted!
              </h3>
              <p className="text-gray-600 mb-6">
                Your submission has been uploaded successfully.
              </p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
      </div>

      {/* Course Filter */}
      {courses.length > 0 && (
        <div className="flex items-center space-x-3 mb-6">
          <label className="text-gray-700 font-medium">Filter by Course:</label>
          <select
            className="border rounded-lg p-2"
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
        </div>
      )}

      {filteredAssignments.length > 0 ? (
        <div className="space-y-6">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-2">
                    {assignment.courseTitle || "Unknown Course"}
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {assignment.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{assignment.description}</p>

                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    {assignment.dueDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>Max Points: {assignment.maxPoints}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission Area */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Submit Assignment</h4>
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    type="button"
                    onClick={() => handleSubmit(assignment._id)}
                    disabled={!submissionData[assignment._id]}
                    className="w-full flex items-center justify-center px-5 py-3 
                               bg-gradient-to-r from-blue-600 to-indigo-700 
                               text-white font-medium rounded-lg shadow-md 
                               hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Submit Assignment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No assignments yet
          </h3>
          <p className="text-gray-600">
            Assignments will appear here when posted by your instructor
          </p>
        </div>
      )}
    </div>
  );
};

export default Assignments;
