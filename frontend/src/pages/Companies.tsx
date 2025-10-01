import React from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, CheckCircle, Phone, AlertTriangle, Lightbulb, ArrowRight, Building, Star, Shield, Clock, Target } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const directHireSteps = [
  {
    title: "Browse Talent",
    desc: "Access our pool of pre-screened, certified students ready for internships and full-time roles.",
    icon: <Users className="h-8 w-8 text-indigo-600" />
  },
  {
    title: "Interview & Select",
    desc: "Engage with shortlisted candidates and select those who align with your project goals.",
    icon: <CheckCircle className="h-8 w-8 text-indigo-600" />
  },
  {
    title: "Onboard Quickly",
    desc: "Students integrate seamlessly into your teams, contributing from day one.",
    icon: <Clock className="h-8 w-8 text-indigo-600" />
  },
];

const trainingHireSteps = [
  {
    title: "Share Your Needs",
    desc: "Tell us your project scope, skill requirements, and timelines.",
    icon: <Target className="h-8 w-8 text-green-600" />
  },
  {
    title: "Tailored Training",
    desc: "We design and deliver a targeted program aligned with your company's needs.",
    icon: <Briefcase className="h-8 w-8 text-green-600" />
  },
  {
    title: "Assess & Validate",
    desc: "Students complete assessments and certifications.",
    icon: <CheckCircle className="h-8 w-8 text-green-600" />
  },
  {
    title: "Deploy with Confidence",
    desc: "Interns join your project trained exclusively for your technical and operational goals.",
    icon: <Shield className="h-8 w-8 text-green-600" />
  },
];


const startupChallenges = [
  "High Hiring Costs: Salaries, benefits, and training expenses place a heavy burden on tight budgets.",
  "Limited Access to Skilled Talent: Competing with larger, established companies makes it difficult to attract qualified candidates.",
  "Hiring Risks: A mismatched hire can slow down projects, increase costs, and disrupt momentum.",
];

const ourSolutions = [
  "Pre-Trained Professionals: Immediate access to certified talent with practical skills and project experience.",
  "Cost-Effective Hiring: Lower onboarding and training costs by hiring candidates who are ready to contribute from day one.",
  "Flexible Engagement Options: Choose from short-term project support or long-term hires to match your evolving needs.",
  "Risk-Free Hiring: Pre-screened, skill-validated candidates ensure strong alignment with your technical and operational requirements.",
];

const benefits = [
  {
    title: "Immediate Productivity",
    desc: "Interns arrive with the skills needed, requiring minimal onboarding.",
    icon: <Clock className="h-10 w-10 text-indigo-600 mb-4" />
  },
  {
    title: "Lower Hiring Risks",
    desc: "Only pre-vetted students make it to your shortlist.",
    icon: <Shield className="h-10 w-10 text-indigo-600 mb-4" />
  },
  {
    title: "Zero-Cost Talent Pipeline",
    desc: "Access a steady stream of trained students at no cost.",
    icon: <Users className="h-10 w-10 text-indigo-600 mb-4" />
  },
  {
    title: "Fresh Perspectives",
    desc: "Students bring new ideas, energy, and innovation.",
    icon: <Lightbulb className="h-10 w-10 text-indigo-600 mb-4" />
  },
  {
    title: "Scalable Solution",
    desc: "Quickly scale your workforce to meet project spikes.",
    icon: <Building className="h-10 w-10 text-indigo-600 mb-4" />
  },
  {
    title: "Industry-Ready Skills",
    desc: "All candidates are certified and trained on industry-standard tools.",
    icon: <Star className="h-10 w-10 text-indigo-600 mb-4" />
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Companies: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-3/5 text-center md:text-left mb-10 md:mb-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    Hire Certified Talent to your workforce - <span className="text-indigo-200">That's Ready Before Day One</span>
                  </h1>
                  <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mb-8">
                    We don't just train students, we transform them into job-ready professionals. With certifications, hands-on training, and real-world project skills, our graduates are ready to make an impact from day one. 
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-semibold rounded-lg shadow-lg hover:bg-indigo-50 transition transform hover:scale-105"
                  >
                    Become a Hiring Partner <ArrowRight className="h-5 w-5" />
                  </a>
                </motion.div>
              </div>
              <div className="md:w-2/5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="relative"
                >
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">100% Job-Ready</h3>
                        <p className="text-indigo-200">Certified & Project-Trained</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <p className="text-sm">
                            {i === 0 && "Industry-standard certifications"}
                            {i === 1 && "Real-world project experience"}
                            {i === 2 && "Direct Hire & Training-to-Hire models"}
                            {i === 3 && "Industry Ready Skills"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-block p-2 px-4 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                About Us
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About RASS Academy</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                At RASS Academy, we bridge the gap between academia and industry by equipping college graduates with the practical skills and certifications they need to succeed in today's workforce. Our mission is simple: empower students to become industry-ready from day one, while helping companies access a pipeline of trained, certified, and motivated talent.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Partnership Models */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-block p-2 px-4 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                Our Partnership Models
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Choose Your Collaboration Model</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We invite forward-thinking companies to join us as Hiring Partners through unique collaboration models designed to meet your organizational needs.
              </p>
            </motion.div>

            {/* Direct Hire */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-20">
              <div className="grid md:grid-cols-2">
                <div className="bg-indigo-700 text-white p-10 md:p-16">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6">
                    Direct Hire: Access Pre-Screened Talent
                  </h3>
                  <p className="text-indigo-100 mb-8">
                    Ideal for companies ready to onboard trained interns immediately. Get access to job-ready interns who require no additional training—saving time, cost, and effort.
                  </p>
                  <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition">
                    Learn More <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
                <div className="p-10 md:p-16">
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-8"
                  >
                    {directHireSteps.map((step, idx) => (
                      <motion.div
                        key={idx}
                        variants={fadeUp}
                        custom={idx}
                        className="flex gap-4"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {step.icon}
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h4>
                          <p className="text-gray-600">{step.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Training-to-Hire */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="order-2 md:order-1 p-10 md:p-16">
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-8"
                  >
                    {trainingHireSteps.map((step, idx) => (
                      <motion.div
                        key={idx}
                        variants={fadeUp}
                        custom={idx}
                        className="flex flex-col items-center text-center"
                      >
                        <div className="mb-4">
                          {step.icon}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.desc}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
                <div className="order-1 md:order-2 bg-green-700 text-white p-10 md:p-16">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6">
                    Customized Training-to-Hire Program
                  </h3>
                  <p className="text-green-100 mb-8">
                    Perfect for businesses with specific project requirements. Build a custom-trained workforce that matches your exact requirements, reducing hiring risks and accelerating productivity.
                  </p>
                  <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition">
                    Learn More <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Startup Challenges */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-block p-2 px-4 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                For Startups
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">The Startup Challenge: Talent Acquisition Made Simple</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                For early-stage startups, building the right team is both critical and challenging. Limited resources, high competition for skilled professionals, and the cost of onboarding can quickly become roadblocks to growth.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <AlertTriangle className="h-7 w-7 text-red-500" />
                  <span>Challenges Startups Face</span>
                </h3>
                <ul className="space-y-6">
                  {startupChallenges.map((c, idx) => (
                    <li key={idx} className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>
                      <p className="text-gray-700">{c}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Lightbulb className="h-7 w-7 text-green-500" />
                  <span>How RASS Academy Supports Startups</span>
                </h3>
                <ul className="space-y-6">
                  {ourSolutions.map((s, idx) => (
                    <li key={idx} className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-gray-700">{s}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 inline-block max-w-3xl">
                <h4 className="text-xl font-bold text-indigo-900 mb-3">The Outcome</h4>
                <p className="text-indigo-700">
                  Startups can build strong teams faster, at lower cost, and with greater confidence—freeing founders to focus on innovation and scaling the business.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-block p-2 px-4 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                Benefits
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Partner with RASS Academy</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our partnership model is designed to provide maximum value with minimal risk, helping your organization access top talent efficiently.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {benefits.map((b, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  custom={idx}
                  className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-indigo-200 flex flex-col items-center text-center"
                >
                  {b.icon}
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{b.title}</h4>
                  <p className="text-gray-600">{b.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-indigo-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-block p-2 px-4 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                Success Stories
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What Our Partners Say</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Hear from companies who have transformed their hiring process with RASS Academy.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className="bg-white p-8 rounded-xl shadow-md"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                    <div>
                      <h4 className="font-bold text-lg">
                        {idx === 0 ? "Sarah Johnson" : "Michael Chen"}
                      </h4>
                      <p className="text-gray-600">
                        {idx === 0 ? "CTO, TechStart Inc." : "HR Director, InnovateCorp"}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    {idx === 0 
                      ? "The interns we hired through RASS Academy were ready to contribute from day one. Their technical skills and project experience made onboarding seamless, saving us valuable time and resources."
                      : "We've hired five graduates through the Training-to-Hire program, and all of them have exceeded our expectations. The custom training aligned perfectly with our tech stack and project needs."
                    }
                  </p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500" fill="#EAB308" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Access Job-Ready Talent?
              </h2>
              <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
                Zero-Cost Talent Pipeline. Proven Results. Become a Hiring Partner Today and access certified, project-ready talent tailored for your organization’s success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 font-semibold rounded-lg shadow-lg hover:bg-indigo-50 transition"
                >
                  <Phone className="h-5 w-5" /> Become a Partner
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
                >
                  Learn More <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Companies;