// frontend/src/pages/instructor/InstructorChats.tsx
import React, { useEffect, useState, useRef } from "react";
import { chatAPI } from "../../services/api";
import { Send, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
const InstructorChats: React.FC = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat]);

  const loadChats = async () => {
    try {
      const res = await chatAPI.getMentorChats();

      // ✅ Group chats by student+course
      const grouped: Record<string, any> = {};
      for (const chat of res.data || []) {
        const studentId = chat.student?._id || chat.student;
        const courseId = chat.course?._id || chat.course;
        const key = `${studentId}-${courseId}`;

        if (!grouped[key]) {
          grouped[key] = { ...chat, messages: [] };
        }

        grouped[key].messages = [
          ...grouped[key].messages,
          ...(chat.messages || []),
        ];
      }

      setChats(Object.values(grouped));
    } catch (err) {
      console.error("Error loading chats:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChat || !newMessage.trim()) return;

    try {
      const courseId =
        typeof selectedChat.course === "string"
          ? selectedChat.course
          : selectedChat.course?._id;

      const studentId =
        typeof selectedChat.student === "string"
          ? selectedChat.student
          : selectedChat.student?._id;

      if (!courseId || !studentId) {
        alert("❌ Cannot send message. Invalid course or student.");
        return;
      }

      await chatAPI.sendMessageToStudent(courseId, studentId, newMessage);
      setNewMessage("");

      const refreshed = await chatAPI.getChatById(selectedChat._id);
      setSelectedChat(refreshed.data);

      loadChats();
    } catch (err: any) {
      console.error("Error sending message:", err.response?.data || err.message);
      alert("❌ Failed to send message.");
    }
  };

  return (
    <div>
      <Navbar />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto p-6">
      {/* Sidebar Chat List */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="border rounded-2xl p-4 bg-white shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
          Chats
        </h2>
        {chats.length === 0 && (
          <p className="text-gray-500 text-sm">No chats yet.</p>
        )}
        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          {chats.map((chat) => (
            <motion.button
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              whileHover={{ scale: 1.02 }}
              className={`w-full text-left p-3 rounded-xl transition ${
                selectedChat?._id === chat._id
                  ? "bg-blue-100 border border-blue-400 shadow-sm"
                  : "hover:bg-gray-50"
              }`}
            >
              <p className="font-medium text-gray-900">
                {chat.student?.name || "Unknown Student"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {chat.messages[chat.messages.length - 1]?.content ||
                  "No messages yet"}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Main Chat Window */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="md:col-span-2 border rounded-2xl flex flex-col bg-white shadow-lg"
      >
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold flex justify-between items-center rounded-t-2xl">
              <div>
                Chat with {selectedChat.student?.name}
                <p className="text-sm opacity-80 font-normal">
                  {selectedChat.course?.title || "Course"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              <AnimatePresence>
                {selectedChat.messages.map((msg: any, idx: number) => {
                  const isStudent = msg.sender._id === selectedChat.student._id;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex ${
                        isStudent ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-xs shadow-md ${
                          isStudent
                            ? "bg-white text-gray-800 border border-gray-200"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-[10px] mt-1 opacity-70 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t flex items-center gap-2 bg-white rounded-b-2xl">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-blue-600 transition"
              >
                <Send className="h-4 w-4" />
                Send
              </motion.button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-center p-6">
            <div>
              <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
    <Footer />
    </div>
  );
};

export default InstructorChats;
