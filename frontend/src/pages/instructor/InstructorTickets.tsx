import React, { useEffect, useState } from "react";
import { supportTicketAPI } from "../../services/api";
import { MessageCircle, Clock, CheckCircle, AlertCircle, Send, Filter, Tag, Flag, User } from "lucide-react";
import { SupportTicket } from "../../types";

const InstructorTickets: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
  try {
    const response = await supportTicketAPI.getInstructorTickets(); // ✅ use instructor-only tickets
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


  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const response = await supportTicketAPI.addMessage(selectedTicket._id, newMessage);
      setSelectedTicket(response.data);
      setTickets((prev) =>
        prev.map((t) => (t._id === selectedTicket._id ? response.data : t))
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!selectedTicket) return;
    try {
      const response = await supportTicketAPI.updateTicketStatus(selectedTicket._id, status);
      setSelectedTicket(response.data);
      setTickets((prev) =>
        prev.map((t) => (t._id === selectedTicket._id ? response.data : t))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "in-progress": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "resolved": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "closed": return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default: return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tickets List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex justify-between">
            Support Tickets <span className="text-gray-500 text-sm">{tickets.length}</span>
          </h2>
          <div className="mb-4">
            <select
              className="w-full border rounded px-2 py-1"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedTicket?._id === ticket._id
                    ? "bg-blue-50 border border-blue-300"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  {getStatusIcon(ticket.status)}
                  <span className="text-xs text-gray-500">{ticket.ticketId}</span>
                </div>
                <h3 className="font-medium text-sm">{ticket.subject}</h3>
                <p className="text-xs text-gray-500">{ticket.category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 flex flex-col">
          {selectedTicket ? (
            <>
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-xl">{selectedTicket.subject}</h2>
                <div>
                  {["open", "in-progress", "resolved", "closed"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(s)}
                      className={`px-2 py-1 text-xs rounded ml-2 ${
                        selectedTicket.status === s ? "bg-blue-500 text-white" : "bg-gray-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {selectedTicket.messages.map((m) => (
                  <div
                    key={m._id}
                    className={`p-3 rounded ${
                      m.isStaff ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-sm flex items-center">
                        {m.isStaff && <User className="h-4 w-4 mr-1 text-blue-600" />}
                        {m.sender?.name || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(m.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{m.message}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !newMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {sendingMessage ? "Sending..." : <Send className="h-4 w-4" />}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center text-gray-500 my-auto">
              Select a ticket to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorTickets;
