import React, { useState } from "react";
import { 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Globe, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Send,
  ArrowLeft
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

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

const UniversityPartnershipForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    designation: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    countryCode: "+91"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.university.trim()) newErrors.university = "University name is required";
    if (!formData.designation.trim()) newErrors.designation = "Designation is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.website && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(formData.website)) {
      newErrors.website = "Please enter a valid website URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setFormData(prev => ({ ...prev, phone: value }));
      
      if (value.length > 0 && value.length < 10) {
        setErrors(prev => ({ ...prev, phone: 'Phone number must be exactly 10 digits' }));
      } else if (value.length === 10) {
        setErrors(prev => ({ ...prev, phone: '' }));
      } else {
        setErrors(prev => ({ ...prev, phone: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        phone: `${formData.countryCode}${formData.phone}`
      };
      delete submissionData.countryCode;
      
      const response = await fetch("https://rass-h2s1.onrender.com/api/university-partnership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          university: "",
          designation: "",
          email: "",
          phone: "",
          website: "",
          description: "",
          countryCode: "+91"
        });
        setErrors({});
      } else {
        throw new Error(data.error || "Submission failed");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-8">
            Your university partnership inquiry has been submitted successfully. Our team will review your information and get back to you within 2-3 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsSubmitted(false)} 
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Submit Another Form
            </button>
            <button 
              onClick={goBack} 
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
        <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <button 
            onClick={goBack}
            className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            University Partnership Form
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Partner with us to provide industry-aligned certification programs to your students. Fill out the form below and our team will get in touch with you.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Partnership Details</h2>
            </div>
            <p className="text-indigo-100 mt-2">
              Please provide your information to explore partnership opportunities
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border ${errors.designation ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="Dean, Head of Department"
                    />
                  </div>
                  {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation}</p>}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-600" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="john@university.edu"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="w-20 px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
                    >
                      {countryCodes.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.code} - {item.country}
                        </option>
                      ))}
                    </select>
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={`block w-full pl-10 pr-3 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Enter 10 digit number"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* University Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-600" />
                University Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                    University Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GraduationCap className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="university"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border ${errors.university ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="University Name"
                    />
                  </div>
                  {errors.university && <p className="mt-1 text-sm text-red-600">{errors.university}</p>}
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    University Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border ${errors.website ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="https://www.university.edu"
                    />
                  </div>
                  {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Brief Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className={`block w-full px-3 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Tell us about your university and how we can collaborate to provide industry-aligned programs to your students..."
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Partnership Inquiry
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-indigo-600" />
            What Happens Next?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Review</h4>
                <p className="text-gray-600 text-sm">Our team will review your partnership inquiry within 2 business days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Consultation</h4>
                <p className="text-gray-600 text-sm">We'll schedule a call to discuss your requirements in detail.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Partnership</h4>
                <p className="text-gray-600 text-sm">We'll create a customized partnership plan tailored to your needs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partnership Benefits */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Partnership Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Industry-Aligned Curriculum</h4>
                <p className="text-gray-600 text-sm">Provide your students with certification programs that match industry requirements.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Placement Opportunities</h4>
                <p className="text-gray-600 text-sm">Connect your students with top companies for internships and placements.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Faculty Development</h4>
                <p className="text-gray-600 text-sm">Training programs for your faculty to stay updated with industry trends.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Revenue Sharing</h4>
                <p className="text-gray-600 text-sm">Earn revenue through our partnership programs while adding value to your students.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
</div>
  );
};

export default UniversityPartnershipForm;