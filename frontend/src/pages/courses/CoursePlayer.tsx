import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courseAPI, enrollmentAPI, forumAPI } from '../../services/api';
import { PlayCircle, CheckCircle, FileText, MessageCircle, Calendar } from 'lucide-react';
import { Course, Enrollment, ForumPost } from '../../types';
import DiscussionForum from '../student/DiscussionForum';
const CoursePlayer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'discussions' | 'assignments'>('overview');
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, enrollmentsRes, forumRes] = await Promise.all([
        courseAPI.getCourse(courseId!),
        enrollmentAPI.getMyEnrollments(),
        forumAPI.getCourseForums(courseId!)
      ]);

      setCourse(courseRes.data);
      const userEnrollment = enrollmentsRes.data.find((e: Enrollment) => e.course._id === courseId);
      setEnrollment(userEnrollment || null);
      setForumPosts(forumRes.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleComplete = async (moduleId: string) => {
    try {
      await enrollmentAPI.updateProgress({
        courseId,
        moduleId,
        completed: true,
        watchTime: course?.modules[currentModule]?.duration || 0
      });
      await fetchCourseData(); // Refresh enrollment data
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course not accessible</h2>
          <p className="text-gray-600">Please enroll in this course to access the content.</p>
        </div>
      </div>
    );
  }

  const currentModuleData = course.modules[currentModule];
  const isCurrentModuleCompleted = enrollment.progress.find(
    p => p.moduleId === currentModuleData?._id
  )?.completed || false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
        {/* Sidebar - Module List */}
        <div className="lg:col-span-1 bg-white border-r border-gray-200 max-h-screen overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{course.title}</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{enrollment.completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${enrollment.completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            {course.modules.map((module, index) => {
              const moduleProgress = enrollment.progress.find(p => p.moduleId === module._id);
              const isCompleted = moduleProgress?.completed || false;
              
              return (
                <div
                  key={module._id}
                  className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
                    currentModule === index 
                      ? 'bg-primary-50 border border-primary-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentModule(index)}
                >
                  <div className="flex items-center">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    ) : (
                      <PlayCircle className="h-5 w-5 text-gray-400 mr-3" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{module.title}</p>
                      <p className="text-xs text-gray-600">{module.duration} min</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Video Player */}
          <div className="bg-black aspect-video flex items-center justify-center">
            {currentModuleData?.videoUrl ? (
              <video 
                controls 
                className="w-full h-full"
                src={currentModuleData.videoUrl}
                onEnded={() => handleModuleComplete(currentModuleData._id)}
              />
            ) : (
              <div className="text-center text-white">
                <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Video content coming soon</p>
              </div>
            )}
          </div>

          {/* Course Controls */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{currentModuleData?.title}</h3>
                <p className="text-gray-600">{currentModuleData?.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                {!isCurrentModuleCompleted && (
                  <button
                    onClick={() => handleModuleComplete(currentModuleData._id)}
                    className="btn-primary flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </button>
                )}
                <div className="flex space-x-2">
                  <button
                    disabled={currentModule === 0}
                    onClick={() => setCurrentModule(currentModule - 1)}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentModule === course.modules.length - 1}
                    onClick={() => setCurrentModule(currentModule + 1)}
                    className="btn-primary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-6">
              <div className="flex space-x-8">
                {['overview', 'discussions'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white p-6">
            {activeTab === 'overview' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Module Overview</h4>
                <p className="text-gray-700 mb-6">{currentModuleData?.description}</p>
                
                {currentModuleData?.resources && currentModuleData.resources.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Resources</h5>
                    <div className="space-y-2">
                      {currentModuleData.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <FileText className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-900">{resource.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'discussions' && (
                <DiscussionForum courseId={course._id} />
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;