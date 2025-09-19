import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  ArrowRight,
  Building,
  Smartphone
} from 'lucide-react';
import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const officeLocations = [
    {
      city: 'Bengaluru',
      address: '123, Tech Park, Koramangala, Bengaluru - 560034',
      phone: '+91 98765 43210',
      image: 'https://images.unsplash.com/photo-1588416499018-d8c621b1b3cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
    },
    {
      city: 'Hyderabad',
      address: '456, Business Hub, Hitech City, Hyderabad - 500081',
      phone: '+91 87654 32109',
      image: 'https://images.unsplash.com/photo-1590649880760-2d4b0f523de7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
    },
    {
      city: 'Delhi NCR',
      address: '789, Corporate Tower, Gurugram - 122002',
      phone: '+91 76543 21098',
      image: 'https://images.unsplash.com/photo-1588416499018-d8c621b1b3cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
    }
  ];

  return (
    <div>
        <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Touch</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions about our programs? Want to know more about how we can help transform your career? We're here to help!
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
            Send us a Message
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Ajay Kumar"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="AJ@gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Course Inquiry"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                placeholder="Tell us how we can help you..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          {/* Contact Details */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  Phone
                </h3>
                <div className="space-y-2 pl-7">
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-gray-600">+91 87654 32109</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  Email
                </h3>
                <div className="space-y-2 pl-7">
                  <p className="text-gray-600">info@raasacademy.com</p>
                  <p className="text-gray-600">support@raasacademy.com</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Head Office
                </h3>
                <p className="text-gray-600 pl-7">
                  123, Tech Park, Koramangala<br />
                  Bengaluru, Karnataka 560034
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Office Hours
                </h3>
                <div className="space-y-1 pl-7">
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Support Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Need Immediate Assistance?</h3>
                <p className="text-blue-100">Call us now for quick support</p>
              </div>
            </div>
            <button className="w-full bg-white text-blue-600 py-3 px-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center">
              <Phone className="h-4 w-4 mr-2" />
              Call +91 98765 43210
            </button>
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <div className="max-w-7xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Office Locations</h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Visit us at any of our offices across India
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {officeLocations.map((office, index) => (
            <div 
              key={index}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={office.image} 
                  alt={office.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-600" />
                  {office.city}
                </h3>
                <p className="text-gray-600 mb-4">{office.address}</p>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-blue-600" />
                  {office.phone}
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center">
                  Get Directions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto mt-20 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
        <div className="h-96 w-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Map</h3>
            <p className="text-gray-600">Explore our locations with our interactive map</p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-300">
              View on Google Maps
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default ContactUs;