// src/pages/LandingPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// replace Lightning with Zap
import { BookOpen, Users, Award, Zap, Briefcase, Globe } from "lucide-react";


/**
 * LandingPage - Responsive landing page component
 * Uses Tailwind classes and framer-motion for animations.
 *
 * Notes:
 * - Replace placeholder images in /public/assets/ (logos/testimonials).
 * - Install framer-motion: npm i framer-motion
 */

const partnerLogos = [
  "/assets/logo-nasscom.svg",
  "/assets/logo-startup-india.svg",
  "/assets/logo-sample-1.svg",
  "/assets/logo-sample-2.svg",
];

const stats = [
  { label: "Students Trained", value: "25,000+" },
  { label: "Hiring Partners", value: "200+" },
  { label: "Job Placements", value: "7,800+" },
];

const highlights = [
  {
    title: "Outcome-focused Curriculum",
    desc: "Curriculum built with hiring partners and industry mentors.",
    icon: BookOpen,
  },
  {
    title: "Real Projects & Internships",
    desc: "Hands-on capstones simulating real workplace tasks.",
    icon: Briefcase,
  },
  {
    title: "Mentorship & Mock Interviews",
    desc: "1:1 mentor sessions and interview prep for placement readiness.",
    icon: Users,
  },
  {
    title: "Placement Assistance",
    desc: "Dedicated placement support & employer connection.",
    icon: Award,
  },
];

const testimonials = [
  {
    name: "Aarti S.",
    title: "Frontend Engineer @ Acme",
    quote:
      "The program took me from zero to job-ready. The project work and mentor sessions were game-changing.",
    avatar: "/assets/testimonial-1.jpg",
  },
  {
    name: "Rohit K.",
    title: "Product Analyst @ Stellar",
    quote:
      "Practical assessments and mock interviews helped me land my internship and then a full-time role.",
    avatar: "/assets/testimonial-2.jpg",
  },
];

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0 },
};

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <motion.div initial="initial" animate="enter" variants={fadeIn}>
          <p className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-3">
            India’s #1 Outcome-Focused Initiative
          </p>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Become the talent every company wants to hire
          </h1>

          <p className="mt-4 text-gray-700 max-w-xl">
            Practical courses, project-based learning, mentor-led sessions and
            placement support — built with industry partners to make you job-ready.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:shadow-lg transition"
            >
              Browse Courses
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Partner with Us
            </Link>
          </div>

          {/* quick stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                className="bg-white rounded-lg p-4 shadow-sm border"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hero visual / trust card */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Job-Ready Programs
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Practical tracks with live projects and employer interviews.
                </p>
              </div>
              <div className="rounded-full w-12 h-12 bg-indigo-50 flex items-center justify-center">
                <Zap className="text-indigo-600" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-xs text-gray-500">Avg. Salary</p>
                <p className="font-semibold text-gray-900">₹6.2 LPA</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-500">Placement Rate</p>
                <p className="font-semibold text-gray-900">78%</p>
              </div>
            </div>

            <div className="mt-5">
              <Link
                to="/courses"
                className="text-sm inline-flex px-4 py-2 bg-primary-50 text-primary-700 rounded-full font-medium"
              >
                Explore Projects
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            Trusted by
            <div className="mt-3 flex items-center justify-center gap-4">
              {partnerLogos.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`partner-${idx}`}
                  className="h-8 opacity-90"
                  onError={(e) => {
                    // fallback to simple box if asset missing
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURES / HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <motion.div
                key={h.title}
                className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-indigo-50">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{h.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{h.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Course highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Featured Tracks</h3>
          <Link to="/courses" className="text-sm text-indigo-600">
            View all courses →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-5 shadow border"
            >
              <div className="h-40 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-lg mb-4 flex items-end p-4 text-white">
                <div>
                  <h4 className="text-lg font-semibold">Fullstack Development</h4>
                  <p className="text-sm mt-1">100+ hours • Projects • Hiring support</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5" />
                  <span>Enrollments 4k</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5" />
                  <span>Self-paced + live</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm font-semibold">₹12,000</div>
                <Link
                  to="/courses/track/fullstack"
                  className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
          What alumni say
        </h3>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="initial"
          animate="enter"
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              className="bg-white rounded-2xl p-6 shadow-md border"
              whileHover={{ y: -6 }}
            >
              <div className="flex items-start space-x-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                />
                <div>
                  <p className="font-medium text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.title}</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700">{t.quote}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h3 className="text-3xl font-bold">Ready to upskill & get hired?</h3>
          <p className="mt-3 max-w-2xl mx-auto">
            Start your journey with industry-aligned programs, mentors and hiring support.
          </p>
          <div className="mt-6">
            <Link
              to="/courses"
              className="inline-flex px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium shadow"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
