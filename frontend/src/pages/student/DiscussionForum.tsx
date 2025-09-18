import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { forumAPI, enrollmentAPI } from "../../services/api";
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  User, 
  BookOpen, 
  Send, 
  ChevronDown, 
  ChevronUp,
  Search,
  Filter
} from "lucide-react";

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  author: { name: string; _id: string };
  course?: { _id: string; title: string };
  createdAt: string;
  replies: { 
    _id: string; 
    content: string; 
    author: { name: string; _id: string }; 
    createdAt: string 
  }[];
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
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [replyingTo, setReplyingTo] = useState<{postId: string, reply: string} | null>(null);
  const [creatingPost, setCreatingPost] = useState(false);

  useEffect(() => {
    if (finalCourseId) {
      fetchCoursePosts(finalCourseId);
    } else {
      fetchAllPosts();
    }
  }, [finalCourseId]);

  // Toggle post expansion
  const togglePost = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  // Fetch posts for one course
  const fetchCoursePosts = async (id: string) => {
    setLoading(true);
    try {
      const res = await forumAPI.getCourseForums(id);
      setPosts(res.data);
      // Expand all posts by default in course view
      setExpandedPosts(new Set(res.data.map((p: ForumPost) => p._id)));
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
      
      // Use Promise.all for parallel requests
      const forumPromises = enrollmentsRes.data.map((e: any) => 
        forumAPI.getCourseForums(e.course._id)
      );
      
      const forumResponses = await Promise.all(forumPromises);
      
      forumResponses.forEach((res, index) => {
        const course = enrollmentsRes.data[index].course;
        allPosts = [
          ...allPosts,
          ...res.data.map((p: ForumPost) => ({
            ...p,
            course,
          })),
        ];
      });
      
      // Sort posts by date
      allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    
    setCreatingPost(true);
    try {
      await forumAPI.createPost({ title, content, course: finalCourseId });
      setTitle("");
      setContent("");
      fetchCoursePosts(finalCourseId);
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setCreatingPost(false);
    }
  };

  // Handle reply submission
  const handleReply = async (postId: string, replyContent: string) => {
    if (!replyContent.trim()) return;
    
    try {
      await forumAPI.addReply(postId, replyContent);
      if (finalCourseId) {
        fetchCoursePosts(finalCourseId);
      } else {
        fetchAllPosts();
      }
      setReplyingTo(null);
    } catch (err) {
      console.error("Error adding reply:", err);
      alert("Failed to add reply. Please try again.");
    }
  };

  // Filter and sort posts
  const filteredAndSortedPosts = posts
    .filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.course && post.course.title.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading discussions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
            Discussion Forum
          </h1>
          {!finalCourseId && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {finalCourseId ? (
          <p className="text-gray-600">Course discussions for {posts[0]?.course?.title || "this course"}</p>
        ) : (
          <p className="text-gray-600">Discussions from all your enrolled courses</p>
        )}
      </div>

      {/* Post form only in a specific course */}
      {finalCourseId && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-blue-600" />
            Start a New Discussion
          </h2>
          <form onSubmit={handleCreatePost}>
            <input
              type="text"
              placeholder="Discussion Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              placeholder="What would you like to discuss?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            ></textarea>
            <button 
              type="submit" 
              disabled={creatingPost}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingPost ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Post Discussion
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Posts list */}
      <div className="space-y-4">
        {filteredAndSortedPosts.length > 0 ? (
          filteredAndSortedPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => togglePost(post._id)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900 text-lg">{post.title}</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    {expandedPosts.has(post._id) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-3">{post.author?.name || "Anonymous"}</span>
                  
                  {post.course && (
                    <>
                      <BookOpen className="h-4 w-4 mr-1 ml-3" />
                      <span className="mr-3">{post.course.title}</span>
                    </>
                  )}
                  
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                
                {expandedPosts.has(post._id) && (
                  <p className="text-gray-700 mt-3">{post.content}</p>
                )}
              </div>

              {/* Replies section - only show when expanded */}
              {expandedPosts.has(post._id) && (
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                    {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
                  </h4>
                  
                  {post.replies.length > 0 ? (
                    <div className="space-y-4 mb-4">
                      {post.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="bg-white rounded-lg p-4 border border-gray-200"
                        >
                          <p className="text-gray-700">{reply.content}</p>
                          <div className="flex items-center text-xs text-gray-500 mt-2">
                            <User className="h-3 w-3 mr-1" />
                            <span className="mr-2">{reply.author?.name || "Anonymous"}</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm mb-4">No replies yet. Be the first to respond!</p>
                  )}

                  {/* Reply form */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <textarea
                      placeholder="Write your reply..."
                      value={replyingTo?.postId === post._id ? replyingTo.reply : ''}
                      onChange={(e) => setReplyingTo({postId: post._id, reply: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleReply(post._id, replyingTo?.postId === post._id ? replyingTo.reply : '')}
                        disabled={!(replyingTo?.postId === post._id && replyingTo.reply.trim())}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Post Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No matching discussions found" : "No discussions yet"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : finalCourseId
                  ? "Be the first to start a discussion!"
                  : "Enroll in a course to see discussions."
              }
            </p>
            {finalCourseId && !searchTerm && (
              <button
                onClick={() => document.getElementById('new-post-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start a Discussion
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionForum;