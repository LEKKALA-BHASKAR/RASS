import React from "react";
import { motion } from "framer-motion";
import { Users, GraduationCap, Rocket, CheckCircle, ArrowRight, BookOpen, Target, Zap } from "lucide-react";

const HTDSection: React.FC = () => {
  const htdSteps = [
    {
      id: "hire",
      title: "Hire – Discover the Right Talent",
      icon: <Users className="h-10 w-10" />,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      points: [
        "Partner with top colleges to identify high-potential graduates",
        "Thorough screening process for aptitude, communication, and problem-solving",
        "Select individuals who align with your organization's culture and goals"
      ]
    },
    {
      id: "train",
      title: "Train – Build Industry-Ready Professionals",
      icon: <GraduationCap className="h-10 w-10" />,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      points: [
        "Training programs curated by industry experts",
        "Hands-on learning in latest technologies and tools",
        "Development of soft skills and corporate professionalism",
        "Live projects and case-based learning approach"
      ]
    },
    {
      id: "deploy",
      title: "Deploy – Accelerate Your Projects",
      icon: <Rocket className="h-10 w-10" />,
      color: "from-green-500 to-teal-600",
      bgColor: "bg-green-50",
      points: [
        "Direct deployment to client projects",
        "Elimination of recruitment delays and training overheads",
        "Smooth integration into your teams",
        "Effective contribution from day one"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hire. Train. Deploy.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering Businesses with Project-Ready Talent
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <p className="text-lg text-gray-600 leading-relaxed">
            At RAAS Academy, we understand that today's businesses need skilled professionals who can deliver results from day one. Our Hire, Train, and Deploy (HTD) model is designed to bridge the gap between academic education and industry expectations, creating a steady pipeline of job-ready talent for your organization.
          </p>
        </motion.div>

        {/* HTD Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {htdSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Card */}
              <div className={`h-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100`}>
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${step.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      {step.icon}
                    </div>
                    <div className="text-3xl font-bold">
                      0{index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <ul className="space-y-3">
                    {step.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Connector */}
              {index < htdSteps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
      
      <style >{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default HTDSection;