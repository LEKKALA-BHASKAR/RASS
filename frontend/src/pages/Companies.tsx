import React from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, CheckCircle, Phone } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const directHireSteps = [
  {
    title: "Browse Talent",
    desc: "Access our pool of highly trained, pre-screened interns.",
  },
  {
    title: "Interview & Select",
    desc: "Conduct interviews with shortlisted candidates to ensure the best fit.",
  },
  {
    title: "Onboard Quickly",
    desc: "Selected interns join your ongoing or upcoming projects without delay.",
  },
];

const trainingHireSteps = [
  {
    title: "Share Your Needs",
    desc: "Provide us with your project scope, required skills, and timelines.",
  },
  {
    title: "Tailored Training",
    desc: "We design and deliver a targeted training program aligned with your requirements.",
  },
  {
    title: "Assess & Interview",
    desc: "Candidates complete assessments before your final interviews.",
  },
  {
    title: "Deploy with Confidence",
    desc: "Interns join your project with the exact skill set you need.",
  },
];

const benefits = [
  {
    title: "Immediate Productivity",
    desc: "Interns arrive with the skills and tools needed, requiring minimal onboarding so they can contribute from day one.",
  },
  {
    title: "Reduced Hiring Effort",
    desc: "We handle sourcing, screening, and training—your team only focuses on interviews and onboarding.",
  },
  {
    title: "Lower Risk, Higher Quality",
    desc: "All interns are pre-vetted for skills, communication, and readiness to ensure only top candidates reach you.",
  },
  {
    title: "Customized Skill Alignment",
    desc: "We design training programs so interns match your project’s tech stack, processes, and objectives perfectly.",
  },
  {
    title: "Zero-Cost Talent Pipeline",
    desc: "Access a steady stream of trained interns at no cost. Evaluate performance and hire top performers full-time.",
  },
  {
    title: "Fresh Perspectives & Innovation",
    desc: "Interns bring fresh ideas, academic insights, and enthusiasm to energize your team.",
  },
  {
    title: "Scalable Resource Solution",
    desc: "Scale quickly with interns when project demands spike, without long lead times or heavy hiring budgets.",
  },
];

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const Companies: React.FC = () => {
  return (
    <div>
        <Navbar />
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold mb-6"
          >
            Build Your Talent Pipeline with Vetted and Ready-to-Work Interns
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-indigo-100 max-w-3xl mx-auto mb-8"
          >
            Streamline your operations by engaging focus-driven, pre-qualified
            interns who bring fresh perspectives, support critical projects, and
            deliver tangible outcomes—completely free to your business.
          </motion.p>
          <motion.a
            href="/contact"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="inline-block px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
          >
            Schedule a Call
          </motion.a>
        </div>
      </section>

      {/* Section Intro */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Flexible Internship Hiring Solutions for Your Company
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          We offer tailored pathways to help companies seamlessly integrate
          skilled interns into their teams—ensuring the right talent is ready to
          make an immediate impact.
        </p>
      </section>

      {/* Direct Hire */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">
          Direct Hire from Our Pre-Screened Talent Pool
        </h3>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Ideal for companies ready to onboard trained interns right away.
          <br />
          <span className="font-medium text-indigo-600">
            Benefit: No training overhead—interns are job-ready from day one.
          </span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {directHireSteps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={idx}
              className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900">{step.title}</h4>
              <p className="text-sm text-gray-600 mt-2">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Training-to-Hire */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">
            Customized Training-to-Hire Program
          </h3>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Perfect for businesses with specific project requirements.
            <br />
            <span className="font-medium text-green-600">
              Benefit: Interns are trained exclusively to meet your project’s
              technical and operational needs.
            </span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {trainingHireSteps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={idx}
                className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Briefcase className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{step.title}</h4>
                <p className="text-sm text-gray-600 mt-2">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">
          Why Partner with Us for Trained & Pre-Screened Interns
        </h3>
        <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
          Our approach is designed to save your business time, reduce hiring
          risks, and maximize productivity from day one.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={idx}
              className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition"
            >
              <CheckCircle className="h-5 w-5 text-indigo-600 mb-2" />
              <h4 className="font-semibold text-gray-900">{b.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-indigo-700 py-16 text-center text-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-4"
        >
          Ready to Access Job-Ready Talent?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-indigo-100 mb-6 max-w-2xl mx-auto"
        >
          Zero-Cost Talent Pipeline. Proven Results. Start today.
        </motion.p>
        <motion.a
          href="/contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
        >
          <Phone className="h-5 w-5" /> Schedule a Call
        </motion.a>
      </section>
    </div>
    <Footer />
    </div>
  );
};

export default Companies;
