import React from 'react';

interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const PartnerWithUs: React.FC = () => {
  const benefits: Benefit[] = [
    {
      id: 1,
      title: "Immediate Productivity",
      description: "Interns arrive with the skills and tools needed for your projects, requiring minimal onboarding so they can start contributing from day one.",
      icon: "🚀"
    },
    {
      id: 2,
      title: "Reduced Hiring Effort",
      description: "We manage the sourcing, screening, and training process, so you only focus on final interviews and onboarding saving valuable HR time.",
      icon: "⏱️"
    },
    {
      id: 3,
      title: "Lower Risk, Higher Quality",
      description: "All interns are pre-vetted for technical skills, communication ability, and workplace readiness to ensure only top candidates reach you.",
      icon: "✅"
    },
    {
      id: 4,
      title: "Customized Skill Alignment",
      description: "For specific needs, we design targeted training programs so interns match your project's tech stack, processes, and objectives perfectly.",
      icon: "🎯"
    },
    {
      id: 5,
      title: "Zero-Cost Talent Pipeline",
      description: "Gain access to a steady stream of trained, high-quality interns at no cost to your business. Evaluate their performance during the internship and hire your top performers for full-time roles without traditional recruitment expenses.",
      icon: "💰"
    },
    {
      id: 6,
      title: "Fresh Perspectives & Innovation",
      description: "Interns bring fresh ideas, academic insights, and enthusiasm that can drive innovation and energize your team.",
      icon: "💡"
    },
    {
      id: 7,
      title: "Scalable Resource Solution",
      description: "Scale up quickly with interns when project demands spike without long lead times or heavy hiring budgets.",
      icon: "📈"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white font-sans">
      {/* Header */}
      <header className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Why Partner with Us for Trained & Pre-Screened Interns</h1>
        <p className="text-xl text-blue-200 max-w-3xl mx-auto">
          Our approach is designed to save your business time, reduce hiring risks, and maximize productivity from day one.
        </p>
      </header>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map(benefit => (
            <div 
              key={benefit.id} 
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:scale-105"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-100">{benefit.title}</h3>
              <p className="text-blue-200">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Talent Acquisition?</h2>
          <p className="text-lg text-blue-100 mb-6">
            Join hundreds of companies that have streamlined their hiring process with our pre-screened interns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-900 font-semibold py-3 px-8 rounded-full hover:bg-blue-100 transition-colors">
              Schedule a Call
            </button>
            <button className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white/10 transition-colors">
              Download Brochure
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white/5 p-6 rounded-xl">
            <div className="text-3xl font-bold text-blue-300">95%</div>
            <div className="text-blue-200">Satisfaction Rate</div>
          </div>
          <div className="bg-white/5 p-6 rounded-xl">
            <div className="text-3xl font-bold text-blue-300">500+</div>
            <div className="text-blue-200">Companies Partnered</div>
          </div>
          <div className="bg-white/5 p-6 rounded-xl">
            <div className="text-3xl font-bold text-blue-300">80%</div>
            <div className="text-blue-200">Conversion Rate</div>
          </div>
          <div className="bg-white/5 p-6 rounded-xl">
            <div className="text-3xl font-bold text-blue-300">24h</div>
            <div className="text-blue-200">Average Matching Time</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerWithUs;