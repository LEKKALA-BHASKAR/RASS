import React, { useState, useEffect, useRef } from "react";
import { chatAPI, enrollmentAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  Send,
  ArrowLeft,
  User,
  Clock,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { motion } from "framer-motion";

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
  courseId: string;
  courseTitle: string;
}

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [courseChats, setCourseChats] = useState<Record<string, ChatMessage[]>>(
    {}
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchMentorsAndChats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMentorsAndChats = async () => {
    try {
      const enrollments = await enrollmentAPI.getMyEnrollments();
      const mentorsData = enrollments.data.map((e: any) => ({
        _id: e.course.instructor._id,
        name: e.course.instructor.name,
        courseId: e.course._id,
        courseTitle: e.course.title,
      }));
      setMentors(mentorsData);

      // Fetch all chats for the student
      const chatsRes = await chatAPI.getStudentChats();
      const allChats = chatsRes.data;

      const chatMap: Record<string, ChatMessage[]> = {};
      allChats.forEach((c: any) => {
        const courseId = c.course._id;
        if (!chatMap[courseId]) chatMap[courseId] = [];
        chatMap[courseId].push(...c.messages);
      });

      if (mentorsData.length > 0) {
        setSelectedMentor(mentorsData[0]);
        setMessages(chatMap[mentorsData[0].courseId] || []);
      }
      setCourseChats(chatMap);
    } catch (error) {
      console.error("Error fetching mentors/chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMentor = (courseId: string) => {
    const mentor = mentors.find((m) => m.courseId === courseId) || null;
    setSelectedMentor(mentor);
    setMessages(courseChats[courseId] || []);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMentor) return;

    try {
      const res = await chatAPI.sendMessageToCourse(
        selectedMentor.courseId,
        newMessage
      );
      const updatedMessages = res.data.messages;

      setMessages(updatedMessages);
      setCourseChats((prev) => ({
        ...prev,
        [selectedMentor.courseId]: updatedMessages,
      }));
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
          <p className="mt-4 text-gray-600">Loading your chats...</p>
        </div>
      </div>
    );
  }

  if (!selectedMentor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-md p-6 bg-white rounded-2xl shadow-lg text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No Active Chat
          </h2>
          <p className="text-gray-600 mb-4">
            You are not enrolled in any course yet. Enroll in a course to start
            chatting with your mentor.
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
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden h-[85vh] flex flex-col">
          {/* Header with mentor selector */}
            <div className="flex-none p-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">
                  Chat with {selectedMentor?.name}
                </h1>
                <p className="text-blue-100 text-sm flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {messages.length > 0
                    ? `Last message: ${new Date(
                        messages[messages.length - 1].timestamp ||
                          messages[messages.length - 1].createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : "No messages yet"}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <label
                  htmlFor="mentorSelect"
                  className="text-sm font-medium text-white"
                >
                  Select mentor to chat:
                </label>
                <select
                  id="mentorSelect"
                  className="ml-2 px-3 py-2 rounded-lg text-gray-800 text-sm"
                  value={selectedMentor?.courseId}
                  onChange={(e) => handleSelectMentor(e.target.value)}
                >
                  {mentors.map((m) => (
                    <option key={m.courseId} value={m.courseId}>
                      {m.courseTitle} ({m.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>


          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isStudent = msg.sender._id === user?._id;
                  return (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${isStudent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md p-4 rounded-2xl shadow-sm ${
                          isStudent
                            ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-br-none"
                            : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <div
                          className={`flex items-center mt-2 text-xs ${
                            isStudent ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          <span>{msg.sender.name}</span>
                          <span className="mx-1">•</span>
                          <span>
                            {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="mb-4 p-4 bg-blue-100 rounded-full">
                  <MessageSquare className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-600 max-w-md">
                  Start the conversation with {selectedMentor?.name}. Ask
                  questions about your course or discuss your progress.
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>


          {/* Input */}
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
      <Footer />
    </div>
  );
};

export default Chat;
