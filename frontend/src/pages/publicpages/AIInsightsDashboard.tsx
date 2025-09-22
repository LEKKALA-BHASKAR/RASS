
    import { useState } from 'react';
    import { 
      TrendingUp, 
      BarChart3, 
      Users, 
      Globe, 
      Zap, 
      BookOpen,
      Shield,
      Target
    } from 'lucide-react';

    // Define TypeScript interfaces
    interface Report {
      id: number;
      title: string;
      publisher: string;
      year: string;
      highlights: string[];
      keyStat?: {
        value: string;
        label: string;
      };
    }

    interface MetricCard {
      id: number;
      title: string;
      value: string;
      change: string;
      icon: JSX.Element;
      color: string;
    }

    const AIInsightsDashboard = () => {
      const reports: Report[] = [
        {
          id: 1,
          title: "The State of AI Global Survey 2025",
          publisher: "McKinsey & Company",
          year: "October 2025",
          highlights: [
            "Generative AI Integration in 65% of Enterprises",
            "Redesigning Workflows for AI Implementation",
            "Senior Leadership Roles in AI Governance",
            "Driving Bottom-Line Impact Through AI"
          ],
          keyStat: {
            value: "65%",
            label: "of executives see AI as primary growth driver"
          }
        },
        {
          id: 2,
          title: "Artificial Intelligence Index Report 2025",
          publisher: "Stanford University Human-Centered AI Institute (HAI)",
          year: "April 2025",
          highlights: [
            "AI's Societal Impact Deepens Across Sectors",
            "Inference Costs Decline, Democratizing AI Access",
            "Global Surge in AI Research and Patents",
            "Corporate Emphasis on Responsible AI Practices"
          ]
        },
        {
          id: 3,
          title: "AI Market Size and Forecast 2025-2030",
          publisher: "Grand View Research",
          year: "March 2025",
          highlights: [
            "AI Market Valued at $279.22 Billion in 2024",
            "Projected CAGR of 35.9% (2025-2030)",
            "AI Integration Across Diverse Industry Verticals",
            "Innovations Driving AI Adoption"
          ],
          keyStat: {
            value: "35.9%",
            label: "Projected CAGR (2025-2030)"
          }
        }
      ];

      const metrics: MetricCard[] = [
        {
          id: 1,
          title: "AI Adoption Rate",
          value: "65%",
          change: "+12%",
          icon: <TrendingUp size={24} />,
          color: "from-blue-500 to-cyan-400"
        },
        {
          id: 2,
          title: "Market Growth",
          value: "35.9%",
          change: "CAGR",
          icon: <BarChart3 size={24} />,
          color: "from-purple-500 to-pink-400"
        },
        {
          id: 3,
          title: "AI Research Papers",
          value: "128K",
          change: "+18%",
          icon: <BookOpen size={24} />,
          color: "from-green-500 to-emerald-400"
        },
        {
          id: 4,
          title: "Global Impact",
          value: "84%",
          change: "Sectors",
          icon: <Globe size={24} />,
          color: "from-orange-500 to-red-400"
        }
      ];

      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 p-4 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
                AI Insights 2025
              </h1>
              <p className="mt-2 text-lg text-gray-600 font-medium">Discover global AI trends, forecasts, and industry insights</p>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Reports */}
              <div className="lg:col-span-2 space-y-6">
                {reports.map((report) => (
                  <div 
                    key={report.id}
                    className="relative bg-white/40 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 p-6"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-3xl" />
                    <div className="relative z-10">
                      <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-sm font-medium mb-4">
                        {report.year}
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{report.title}</h2>
                      <p className="text-gray-600 mb-4">{report.publisher}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Zap size={18} className="text-yellow-500" />
                            Key Highlights
                          </h3>
                          <ul className="space-y-2">
                            {report.highlights.map((highlight, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 text-sm">{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {report.keyStat && (
                          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200/50">
                            <div className="text-5xl font-bold text-gray-900 mb-2">{report.keyStat.value}</div>
                            <div className="text-gray-600 text-center text-sm">{report.keyStat.label}</div>
                          </div>
                        )}
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-200/30 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-100/80 text-gray-700 rounded-full text-xs flex items-center gap-1">
                          <Target size={12} />
                          Strategic Impact
                        </span>
                        <span className="px-3 py-1 bg-gray-100/80 text-gray-700 rounded-full text-xs flex items-center gap-1">
                          <Users size={12} />
                          Organizational Change
                        </span>
                        <span className="px-3 py-1 bg-gray-100/80 text-gray-700 rounded-full text-xs flex items-center gap-1">
                          <Shield size={12} />
                          Governance
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column - Metrics & Insights */}
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="bg-white/40 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">Key Metrics</h3>
                  <div className="space-y-4">
                    {metrics.map((metric) => (
                      <div 
                        key={metric.id}
                        className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-4 hover:scale-105 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className={`p-2 rounded-xl bg-gradient-to-r ${metric.color} text-white`}>
                            {metric.icon}
                          </div>
                          <span className={`text-sm font-medium ${
                            metric.change.includes('+') ? 'text-green-500' : 'text-blue-500'
                          }`}>
                            {metric.change}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                        <div className="text-sm text-gray-600">{metric.title}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Investment Trends */}
                <div className="bg-gradient-to-br from-purple-100/50 to-pink-100/50 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">AI Investment Trends</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">Enterprise AI Budget Increase</span>
                      <span className="font-semibold text-gray-900">42%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">AI Talent Demand Growth</span>
                      <span className="font-semibold text-gray-900">67%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">AI Ethics Investment</span>
                      <span className="font-semibold text-gray-900">28%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custom CSS */}
          <style>{`
            .shadow-xl {
              box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
            }
            .hover\\:shadow-2xl:hover {
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 12px rgba(0, 0, 0, 0.1);
            }
            .line-clamp-2 {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          `}</style>
        </div>
      );
    };

export default AIInsightsDashboard;