import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { forumAPI, enrollmentAPI } from "../../services/api";

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  author: { name: string };
  course?: { _id: string; title: string };
  createdAt: string;
  replies: { _id: string; content: string; author: { name: string }; createdAt: string }[];
}

interface DiscussionForumProps {
  courseId?: string; // optional prop for CoursePlayer
}

const DiscussionForum: React.FC<DiscussionForumProps> = ({ courseId }) => {
  const { courseId: paramCourseId } = useParams<{ courseId: string }>();
  const finalCourseId = courseId || paramCourseId;

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (finalCourseId) {
      fetchCoursePosts(finalCourseId);
    } else {
      fetchAllPosts();
    }
  }, [finalCourseId]);

  // Fetch posts for one course
  const fetchCoursePosts = async (id: string) => {
    setLoading(true);
    try {
      const res = await forumAPI.getCourseForums(id);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching course posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts for all enrolled courses
  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const enrollmentsRes = await enrollmentAPI.getMyEnrollments();
      let allPosts: ForumPost[] = [];
      for (const e of enrollmentsRes.data) {
        const res = await forumAPI.getCourseForums(e.course._id);
        allPosts = [
          ...allPosts,
          ...res.data.map((p: ForumPost) => ({
            ...p,
            course: e.course,
          })),
        ];
      }
      setPosts(allPosts);
    } catch (err) {
      console.error("Error fetching all posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new post (only allowed inside a specific course)
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalCourseId) {
      alert("Please go to a specific course to create a discussion.");
      return;
    }
    try {
      await forumAPI.createPost({ title, content, course: finalCourseId });
      setTitle("");
      setContent("");
      fetchCoursePosts(finalCourseId);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Discussion Forum</h1>

      {/* Post form only in a specific course */}
      {finalCourseId && (
        <form onSubmit={handleCreatePost} className="card p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Start a New Discussion</h2>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
          />
          <textarea
            placeholder="Write your content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
            rows={4}
          ></textarea>
          <button type="submit" className="btn-primary px-4 py-2 rounded-lg">
            Post Discussion
          </button>
        </form>
      )}

      {/* Posts list */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="card p-4 border border-gray-200 rounded-lg"
            >
              <h3 className="font-semibold text-gray-900">{post.title}</h3>
              <p className="text-gray-700 mt-1">{post.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                Posted by {post.author?.name || "Anonymous"}{" "}
                {post.course && (
                  <>
                    {" "}
                    | Course:{" "}
                    <span className="font-medium">{post.course.title}</span>
                  </>
                )}{" "}
                on {new Date(post.createdAt).toLocaleDateString()}
              </p>

              {/* Replies */}
              <div className="ml-4 mt-3">
                <h4 className="text-sm font-medium mb-2">Replies</h4>
                {post.replies && post.replies.length > 0 ? (
                  post.replies.map((reply) => (
                    <div
                      key={reply._id}
                      className="border-l-2 border-gray-200 pl-3 mb-2"
                    >
                      <p className="text-sm">{reply.content}</p>
                      <p className="text-xs text-gray-500">
                        — {reply.author?.name || "Anonymous"} on{" "}
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No replies yet</p>
                )}
              </div>

              {/* Reply form */}
              <ReplyBox
                onReply={async (replyContent) => {
                  if (!replyContent.trim()) return;
                  await forumAPI.addReply(post._id, replyContent);
                  finalCourseId
                    ? fetchCoursePosts(finalCourseId)
                    : fetchAllPosts();
                }}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-600">
            No discussions yet.{" "}
            {finalCourseId
              ? "Be the first to start one!"
              : "Enroll in a course to see discussions."}
          </p>
        )}
      </div>
    </div>
  );
};

// Small reply box component
const ReplyBox: React.FC<{ onReply: (content: string) => void }> = ({ onReply }) => {
  const [reply, setReply] = useState("");

  return (
    <div className="mt-3">
      <textarea
        placeholder="Write a reply..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 text-sm"
        rows={2}
      />
      <button
        onClick={() => {
          if (reply.trim()) {
            onReply(reply);
            setReply("");
          }
        }}
        className="btn-secondary px-3 py-1 text-sm"
      >
        Reply
      </button>
    </div>
  );
};

export default DiscussionForum;
