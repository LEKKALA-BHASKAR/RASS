import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseAPI, enrollmentAPI } from '../../services/api';
import { Clock, Users, Star, BookOpen, Play, Award } from 'lucide-react';
import { Course, Enrollment } from '../../types';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const courseRes = await courseAPI.getCourse(id!);
      setCourse(courseRes.data);

      if (isAuthenticated) {
        try {
          const enrollmentsRes = await enrollmentAPI.getMyEnrollments();
          const userEnrollment = enrollmentsRes.data.find((e: Enrollment) => e.course._id === id);
          setEnrollment(userEnrollment || null);
        } catch (error) {
          // User not enrolled
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated || !course) return;
    
    setEnrolling(true);
    try {
      await enrollmentAPI.enrollInCourse(course._id);
      await fetchCourseData(); // Refresh data
    } catch (error) {
      console.error('Error enrolling:', error);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course not found</h2>
          <Link to="/courses" className="btn-primary">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card">
            {/* Course Header */}
            <div className="aspect-video bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <BookOpen className="h-24 w-24 text-gray-400" />
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{course.totalDuration} minutes</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{course.enrollmentCount} students</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                <span>{course.rating.average.toFixed(1)} ({course.rating.count} reviews)</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {course.level}
              </span>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">{course.description}</p>

            {/* Course Modules */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Content</h3>
              <div className="space-y-3">
                {course.modules.map((module, index) => (
                  <div key={module._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900">{module.title}</h4>
                          {module.description && (
                            <p className="text-sm text-gray-600">{module.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{module.duration} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Outcomes */}
            {course.learningOutcomes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What you'll learn</h3>
                <ul className="space-y-2">
                  {course.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start">
                      <Award className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {course.requirements.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {course.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="card sticky top-8">
            <div className="text-center mb-6">
              <span className="text-3xl font-bold text-primary-600">₹{course.price}</span>
            </div>

            {enrollment ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">You're enrolled in this course!</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-green-700 mb-1">
                      <span>Progress</span>
                      <span>{enrollment.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${enrollment.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <Link 
                  to={`/learn/${course._id}`}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Continue Learning
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {isAuthenticated ? (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" className="w-full btn-primary block text-center">
                      Login to Enroll
                    </Link>
                    <Link to="/register" className="w-full btn-secondary block text-center">
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Course Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Course includes:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <Play className="h-4 w-4 mr-2" />
                  {course.modules.length} video modules
                </li>
                <li className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Downloadable resources
                </li>
                <li className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Certificate of completion
                </li>
              </ul>
            </div>

            {/* Instructor Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Instructor</h4>
              <div className="flex items-center">
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium">
                    {course.instructor.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{course.instructor.name}</p>
                  <p className="text-sm text-gray-600">Expert Instructor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;