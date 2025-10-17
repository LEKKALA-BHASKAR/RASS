// frontend/src/pages/Companies.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Briefcase,
  CheckCircle,
  Phone,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Building,
  Star,
  Shield,
  Clock,
  Target,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Companies: React.FC = () => {
  const heroImages = [
    { src: "/images/companies/hero-teamwork.jpg", dark: true },
    { src: "/images/companies/hero-office.jpg", dark: false },
    { src: "/images/companies/certified-student.jpg", dark: true },
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Smooth fade slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Simulated loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="bg-white overflow-hidden">
        {/* 🟣 Hero Section */}
        <section className="relative h-[90vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 overflow-hidden">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 text-center md:text-left z-10"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Hire <span className="text-indigo-600">Certified Talent</span>{" "}
              Ready Before Day One
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto md:mx-0">
              Partner with RASS Academy to access pre-trained, project-ready
              professionals who contribute from the very first day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="/contact"
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all"
              >
                Become a Partner
              </a>
              <a
                href="/about"
                className="px-8 py-3 border border-indigo-600 text-indigo-700 rounded-lg font-medium hover:bg-indigo-50 transition-all"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          {/* Right Image Player */}
          <div className="md:w-1/2 relative h-[60vh] md:h-[80vh] mt-10 md:mt-0 rounded-2xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={heroImages[currentImage].src}
                src={heroImages[currentImage].src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Hero"
              />
            </AnimatePresence>
            <div
              className={`absolute inset-0 ${
                heroImages[currentImage].dark ? "bg-black/40" : "bg-black/25"
              }`}
            />
          </div>
        </section>

        {/* 🧠 About Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-20 bg-gray-50 text-center px-6"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              About RASS Academy
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We bridge the gap between academia and industry by providing
              students with real-world, project-based training and certifications.
              Our mission: empower graduates to be industry-ready while giving
              companies access to trained, job-ready professionals.
            </p>
          </div>
        </motion.section>

        {/* 💼 Partnership Models */}
        <section className="py-20 max-w-7xl mx-auto px-6 space-y-24">
          {/* Direct Hire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">
                Direct Hire: Access Pre-Screened Talent
              </h3>
              <p className="text-gray-600">
                Ideal for companies that need skilled talent immediately. Access
                job-ready interns who require no additional onboarding effort.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-2 items-center">
                  <CheckCircle className="h-5 w-5 text-green-600" /> Browse
                  certified candidates
                </li>
                <li className="flex gap-2 items-center">
                  <CheckCircle className="h-5 w-5 text-green-600" /> Hire and
                  onboard instantly
                </li>
              </ul>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Learn More <ArrowRight className="h-5 w-5" />
              </a>
            </div>
            <img
              src="/images/companies/hire-model.jpg"
              alt="Hire model"
              className="rounded-2xl shadow-lg object-cover"
            />
          </motion.div>

          {/* Training-to-Hire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            <img
              src="/images/companies/training-hire.jpg"
              alt="Training program"
              className="rounded-2xl shadow-lg object-cover"
            />
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">
                Training-to-Hire: Custom Workforce Development
              </h3>
              <p className="text-gray-600">
                Build a custom-trained workforce aligned with your project goals.
                Reduce hiring risks while improving team productivity.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-2 items-center">
                  <Briefcase className="h-5 w-5 text-green-600" /> Tailored
                  programs based on your stack
                </li>
                <li className="flex gap-2 items-center">
                  <Shield className="h-5 w-5 text-green-600" /> Skilled interns
                  trained for your needs
                </li>
              </ul>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition"
              >
                Learn More <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </section>

        {/* ⚙️ Startup Challenges & Solutions */}
        <section className="py-20 bg-gray-50 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start"
          >
            {/* Challenges */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="text-red-500 h-7 w-7" /> Startup
                Challenges
              </h3>
              <ul className="space-y-5 text-gray-700">
                <li>💸 High hiring costs & limited access to skilled talent.</li>
                <li>⚡ Risk of mismatched hires slowing project delivery.</li>
                <li>⏱️ Long onboarding times that delay productivity.</li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lightbulb className="text-green-500 h-7 w-7" /> RASS Solutions
              </h3>
              <ul className="space-y-5 text-gray-700">
                <li>
                  ✅ Access pre-trained, certified professionals ready from day
                  one.
                </li>
                <li>
                  🧠 Reduce onboarding & training costs through verified skills.
                </li>
                <li>
                  🚀 Flexible hire models: project-based or full-time talent.
                </li>
              </ul>
            </div>
          </motion.div>
        </section>

        {/* 💡 Benefits */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-20 max-w-7xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-10">
            Why Partner with RASS Academy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="h-10 w-10 text-indigo-600 mb-4" />,
                title: "Immediate Productivity",
                desc: "Interns require minimal onboarding.",
              },
              {
                icon: <Users className="h-10 w-10 text-indigo-600 mb-4" />,
                title: "Zero-Cost Pipeline",
                desc: "Access skilled, pre-trained students for free.",
              },
              {
                icon: <Lightbulb className="h-10 w-10 text-indigo-600 mb-4" />,
                title: "Fresh Perspectives",
                desc: "Students bring creativity & innovation.",
              },
            ].map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition"
              >
                {b.icon}
                <h4 className="text-xl font-bold mb-2">{b.title}</h4>
                <p className="text-gray-600">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 🚀 Final CTA */}
        <section
          className="relative py-20 bg-cover bg-center text-white"
          style={{ backgroundImage: "url('/images/companies/cta-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Access Job-Ready Talent?
            </h2>
            <p className="text-lg text-indigo-100 mb-8">
              Zero-cost, pre-trained professionals — certified and ready for your
              projects. Join our hiring network today.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-semibold rounded-lg shadow-md hover:bg-indigo-50 transition"
            >
              <Phone className="h-5 w-5" /> Become a Partner
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Companies;
