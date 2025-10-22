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
  Smartphone,
  Globe,
  Users,
  Headphones
} from 'lucide-react';
import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';

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

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    subject: '',
    message: '',
    countryCode: '+91'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileError, setMobileError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setFormData(prev => ({ ...prev, mobileNumber: value }));
      
      if (value.length > 0 && value.length < 10) {
        setMobileError('Mobile number must be exactly 10 digits');
      } else if (value.length === 10) {
        setMobileError('');
      } else {
        setMobileError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate mobile number
    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      setMobileError('Mobile number must be exactly 10 digits');
      setIsSubmitting(false);
      return;
    }

    try {
      const submissionData = {
        ...formData,
        mobileNumber: `${formData.countryCode}${formData.mobileNumber}`
      };
      delete submissionData.countryCode;
      
      const response = await fetch("https://rass-2.onrender.com/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Thank you for your message! We will get back to you soon.");
        setFormData({
          name: "",
          email: "",
          mobileNumber: "",
          subject: "",
          message: "",
          countryCode: "+91"
        });
        setMobileError('');
      } else {
        alert("❌ Failed to send your message. Please try again later.");
        console.error("Server Error:", data);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      alert("⚠️ Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our programs? Want to know more about how we can help transform your career? We're here to help!
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="w-20 px-2 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                    >
                      {countryCodes.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.code} - {item.country}
                        </option>
                      ))}
                    </select>
                    <div className="flex-1">
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handlePhoneChange}
                        required
                        className={`w-full px-4 py-3 border ${mobileError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
                        placeholder="Enter 10 digit number"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  {mobileError && <p className="mt-1 text-sm text-red-600">{mobileError}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="admissions">Admissions</option>
                    <option value="courses">Course Information</option>
                    <option value="partnerships">Partnerships</option>
                    <option value="support">Technical Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 transform ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-1 hover:shadow-lg"
                }`}
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

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Quick Contact Cards */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-5">
                <a 
                  href="tel:+919063194887" 
                  className="flex items-start group hover:bg-blue-50 p-3 rounded-lg transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Phone</h3>
                    <p className="text-gray-600">+91 90631 94887</p>
                  </div>
                </a>

                <a 
                  href="https://api.whatsapp.com/send?phone=919063194887" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start group hover:bg-green-50 p-3 rounded-lg transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors overflow-hidden">
                    <img src="/whatsapp.jpg" alt="WhatsApp" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">WhatsApp</h3>
                    <p className="text-gray-600">Chat with us</p>
                  </div>
                </a>

                <div className="flex items-start group hover:bg-blue-50 p-3 rounded-lg transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">info@raasacademy.com</p>
                    <p className="text-gray-600">contact@raasacademy.com</p>
                    <p className="text-gray-600">support@raasacademy.com</p>
                  </div>
                </div>

                <div className="flex items-start group hover:bg-blue-50 p-3 rounded-lg transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Partnerships</h3>
                    <p className="text-gray-600">partnerships@raasacademy.com</p>
                  </div>
                </div>

                <div className="flex items-start group hover:bg-blue-50 p-3 rounded-lg transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Address</h3>
                    <p className="text-gray-600">1-60, A & B, 3rd Floor, KNR Square</p>
                    <p className="text-gray-600">opp. The Platina, Gachibowli</p>
                    <p className="text-gray-600">Hyderabad, Telangana, India 500032</p>
                  </div>
                </div>

                <div className="flex items-start group hover:bg-blue-50 p-3 rounded-lg transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Office Hours</h3>
                    <p className="text-gray-600">Mon - Fri: 9 AM - 6 PM</p>
                    <p className="text-gray-600">Saturday: 10 AM - 4 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Support Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <Headphones className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Need Immediate Assistance?</h3>
                  <p className="text-blue-100">Call or WhatsApp us now</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="tel:+919063194887"
                  className="flex-1 bg-white text-blue-600 py-3 px-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </a>
                <a 
                  href="https://api.whatsapp.com/send?phone=919063194887"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 flex items-center justify-center"
                >
                  <div className="w-4 h-4 mr-2 overflow-hidden rounded flex items-center justify-center">
                    <img src="/whatsapp.jpg" alt="WhatsApp" className="w-full h-full object-cover" />
                  </div>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="max-w-7xl mx-auto mt-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                Find Us
              </h2>
            </div>
            <div className="h-96 bg-gray-100 relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.4115445347433!2d78.351941314878!3d17.4386786880475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93e4b5b5b5b5%3A0x5b5b5b5b5b5b5b5b!2sKNR%20Square!5e0!3m2!1sen!2sin!4v1629386400000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                title="RAAS Academy Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;