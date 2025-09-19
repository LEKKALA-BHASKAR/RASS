import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Users, 
  Award, 
  TrendingUp, 
  HeartHandshake,
  Lightbulb,
  Shield,
  Star,
  Calendar,
  MapPin,
  GraduationCap,
  BookOpen,
  Zap,
  ArrowRight,
  Play,
  Quote
} from 'lucide-react';
import Header from '../../components/layout/Navbar';
import Footer from '@/components/layout/Footer';


const OurStory = () => {
  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    placement: 0,
    companies: 0,
    courses: 0
  });

  useEffect(() => {
    // Animate statistics
    const interval = setInterval(() => {
      setAnimatedStats(prev => ({
        students: prev.students < 15000 ? prev.students + 150 : 15000,
        placement: prev.placement < 92 ? prev.placement + 1 : 92,
        companies: prev.companies < 2500 ? prev.companies + 25 : 2500,
        courses: prev.courses < 100 ? prev.courses + 1 : 100
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const timeline = [
    {
      year: "2019",
      title: "The Beginning",
      description: "RAAS Academy was founded with a vision to transform tech education and bridge the skills gap in the industry.",
      icon: <Target className="h-6 w-6" />
    },
    {
      year: "2020",
      title: "First Cohort",
      description: "Launched our first cohort with 30 students, focusing on full-stack development and data science.",
      icon: <Users className="h-6 w-6" />
    },
    {
      year: "2021",
      title: "Growth Phase",
      description: "Expanded to 5 new tech stacks and crossed 1000+ placements milestone with top companies.",
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      year: "2022",
      title: "National Presence",
      description: "Established offices in Bangalore, Hyderabad, and Delhi NCR. Launched corporate training programs.",
      icon: <MapPin className="h-6 w-6" />
    },
    {
      year: "2023",
      title: "10,000+ Students",
      description: "Reached the milestone of transforming 10,000+ careers with industry-relevant education.",
      icon: <GraduationCap className="h-6 w-6" />
    },
    {
      year: "2024",
      title: "AI-Powered Learning",
      description: "Launched AI-driven personalized learning platforms and expanded to international markets.",
      icon: <Zap className="h-6 w-6" />
    }
  ];

  const values = [
    {
      icon: <HeartHandshake className="h-8 w-8" />,
      title: "Student First",
      description: "Every decision we make prioritizes student success and career outcomes above all else.",
      color: "bg-rose-100 text-rose-600"
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation",
      description: "We constantly evolve our teaching methods and curriculum to stay ahead of industry trends.",
      color: "bg-amber-100 text-amber-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Integrity",
      description: "We maintain transparency in our processes and honesty in our commitments to students.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Excellence",
      description: "We strive for the highest standards in education delivery and student outcomes.",
      color: "bg-indigo-100 text-indigo-600"
    }
  ];

  const team = [
    {
      name: "Prateek Shukla",
      role: "CEO & Co-Founder",
      bio: "IIT Bombay alumnus with a vision to democratize quality education. Formerly led tech teams at Fortune 500 companies.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
    },
    {
      name: "Nrupul Dev",
      role: "CTO & Co-Founder",
      bio: "Former tech lead at top companies, passionate about teaching and building scalable educational platforms.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
    },
    {
      name: "Yogesh Bhat",
      role: "VP of Engineering",
      bio: "Expert in building scalable systems to transform education delivery with over 15 years of experience.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
    }
  ];

  const testimonials = [
    {
      quote: "RAAS Academy transformed my career from non-tech to a software developer at Microsoft. The curriculum and support were exceptional.",
      author: "Rahul Sharma",
      role: "Software Developer, Microsoft",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
    },
    {
      quote: "The hands-on projects and industry mentorship prepared me perfectly for my role at Amazon. Best investment in my career!",
      author: "Priya Patel",
      role: "Data Scientist, Amazon",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
    },
    {
      quote: "From mechanical engineer to frontend developer at Flipkart - RAAS Academy made my career transition smooth and successful.",
      author: "Amit Kumar",
      role: "Frontend Developer, Flipkart",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Header/>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Story</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            From a vision to transform education to becoming India's leading outcome-based tech learning platform
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{animatedStats.students.toLocaleString()}+</div>
              <div className="text-gray-600">Students Transformed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{animatedStats.placement}%</div>
              <div className="text-gray-600">Placement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{animatedStats.companies.toLocaleString()}+</div>
              <div className="text-gray-600">Hiring Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{animatedStats.courses}+</div>
              <div className="text-gray-600">Courses Offered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                To democratize tech education and create a diverse talent pool that can contribute to India's growing digital economy. 
                We believe that talent is evenly distributed, but opportunities are not – and we're here to bridge that gap.
              </p>
              <p className="text-lg text-gray-700">
                Through industry-relevant curriculum, expert mentorship, and strong industry connections, we're transforming lives 
                and building the next generation of tech leaders.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="text-2xl font-bold mb-6">Why We Exist</div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-4 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>To make quality tech education accessible to everyone</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-4 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>To bridge the skills gap in the technology industry</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-4 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>To create opportunities for career transformation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-4 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>To build a diverse and inclusive tech community</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Milestones in our story of transforming education</p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-400 transform -translate-x-1/2"></div>
            
            {/* Timeline items */}
            <div className="space-y-12 relative">
              {timeline.map((item, index) => (
                <div key={index} className={`flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                  <div className="hidden md:block md:w-1/2"></div>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center z-10">
                    {item.icon}
                  </div>
                  <div className="flex-1 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ml-6 md:mx-6 transform hover:-translate-y-1">
                    <div className="text-lg font-semibold text-blue-600 mb-2">{item.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full transform hover:-translate-y-1">
                  <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mb-4`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600">The visionaries driving our mission forward</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group text-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative w-40 h-40 rounded-full object-cover mx-auto shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from our students who transformed their careers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full transform hover:-translate-y-1">
                  <Quote className="h-8 w-8 text-blue-200 mb-4" />
                  <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-blue-100 text-xl mb-8">
              Be part of the movement that's transforming education and creating opportunities for thousands of students.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1">
                Explore Programs
              </button>
              <button className="bg-transparent text-white border border-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default OurStory;