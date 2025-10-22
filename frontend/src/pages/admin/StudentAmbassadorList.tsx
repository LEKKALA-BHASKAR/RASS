import React, { useEffect, useState } from "react";
import { 
  User, 
  GraduationCap, 
  Mail, 
  Phone, 
  BookOpen, 
  Calendar, 
  Briefcase,
  Download,
  ArrowLeft,
  Search,
  Filter,
  ChevronDown,
  FileText,
  X
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

interface StudentForm {
  _id: string;
  name: string;
  university: string;
  department: string;
  graduationYear: string;
  currentYear: string;
  email: string;
  phone: string;
  competencies: string;
  createdAt: string;
}

const StudentAmbassadorList: React.FC = () => {
  const [forms, setForms] = useState<StudentForm[]>([]);
  const [filteredForms, setFilteredForms] = useState<StudentForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedForm, setSelectedForm] = useState<StudentForm | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch("https://rass-cq8t.onrender.com/api/student-ambassador-form");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch forms");
        setForms(data.data);
        setFilteredForms(data.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...forms];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(form => 
        form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply university filter
    if (selectedUniversity !== "all") {
      filtered = filtered.filter(form => form.university === selectedUniversity);
    }
    
    // Apply year filter
    if (selectedYear !== "all") {
      filtered = filtered.filter(form => form.graduationYear === selectedYear);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof StudentForm];
      const bValue = b[sortBy as keyof StudentForm];
      
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    
    setFilteredForms(filtered);
  }, [forms, searchTerm, sortBy, sortOrder, selectedUniversity, selectedYear]);

  // Get unique universities for filter dropdown
  const universities = [...new Set(forms.map(form => form.university))];
  const graduationYears = [...new Set(forms.map(form => form.graduationYear))];

  // Handle sort toggle
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Download data as CSV
  const downloadCSV = () => {
    const headers = [
      "Name",
      "University",
      "Department",
      "Graduation Year",
      "Current Year",
      "Email",
      "Phone",
      "Competencies",
      "Submitted Date"
    ];
    
    const csvData = filteredForms.map(form => [
      form.name,
      form.university,
      form.department,
      form.graduationYear,
      form.currentYear,
      form.email,
      form.phone,
      `"${form.competencies.replace(/"/g, '""')}"`, // Escape quotes in competencies
      new Date(form.createdAt).toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `student_ambassadors_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Go back to previous page
  const goBack = () => {
    window.history.back();
  };

  // Handle view details
  const handleViewDetails = (form: StudentForm) => {
    setSelectedForm(form);
    setShowDetailsModal(true);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedForm(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading applications...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <button
                  onClick={goBack}
                  className="mr-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-700" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Student Ambassador Applications</h1>
                  <p className="text-gray-600 mt-1">Manage and review student ambassador applications</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  {filteredForms.length} of {forms.length} applications
                </span>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, university or department..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span>Filters</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">Filter Options</h3>
                      <button
                        onClick={() => setShowFilterDropdown(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          value={selectedUniversity}
                          onChange={(e) => setSelectedUniversity(e.target.value)}
                        >
                          <option value="all">All Universities</option>
                          {universities.map(university => (
                            <option key={university} value={university}>{university}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                        >
                          <option value="all">All Years</option>
                          {graduationYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedUniversity("all");
                          setSelectedYear("all");
                        }}
                        className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Applications List */}
          {filteredForms.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedUniversity !== "all" || selectedYear !== "all"
                  ? "Try adjusting your search or filters"
                  : "No student ambassador applications have been submitted yet"}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Name
                    {sortBy === "name" && (
                      <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </button>
                  <button
                    onClick={() => handleSort("university")}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    University
                    {sortBy === "university" && (
                      <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </button>
                  <button
                    onClick={() => handleSort("department")}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Department
                    {sortBy === "department" && (
                      <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </button>
                  <button
                    onClick={() => handleSort("graduationYear")}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Graduation Year
                    {sortBy === "graduationYear" && (
                      <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </button>
                  <button
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Submitted
                    {sortBy === "createdAt" && (
                      <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {filteredForms.map((form) => (
                  <div key={form._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{form.name}</p>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {form.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700">{form.university}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700">{form.department}</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center mb-1">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-700">{form.graduationYear}</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{form.currentYear}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">
                          {new Date(form.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(form.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <div className="mt-2">
                          <button 
                            onClick={() => handleViewDetails(form)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hidden details that can be expanded */}
                    <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Phone:</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {form.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Competencies:</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{form.competencies}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 rounded-t-xl flex justify-between items-center sticky top-0">
                <h2 className="text-2xl font-bold">Application Details</h2>
                <button
                  onClick={closeDetailsModal}
                  className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/20 rounded-lg"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Personal Information Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-indigo-600" />
                    Personal Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="text-base text-gray-900 font-medium">{selectedForm.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                        <p className="text-base text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-indigo-600" />
                          <a href={`mailto:${selectedForm.email}`} className="hover:text-indigo-600">
                            {selectedForm.email}
                          </a>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone Number</p>
                        <p className="text-base text-gray-900 flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-indigo-600" />
                          <a href={`tel:${selectedForm.phone}`} className="hover:text-indigo-600">
                            {selectedForm.phone}
                          </a>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Application Date</p>
                        <p className="text-base text-gray-900 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                          {new Date(selectedForm.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-indigo-600" />
                    Academic Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">University</p>
                        <p className="text-base text-gray-900 font-medium">{selectedForm.university}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Department</p>
                        <p className="text-base text-gray-900 flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-indigo-600" />
                          {selectedForm.department}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Current Year</p>
                        <p className="text-base text-gray-900 flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-indigo-600" />
                          {selectedForm.currentYear}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Graduation Year</p>
                        <p className="text-base text-gray-900">{selectedForm.graduationYear}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Competencies Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                    Competencies & Skills
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {selectedForm.competencies}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={closeDetailsModal}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <a
                    href={`mailto:${selectedForm.email}?subject=Student Ambassador Application - ${selectedForm.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Applicant
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default StudentAmbassadorList;