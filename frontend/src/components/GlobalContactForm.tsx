import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, User, Send, CheckCircle, X, MessageCircle } from "lucide-react";
import { useContact } from "./ContactContext";

const GlobalContactForm = () => {
  const {
    isContactFormOpen,
    setIsContactFormOpen,
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    isSubmitted,
    setIsSubmitted,
  } = useContact();
  
  const [showOptions, setShowOptions] = useState(false);

  // Generic input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://rass-2.onrender.com/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send");

      setIsSubmitted(true);
      setFormData({ name: "", email: "", mobileNumber: "" });

      setTimeout(() => {
        setIsSubmitted(false);
        setIsContactFormOpen(false);
      }, 3000);
    } catch (err) {
      alert("Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsContactFormOpen(false);
    setFormData({ name: "", email: "", mobileNumber: "" });
    setIsSubmitted(false);
  };
  
  const handleWhatsAppClick = () => {
    window.open('https://api.whatsapp.com/send?phone=919063194887', '_blank');
    setShowOptions(false);
  };
  
  const handleEmailClick = () => {
    setShowOptions(false);
    setIsContactFormOpen(true);
  };

  return (
    <>
      {/* Trigger Button */}
      <AnimatePresence>
        {!isContactFormOpen && !showOptions && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 100 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowOptions(true)}
            className="fixed bottom-8 right-8 z-[9999] w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center"
          >
            <MessageCircle className="w-7 h-7 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Options Menu */}
      <AnimatePresence>
        {showOptions && !isContactFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOptions(false)}
              className="fixed inset-0 z-[9998]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed bottom-28 right-8 z-[9999] bg-white rounded-2xl shadow-2xl overflow-hidden w-64"
            >
              <div className="p-2">
                {/* WhatsApp Option */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-green-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors overflow-hidden flex-shrink-0">
                    <img src="/whatsapp.jpg" alt="WhatsApp" className="w-16 h-16 object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">WhatsApp</p>
                    <p className="text-xs text-gray-600">Chat with us instantly</p>
                  </div>
                </motion.button>
                
                {/* Email Option */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEmailClick}
                  className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-indigo-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors flex-shrink-0">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-xs text-gray-600">Get course details</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
            
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 100 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowOptions(false)}
              className="fixed bottom-8 right-8 z-[9999] w-16 h-16 bg-gray-800 rounded-full shadow-2xl flex items-center justify-center"
            >
              <X className="w-7 h-7 text-white" />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isContactFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              className="fixed bottom-8 right-8 z-[9999] w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 relative">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
                <h3 className="text-xl font-bold text-white mb-1">Get Course Details</h3>
                <p className="text-indigo-100 text-sm">We'll call you within 24 hours.</p>
              </div>

              {/* Form */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {isSubmitted ? (
                  <div className="text-center py-6">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h4>
                    <p className="text-gray-600 text-sm mb-4">Our team will contact you shortly.</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={closeModal}
                      className="px-6 py-2 bg-indigo-500 text-white rounded-lg font-semibold text-sm"
                    >
                      Close
                    </motion.button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 border rounded-xl py-2"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 border rounded-xl py-2"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="tel"
                          name="mobileNumber"
                          required
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          className="w-full pl-10 border rounded-xl py-2"
                          placeholder="Your mobile number"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className="w-full bg-indigo-500 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                      {isSubmitting ? "Sending..." : "Get Details"}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalContactForm;
