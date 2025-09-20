import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Users,
  Star,
  BookOpen,
  DollarSign,
  Network,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const benefits = [
  {
    icon: BookOpen,
    title: "Learn Skills Employers Actually Need",
    desc: "Our programs are created with input from industry leaders, ensuring students gain practical, up-to-date skills.",
  },
  {
    icon: Briefcase,
    title: "Direct Access to Internships",
    desc: "Students don’t just finish training—they get connected to companies ready to hire.",
  },
  {
    icon: Star,
    title: "Customized Learning for Better Career Fit",
    desc: "We adapt our training to match students’ academic background and career aspirations.",
  },
  {
    icon: DollarSign,
    title: "Zero-Cost Internship Access",
    desc: "Financial barriers shouldn’t limit opportunity—students gain access to internships at no cost.",
  },
  {
    icon: Users,
    title: "Stronger Job Prospects After Graduation",
    desc: "Graduating with academic + industry experience makes students stand out in job markets.",
  },
  {
    icon: CheckCircle,
    title: "Work on Real Company Projects",
    desc: "Students gain confidence by applying skills in real-world projects with measurable impact.",
  },
  {
    icon: Network,
    title: "Build Long-Term Career Networks",
    desc: "Students expand professional networks, opening doors to mentorship and jobs.",
  },
];

const onboardingSteps = [
  {
    step: "University Collaboration",
    desc: "We align our program with your students’ academic and career goals.",
  },
  {
    step: "Tailored Training",
    desc: "Students receive targeted training designed to meet industry standards.",
  },
  {
    step: "Skill Assessments",
    desc: "We evaluate progress to ensure every student meets required competencies.",
  },
  {
    step: "Internship Matching",
    desc: "Students are placed with pre-vetted companies for meaningful internships.",
  },
  {
    step: "Career Advancement Support",
    desc: "From resumes to interviews, we help students transition into full-time roles.",
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
              Empowering Students Through Real-World Skills & Career
              Opportunities
            </h1>
            <p className="max-w-3xl mx-auto text-lg text-indigo-100 mb-8">
              We help universities transform academic learning into career
              success by giving students the chance to gain industry-ready
              skills, real project experience, and direct internship
              opportunities. Partnering with us means your students graduate
              with more than a degree—they graduate with a competitive edge.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-300 transition"
            >
              Schedule a Call
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why This Partnership Benefits Your Students
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="bg-white rounded-xl p-6 shadow border hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="h-8 w-8 text-indigo-600" />
                  <h3 className="font-semibold text-lg text-gray-900">
                    {b.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Onboarding Steps */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How We Onboard Your Students
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {onboardingSteps.map((s, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="bg-indigo-50 p-6 rounded-lg shadow-sm border text-center"
              >
                <div className="text-indigo-600 text-3xl font-bold mb-3">
                  {idx + 1}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.step}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Partner with us to give your students the confidence, skills, and
            experience to succeed from day one.
          </h2>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-300 transition"
          >
            Schedule a Call
          </Link>
        </div>
      </section>
    </div>
    <Footer />
    </div>
  );
};

export default UniversitiesPage;
