import React, { useState, useEffect, useRef } from "react";
import { chatAPI, enrollmentAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

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

    const res = await chatAPI.sendMessageToCourse(courseId, newMessage); // <--- courseId
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">
          You are not enrolled in any course yet. Enroll in a course to chat
          with your mentor.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col border border-gray-300 rounded-lg">
      <div className="flex-none p-4 border-b bg-gray-100">
        <h1 className="text-xl font-bold">Chat with {mentor.name}</h1>
      </div>

      {/* Chat messages */}
<div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
  {messages.length > 0 ? (
    messages.map((msg) => (
      // ⬇️ REPLACE THIS BLOCK
      <div
        key={msg._id}
        className={`p-3 rounded-lg max-w-xs ${
          msg.sender._id === user?._id
            ? "bg-primary-600 text-white self-end ml-auto"
            : "bg-gray-200 text-gray-900"
        }`}
      >
        <p className="text-sm">{msg.content}</p>
        <span className="text-xs opacity-70 block mt-1">
          {msg.sender.name} • {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString()}
        </span>
      </div>
      // ⬆️ REPLACE WITH UPDATED VERSION
    ))
  ) : (
    <p className="text-gray-600 text-center">
      No messages yet. Start the conversation below 👇
    </p>
  )}
  <div ref={messagesEndRef} />
</div>

      {/* Input box */}
      <form
        onSubmit={handleSendMessage}
        className="flex-none flex items-center p-3 border-t bg-gray-50"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-3"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-red-500 rounded-lg hover:bg-primary-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
