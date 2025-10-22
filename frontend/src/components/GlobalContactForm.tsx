import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, User, Send, CheckCircle, X, MessageCircle } from "lucide-react";
import { useContact } from "./ContactContext";

const countryCodes = [
  { code: "+93", country: "Afghanistan" }, { code: "+355", country: "Albania" }, { code: "+213", country: "Algeria" },
  { code: "+376", country: "Andorra" }, { code: "+244", country: "Angola" }, { code: "+54", country: "Argentina" },
  { code: "+374", country: "Armenia" }, { code: "+61", country: "Australia" }, { code: "+43", country: "Austria" },
  { code: "+994", country: "Azerbaijan" }, { code: "+973", country: "Bahrain" }, { code: "+880", country: "Bangladesh" },
  { code: "+375", country: "Belarus" }, { code: "+32", country: "Belgium" }, { code: "+501", country: "Belize" },
  { code: "+229", country: "Benin" }, { code: "+975", country: "Bhutan" }, { code: "+591", country: "Bolivia" },
  { code: "+387", country: "Bosnia and Herzegovina" }, { code: "+267", country: "Botswana" }, { code: "+55", country: "Brazil" },
  { code: "+673", country: "Brunei" }, { code: "+359", country: "Bulgaria" }, { code: "+226", country: "Burkina Faso" },
  { code: "+257", country: "Burundi" }, { code: "+855", country: "Cambodia" }, { code: "+237", country: "Cameroon" },
  { code: "+1", country: "Canada" }, { code: "+238", country: "Cape Verde" }, { code: "+236", country: "Central African Republic" },
  { code: "+235", country: "Chad" }, { code: "+56", country: "Chile" }, { code: "+86", country: "China" },
  { code: "+57", country: "Colombia" }, { code: "+269", country: "Comoros" }, { code: "+242", country: "Congo" },
  { code: "+506", country: "Costa Rica" }, { code: "+385", country: "Croatia" }, { code: "+53", country: "Cuba" },
  { code: "+357", country: "Cyprus" }, { code: "+420", country: "Czech Republic" }, { code: "+45", country: "Denmark" },
  { code: "+253", country: "Djibouti" }, { code: "+593", country: "Ecuador" }, { code: "+20", country: "Egypt" },
  { code: "+503", country: "El Salvador" }, { code: "+240", country: "Equatorial Guinea" }, { code: "+291", country: "Eritrea" },
  { code: "+372", country: "Estonia" }, { code: "+251", country: "Ethiopia" }, { code: "+679", country: "Fiji" },
  { code: "+358", country: "Finland" }, { code: "+33", country: "France" }, { code: "+241", country: "Gabon" },
  { code: "+220", country: "Gambia" }, { code: "+995", country: "Georgia" }, { code: "+49", country: "Germany" },
  { code: "+233", country: "Ghana" }, { code: "+30", country: "Greece" }, { code: "+502", country: "Guatemala" },
  { code: "+224", country: "Guinea" }, { code: "+245", country: "Guinea-Bissau" }, { code: "+592", country: "Guyana" },
  { code: "+509", country: "Haiti" }, { code: "+504", country: "Honduras" }, { code: "+852", country: "Hong Kong" },
  { code: "+36", country: "Hungary" }, { code: "+354", country: "Iceland" }, { code: "+91", country: "India" },
  { code: "+62", country: "Indonesia" }, { code: "+98", country: "Iran" }, { code: "+964", country: "Iraq" },
  { code: "+353", country: "Ireland" }, { code: "+972", country: "Israel" }, { code: "+39", country: "Italy" },
  { code: "+225", country: "Ivory Coast" }, { code: "+81", country: "Japan" }, { code: "+962", country: "Jordan" },
  { code: "+7", country: "Kazakhstan" }, { code: "+254", country: "Kenya" }, { code: "+965", country: "Kuwait" },
  { code: "+996", country: "Kyrgyzstan" }, { code: "+856", country: "Laos" }, { code: "+371", country: "Latvia" },
  { code: "+961", country: "Lebanon" }, { code: "+266", country: "Lesotho" }, { code: "+231", country: "Liberia" },
  { code: "+218", country: "Libya" }, { code: "+423", country: "Liechtenstein" }, { code: "+370", country: "Lithuania" },
  { code: "+352", country: "Luxembourg" }, { code: "+853", country: "Macau" }, { code: "+389", country: "Macedonia" },
  { code: "+261", country: "Madagascar" }, { code: "+265", country: "Malawi" }, { code: "+60", country: "Malaysia" },
  { code: "+960", country: "Maldives" }, { code: "+223", country: "Mali" }, { code: "+356", country: "Malta" },
  { code: "+222", country: "Mauritania" }, { code: "+230", country: "Mauritius" }, { code: "+52", country: "Mexico" },
  { code: "+373", country: "Moldova" }, { code: "+377", country: "Monaco" }, { code: "+976", country: "Mongolia" },
  { code: "+382", country: "Montenegro" }, { code: "+212", country: "Morocco" }, { code: "+258", country: "Mozambique" },
  { code: "+95", country: "Myanmar" }, { code: "+264", country: "Namibia" }, { code: "+977", country: "Nepal" },
  { code: "+31", country: "Netherlands" }, { code: "+64", country: "New Zealand" }, { code: "+505", country: "Nicaragua" },
  { code: "+227", country: "Niger" }, { code: "+234", country: "Nigeria" }, { code: "+47", country: "Norway" },
  { code: "+968", country: "Oman" }, { code: "+92", country: "Pakistan" }, { code: "+507", country: "Panama" },
  { code: "+675", country: "Papua New Guinea" }, { code: "+595", country: "Paraguay" }, { code: "+51", country: "Peru" },
  { code: "+63", country: "Philippines" }, { code: "+48", country: "Poland" }, { code: "+351", country: "Portugal" },
  { code: "+974", country: "Qatar" }, { code: "+40", country: "Romania" }, { code: "+7", country: "Russia" },
  { code: "+250", country: "Rwanda" }, { code: "+966", country: "Saudi Arabia" }, { code: "+221", country: "Senegal" },
  { code: "+381", country: "Serbia" }, { code: "+248", country: "Seychelles" }, { code: "+232", country: "Sierra Leone" },
  { code: "+65", country: "Singapore" }, { code: "+421", country: "Slovakia" }, { code: "+386", country: "Slovenia" },
  { code: "+677", country: "Solomon Islands" }, { code: "+252", country: "Somalia" }, { code: "+27", country: "South Africa" },
  { code: "+82", country: "South Korea" }, { code: "+211", country: "South Sudan" }, { code: "+34", country: "Spain" },
  { code: "+94", country: "Sri Lanka" }, { code: "+249", country: "Sudan" }, { code: "+597", country: "Suriname" },
  { code: "+268", country: "Swaziland" }, { code: "+46", country: "Sweden" }, { code: "+41", country: "Switzerland" },
  { code: "+963", country: "Syria" }, { code: "+886", country: "Taiwan" }, { code: "+992", country: "Tajikistan" },
  { code: "+255", country: "Tanzania" }, { code: "+66", country: "Thailand" }, { code: "+228", country: "Togo" },
  { code: "+216", country: "Tunisia" }, { code: "+90", country: "Turkey" }, { code: "+993", country: "Turkmenistan" },
  { code: "+256", country: "Uganda" }, { code: "+380", country: "Ukraine" }, { code: "+971", country: "United Arab Emirates" },
  { code: "+44", country: "United Kingdom" }, { code: "+1", country: "United States" }, { code: "+598", country: "Uruguay" },
  { code: "+998", country: "Uzbekistan" }, { code: "+678", country: "Vanuatu" }, { code: "+58", country: "Venezuela" },
  { code: "+84", country: "Vietnam" }, { code: "+967", country: "Yemen" }, { code: "+260", country: "Zambia" },
  { code: "+263", country: "Zimbabwe" }
];

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
  const [mobileError, setMobileError] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  // Generic input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setFormData({ ...formData, mobileNumber: value });
      
      if (value.length > 0 && value.length < 10) {
        setMobileError('Mobile number must be exactly 10 digits');
      } else if (value.length === 10) {
        setMobileError('');
      } else {
        setMobileError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate mobile number
    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      setMobileError('Mobile number must be exactly 10 digits');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        mobileNumber: `${countryCode}${formData.mobileNumber}`
      };
      
      const response = await fetch("https://rass-2.onrender.com/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error("Failed to send");

      setIsSubmitted(true);
      setFormData({ name: "", email: "", mobileNumber: "" });
      setMobileError('');
      setCountryCode('+91');

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
    setMobileError('');
    setCountryCode('+91');
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
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-20 px-2 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
                        >
                          {countryCodes.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.code} - {item.country}
                            </option>
                          ))}
                        </select>
                        <div className="flex-1 relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="tel"
                            name="mobileNumber"
                            required
                            value={formData.mobileNumber}
                            onChange={handlePhoneChange}
                            className={`w-full pl-10 pr-3 border ${mobileError ? 'border-red-500' : 'border-gray-300'} rounded-xl py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                            placeholder="Enter 10 digit number"
                            maxLength={10}
                          />
                        </div>
                      </div>
                      {mobileError && <p className="mt-1 text-xs text-red-600">{mobileError}</p>}
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
