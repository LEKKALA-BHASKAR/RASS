// src/pages/UniversitiesPage.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, CheckCircle, BookOpen, Network, Star, Briefcase, Users, Award, ArrowRight } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";

const heroImages = [
  "/images/universities/university-cta-bg.jpg",
  "/images/universities/hero-university-campus.jpg",
  "/images/universities/hero-classroom.jpg",
  "/images/universities/hero-graduation.jpg",
  "/images/universities/bridge-learning.jpg",
  "/images/universities/university-benefits.jpg",
  "/images/universities/partnership-models.jpg",
  "/images/universities/success-stories.jpg",
];

const UniversitiesPage: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-indigo-700 to-purple-700 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-6 gap-10">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2"
          >
            <GraduationCap className="h-14 w-14 text-yellow-400 mb-6" />
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Empower Universities. <br /> Transform Students into Professionals.
            </h1>
            <p className="text-lg text-indigo-100 mb-8">
              RASS Academy partners with institutions to bridge the gap between education and employability, preparing students with real-world skills and certifications.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-300 transition"
            >
              Start a Partnership <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>

          {/* Image Player */}
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20"
          >
            <img
              src={heroImages[currentImage]}
              alt="University partnership"
              className="w-full h-[420px] object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Bridging the Gap Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/images/universities/bridge-learning.jpg"
              alt="Bridge Learning"
              className="rounded-2xl shadow-xl border"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bridging the Gap Between Classroom and Career
            </h2>
            <p className="text-gray-600 text-lg">
              Our university partnerships help students apply academic knowledge to real-world challenges through certifications, projects, and placement-oriented training—without adding burden to faculty or existing syllabi.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Universities Partner with RASS Academy
            </h2>
            <ul className="space-y-4 text-gray-700">
              {[
                "Enhance student employability through industry certifications.",
                "Provide project-driven, hands-on experience.",
                "Boost university reputation with career-ready graduates.",
                "Strengthen your link with hiring organizations.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/images/universities/university-benefits.jpg"
              alt="University Benefits"
              className="rounded-2xl shadow-xl border"
            />
          </motion.div>
        </div>
      </section>

      {/* Partnership Models Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/images/universities/partnership-models.jpg"
              alt="Partnership Models"
              className="rounded-2xl shadow-xl border"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Flexible Partnership Models for Universities
            </h2>
            <p className="text-gray-600 mb-6">
              Choose the engagement model that aligns best with your institutional goals.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Value-Added Certification Programs",
                "Integrated Curriculum Support",
                "Career-Ready Bootcamps",
                "Industry Engagement Workshops",
              ].map((model, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{model}</h3>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Transforming Education into Career Success
            </h2>
            <p className="text-gray-700 mb-6">
              Partnering universities have seen measurable improvements in graduate employability, placement outcomes, and industry collaboration.
            </p>
            <div className="bg-white p-6 rounded-xl shadow-md border">
              <p className="italic text-gray-700">
                “Our collaboration with RASS Academy has given our students a real competitive edge.
                Their certification programs and mentorship transformed our placement outcomes.”
              </p>
              <p className="mt-3 font-semibold text-indigo-700">— Dean, Global Tech University</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/images/universities/success-stories.jpg"
              alt="Success Stories"
              className="rounded-2xl shadow-xl border"
            />
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="relative py-20 text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/images/universities/university-cta-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Let’s Build Future-Ready Graduates Together</h2>
          <p className="text-lg text-gray-200 mb-8">
            Join the network of universities shaping the next generation of skilled professionals through RASS Academy’s industry-aligned programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition"
            >
              Start Partnership
            </Link>
            <Link
              to="/about"
              className="px-8 py-3 border-2 border-white rounded-lg hover:bg-white/10 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UniversitiesPage;
