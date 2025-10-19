import React, { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

interface AgendaItem {
  day: string;
  title: string;
  description: string;
  time: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface Attendee {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  registeredAt: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  aboutEvent: string;
  date: string;
  location: string;
  type: "Free" | "Paid";
  price: number;
  imageUrl: string;
  highlights: string[];
  agenda: AgendaItem[];
  faq: FAQItem[];
  attendees: Attendee[];
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalEvents: number;
  totalAttendees: number;
  eventsByType: { _id: string; count: number }[];
  recentEvents: Event[];
  upcomingEvents: Event[];
}

export default function ManageEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "create" | "edit" | "attendees">("list");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    aboutEvent: "",
    date: "",
    location: "",
    type: "Free" as "Free" | "Paid",
    price: 0,
    imageUrl: "",
    highlights: [] as string[],
    agenda: [] as AgendaItem[],
    faq: [] as FAQItem[]
  });

  // Form states for dynamic fields
  const [newHighlight, setNewHighlight] = useState("");
  const [newAgendaItem, setNewAgendaItem] = useState({
    day: "",
    title: "",
    description: "",
    time: ""
  });
  const [newFAQItem, setNewFAQItem] = useState({
    question: "",
    answer: ""
  });

  // Attendee form state
  const [attendeeForm, setAttendeeForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    fetchEvents();
    fetchDashboardStats();
  }, []);

  const fetchEvents = async () => {
    try {
      // Use local endpoint instead of remote
      const res = await fetch("http://localhost:8000/api/admin/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Use local endpoint instead of remote
      const res = await fetch("http://localhost:8000/api/admin/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use local endpoint instead of remote
      const res = await fetch("http://localhost:8000/api/admin/create-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        alert("Event created successfully!");
        setForm({ 
          title: "", 
          description: "", 
          aboutEvent: "",
          date: "", 
          location: "", 
          type: "Free", 
          price: 0,
          imageUrl: "",
          highlights: [],
          agenda: [],
          faq: []
        });
        setView("list");
        fetchEvents();
        fetchDashboardStats();
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Error creating event");
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      // Use local endpoint instead of remote
      const res = await fetch(`http://localhost:8000/api/admin/events/${selectedEvent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        alert("Event updated successfully!");
        setView("list");
        fetchEvents();
        fetchDashboardStats();
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Error updating event");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      // Use local endpoint instead of remote
      const res = await fetch(`http://localhost:8000/api/admin/events/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        alert("Event deleted successfully!");
        fetchEvents();
        fetchDashboardStats();
      }
    } catch (error) {
      alert("Error deleting event");
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedEvents.length || !confirm("Are you sure you want to delete selected events?")) return;

    try {
      // Use local endpoint instead of remote
      const res = await fetch("http://localhost:8000/api/admin/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventIds: selectedEvents }),
      });
      
      if (res.ok) {
        alert("Events deleted successfully!");
        setSelectedEvents([]);
        fetchEvents();
        fetchDashboardStats();
      }
    } catch (error) {
      alert("Error deleting events");
    }
  };

  const handleAddAttendee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      // Use local endpoint instead of remote
      const res = await fetch(`http://localhost:8000/api/admin/events/${selectedEvent._id}/attendees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attendeeForm),
      });
      
      if (res.ok) {
        alert("Attendee added successfully!");
        setAttendeeForm({ name: "", email: "", phone: "" });
        fetchEvents(); // Refresh to get updated attendees
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Error adding attendee");
    }
  };

  const handleRemoveAttendee = async (attendeeId: string) => {
    if (!selectedEvent || !confirm("Remove this attendee?")) return;

    try {
      // Use local endpoint instead of remote
      const res = await fetch(`http://localhost:8000/api/admin/events/${selectedEvent._id}/attendees/${attendeeId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        alert("Attendee removed successfully!");
        fetchEvents();
      }
    } catch (error) {
      alert("Error removing attendee");
    }
  };

  const handleExportAttendees = async (eventId: string, eventTitle: string) => {
    try {
      // Use local endpoint instead of remote
      const res = await fetch(`http://localhost:8000/api/admin/export/${eventId}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${eventTitle.replace(/\s+/g, '_')}_attendees.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      alert("Error exporting attendees");
    }
  };

  const handleDuplicateEvent = async (eventId: string) => {
    try {
      // Use local endpoint instead of remote
      const res = await fetch(`http://localhost:8000/api/admin/events/${eventId}/duplicate`, {
        method: "POST",
      });
      
      if (res.ok) {
        alert("Event duplicated successfully!");
        fetchEvents();
        fetchDashboardStats();
      }
    } catch (error) {
      alert("Error duplicating event");
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      aboutEvent: event.aboutEvent,
      date: event.date.split('T')[0],
      location: event.location,
      type: event.type,
      price: event.price,
      imageUrl: event.imageUrl,
      highlights: [...event.highlights],
      agenda: [...event.agenda],
      faq: [...event.faq]
    });
    setView("edit");
  };

  const handleViewAttendees = (event: Event) => {
    setSelectedEvent(event);
    setView("attendees");
  };

  const resetForm = () => {
    setForm({ 
      title: "", 
      description: "", 
      aboutEvent: "",
      date: "", 
      location: "", 
      type: "Free", 
      price: 0,
      imageUrl: "",
      highlights: [],
      agenda: [],
      faq: []
    });
    setNewHighlight("");
    setNewAgendaItem({ day: "", title: "", description: "", time: "" });
    setNewFAQItem({ question: "", answer: "" });
    setSelectedEvent(null);
  };

  // Highlight management
  const addHighlight = () => {
    if (newHighlight.trim()) {
      setForm({ ...form, highlights: [...form.highlights, newHighlight.trim()] });
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    const newHighlights = [...form.highlights];
    newHighlights.splice(index, 1);
    setForm({ ...form, highlights: newHighlights });
  };

  // Agenda management
  const addAgendaItem = () => {
    if (newAgendaItem.day && newAgendaItem.title && newAgendaItem.description && newAgendaItem.time) {
      setForm({ ...form, agenda: [...form.agenda, { ...newAgendaItem }] });
      setNewAgendaItem({ day: "", title: "", description: "", time: "" });
    }
  };

  const removeAgendaItem = (index: number) => {
    const newAgenda = [...form.agenda];
    newAgenda.splice(index, 1);
    setForm({ ...form, agenda: newAgenda });
  };

  // FAQ management
  const addFAQItem = () => {
    if (newFAQItem.question && newFAQItem.answer) {
      setForm({ ...form, faq: [...form.faq, { ...newFAQItem }] });
      setNewFAQItem({ question: "", answer: "" });
    }
  };

  const removeFAQItem = (index: number) => {
    const newFAQ = [...form.faq];
    newFAQ.splice(index, 1);
    setForm({ ...form, faq: newFAQ });
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || event.type === filter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Manage Events</h1>
            <p className="text-xl text-gray-600">Create, edit, and manage your events</p>
          </div>

          {/* Dashboard Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalEvents}</div>
                <div className="text-gray-600">Total Events</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalAttendees}</div>
                <div className="text-gray-600">Total Attendees</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats.eventsByType.find(e => e._id === "Free")?.count || 0}
                </div>
                <div className="text-gray-600">Free Events</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stats.eventsByType.find(e => e._id === "Paid")?.count || 0}
                </div>
                <div className="text-gray-600">Paid Events</div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => { setView("list"); resetForm(); }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                view === "list" 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => { setView("create"); resetForm(); }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                view === "create" 
                  ? "bg-green-600 text-white shadow-md" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Create Event
            </button>
          </div>

          {/* Event List View */}
          {view === "list" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                </select>
                {selectedEvents.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Selected ({selectedEvents.length})
                  </button>
                )}
              </div>

              {/* Events Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEvents(filteredEvents.map(e => e._id));
                            } else {
                              setSelectedEvents([]);
                            }
                          }}
                          className="rounded"
                        />
                      </th>
                      <th className="py-3 px-4 text-left">Event</th>
                      <th className="py-3 px-4 text-left">Date & Location</th>
                      <th className="py-3 px-4 text-left">Type</th>
                      <th className="py-3 px-4 text-left">Attendees</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => (
                      <tr key={event._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedEvents([...selectedEvents, event._id]);
                              } else {
                                setSelectedEvents(selectedEvents.filter(id => id !== event._id));
                              }
                            }}
                            className="rounded"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-semibold text-gray-800">{event.title}</div>
                            <div className="text-sm text-gray-600 line-clamp-2">{event.description}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div className="font-medium">{formatDate(event.date)}</div>
                            <div className="text-gray-600">{event.location}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            event.type === "Free" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {event.type} {event.type === "Paid" && `₹${event.price}`}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-center">
                            <div className="font-semibold">{event.attendees.length}</div>
                            <button
                              onClick={() => handleViewAttendees(event)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(event)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDuplicateEvent(event._id)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                              Duplicate
                            </button>
                            <button
                              onClick={() => handleExportAttendees(event._id, event.title)}
                              className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                            >
                              Export
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event._id)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No events found. Create your first event!
                </div>
              )}
            </div>
          )}

          {/* Create/Edit Event Form */}
          {(view === "create" || view === "edit") && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">
                {view === "create" ? "Create New Event" : "Edit Event"}
              </h2>
              
              <form onSubmit={view === "create" ? handleCreateEvent : handleUpdateEvent}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About This Event
                    </label>
                    <textarea
                      rows={4}
                      value={form.aboutEvent}
                      onChange={(e) => setForm({ ...form, aboutEvent: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Detailed description of the event..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type *
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as "Free" | "Paid" })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Free">Free</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>

                  {form.type === "Paid" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {/* Image URL Field */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Optional: Provide a URL for the event image
                    </p>
                  </div>

                  {/* Image Preview */}
                  {form.imageUrl && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Preview
                      </label>
                      <div className="border border-gray-300 rounded-lg p-4">
                        <img
                          src={form.imageUrl}
                          alt="Event preview"
                          className="max-w-full max-h-64 object-cover rounded-lg mx-auto"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%239ca3af'%3EImage not available%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <p className="text-sm text-gray-500 text-center mt-2">
                          Preview of your event image
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Highlights Section */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Highlights
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a highlight"
                      />
                      <button
                        type="button"
                        onClick={addHighlight}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    {form.highlights.length > 0 && (
                      <div className="mt-2">
                        {form.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded mb-1">
                            <span>{highlight}</span>
                            <button
                              type="button"
                              onClick={() => removeHighlight(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Agenda Section */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Agenda
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                      <input
                        type="text"
                        value={newAgendaItem.day}
                        onChange={(e) => setNewAgendaItem({ ...newAgendaItem, day: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Day (e.g., Day 1)"
                      />
                      <input
                        type="text"
                        value={newAgendaItem.time}
                        onChange={(e) => setNewAgendaItem({ ...newAgendaItem, time: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Time (e.g., 10:00 AM)"
                      />
                      <input
                        type="text"
                        value={newAgendaItem.title}
                        onChange={(e) => setNewAgendaItem({ ...newAgendaItem, title: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Title"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAgendaItem.description}
                          onChange={(e) => setNewAgendaItem({ ...newAgendaItem, description: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Description"
                        />
                        <button
                          type="button"
                          onClick={addAgendaItem}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {form.agenda.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {form.agenda.map((item, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-gray-50 p-3 rounded">
                            <div className="font-medium">{item.day}</div>
                            <div>{item.time}</div>
                            <div>{item.title}</div>
                            <div className="flex items-center justify-between">
                              <span>{item.description}</span>
                              <button
                                type="button"
                                onClick={() => removeAgendaItem(index)}
                                className="text-red-600 hover:text-red-800 ml-2"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FAQ Section */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequently Asked Questions
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        value={newFAQItem.question}
                        onChange={(e) => setNewFAQItem({ ...newFAQItem, question: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Question"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newFAQItem.answer}
                          onChange={(e) => setNewFAQItem({ ...newFAQItem, answer: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Answer"
                        />
                        <button
                          type="button"
                          onClick={addFAQItem}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {form.faq.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {form.faq.map((item, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            <div className="font-medium">Q: {item.question}</div>
                            <div className="text-gray-600">A: {item.answer}</div>
                            <div className="flex justify-end mt-2">
                              <button
                                type="button"
                                onClick={() => removeFAQItem(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {view === "create" ? "Create Event" : "Update Event"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setView("list"); resetForm(); }}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Attendees View */}
          {view === "attendees" && selectedEvent && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedEvent.title} - Attendees</h2>
                  <p className="text-gray-600">Total: {selectedEvent.attendees.length} attendees</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleExportAttendees(selectedEvent._id, selectedEvent.title)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Export to Excel
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Back to List
                  </button>
                </div>
              </div>

              {/* Add Attendee Form */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4">Add New Attendee</h3>
                <form onSubmit={handleAddAttendee} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Name *"
                    required
                    value={attendeeForm.name}
                    onChange={(e) => setAttendeeForm({ ...attendeeForm, name: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    value={attendeeForm.email}
                    onChange={(e) => setAttendeeForm({ ...attendeeForm, email: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={attendeeForm.phone}
                      onChange={(e) => setAttendeeForm({ ...attendeeForm, phone: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>

              {/* Attendees List */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Phone</th>
                      <th className="py-3 px-4 text-left">Registered</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEvent.attendees.map((attendee) => (
                      <tr key={attendee._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{attendee.name}</td>
                        <td className="py-3 px-4">{attendee.email}</td>
                        <td className="py-3 px-4">{attendee.phone || "-"}</td>
                        <td className="py-3 px-4 text-sm">
                          {formatDate(attendee.registeredAt)}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleRemoveAttendee(attendee._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {selectedEvent.attendees.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No attendees yet. Add the first attendee above!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}