import React, { useState, useEffect, useRef } from "react";
import { chatAPI, enrollmentAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Send, ArrowLeft, User, Clock, MessageSquare } from "lucide-react";

interface ChatMessage {
  _id: string;
  sender: { _id: string; name: string };
  content: string;
  createdAt: string;
  timestamp?: string;
}

interface Mentor {
  _id: string;
  name: string;
}

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchMentorAndChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMentorAndChat = async () => {
    try {
      // Get student's enrolled courses
      const enrollments = await enrollmentAPI.getMyEnrollments();

      // Save mentors (instructor + admins)
      const instructor = enrollments.data[0]?.course?.instructor || null;
      setMentor(instructor);

      // Get all chats of this student (includes both instructor + admin)
      const chats = await chatAPI.getStudentChats();

      // Merge all messages from all mentors into one array (sorted by time)
      const allMessages = chats.data.flatMap((c: any) =>
        c.messages.map((m: any) => ({
          ...m,
          mentor: c.mentor, // keep track of which mentor sent
        }))
      );

      // Sort by timestamp
      allMessages.sort(
        (a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setMessages(allMessages);
    } catch (error) {
      console.error("Error fetching mentor or chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !mentor) return;

    try {
      // Use first enrolled course
      const enrollments = await enrollmentAPI.getMyEnrollments();
      const courseId = enrollments.data[0]?.course?._id;
      if (!courseId) return;

      const res = await chatAPI.sendMessageToCourse(courseId, newMessage);
      setMessages(res.data.messages);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading your messages...</p>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-md p-6 bg-white rounded-2xl shadow-lg text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Chat</h2>
          <p className="text-gray-600 mb-4">
            You are not enrolled in any course yet. Enroll in a course to chat with your mentor.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden h-[85vh] flex flex-col">
        {/* Chat header */}
        <div className="flex-none p-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">Chat with {mentor.name}</h1>
              <p className="text-blue-100 text-sm flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {messages.length > 0 
                  ? `Last message: ${new Date(messages[messages.length - 1].timestamp || messages[messages.length - 1].createdAt).toLocaleTimeString()}`
                  : "No messages yet"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.sender._id === user?._id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md rounded-2xl p-4 ${
                      msg.sender._id === user?._id
                        ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-br-none"
                        : "bg-white border border-gray-200 text-gray-900 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className={`flex items-center mt-2 text-xs ${msg.sender._id === user?._id ? "text-blue-100" : "text-gray-500"}`}>
                      <span>{msg.sender.name}</span>
                      <span className="mx-1">•</span>
                      <span>{new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="mb-4 p-4 bg-blue-100 rounded-full">
                <MessageSquare className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No messages yet</h3>
              <p className="text-gray-600 max-w-md">
                Start the conversation with {mentor.name}. Ask questions about your course or discuss your progress.
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <form
          onSubmit={handleSendMessage}
          className="flex-none flex items-center p-4 border-t border-gray-200 bg-white"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`px-5 py-3 rounded-r-lg font-medium flex items-center ${
              newMessage.trim() 
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;