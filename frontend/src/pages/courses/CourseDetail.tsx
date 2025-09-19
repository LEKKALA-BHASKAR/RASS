import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { courseAPI, enrollmentAPI } from "../../services/api";
import { Course, Enrollment } from "../../types";

// Components
import CourseHero from "../../components/course/CourseHero";
import CourseDetails from "../../components/course/CourseDetails";
import LearningOutcomes from "../../components/course/LearningOutcomes";
import CourseHighlights from "../../components/course/CourseHighlights";
import CourseCurriculum from "../../components/course/CourseCurriculum";
import ToolsTechnologies from "../../components/course/ToolsTechnologies";
import InstructorCard from "../../components/course/InstructorCard";
import AlumniSpeaks from "../../components/course/AlumniSpeaks";
import LearningJourney from "../../components/course/LearningJourney";
import CourseDescription from "../../components/course/CourseDescription";
import DreamCompanies from "../../components/course/DreamCompanies";
import FeeRegistration from "../../components/course/FeeRegistration";
import FAQSection from "../../components/course/FAQSection";

// ✅ Import local assets
import googleLogo from "../../assets/companies/google.png";
import microsoftLogo from "../../assets/companies/microsoft.png";
import amazonLogo from "../../assets/companies/amazon.png";
import wiproLogo from "../../assets/companies/wipro.png";
const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const courseRes = await courseAPI.getCourse(id!);
      setCourse(courseRes.data);

      if (isAuthenticated) {
        try {
          const enrollmentsRes = await enrollmentAPI.getMyEnrollments();
          const userEnrollment = enrollmentsRes.data.find(
            (e: Enrollment) => e.course._id === id
          );
          setEnrollment(userEnrollment || null);
        } catch {
          setEnrollment(null);
        }
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated || !course) return;
    try {
      await enrollmentAPI.enrollInCourse(course._id);
      await fetchCourseData();
      navigate(`/learn/${course._id}`);
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Course not found.</p>
      </div>
    );
  }

  // 🔹 Mock fallbacks if backend doesn’t provide fields
  const highlights = course?.["highlights"] || [
    { title: "Hands-on Projects", desc: "Work on portfolio-ready projects." },
    { title: "Mentorship", desc: "Learn directly from industry experts." },
    { title: "Job Readiness", desc: "Resume building & mock interviews." },
  ];

  const tools = course?.["tools"] || [
    { name: "React" },
    { name: "Node.js" },
    { name: "MongoDB" },
  ];

  const testimonials =
  (course as any).testimonials?.map((t: any) => ({
    name: t.name,
    role: t.role || t.title || "Student", // ✅ normalize field
    quote: t.quote,
    avatar: t.avatar,
  })) || [
    {
      name: "Aditi Sharma",
      role: "Frontend Engineer",
      quote:
        "This course gave me the confidence and skills to land my first developer role.",
    },
    {
      name: "Rohit Mehta",
      role: "Data Analyst",
      quote:
        "The projects and mentorship were game-changing for my career transition.",
    },
  ];


  const learningJourney = course?.["learningJourney"] || [
    { step: "Enroll", desc: "Join the program and unlock your dashboard." },
    { step: "Learn", desc: "Complete interactive modules and assignments." },
    { step: "Build", desc: "Work on real-world projects." },
    { step: "Get Hired", desc: "Leverage our career support & placements." },
  ];

  const companies = course?.["companies"] || [
    { name: "Google", logo: googleLogo },
    { name: "Microsoft", logo: microsoftLogo },
    { name: "Amazon", logo: amazonLogo },
    { name: "Wipro", logo: wiproLogo },
  ];

  const faqs = course?.["faqs"] || [
    {
      question: "Do I get a certificate after completion?",
      answer: "Yes, you receive a shareable industry-recognized certificate.",
    },
    {
      question: "Is placement support provided?",
      answer:
        "Absolutely, we provide resume prep, mock interviews, and connect you with hiring partners.",
    },
    {
      question: "Are there live sessions?",
      answer:
        "Yes, the program includes both self-paced modules and live mentor sessions.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-16">
      <CourseHero course={course} enrollment={enrollment} onEnroll={handleEnroll} />
      <CourseDetails course={course} />
      <LearningOutcomes outcomes={course.learningOutcomes} />
      <CourseHighlights highlights={highlights} />
      <CourseCurriculum modules={course.modules} />
      <ToolsTechnologies tools={tools} />
      <InstructorCard instructor={course.instructor} />
      <AlumniSpeaks testimonials={testimonials} />
      <LearningJourney journey={learningJourney} />
      <CourseDescription description={course.description} />
      <DreamCompanies companies={companies} />
      <FeeRegistration
        course={course}
        enrollment={enrollment}
        onEnroll={handleEnroll}
      />
      <FAQSection faqs={faqs} />
    </div>
  );
};

export default CourseDetail;
