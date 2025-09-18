// frontend/src/pages/instructor/InstructorChats.tsx
import React, { useEffect, useState, useRef } from "react";
import { chatAPI } from "../../services/api";
import { Send } from "lucide-react";

const InstructorChats: React.FC = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    // Auto scroll when messages update
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

      // merge messages
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
        console.error("Missing courseId or studentId:", {
          courseId,
          studentId,
          selectedChat,
        });
        alert("❌ Cannot send message. Invalid course or student.");
        return;
      }

      await chatAPI.sendMessageToStudent(courseId, studentId, newMessage);
      setNewMessage("");

      // ✅ Refresh current chat
      const refreshed = await chatAPI.getChatById(selectedChat._id);
      setSelectedChat(refreshed.data);

      // ✅ Reload sidebar chat list
      loadChats();
    } catch (err: any) {
      console.error("Error sending message:", err.response?.data || err.message);
      alert("❌ Failed to send message. Check console.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto p-6">
      {/* Sidebar Chat List */}
      <div className="border rounded-lg p-4 bg-white shadow-md">
        <h2 className="text-xl font-semibold mb-4">Chats</h2>
        {chats.length === 0 && (
          <p className="text-gray-500 text-sm">No chats yet.</p>
        )}
        {chats.map((chat) => (
          <button
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            className={`w-full text-left p-3 rounded-lg mb-2 transition ${
              selectedChat?._id === chat._id
                ? "bg-blue-100 border border-blue-400"
                : "hover:bg-gray-50"
            }`}
          >
            <p className="font-medium">{chat.student?.name || "Unknown Student"}</p>
            <p className="text-xs text-gray-500 truncate">
              {chat.messages[chat.messages.length - 1]?.content ||
                "No messages yet"}
            </p>
          </button>
        ))}
      </div>

      {/* Main Chat Window */}
      <div className="md:col-span-2 border rounded-lg flex flex-col bg-white shadow-md">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-blue-50 font-semibold flex justify-between items-center">
              Chat with {selectedChat.student?.name}
              <span className="text-sm text-gray-500">
                {selectedChat.course?.title || "Course"}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedChat.messages.map((msg: any, idx: number) => {
                const isStudent = msg.sender._id === selectedChat.student._id;
                return (
                  <div
                    key={idx}
                    className={`flex ${
                      isStudent ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl max-w-xs shadow-sm ${
                        isStudent
                          ? "bg-gray-200 text-gray-800"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-[10px] mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t flex space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
              >
                <Send className="h-4 w-4 mr-1" /> Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorChats;
