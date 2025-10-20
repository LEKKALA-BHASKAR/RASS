import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send, User, GraduationCap, Mail, Phone, Award, Calendar, BookOpen, Briefcase, CheckCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const StudentAmbassadorForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    department: "",
    graduationYear: "",
    currentYear: "",
    email: "",
    phone: "",
    competencies: ""
  });
  useEffect(()=>{
    window.scrollTo(0,0);
  },[])
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 6 }, (_, i) => (currentYear + i).toString());
  const studyYears = ["1st Year", "2nd Year", "3rd Year", "Final Year"];

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.university.trim()) newErrors.university = "University is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.graduationYear) newErrors.graduationYear = "Graduation year is required";
    if (!formData.currentYear) newErrors.currentYear = "Current year is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) newErrors.phone = "Phone must be 10 digits";
    if (!formData.competencies.trim()) newErrors.competencies = "Core competencies required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.toString() }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("https://rass-h2s1.onrender.com/api/student-ambassador-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submission failed");

      setIsSubmitted(true);
      setFormData({
        name: "",
        university: "",
        department: "",
        graduationYear: "",
        currentYear: "",
        email: "",
        phone: "",
        competencies: ""
      });
    } catch (error: any) {
      console.error("Error submitting form:", error.message);
      alert("Error submitting form: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Student Ambassador Form</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join RAAS Academy as a Student Ambassador and represent our programs at your college.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-8 w-8" />
                <h2 className="text-2xl font-bold">Application Form</h2>
              </div>
              <p className="text-indigo-100">Fill in your details to apply</p>
            </div>

            {/* Form Body */}
            {isSubmitted ? (
              <div className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                <p className="text-gray-600 mb-6">Thank you for applying. We'll review your application soon.</p>
                <button onClick={() => setIsSubmitted(false)} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className={`block w-full border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg p-3`} placeholder="Full name" />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* University */}
                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">University *</label>
                  <input type="text" name="university" value={formData.university} onChange={handleChange} className={`block w-full border ${errors.university ? "border-red-500" : "border-gray-300"} rounded-lg p-3`} placeholder="University" />
                  {errors.university && <p className="text-red-600 text-sm mt-1">{errors.university}</p>}
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} className={`block w-full border ${errors.department ? "border-red-500" : "border-gray-300"} rounded-lg p-3`} placeholder="Department" />
                  {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
                </div>

                {/* Graduation Year */}
                <div>
                  <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-2">Graduation Year *</label>
                  <select name="graduationYear" value={formData.graduationYear} onChange={handleChange} className={`block w-full border ${errors.graduationYear ? "border-red-500" : "border-gray-300"} rounded-lg p-3`}>
                    <option value="">Select year</option>
                    {graduationYears.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  {errors.graduationYear && <p className="text-red-600 text-sm mt-1">{errors.graduationYear}</p>}
                </div>

                {/* Current Year */}
                <div>
                  <label htmlFor="currentYear" className="block text-sm font-medium text-gray-700 mb-2">Current Year *</label>
                  <select name="currentYear" value={formData.currentYear} onChange={handleChange} className={`block w-full border ${errors.currentYear ? "border-red-500" : "border-gray-300"} rounded-lg p-3`}>
                    <option value="">Select year</option>
                    {studyYears.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  {errors.currentYear && <p className="text-red-600 text-sm mt-1">{errors.currentYear}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={`block w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg p-3`} placeholder="Email" />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`block w-full border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-lg p-3`} placeholder="Phone number" />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Competencies */}
                <div>
                  <label htmlFor="competencies" className="block text-sm font-medium text-gray-700 mb-2">Core Competencies *</label>
                  <textarea name="competencies" value={formData.competencies} onChange={handleChange} rows={4} className={`block w-full border ${errors.competencies ? "border-red-500" : "border-gray-300"} rounded-lg p-3`} placeholder="Your skills and strengths" />
                  {errors.competencies && <p className="text-red-600 text-sm mt-1">{errors.competencies}</p>}
                </div>

                {/* Submit */}
                <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700">
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentAmbassadorForm;
