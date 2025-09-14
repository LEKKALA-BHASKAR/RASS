import React, { useEffect, useState } from "react";
import { supportTicketAPI } from "../../services/api";

const SupportTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "medium",
  });
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [message, setMessage] = useState("");

  // Fetch tickets
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await supportTicketAPI.getMyTickets();
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Create new ticket
  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.description || !newTicket.category) {
      alert("Please fill all required fields (subject, description, category)");
      return;
    }
    try {
      await supportTicketAPI.createTicket(newTicket);
      setNewTicket({
        subject: "",
        description: "",
        category: "",
        priority: "medium",
      });
      fetchTickets();
    } catch (err) {
      console.error("Error creating ticket:", err);
    }
  };

  // Add message
  const handleAddMessage = async () => {
    if (!selectedTicket || !message.trim()) return;
    try {
      await supportTicketAPI.addMessage(selectedTicket._id, message);
      setMessage("");
      // Refresh tickets & update current ticket messages
      const res = await supportTicketAPI.getMyTickets();
      setTickets(res.data);
      const updated = res.data.find((t: any) => t._id === selectedTicket._id);
      setSelectedTicket(updated);
    } catch (err) {
      console.error("Error adding message:", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🎫 Support Tickets</h1>

      {/* Create Ticket */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Create New Ticket</h2>
        <input
          type="text"
          placeholder="Subject"
          value={newTicket.subject}
          onChange={(e) =>
            setNewTicket({ ...newTicket, subject: e.target.value })
          }
          className="border p-2 w-full mb-3 rounded"
        />
        <textarea
          placeholder="Describe your issue"
          value={newTicket.description}
          onChange={(e) =>
            setNewTicket({ ...newTicket, description: e.target.value })
          }
          className="border p-2 w-full mb-3 rounded"
          rows={3}
        />
        <select
          value={newTicket.category}
          onChange={(e) =>
            setNewTicket({ ...newTicket, category: e.target.value })
          }
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="">Select category</option>
          <option value="technical">Technical</option>
          <option value="billing">Billing</option>
          <option value="course">Course</option>
          <option value="account">Account</option>
          <option value="other">Other</option>
        </select>
        <select
          value={newTicket.priority}
          onChange={(e) =>
            setNewTicket({ ...newTicket, priority: e.target.value })
          }
          className="border p-2 w-full mb-4 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <button
          onClick={handleCreateTicket}
          className="bg-primary-600 text-green-500 px-4 py-2 rounded hover:bg-primary-700"
        >
          Submit Ticket
        </button>
      </div>

      {/* Ticket List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="card p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{ticket.subject}</h3>
                  <p className="text-sm text-gray-600">
                    Category: {ticket.category}
                  </p>
                  <p className="text-sm text-gray-600">
                    Priority: {ticket.priority}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {ticket.status}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  className="border px-3 py-1 rounded hover:bg-gray-100"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white rounded p-6 w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-2">{selectedTicket.subject}</h2>
            <p className="mb-2">{selectedTicket.description}</p>
            <p className="text-sm text-gray-600 mb-4">
              Category: {selectedTicket.category} | Priority:{" "}
              {selectedTicket.priority} | Status: {selectedTicket.status}
            </p>
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Messages:</h4>
              {selectedTicket.messages?.length > 0 ? (
                selectedTicket.messages.map((msg: any, i: number) => (
                  <div
                    key={i}
                    className="p-2 border rounded mb-2 bg-gray-50 text-sm"
                  >
                    <p>{msg.message}</p>
                    <p className="text-xs text-gray-500">
                      By {msg.sender?.name || "Unknown"} •{" "}
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No messages yet.</p>
              )}
            </div>
            <textarea
              placeholder="Write a reply..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border p-2 w-full mb-2 rounded"
              rows={3}
            />
            <div className="flex justify-between">
              <button
                onClick={handleAddMessage}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Send Reply
              </button>
              <button
                onClick={() => setSelectedTicket(null)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketsPage;
