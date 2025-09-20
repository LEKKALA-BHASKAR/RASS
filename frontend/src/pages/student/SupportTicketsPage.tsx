// frontend/src/pages/support/SupportTickets.tsx

import React, { useState, useEffect } from "react";
import { supportTicketAPI } from "../../services/api";
import {
  MessageCircle,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Send,
  Tag,
  Flag,
  Search,
  Filter,
  User,
} from "lucide-react";
import { SupportTicket } from "../../types";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [creatingTicket, setCreatingTicket] = useState(false);

  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    category: "technical",
    priority: "medium",
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await supportTicketAPI.getMyTickets();
      setTickets(response.data);
      if (!selectedTicket && response.data.length > 0) {
        setSelectedTicket(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingTicket(true);
    try {
      const response = await supportTicketAPI.createTicket(newTicket);
      setShowCreateModal(false);
      setNewTicket({
        subject: "",
        description: "",
        category: "technical",
        priority: "medium",
      });
      setSelectedTicket(response.data);
      fetchTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("❌ Failed to create ticket. Try again.");
    } finally {
      setCreatingTicket(false);
    }
  };

  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const response = await supportTicketAPI.addMessage(selectedTicket._id, newMessage);
      setSelectedTicket(response.data);
      setNewMessage("");
      setTickets((prev) =>
        prev.map((t) => (t._id === selectedTicket._id ? response.data : t))
      );
    } catch (error) {
      console.error("Error adding message:", error);
      alert("❌ Failed to send message. Try again.");
    } finally {
      setSendingMessage(false);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-yellow-100 text-yellow-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
            <p className="text-gray-600 mt-2">
              Submit and track your tickets easily
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 lg:mt-0 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium flex items-center hover:from-blue-700 hover:to-indigo-800 transition"
          >
            <Plus className="h-5 w-5 mr-2" /> Create Ticket
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tickets List */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">My Tickets</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {tickets.length}
              </span>
            </div>

            {/* Search & Filter */}
            <div className="space-y-3 mb-6">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Tickets */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <motion.div
                    key={ticket._id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 rounded-xl cursor-pointer transition ${
                      selectedTicket?._id === ticket._id
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200"
                        : "bg-gray-50 border hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(ticket.status)}
                        <span className="text-xs text-gray-500">{ticket.ticketId}</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm mt-2 truncate">
                      {ticket.subject}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 capitalize flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {ticket.category}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(ticket.createdAt)}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">
                  No tickets found
                </p>
              )}
            </div>
          </div>

          {/* Ticket Details */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 flex flex-col">
            {selectedTicket ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedTicket.subject}
                  </h2>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 capitalize">
                    {selectedTicket.status}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {selectedTicket.messages.map((msg) => (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl ${
                        msg.isStaff ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          {msg.isStaff && <User className="h-4 w-4 text-blue-600" />}
                          {msg.sender.name}
                          {msg.isStaff && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                              Staff
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(msg.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{msg.message}</p>
                    </motion.div>
                  ))}
                </div>

                {selectedTicket.status !== "closed" &&
                  selectedTicket.status !== "resolved" && (
                    <form
                      onSubmit={handleAddMessage}
                      className="border-t pt-4 flex flex-col"
                    >
                      <textarea
                        rows={3}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={sendingMessage || !newMessage.trim()}
                        className="mt-3 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition"
                      >
                        {sendingMessage ? "Sending..." : "Send"}
                      </button>
                    </form>
                  )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a ticket to view details
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Create Support Ticket
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newTicket.subject}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, subject: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={5}
                  required
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newTicket.description}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-gray-400" />
                    Category
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newTicket.category}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, category: e.target.value })
                    }
                  >
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="course">Course</option>
                    <option value="account">Account</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Flag className="h-4 w-4 mr-2 text-gray-400" />
                    Priority
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newTicket.priority}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, priority: e.target.value })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingTicket}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition"
                >
                  {creatingTicket ? "Creating..." : "Create Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
      <Footer />
    </div>
  );
};

export default SupportTickets;
