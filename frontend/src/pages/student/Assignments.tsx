import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { assignmentAPI } from "../../services/api";
import {
  FileText,
  Calendar,
  Upload,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Assignment } from "../../types";

const Assignments: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionData, setSubmissionData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (courseId) {
      fetchAssignments();
    }
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      const response = await assignmentAPI.getCourseAssignments(courseId!);
      setAssignments(response.data);
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

      alert("✅ Assignment submitted successfully!");
      setSubmissionData({ ...submissionData, [assignmentId]: "" });

      // Optional: refresh to confirm it's stored
      await fetchAssignments();
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
      </div>

      {assignments.length > 0 ? (
        <div className="space-y-6">
          {assignments.map((assignment) => (
            <div key={assignment._id} className="card p-6 border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
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
                    rows={4}
                    className="w-full border rounded-lg p-2"
                    placeholder="Enter your submission link here (e.g., GitHub, Google Docs)"
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
                    className="btn-primary disabled:opacity-50 flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Assignment Link
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
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
