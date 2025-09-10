import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { assignmentAPI } from '../../services/api';
import { FileText, Calendar, Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { Assignment } from '../../types';

const Assignments: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
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
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (assignmentId: string) => {
    try {
      const content = submissionData[assignmentId];
      if (!content) return;

      await assignmentAPI.submitAssignment(assignmentId, { content });
      await fetchAssignments(); // Refresh data
      setSubmissionData({ ...submissionData, [assignmentId]: '' });
    } catch (error) {
      console.error('Error submitting assignment:', error);
    }
  };

  const getStatusInfo = (assignment: Assignment, userId: string) => {
    const submission = assignment.submissions.find(s => s.student._id === userId);
    
    if (!submission) {
      const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
      return {
        status: isOverdue ? 'overdue' : 'pending',
        color: isOverdue ? 'text-red-600' : 'text-yellow-600',
        icon: isOverdue ? AlertCircle : Clock,
        text: isOverdue ? 'Overdue' : 'Pending'
      };
    }

    if (submission.grade !== undefined) {
      return {
        status: 'graded',
        color: 'text-green-600',
        icon: CheckCircle,
        text: `Graded: ${submission.grade}/${assignment.maxPoints}`
      };
    }

    return {
      status: 'submitted',
      color: 'text-blue-600',
      icon: CheckCircle,
      text: 'Submitted'
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
      </div>

      {assignments.length > 0 ? (
        <div className="space-y-6">
          {assignments.map((assignment) => {
            const statusInfo = getStatusInfo(assignment, 'current-user-id'); // You'll need to get actual user ID
            const submission = assignment.submissions.find(s => s.student._id === 'current-user-id');
            
            return (
              <div key={assignment._id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                    <p className="text-gray-600 mb-4">{assignment.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                      {assignment.dueDate && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>Max Points: {assignment.maxPoints}</span>
                      </div>
                    </div>

                    {assignment.instructions && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
                        <p className="text-blue-800 text-sm">{assignment.instructions}</p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 text-right">
                    <div className={`flex items-center ${statusInfo.color} mb-2`}>
                      <statusInfo.icon className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">{statusInfo.text}</span>
                    </div>
                  </div>
                </div>

                {/* Submission Area */}
                {!submission ? (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Submit Assignment</h4>
                    <div className="space-y-3">
                      <textarea
                        rows={4}
                        className="input-field"
                        placeholder="Enter your submission content..."
                        value={submissionData[assignment._id] || ''}
                        onChange={(e) => setSubmissionData({
                          ...submissionData,
                          [assignment._id]: e.target.value
                        })}
                      />
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleSubmit(assignment._id)}
                          disabled={!submissionData[assignment._id]}
                          className="btn-primary disabled:opacity-50 flex items-center"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Assignment
                        </button>
                        <button className="btn-secondary flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Upload File
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Your Submission</h4>
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <p className="text-gray-700">{submission.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Submitted on {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    
                    {submission.feedback && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-medium text-blue-900 mb-2">Instructor Feedback:</h5>
                        <p className="text-blue-800">{submission.feedback}</p>
                        {submission.grade !== undefined && (
                          <p className="text-blue-900 font-semibold mt-2">
                            Grade: {submission.grade}/{assignment.maxPoints}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
          <p className="text-gray-600">Assignments will appear here when posted by your instructor</p>
        </div>
      )}
    </div>
  );
};

export default Assignments;