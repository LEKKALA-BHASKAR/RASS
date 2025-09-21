import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Briefcase,
  GraduationCap,
  Users,
  Star,
  Award,
  BookOpen,
} from "lucide-react";

export interface Highlight {
  title: string;
  desc: string;
}

interface Props {
  highlights: Highlight[];
}

const CourseHighlights: React.FC<Props> = ({ highlights }) => {
  // Curated default highlights
  const defaultHighlights = [
    {
      title: "Live + Recorded Classes",
      desc: "Attend interactive sessions or learn at your own pace with full flexibility.",
      icon: <BookOpen className="h-7 w-7 text-indigo-600" />,
    },
    {
      title: "Hands-on Projects",
      desc: "Build 5+ portfolio-ready projects guided by industry mentors.",
      icon: <CheckCircle className="h-7 w-7 text-green-600" />,
    },
    {
      title: "Career Support",
      desc: "Mock interviews, resume prep & referrals to 50+ hiring partners.",
      icon: <Briefcase className="h-7 w-7 text-blue-600" />,
    },
    {
      title: "1:1 Mentorship",
      desc: "Personal mentorship from experts throughout your journey.",
      icon: <Users className="h-7 w-7 text-purple-600" />,
    },
    {
      title: "Job Guarantee",
      desc: "Placement support until you get hired in your dream role.",
      icon: <Star className="h-7 w-7 text-yellow-500" />,
    },
    {
      title: "Industry Certificate",
      desc: "Earn a certificate recognized by top MNCs & startups.",
      icon: <Award className="h-7 w-7 text-pink-600" />,
    },
  ];

  // ✅ Merge DB highlights with defaults
  const displayHighlights = [
    ...highlights.map((h) => ({
      ...h,
      icon: <CheckCircle className="h-7 w-7 text-indigo-600" />,
    })),
    ...defaultHighlights,
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15 },
    }),
  };

  return (
    <section className="py-14">
      <h2 className="text-3xl font-bold mb-10 text-center">Course Highlights</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayHighlights.map((h, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={idx}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-2xl shadow-md border hover:shadow-xl transition"
          >
            <div className="mb-3">{(h as any).icon}</div>
            <h3 className="font-semibold text-gray-900 text-lg">{h.title}</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{h.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CourseHighlights;
