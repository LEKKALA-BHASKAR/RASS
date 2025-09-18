import React, { useState, useEffect } from "react";
import { BookOpen, Users, Award, Clock, MessageCircle, Search } from "lucide-react";
import { courseAPI, enrollmentAPI, assignmentAPI } from "../../services/api";
import { Course, Enrollment, Assignment } from "../../types";

const Students: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseStudents();
    }
  }, [selectedCourse]);

  const getStudentName = (student: any) =>
    typeof student === "string" ? "Unknown Student" : student.name;

  const getStudentEmail = (student: any) =>
    typeof student === "string" ? "" : student.email || "";

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getInstructorCourses();
      setCourses(response.data);
      if (response.data.length > 0) {
        setSelectedCourse(response.data[0]); // default to first
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseStudents = async () => {
    if (!selectedCourse) return;

    try {
      const [enrollmentsRes, assignmentsRes] = await Promise.all([
        enrollmentAPI.getCourseEnrollments(selectedCourse._id),
        assignmentAPI.getCourseAssignments(selectedCourse._id),
      ]);

      // ✅ Filter to only students (ignore admins/instructors)
      const onlyStudents = (enrollmentsRes.data || []).filter((enrollment: any) => {
        const student = enrollment.student;
        if (!student) return false;
        if (typeof student === "string") return true; // assume student
        return !student.role || student.role === "student";
      });

      setEnrollments(onlyStudents);
      setAssignments(assignmentsRes.data || []);
    } catch (error) {
      console.error("Error fetching course students:", error);
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const studentName =
      typeof enrollment.student === "object"
        ? enrollment.student?.name || ""
        : enrollment.student;

    const matchesSearch = studentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && enrollment.completed) ||
      (filterStatus === "in-progress" && !enrollment.completed);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
        <p className="text-gray-600 mt-2">
          Track and manage your students&apos; progress
        </p>
      </div>

      {/* Course Selector */}
      <div className="card mb-6">
        <div className="flex items-center space-x-4">
          <BookOpen className="h-5 w-5 text-gray-600" />
          <select
            className="input-field flex-1"
            value={selectedCourse?._id || ""}
            onChange={(e) => {
              const course = courses.find((c) => c._id === e.target.value);
              setSelectedCourse(course || null);
            }}
          >
            <option value="">Select a course</option>
            {courses.map((course) => {
              // ✅ Count only student enrollments
              const studentCount = enrollments.filter((enr) => {
                const student = enr.student;
                if (!student) return false;
                if (typeof student === "string") return true;
                return !student.role || student.role === "student";
              }).length;

              return (
                <option key={course._id} value={course._id}>
                  {course.title} ({studentCount} students)
                </option>
              );
            })}
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

          {/* Students */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Students in {selectedCourse.title}
            </h3>

            {filteredEnrollments.length > 0 ? (
              <div className="space-y-4">
                {filteredEnrollments.map((enrollment) => {
                  const student =
                    typeof enrollment.student === "object"
                      ? enrollment.student
                      : { _id: enrollment.student, name: "Unknown Student" };

                  return (
                    <div
                      key={enrollment._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium text-gray-900">
                              {getStudentName(enrollment.student)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {getStudentEmail(enrollment.student)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              enrollment.completed
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {enrollment.completed ? "Completed" : "In Progress"}
                          </span>
                          <div className="text-sm text-gray-600 mt-2">
                            Progress: {enrollment.completionPercentage}%
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
                        <div>
                          <Clock className="h-4 w-4 text-gray-600 mx-auto mb-1" />
                          <p className="text-sm text-gray-600">
                            {Math.floor(
                              enrollment.progress.reduce(
                                (total, p) => total + p.watchTime,
                                0
                              ) / 3600
                            )}
                            h
                          </p>
                        </div>
                        <div>
                          <Award className="h-4 w-4 text-gray-600 mx-auto mb-1" />
                          <p className="text-sm text-gray-600">
                            {
                              assignments.filter((a) =>
                                a.submissions?.some((s) =>
                                  typeof s.student === "string"
                                    ? s.student === student._id
                                    : s.student?._id === student._id
                                )
                              ).length
                            }
                            /{assignments.length}
                          </p>
                        </div>
                        <div>
                          <MessageCircle className="h-4 w-4 text-gray-600 mx-auto mb-1" />
                          <p className="text-sm text-gray-600">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No students found
                </h3>
                <p className="text-gray-600">
                  No students match your current filters
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Students;
