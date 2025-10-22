import React, { useEffect, useState } from "react";
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Globe, 
  Download,
  ArrowLeft,
  Search,
  Filter,
  ChevronDown,
  FileText,
  X,
  Calendar,
  Eye
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

interface PartnershipForm {
  _id: string;
  name: string;
  organization: string;
  mobile: string;
  email: string;
  designation: string;
  description: string;
  website: string;
  createdAt: string;
}

const CompanyPartnershipList: React.FC = () => {
  const [forms, setForms] = useState<PartnershipForm[]>([]);
  const [filteredForms, setFilteredForms] = useState<PartnershipForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedForm, setSelectedForm] = useState<PartnershipForm | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch("https://rass1.onrender.com/api/company-partnership");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch forms");
        setForms(data.data || []);
        setFilteredForms(data.data || []);
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
        form.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.designation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply organization filter
    if (selectedOrganization !== "all") {
      filtered = filtered.filter(form => form.organization === selectedOrganization);
    }
    
    // Apply date range filter
    if (selectedDateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      if (selectedDateRange === "week") {
        filterDate.setDate(now.getDate() - 7);
      } else if (selectedDateRange === "month") {
        filterDate.setMonth(now.getMonth() - 1);
      } else if (selectedDateRange === "quarter") {
        filterDate.setMonth(now.getMonth() - 3);
      }
      
      filtered = filtered.filter(form => 
        new Date(form.createdAt) >= filterDate
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof PartnershipForm];
      const bValue = b[sortBy as keyof PartnershipForm];
      
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    
    setFilteredForms(filtered);
  }, [forms, searchTerm, sortBy, sortOrder, selectedOrganization, selectedDateRange]);

  // Get unique organizations for filter dropdown
  const organizations = [...new Set(forms.map(form => form.organization))];

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
      "Organization",
      "Designation",
      "Email",
      "Phone",
      "Website",
      "Description",
      "Submitted Date"
    ];
    
    const csvData = filteredForms.map(form => [
      form.name,
      form.organization,
      form.designation,
      form.email,
      form.mobile,
      form.website || "N/A",
      `"${form.description.replace(/"/g, '""')}"`, // Escape quotes in description
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
    link.setAttribute("download", `company_partnerships_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // View form details
  const viewFormDetails = (form: PartnershipForm) => {
    setSelectedForm(form);
    setShowDetailsModal(true);
  };

  // Go back to previous page
  const goBack = () => {
    window.history.back();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading partnership applications...</p>
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
                  <h1 className="text-3xl font-bold text-gray-900">Company Partnership Applications</h1>
                  <p className="text-gray-600 mt-1">Manage and review partnership inquiries from organizations</p>
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
                  placeholder="Search by name, email, organization or designation..."
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          value={selectedOrganization}
                          onChange={(e) => setSelectedOrganization(e.target.value)}
                        >
                          <option value="all">All Organizations</option>
                          {organizations.map(organization => (
                            <option key={organization} value={organization}>{organization}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          value={selectedDateRange}
                          onChange={(e) => setSelectedDateRange(e.target.value)}
                        >
                          <option value="all">All Time</option>
                          <option value="week">Last Week</option>
                          <option value="month">Last Month</option>
                          <option value="quarter">Last Quarter</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedOrganization("all");
                          setSelectedDateRange("all");
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
              <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedOrganization !== "all" || selectedDateRange !== "all"
                  ? "Try adjusting your search or filters"
                  : "No partnership applications have been submitted yet"}
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
                    onClick={() => handleSort("organization")}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Organization
                    {sortBy === "organization" && (
                      <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </button>
                  <button
                    onClick={() => handleSort("designation")}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Designation
                    {sortBy === "designation" && (
                      <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </button>
                  <button
                    onClick={() => handleSort("email")}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Email
                    {sortBy === "email" && (
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
                            <Phone className="h-3 w-3 mr-1" />
                            {form.mobile}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700">{form.organization}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700">{form.designation}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700 truncate">{form.email}</span>
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
                            onClick={() => viewFormDetails(form)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="text-xl font-bold text-gray-900">Partnership Application Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-gray-900">{selectedForm.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Organization</p>
                  <p className="text-gray-900">{selectedForm.organization}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Designation</p>
                  <p className="text-gray-900">{selectedForm.designation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{selectedForm.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{selectedForm.mobile}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Website</p>
                  <p className="text-gray-900">
                    {selectedForm.website ? (
                      <a href={selectedForm.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        {selectedForm.website}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-gray-900 mt-1">{selectedForm.description}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Submitted On</p>
                <p className="text-gray-900">{new Date(selectedForm.createdAt).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
   
  );
};

export default CompanyPartnershipList;