import React, { useState, useEffect } from 'react';
import { courseAPI, enrollmentAPI, assignmentAPI } from '../../services/api';
import { Users, Search, Filter, BookOpen, Award, Clock, MessageCircle } from 'lucide-react';
import { Course, Enrollment, Assignment } from '../../types';

const Students: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseStudents();
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getInstructorCourses();
      setCourses(response.data);
      if (response.data.length > 0) {
        setSelectedCourse(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseStudents = async () => {
    if (!selectedCourse) return;
    
    try {
      // In a real app, you'd have an endpoint to get enrollments for instructor's courses
      const [assignmentsRes] = await Promise.all([
        assignmentAPI.getCourseAssignments(selectedCourse._id)
      ]);
      
      setAssignments(assignmentsRes.data);
      
      // Mock enrollment data for demonstration
      const mockEnrollments: Enrollment[] = [
        {
          _id: '1',
          student: 'student1',
          course: {
            _id: selectedCourse._id,
            title: selectedCourse.title,
            description: selectedCourse.description,
            instructor: selectedCourse.instructor,
            category: selectedCourse.category,
            level: selectedCourse.level,
            price: selectedCourse.price,
            modules: selectedCourse.modules,
            totalDuration: selectedCourse.totalDuration,
            enrollmentCount: selectedCourse.enrollmentCount,
            rating: selectedCourse.rating,
            isPublished: selectedCourse.isPublished,
            tags: selectedCourse.tags,
            requirements: selectedCourse.requirements,
            learningOutcomes: selectedCourse.learningOutcomes,
            createdAt: selectedCourse.createdAt,
            updatedAt: selectedCourse.updatedAt
          },
          enrolledAt: '2024-01-15',
          progress: selectedCourse.modules.map(module => ({
            moduleId: module._id,
            completed: Math.random() > 0.5,
            watchTime: Math.floor(Math.random() * module.duration * 60)
          })),
          completed: Math.random() > 0.7,
          certificateIssued: false,
          paymentStatus: 'completed',
          completionPercentage: Math.floor(Math.random() * 100)
        }
      ];
      
      setEnrollments(mockEnrollments);
    } catch (error) {
      console.error('Error fetching course students:', error);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = true; // In real app, filter by student name
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && enrollment.completed) ||
      (filterStatus === 'in-progress' && !enrollment.completed);
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
        <p className="text-gray-600 mt-2">Track and manage your students' progress</p>
      </div>

      {/* Course Selection */}
      <div className="card mb-6">
        <div className="flex items-center space-x-4">
          <BookOpen className="h-5 w-5 text-gray-600" />
          <select
            className="input-field flex-1"
            value={selectedCourse?._id || ''}
            onChange={(e) => {
              const course = courses.find(c => c._id === e.target.value);
              setSelectedCourse(course || null);
            }}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title} ({course.enrollmentCount} students)
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCourse && (
        <>
          {/* Filters */}
          <div className="card mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="input-field"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Students</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Students List */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Students in {selectedCourse.title}
            </h3>

            {filteredEnrollments.length > 0 ? (
              <div className="space-y-4">
                {filteredEnrollments.map((enrollment) => (
                  <div key={enrollment._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium text-gray-900">Student Name</h4>
                          <p className="text-sm text-gray-600">student@example.com</p>
                          <p className="text-xs text-gray-500">
                            Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            enrollment.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {enrollment.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Progress: {enrollment.completionPercentage}%
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="flex items-center justify-center mb-1">
                            <Clock className="h-4 w-4 text-gray-600 mr-1" />
                            <span className="text-sm font-medium text-gray-900">Watch Time</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {Math.floor(enrollment.progress.reduce((total, p) => total + p.watchTime, 0) / 3600)}h
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-center mb-1">
                            <Award className="h-4 w-4 text-gray-600 mr-1" />
                            <span className="text-sm font-medium text-gray-900">Assignments</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {assignments.filter(a => a.submissions.some(s => s.student._id === enrollment.student)).length}/{assignments.length}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-center mb-1">
                            <MessageCircle className="h-4 w-4 text-gray-600 mr-1" />
                            <span className="text-sm font-medium text-gray-900">Last Active</span>
                          </div>
                          <p className="text-sm text-gray-600">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-600">No students match your current filters</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Students;