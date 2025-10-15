import React, { useState, useEffect } from "react";
import { supportTicketAPI } from "../../services/api";
import {
  MessageCircle,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Calendar,
  Loader2,
} from "lucide-react";
import { SupportTicket } from "../../types";
import { motion } from "framer-motion";

const SupportManagement: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  useEffect(() => {
  fetchTickets();
  console.log("Loading tickets for admin...");
}, [filters]);


  const fetchTickets = async () => {
    try {
      const response = await supportTicketAPI.getAllTickets(filters);
      setTickets(response.data);
      if (response.data.length > 0 && !selectedTicket) {
        setSelectedTicket(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId: string, status: string) => {
    try {
      await supportTicketAPI.updateTicketStatus(ticketId, status);
      fetchTickets();
      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: status as any });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim()) return;

    setSending(true);
    try {
      const response = await supportTicketAPI.addMessage(
        selectedTicket._id,
        newMessage
      );
      setSelectedTicket(response.data);
      setNewMessage("");
      fetchTickets();
    } catch (error) {
      console.error("Error adding message:", error);
    } finally {
      setSending(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "closed":
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
        <p className="text-gray-600 mt-2">
          Manage and resolve support requests from all students
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar - Ticket List */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow p-5"
        >
          {/* Filters */}
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Filters</h3>
            <div className="space-y-3">
              <select
                className="w-full input-field"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                className="w-full input-field"
                value={filters.priority}
                onChange={(e) =>
                  setFilters({ ...filters, priority: e.target.value })
                }
              >
                <option value="">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Ticket List */}
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {tickets.length === 0 ? (
              <p className="text-sm text-gray-500">No tickets found.</p>
            ) : (
              tickets.map((ticket) => (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  key={ticket._id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 rounded-lg cursor-pointer transition ${
                    selectedTicket?._id === ticket._id
                      ? "bg-indigo-50 border border-indigo-300"
                      : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(ticket.status)}
                      <span className="text-sm font-medium text-gray-900">
                        {ticket.ticketId}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                    {ticket.subject}
                  </h4>
                  <p className="text-xs text-gray-500">
                    by {ticket.user.name} •{" "}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Ticket Details */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow p-6 flex flex-col"
        >
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedTicket.subject}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {selectedTicket.user.name}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(selectedTicket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Status Update */}
                <select
                  className="input-field text-sm"
                  value={selectedTicket.status}
                  onChange={(e) =>
                    handleStatusUpdate(selectedTicket._id, e.target.value)
                  }
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-1">
                {selectedTicket.messages.map((msg) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${
                      msg.isStaff
                        ? "bg-indigo-50 border border-indigo-200 ml-auto max-w-lg"
                        : "bg-gray-50 border border-gray-200 mr-auto max-w-lg"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm text-gray-900">
                        {msg.sender?.name || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{msg.message}</p>
                  </motion.div>
                ))}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleAddMessage} className="border-t pt-4">
                <div className="flex items-center gap-3">
                  <textarea
                    rows={2}
                    placeholder="Type your response..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    {sending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Send"
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
              <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">No ticket selected</h3>
              <p>Select a ticket from the sidebar to view details</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SupportManagement;
