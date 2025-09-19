import  { useState, useEffect } from 'react';
import { 
  Target, 
  Users, 
  Award, 
  TrendingUp, 
  Heart, 
  Lightbulb, 
  Shield, 
  Star,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    placement: 0,
    salary: 0,
    partners: 0
  });

  useEffect(() => {
    // Animate statistics
    const interval = setInterval(() => {
      setAnimatedStats(prev => ({
        students: prev.students < 15000 ? prev.students + 500 : 15000,
        placement: prev.placement < 85 ? prev.placement + 2 : 85,
        salary: prev.salary < 3.5 ? prev.salary + 0.1 : 3.5,
        partners: prev.partners < 2500 ? prev.partners + 50 : 2500
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);
  const navigate = useNavigate();

  return (
    <div>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center mb-20 transform transition-all duration-700">
        <div className="relative inline-block mb-8">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-30"></div>
          <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Transforming Lives Through Outcome-Based Education
          </h1>
        </div>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          We are on a mission to empower individuals with industry-relevant skills and connect them with life-changing career opportunities.
        </p>
      </section>

      {/* Mission & Stats */}
      <section className="max-w-6xl mx-auto mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              To democratize tech education and create a diverse talent pool that can contribute to India's growing digital economy. We believe that talent is evenly distributed, but opportunities are not – and we're here to bridge that gap.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-blue-600 mb-2">{animatedStats.students.toLocaleString()}+</div>
              <div className="text-gray-600 flex items-center justify-center gap-1">
                <Users className="h-5 w-5" />
                Students Transformed
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-blue-600 mb-2">{animatedStats.placement}%</div>
              <div className="text-gray-600 flex items-center justify-center gap-1">
                <Award className="h-5 w-5" />
                Placement Rate
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-blue-600 mb-2">₹{animatedStats.salary.toFixed(1)}L</div>
              <div className="text-gray-600 flex items-center justify-center gap-1">
                <TrendingUp className="h-5 w-5" />
                Average Salary
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-blue-600 mb-2">{animatedStats.partners.toLocaleString()}+</div>
              <div className="text-gray-600 flex items-center justify-center gap-1">
                <Briefcase className="h-5 w-5" />
                Hiring Partners
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-6xl mx-auto mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Core Values</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do at RAAS Academy</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Heart, title: "Student First", desc: "Every decision we make prioritizes student success and career outcomes.", color: "bg-rose-100 text-rose-600" },
            { icon: Lightbulb, title: "Innovation", desc: "Constantly evolving our teaching methods and curriculum to stay ahead.", color: "bg-amber-100 text-amber-600" },
            { icon: Shield, title: "Integrity", desc: "Transparent in our processes, honest in our commitments.", color: "bg-blue-100 text-blue-600" },
            { icon: Star, title: "Impact", desc: "Measuring success by the lives transformed and careers launched.", color: "bg-indigo-100 text-indigo-600" }
          ].map((value, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full transform hover:-translate-y-1">
                <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mb-4`}>
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Team */}
      <section className="max-w-6xl mx-auto mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Leadership Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">The visionaries driving our mission forward</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Prateek Shukla", role: "CEO & Co-Founder", desc: "IIT Bombay alumnus with a vision to democratize quality education", icon: GraduationCap },
            { name: "Nrupul Dev", role: "CTO & Co-Founder", desc: "Former tech lead at top companies, passionate about teaching", icon: Briefcase },
            { name: "Yogesh Bhat", role: "VP – Engineering", desc: "Building scalable systems to transform education delivery", icon: Target }
          ].map((leader, index) => (
            <div key={index} className="group relative text-center">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full transform hover:-translate-y-1">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <leader.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{leader.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{leader.role}</p>
                <p className="text-gray-600">{leader.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Journey */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Journey</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Milestones in our story of transforming education</p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-400 transform -translate-x-1/2"></div>
          
          {/* Timeline items */}
          <div className="space-y-12 relative">
            {[
              { year: "2019", event: "Started with a vision to transform tech education", icon: Target },
              { year: "2020", event: "Launched first cohort with 30 students", icon: Users },
              { year: "2021", event: "Crossed 1000+ placements milestone", icon: Award },
              { year: "2022", event: "Expanded to 5 new tech stacks", icon: TrendingUp },
              { year: "2023", event: "Reached 10,000+ students transformed", icon: Star },
              { year: "2024", event: "Launched AI-powered learning platform", icon: Lightbulb }
            ].map((milestone, index) => (
              <div key={index} className={`flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                <div className="hidden md:block md:w-1/2"></div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center z-10">
                  <milestone.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ml-6 md:mx-6 transform hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-lg font-semibold text-blue-600">{milestone.year}</span>
                  </div>
                  <p className="text-gray-700">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto mt-20 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Mission</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Be part of the movement that's transforming education and creating opportunities for thousands of students.
          </p>
           <button
      onClick={() => navigate("/courses")}
      className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center mx-auto"
    >
      Explore Programs
      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
    </button>
        </div>
      </section>
    </div>
    <Footer />
    </div>
  );
};

export default About;