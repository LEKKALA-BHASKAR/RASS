import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Video, MessageCircle, Calendar, ChevronRight, Star, TrendingUp, Clock, Heart, Target, Globe } from 'lucide-react';
import { HeroCarousel } from './publicpages/HeroSection';
import { ClientsSection } from './publicpages/ClientSection';
import CourseShowcase from './publicpages/CourseShowcase';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import CertificationCourses from './publicpages/CertificationCourses';
import PartnerWithUs from './publicpages/PartnerWithUs';
import CompaniesPage from './publicpages/CompaniesPage';

const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-indigo-600" />,
      title: "Interactive Courses",
      description: "Engage with video content, assignments, and interactive learning materials"
    },
    {
      icon: <Users className="h-10 w-10 text-indigo-600" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals and experienced educators"
    },
    {
      icon: <Award className="h-10 w-10 text-indigo-600" />,
      title: "Certificates",
      description: "Earn verified certificates upon course completion"
    },
    {
      icon: <Video className="h-10 w-10 text-indigo-600" />,
      title: "Live Sessions",
      description: "Join live webinars and interactive sessions with instructors"
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-indigo-600" />,
      title: "Discussion Forums",
      description: "Connect with peers and instructors in course-specific forums"
    },
    {
      icon: <Calendar className="h-10 w-10 text-indigo-600" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed progress analytics"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Active Students", icon: <Users className="h-6 w-6" /> },
    { value: "500+", label: "Expert Instructors", icon: <Heart className="h-6 w-6" /> },
    { value: "200+", label: "Courses Available", icon: <BookOpen className="h-6 w-6" /> },
    { value: "98%", label: "Satisfaction Rate", icon: <Target className="h-6 w-6" /> }
  ];

  const testimonials = [
    {
      name: "Bhaskar Lekkala",
      role: "Web Developer",
      content: "RASS Academy completely transformed my career. The courses are well-structured and the instructors are incredibly knowledgeable.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "S Vamsi",
      role: "Data Scientist",
      content: "The hands-on projects helped me build a portfolio that landed me my dream job. The support from instructors was exceptional.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Priya Sharma",
      role: "UX Designer",
      content: "As a working professional, the flexible learning schedule was perfect for me. I could learn at my own pace without compromising my job.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  return (
    <div>
      <Navbar/>
   
    <div className="min-h-screen overflow-hidden bg-white">
      
     
<HeroCarousel/>
      {/* Stats Section */}
      <section className="py-16 bg-indigo-600 text-white">
       <ClientsSection/>
      </section>
      <CourseShowcase/>
      <CertificationCourses/>
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              A Learning Experience <span className="text-indigo-600">Designed for Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides comprehensive tools for students, instructors, and administrators 
              to create the best learning experience possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-slate-50 rounded-xl p-8 hover:bg-indigo-50 transition-all duration-300 group border border-transparent hover:border-indigo-100"
              >
                <div className="inline-flex items-center justify-center p-3 bg-white rounded-lg shadow-sm mb-6 group-hover:bg-indigo-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-indigo-700">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PartnerWithUs/>
      <CompaniesPage/>
      {/* Testimonial Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="text-indigo-600">Students</span> Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from some of our students who have transformed their careers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={20} className="fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-indigo-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Join thousands of students already learning with RASS Academy. 
            Start your journey today with our comprehensive courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-indigo-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
            >
              Join RASS Academy <TrendingUp size={20} />
            </Link>
            <Link 
              to="/courses" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-700 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              View Courses <Clock size={20} />
            </Link>
          </div>
        </div>
      </section>
    <Footer/>
    </div>
     </div>
  );
};

export default Home;