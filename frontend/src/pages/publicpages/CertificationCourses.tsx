import React, { useState } from 'react';

// Define types for our data
interface Feature {
  id: number;
  title: string;
  description: string;
}

interface CourseBenefit {
  id: number;
  title: string;
  description: string;
}

// Main component
const CertificationCourses: React.FC = () => {
  // Data for our features
  const features: Feature[] = [
    {
      id: 1,
      title: "Flexible Hybrid Learning",
      description: "Experience the energy of live, instructor-led classes combined with the freedom of self-paced preparatory modules."
    },
    {
      id: 2,
      title: "Applied, Hands-On Learning",
      description: "Bridge the gap between theory and practice with immersive projects and labs that mirror professional tasks."
    },
    {
      id: 3,
      title: "Practice for Mastery",
      description: "Ensure you master every concept with module-specific assignments and practical challenges designed to test your knowledge."
    },
    {
      id: 4,
      title: "Your Central Learning Hub",
      description: "Navigate your entire learning journey from lessons to peer collaboration—on one intuitive, state-of-the-art platform."
    },
    {
      id: 5,
      title: "24/7 Expert Mentorship",
      description: "Receive timely guidance whenever you need it from our dedicated team of expert mentors, committed to ensuring your success."
    },
    {
      id: 6,
      title: "Data-Driven Insights",
      description: "Track your learning journey and identify areas for improvement with a personalized dashboard showing detailed performance analytics."
    },
    {
      id: 7,
      title: "Innovate & Compete",
      description: "Showcase your talent to the industry by participating in high-stakes hackathons and real-world coding challenges."
    },
    {
      id: 8,
      title: "Bridge to Your Career",
      description: "Translate your training into professional experience by qualifying for exclusive internship opportunities with our network of partner companies."
    },
    {
      id: 9,
      title: "Learn from the Best",
      description: "Go beyond the curriculum with exclusive masterclasses and Q&A sessions featuring top-tier leaders from industry and academia."
    },
    {
      id: 10,
      title: "Exclusive Community Events",
      description: "Stay on the cutting edge with our regular lineup of expert-led workshops, webinars, and virtual conferences."
    }
  ];

  // Data for our benefits
  const benefits: CourseBenefit[] = [
    {
      id: 1,
      title: "Mastering the Art of Learning",
      description: "Develop effective learning strategies that will serve you throughout your career."
    },
    {
      id: 2,
      title: "Building Skills Through Practice",
      description: "Reinforce your knowledge with hands-on exercises and real-world applications."
    },
    {
      id: 3,
      title: "Learning with a Peer Community",
      description: "Collaborate and grow with like-minded individuals on the same learning journey."
    },
    {
      id: 4,
      title: "Proving Talent in Competitions",
      description: "Test your skills against others and demonstrate your abilities in competitive environments."
    }
  ];

  // State for the currently selected feature (for mobile view)
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 py-16 px-6 sm:px-10 lg:px-16">
    {/* Header */}
    <header className="text-center mb-20">
      <h1 className="text-5xl font-extrabold text-indigo-900 mb-6 leading-tight tracking-tight">
        Our Certification Courses
      </h1>
      <p className="text-2xl text-indigo-700 italic font-medium mb-12">
        "From foundational skills to advanced professional mastery."
      </p>

      {/* Benefits grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
          >
            <h3 className="text-lg font-bold text-indigo-800 mb-4 border-l-4 border-indigo-500 pl-3">
              {benefit.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
          </div>
        ))}
      </div>
    </header>

    {/* Main content */}
    <main className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center text-indigo-900 mb-16">
        Our Learning Features
      </h2>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="group bg-gradient-to-br from-white/90 to-indigo-50 rounded-2xl shadow-lg overflow-hidden transform transition duration-500 hover:-translate-y-3 hover:shadow-2xl"
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-600 text-white p-4 rounded-xl mr-5 shadow-md group-hover:scale-110 transition">
                  <span className="font-bold text-xl">{feature.id}</span>
                </div>
                <h3 className="text-2xl font-semibold text-indigo-800 tracking-tight">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl opacity-90"></div>
        <div className="relative z-10 text-center py-16 px-8 rounded-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 drop-shadow-lg">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with
            our industry-recognized certification courses.
          </p>
          <button className="bg-white text-indigo-700 font-bold text-lg py-4 px-10 rounded-full shadow-xl hover:bg-indigo-100 hover:scale-105 transform transition">
            🚀 Enroll Now
          </button>
        </div>
      </div>
    </main>
  </div>
);
};

export default CertificationCourses;