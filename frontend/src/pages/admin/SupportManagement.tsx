import React, { useState, useEffect } from "react";
import { supportTicketAPI } from "../../services/api";
import {
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  User,
  Loader2,
} from "lucide-react";
import { SupportTicket } from "../../types";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const SupportManagement: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    try {
      const response = await supportTicketAPI.getAllTickets();
      let data: SupportTicket[] = response.data || [];
      if (statusFilter !== "all") {
        data = data.filter((t) => t.status === statusFilter);
      }
      setTickets(data);
      if (!selectedTicket && data.length > 0) {
        setSelectedTicket(data[0]);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim()) return;
    setSendingMessage(true);
    try {
      const response = await supportTicketAPI.addMessage(
        selectedTicket._id,
        newMessage
      );
      setSelectedTicket(response.data);
      setTickets((prev) =>
        prev.map((t) => (t._id === selectedTicket._id ? response.data : t))
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("❌ Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!selectedTicket) return;
    try {
      const response = await supportTicketAPI.updateTicketStatus(
        selectedTicket._id,
        status
      );
      // Ensure the updated ticket has all the necessary populated fields
      const updatedTicket = response.data;
      setSelectedTicket(updatedTicket);
      setTickets((prev) =>
        prev.map((t) => (t._id === selectedTicket._id ? updatedTicket : t))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("❌ Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-red-100 text-red-700",
      "in-progress": "bg-yellow-100 text-yellow-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-600",
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${colors[status] || "bg-gray-100"}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tickets List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
            Support Tickets
            <span className="text-sm text-gray-500">{tickets.length}</span>
          </h2>
          <select
            className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <div className="space-y-3">
            {tickets.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No tickets found.</p>
            ) : (
              tickets.map((ticket) => (
                <motion.div
                  key={ticket._id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 rounded-xl cursor-pointer transition ${
                    selectedTicket?._id === ticket._id
                      ? "bg-indigo-50 border-2 border-indigo-300"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {ticket.subject}
                    </p>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <p className="text-xs text-gray-600 capitalize">{ticket.category}</p>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Ticket Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 flex flex-col"
        >
          {selectedTicket ? (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h2 className="font-bold text-2xl">{selectedTicket.subject}</h2>
                <div className="flex flex-wrap gap-2">
                  {["open", "in-progress", "resolved", "closed"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(s)}
                      className={`px-3 py-1 text-xs rounded-lg transition ${
                        selectedTicket.status === s
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 mb-4">
                {selectedTicket.messages.map((m) => (
                  <motion.div
                    key={m._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl ${
                      m.isStaff
                        ? "bg-indigo-50 border border-indigo-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-sm flex items-center">
                        {m.isStaff && <User className="h-4 w-4 mr-1 text-indigo-600" />}
                        {m.sender?.name || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(m.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{m.message}</p>
                  </motion.div>
                ))}
              </div>

              {/* Reply Form */}
              {selectedTicket.status !== "closed" && (
                <form onSubmit={handleAddMessage} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessage.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg flex items-center justify-center transition disabled:opacity-50"
                  >
                    {sendingMessage ? "Sending..." : <Send className="h-4 w-4" />}
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No ticket selected</h3>
                <p className="text-sm">Select a ticket from the list to view details</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      
    </div>
    <Footer />
    </div>
  );
};

export default SupportManagement;