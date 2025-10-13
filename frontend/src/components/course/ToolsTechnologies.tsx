import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, User, Send, CheckCircle } from "lucide-react";

export interface Tool {
  name: string;
  imageUrl?: string;
  color?: string;
}

interface Props {
  tools: Tool[];
}

const ToolsTechnologies: React.FC<Props> = ({ tools }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!tools || tools.length === 0) {
    return null;
  }

  // Tool-specific colors to match the image
  const getToolColor = (toolName: string) => {
    const colors: { [key: string]: string } = {
      'Python': 'bg-blue-500',
      'SQL': 'bg-orange-500',
      'NumPy': 'bg-indigo-600',
      'Pandas': 'bg-blue-600',
      'Seaborn': 'bg-teal-600',
      'scikit-learn': 'bg-orange-600',
      'Keras': 'bg-red-500',
      'Tensorflow': 'bg-orange-500',
      'Transformers': 'bg-yellow-500',
      'ChatGPT': 'bg-green-600',
      'OpenCV': 'bg-red-600',
      'SpaCy': 'bg-indigo-500',
      'LangChain': 'bg-blue-700',
      'Docker': 'bg-blue-400',
      'Flask': 'bg-gray-800',
      'Whisper': 'bg-purple-600',
      'ML Flow': 'bg-blue-800',
      'Github': 'bg-gray-900',
      'Gemini': 'bg-blue-500',
      'DALL-E': 'bg-green-500',
      'Dall.E': 'bg-green-500'
    };
    return colors[toolName] || 'bg-gray-500';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch("https://rass-h2s1.onrender.com/api/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    // ✅ Success
    setIsSubmitted(true);
    setFormData({ name: "", email: "", mobileNumber: "" });

    // Auto-hide success message
    setTimeout(() => setIsSubmitted(false), 4000);
  } catch (error: any) {
    console.error("Error submitting form:", error);
    alert(error.message || "Failed to submit form. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tools Section */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Tools & Technologies
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Master the cutting-edge tools and technologies used by industry professionals
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16"
        >
          {tools.map((tool, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl blur-sm opacity-20"></div>
              <div className="relative bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg border border-white border-opacity-30 flex items-center transition-all duration-300 overflow-hidden">
                {/* Left 30% - Tool Icon */}
                <div className="w-3/10 flex-shrink-0 flex items-center justify-center p-3">
                  {tool.imageUrl ? (
                    <motion.div 
                      className="w-12 h-12 rounded-full overflow-hidden bg-white border border-gray-200"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <img
                        src={tool.imageUrl}
                        alt={tool.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      className={`w-12 h-12 ${getToolColor(tool.name)} rounded-full flex items-center justify-center`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="text-white font-bold text-lg">
                        {tool.name.charAt(0).toUpperCase()}
                      </span>
                    </motion.div>
                  )}
                </div>
                
                {/* Right 70% - Tool Name */}
                <div className="w-7/10 p-3">
                  <span className="text-base font-semibold text-gray-800 truncate block">
                    {tool.name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form Section */}
        <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Content */}
        <div className="p-8 lg:p-12 text-white">
          <div className="max-w-md">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Want to Know More About This Course?
            </h3>
            <p className="text-indigo-100 text-lg mb-6 leading-relaxed">
              Get detailed course curriculum, placement opportunities, and
              personalized guidance from our experts. We'll call you within 24
              hours to explain everything.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="font-semibold">24-Hour Call Back</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <User className="w-5 h-5" />
                </div>
                <span className="font-semibold">Personalized Guidance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-semibold">Detailed Curriculum</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white p-8 lg:p-12">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                Thank You!
              </h4>
              <p className="text-gray-600 mb-4">
                We've received your details. Our team will call you within 24
                hours.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-semibold"
              >
                Submit Another Inquiry
              </motion.button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="mobileNumber"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    required
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter your mobile number"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Get Course Details
                  </>
                )}
              </motion.button>

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to be contacted within 24 hours by our
                course counselor.
              </p>
            </form>
          )}
        </div>
      </div>
    </motion.div>
      </div>
    </section>
  );
};

export default ToolsTechnologies;