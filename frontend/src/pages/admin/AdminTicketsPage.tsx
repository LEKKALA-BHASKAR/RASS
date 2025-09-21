import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiMessageSquare,
  FiUser
} from "react-icons/fi";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const AdminTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");


  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, statusFilter]);

  const fetchTickets = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(
        "https://rass-h2s1.onrender.com/api/support-tickets/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTickets(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterTickets = () => {
    let result = tickets;

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(ticket => ticket.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        ticket =>
          ticket.subject.toLowerCase().includes(term) ||
          ticket.message.toLowerCase().includes(term) ||
          (ticket.user?.name && ticket.user.name.toLowerCase().includes(term))
      );
    }

    setFilteredTickets(result);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <FiAlertCircle className="text-green-500" />;
      case "closed":
        return <FiCheckCircle className="text-gray-500" />;
      case "pending":
        return <FiClock className="text-amber-500" />;
      default:
        return <FiMessageSquare className="text-blue-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-700 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-md">
          <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Tickets</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTickets}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
        <Navbar/>
    <div className="min-h-screen bg-gray-50 p-6">
        
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600 mt-2">Manage and respond to customer support requests</p>
          </div>
          <button
            onClick={fetchTickets}
            disabled={refreshing}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="flex items-center justify-end text-sm text-gray-600">
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {filteredTickets.length} {filteredTickets.length === 1 ? "ticket" : "tickets"}
              </span>
            </div>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <FiMessageSquare className="text-gray-300 text-4xl mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No tickets found</h3>
              <p className="text-gray-500 mt-2">
                {tickets.length === 0
                  ? "There are no support tickets yet."
                  : "Try adjusting your search or filter criteria."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          {getStatusIcon(ticket.status)}
                        </div>
                        <div>
                          <h2 className="font-semibold text-lg text-gray-900">{ticket.subject}</h2>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FiUser className="mr-1" />
                            <span className="mr-4">{ticket.user?.name || "Unknown User"}</span>
                            <FiClock className="mr-1" />
                            <span>{formatDate(ticket.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusClass(
                          ticket.status
                        )}`}
                      >
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </div>
                    <p className="mt-4 text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {ticket.message}
                    </p>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 rounded-b-xl flex justify-end">
                    <button className="text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
    </div>
    <Footer/>
    </div>
  );
};

export default AdminTicketsPage;