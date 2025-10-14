import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { courseAPI, enrollmentAPI } from "../../services/api";
import { Course, Enrollment } from "../../types";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

// Components
import CourseHero from "../../components/course/CourseHero";
import CourseDetails from "../../components/course/CourseDetails";
import LearningOutcomes from "../../components/course/LearningOutcomes";
import CourseHighlights from "../../components/course/CourseHighlights";
import CourseCurriculum from "../../components/course/CourseCurriculum";
import ToolsTechnologies from "../../components/course/ToolsTechnologies";
import JobRoles from "../../components/course/JobRoles";
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
import { ClientsSection } from "../publicpages/ClientSection";

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Section Refs
  const sectionRefs: Record<string, React.RefObject<HTMLDivElement>> = {
    hero: useRef(null),
    details: useRef(null),
    outcomes: useRef(null),
    highlights: useRef(null),
    curriculum: useRef(null),
    tools: useRef(null),
    jobs: useRef(null),
    instructor: useRef(null),
    alumni: useRef(null),
    journey: useRef(null),
    description: useRef(null),
    companies: useRef(null),
    fee: useRef(null),
    faq: useRef(null),
  };

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

    // 🆓 Free course → enroll directly
    if (course.price === 0) {
      try {
        await enrollmentAPI.enrollInCourse(course._id);
        await fetchCourseData();
        navigate(`/learn/${course._id}`);
      } catch (error) {
        console.error("Error enrolling free course:", error);
      }
      return;
    }

    // 💳 Paid course → Razorpay flow
    try {
      // 1. Create Razorpay order from backend
      const res = await fetch("https://rass-h2s1.onrender.com/api/payments/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ courseId: course._id }),
      });

      const { order } = await res.json();
      if (!order) {
        alert("Failed to create payment order");
        return;
      }

      const options = {
        key: "rzp_test_RJqt4AZALMZEYE", // ✅ Test key
        amount: order.amount,
        currency: order.currency,
        name: "RASS Academy",
        description: `Payment for ${course.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(
              "https://rass-h2s1.onrender.com/api/payments/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  ...response,
                  courseId: course._id,
                }),
              }
            );

            const result = await verifyRes.json();

            if (result.success) {
              await fetchCourseData();
              navigate(`/learn/${course._id}`);
            } else {
              alert("Payment verified but enrollment failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Something went wrong verifying payment.");
          }
        },
        prefill: {
          name: "Student",
          email: "student@example.com",
        },
        theme: { color: "#6366f1" },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong during payment.");
    }
  };

  const scrollToSection = (key: string) => {
  const ref = sectionRefs[key]?.current;
  if (ref) {
    const topOffset = 100; // height of sticky nav
    const elementPosition = ref.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - topOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
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

  // 🔹 Fallbacks for missing fields
  const highlights = (course as any).highlights || [
    { title: "Hands-on Projects", desc: "Work on portfolio-ready projects." },
    { title: "Mentorship", desc: "Learn directly from industry experts." },
    { title: "Job Readiness", desc: "Resume building & mock interviews." },
  ];

  // Use the actual techStack from the course or fallback to default tools
  const tools = course.techStack || (course as any).tools || [
    { name: "React" },
    { name: "Node.js" },
    { name: "MongoDB" },
  ];

  // Use the actual jobRoles from the course
  const jobRoles = (course.jobRoles || [])
    .filter((role): role is string => role !== null && role !== undefined && typeof role === 'string' && role.trim() !== '')
    .map(role => ({ name: role })) || [];

  const testimonials =
    (course as any).testimonials?.map((t: any) => ({
      name: t.name,
      role: t.role || t.title || "Student",
      quote: t.quote || t.description || "",
      avatar: t.avatar || t.imageUrl || "",
    })) || [];

  const learningJourney = (course as any).learningJourney || [];

  const companies = (course as any).companies || [
    { name: "Google", logo: googleLogo },
    { name: "Microsoft", logo: microsoftLogo },
    { name: "Amazon", logo: amazonLogo },
    { name: "Wipro", logo: wiproLogo },
  ];

  const faqs = (course as any).faqs || [];

 return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ✅ Sticky Navigation */}
      <div className="sticky top-16 bg-white shadow z-40 border-b">
        <div className="max-w-8xl mx-auto flex items-center px-6 py-3 overflow-x-auto space-x-3 text-sm font-medium">
          {[
            { key: "description", label: "About Course" },
            { key: "curriculum", label: "Curriculum" },
            { key: "tools", label: "Tools & Tech" },
            { key: "jobs", label: "Job Roles" },
            { key: "details", label: "Course Overview" },
            { key: "outcomes", label: "Learning Outcomes" },
            { key: "highlights", label: "Highlights" },
            { key: "alumni", label: "Alumni Speaks" },
            { key: "journey", label: "Admission Process" },
            { key: "companies", label: "Dream Companies" },
            { key: "fee", label: "Fee & Registration" },
            { key: "faq", label: "FAQs" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => scrollToSection(tab.key)}
              className="px-4 py-2 rounded-full border border-indigo-200 text-gray-700 bg-gray-50 hover:bg-indigo-100 hover:text-indigo-700 transition whitespace-nowrap"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Sections - Remove spacing between components */}
      <div className="flex flex-col min-h-screen">
        <div ref={sectionRefs.hero}>
          <CourseHero course={course} enrollment={enrollment} onEnroll={handleEnroll} />
        </div>
        <div ref={sectionRefs.description}>
          <CourseDescription description={course.description || ""} />
        </div>
        <div ref={sectionRefs.curriculum}>
          <CourseCurriculum modules={course.modules || []} />
        </div>
        <div ref={sectionRefs.tools}>
          <ToolsTechnologies tools={tools} />
        </div>
        <div ref={sectionRefs.jobs}>
          <JobRoles jobRoles={jobRoles} />
        </div>
        <div ref={sectionRefs.details}>
          <CourseDetails course={course} />
        </div>
        <div ref={sectionRefs.outcomes}>
          <LearningOutcomes outcomes={course.learningOutcomes || []} />
        </div>
        <div ref={sectionRefs.highlights}>
          <CourseHighlights highlights={highlights} />
        </div>
        <div ref={sectionRefs.alumni}>
          <AlumniSpeaks testimonials={testimonials} />
        </div>
        <div ref={sectionRefs.journey}>
          <LearningJourney journey={learningJourney} />
        </div>
        <div ref={sectionRefs.companies}>
          <ClientsSection/>
        </div>
        <div ref={sectionRefs.fee}>
          <FeeRegistration course={course} enrollment={enrollment} onEnroll={handleEnroll} />
        </div>
        <div ref={sectionRefs.faq}>
          <FAQSection faqs={faqs} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;
