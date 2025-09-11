import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Video, MessageCircle, Calendar } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary-600" />,
      title: "Interactive Courses",
      description: "Engage with video content, assignments, and interactive learning materials"
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals and experienced educators"
    },
    {
      icon: <Award className="h-8 w-8 text-primary-600" />,
      title: "Certificates",
      description: "Earn verified certificates upon course completion"
    },
    {
      icon: <Video className="h-8 w-8 text-primary-600" />,
      title: "Live Sessions",
      description: "Join live webinars and interactive sessions with instructors"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-primary-600" />,
      title: "Discussion Forums",
      description: "Connect with peers and instructors in course-specific forums"
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary-600" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed progress analytics"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              RASS ACADEMY
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-primary-100">
              Learn. Grow. Succeed.
            </p>
            <p className="text-lg mb-8 text-primary-200 max-w-3xl mx-auto">
              Complete E-Learning Management System connecting Students, Instructors, and Admins 
              with powerful tools and dynamic dashboards for seamless education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started
              </Link>
              <Link to="/courses" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Learn
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive tools for students, instructors, and administrators 
              to create the best learning experience possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning with RASS Academy. 
            Start your journey today with our comprehensive courses.
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            Join RASS Academy
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;