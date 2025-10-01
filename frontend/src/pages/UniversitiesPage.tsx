import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Briefcase, Users, Star, CheckCircle, Network, Award } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const benefits = [
  {
    icon: GraduationCap,
    title: "Enhance Student Employability",
    desc: "Students graduate not only with a degree but also with certifications, hands-on project experience, and industry-ready skills.",
  },
  {
    icon: Network,
    title: "Strengthen Industry Connections",
    desc: "Our partnerships with hiring organizations give your students direct access to job opportunities and internships.",
  },
  {
    icon: Star,
    title: "Boost University Reputation",
    desc: "By producing graduates who are truly workforce-ready, your institution stands out as a leader in career-focused education.",
  },
  {
    icon: BookOpen,
    title: "Flexible Integration",
    desc: "Our programs can be offered as value-added certifications, credit-bearing modules, or extracurricular training alongside your existing curriculum.",
  },
];

const partnershipModels = [
  {
    title: "Value-Added Certification Programs",
    desc: "Offer short-term, specialized certifications alongside degree programs to boost employability.",
  },
  {
    title: "Integrated Curriculum Support",
    desc: "Embed our training modules into your academic curriculum as credit courses.",
  },
  {
    title: "Career-Ready Bootcamps",
    desc: "Intensive, project-driven programs to prepare final-year students for immediate employment.",
  },
  {
    title: "Industry Engagement",
    desc: "Collaborative workshops, guest lectures, and hackathons to expose students to real-world business challenges.",
  },
];

const UniversitiesPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GraduationCap className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Empower Students. Elevate Careers.
              </h1>
              <p className="max-w-3xl mx-auto text-lg text-indigo-100 mb-8">
                Imagine your graduates stepping into the workforce with confidence, certifications, and real-world skills from day one. With RAAS Academy, your university can transform education into meaningful career outcomes.
              </p>
              <Link
                to="/contact"
                className="inline-block px-8 py-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-300 transition"
              >
                Start a Partnership
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Bridging the Gap Section */}
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Bridging the Gap Between Classroom Learning and Industry Readiness
              </h2>
              <p className="max-w-4xl mx-auto text-lg text-gray-600">
                At RAAS Academy, we partner with universities to equip students with the practical skills, certifications, and real-world experiences they need to thrive in today's competitive job market. Our collaboration enhances your academic programs, strengthens student employability, and builds stronger industry connections—without adding extra burden to your faculty or curriculum.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Universities Partner with RAAS Academy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-xl p-6 shadow border hover:shadow-md transition"
                >
                  <Icon className="h-8 w-8 text-indigo-600 mb-4" />
                  <h3 className="font-semibold text-lg text-gray-900">
                    {b.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">{b.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Partnership Models */}
        <section className="bg-indigo-50 py-16">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Partnership Models for Universities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partnershipModels.map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-8 rounded-lg shadow-sm border"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      <span className="font-bold text-indigo-600">{idx + 1}</span>
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900">
                      {m.title}
                    </h3>
                  </div>
                  <p className="text-gray-700">{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <Award className="h-12 w-12 mx-auto text-indigo-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Transforming Education Into Career Success
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-gray-600">
                By partnering with RAAS Academy, universities ensure their students are not just educated—but employable, certified, and industry-ready from day one. Our mission is to complement your academic excellence with practical career pathways that benefit both students and the institution.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">
              Together, We Create Future-Ready Graduates.
            </h2>
            <p className="text-lg text-indigo-100 mb-8">
              Join leading universities that are revolutionizing how they prepare students for successful careers.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-300 transition"
            >
              Start a Partnership
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default UniversitiesPage;