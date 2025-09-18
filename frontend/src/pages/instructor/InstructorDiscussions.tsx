// frontend/src/pages/instructor/InstructorDiscussions.tsx
import React, { useEffect, useState } from "react";
import { forumAPI, courseAPI } from "../../services/api";
import { Plus } from "lucide-react";

const InstructorDiscussions: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "general" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await courseAPI.getInstructorCourses();
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const loadDiscussions = async (courseId: string) => {
    try {
      const res = await forumAPI.getCourseForums(courseId);
      setDiscussions(res.data);
    } catch (err) {
      console.error("Error loading forums:", err);
    }
  };

  const handleCreatePost = async () => {
    if (!selectedCourse) return;
    try {
      await forumAPI.createPost({
        ...newPost,
        course: selectedCourse._id,
      });
      setShowModal(false);
      setNewPost({ title: "", content: "", category: "general" });
      loadDiscussions(selectedCourse._id);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Course Discussions</h1>

      {/* Course Selector */}
      <div className="mb-4">
        <select
          value={selectedCourse?._id || ""}
          onChange={(e) => {
            const course = courses.find((c) => c._id === e.target.value);
            setSelectedCourse(course);
            if (course) loadDiscussions(course._id);
          }}
          className="input-field"
        >
          <option value="">Select a Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Discussion List */}
      {selectedCourse ? (
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">{selectedCourse.title} Discussions</h2>
            <button
              className="btn-primary flex items-center"
              onClick={() => setShowModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> New Post
            </button>
          </div>

          {discussions.length === 0 ? (
            <p className="text-gray-500">No discussions yet.</p>
          ) : (
            <div className="space-y-4">
              {discussions.map((post) => (
                <div key={post._id} className="border p-4 rounded-lg bg-white shadow-sm">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-gray-600">{post.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    By {post.author?.name || "Unknown"} •{" "}
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Select a course to view discussions.</p>
      )}

      {/* Modal for creating a post */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">New Discussion</h3>
            <input
              type="text"
              placeholder="Title"
              className="input-field mb-3"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <textarea
              rows={4}
              placeholder="Content"
              className="input-field mb-3"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            />
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              className="input-field mb-3"
            >
              <option value="general">General</option>
              <option value="assignment">Assignment</option>
              <option value="technical">Technical</option>
              <option value="announcement">Announcement</option>
            </select>
            <div className="flex justify-end space-x-3">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleCreatePost}>
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDiscussions;
