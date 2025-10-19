import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/api";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

interface AgendaItem {
  _id?: string;
  day: string;
  title: string;
  description: string;
  time: string;
}

interface FAQItem {
  _id?: string;
  question: string;
  answer: string;
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
  attendees: any[];
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await apiClient.get(`/admin/events/${id}`);
      setEvent(res.data);
    } catch (error: any) {
      console.error("Error fetching event:", error);
      alert(`Error fetching event: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      alert("Please login to register for this event");
      // Redirect to login page
      navigate("/login");
      return;
    }

    if (event?.type === "Paid") {
      handlePaidEventRegistration();
    } else {
      // For free events, show registration form with user's authenticated info
      setRegistrationForm({ 
        name: user?.name || "", 
        email: user?.email || "",
        phone: ""
      });
      setShowRegistrationForm(true);
      setRegistrationSuccess(false);
    }
  };

  const handlePaidEventRegistration = async () => {
    if (!event || !user) return;

    try {
      // 1. Create Razorpay order from backend
      const res = await apiClient.post("/payments/event-order", { eventId: event._id });

      const { order } = res.data;
      if (!order) {
        alert("Failed to create payment order");
        return;
      }

      const options = {
        key: (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || "rzp_test_RJqt4AZALMZEYE", // Use env var or fallback
        amount: order.amount,
        currency: order.currency,
        name: "RASS Academy",
        description: `Payment for ${event.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Store payment data for later verification
            setPaymentData(response);
            
            // Show registration form after successful payment with user's authenticated info
            setRegistrationForm({ 
              name: user?.name || "", 
              email: user?.email || "",
              phone: ""
            });
            setShowRegistrationForm(true);
          } catch (err) {
            console.error("Payment handler error:", err);
            alert("Something went wrong after payment.");
          }
        },
        prefill: {
          name: user.name || "Student",
          email: user.email || "student@example.com",
          contact: user.profile?.phone || ""
        },
        theme: { color: "#6366f1" },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(`Something went wrong during payment: ${error.message}`);
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !user) return;

    try {
      // For paid events, we need to verify payment and register
      if (event.type === "Paid" && paymentData) {
        // Verify payment first
        const verifyRes = await apiClient.post("/payments/verify-event", {
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
          eventId: event._id,
        });

        const result = verifyRes.data;

        if (!result.success) {
          alert("Payment verification failed.");
          return;
        }
      }

      // Register attendee with payment ID for paid events and userId
      const registrationData = {
        ...registrationForm,
        userId: user._id,
        ...(paymentData && { paymentId: paymentData.razorpay_payment_id })
      };

      const res = await apiClient.post(`/admin/events/${event._id}/attendees`, registrationData);

      if (res.status === 201) {
        setRegistrationSuccess(true);
        setShowRegistrationForm(false);
        setPaymentData(null); // Clear payment data
        // Refresh event data to show updated attendee count
        fetchEvent();
      } else {
        alert(`Registration failed: ${res.data.error}`);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(`Registration failed: ${error.response?.data?.error || "Please try again."}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
          <p className="text-gray-600 text-lg">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event not found</h2>
          <button 
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Event Hero Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            {event.imageUrl && (
              <div className="h-96 overflow-hidden">
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%239ca3af'%3EEvent Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            )}
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{event.title}</h1>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        event.type === "Free" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {event.type} {event.type === "Paid" && `₹${event.price}`}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg mb-6">{event.description}</p>
                </div>
                <button
                  onClick={handleRegisterClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 whitespace-nowrap"
                >
                  {event.type === "Free" ? "Register Now" : `Register for ₹${event.price}`}
                </button>
              </div>
            </div>
          </div>

          {/* About Event */}
          {event.aboutEvent && (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
              <p className="text-gray-600 whitespace-pre-line">{event.aboutEvent}</p>
            </div>
          )}

          {/* Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Highlights</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Agenda */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Agenda</h2>
              <div className="space-y-6">
                {event.agenda.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 text-blue-800 font-bold rounded-lg px-4 py-2 mr-4">
                          {item.day}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {event.faq && event.faq.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {event.faq.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Registration Success Modal */}
        {registrationSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h3>
                <p className="text-gray-600 mb-6">
                  You have successfully registered for <strong>{event.title}</strong>
                </p>
                <button
                  onClick={() => {
                    setRegistrationSuccess(false);
                    // Optionally refresh the page or update state
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form Modal */}
        {showRegistrationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800">Register for Event</h3>
                <p className="text-gray-600 mt-1">{event.title}</p>
              </div>

              <form onSubmit={handleRegistrationSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={registrationForm.name}
                      onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={registrationForm.email}
                      onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      readOnly={!!user?.email} // Make email read-only if user is authenticated
                    />
                    {user?.email && (
                      <p className="text-xs text-gray-500 mt-1">
                        Email is linked to your account and cannot be changed
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={registrationForm.phone}
                      onChange={(e) => setRegistrationForm({ ...registrationForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Complete Registration
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegistrationForm(false);
                      setPaymentData(null); // Clear payment data if user cancels
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}