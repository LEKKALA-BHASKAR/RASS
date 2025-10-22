import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Download, 
  RefreshCw, 
  Trash2, 
  CheckSquare, 
  Square, 
  University, 
  Mail, 
  Phone, 
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  X,
  Filter,
  Search,
  ChevronDown,
  FileText,
  Building
} from 'lucide-react';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
interface Partnership {
  _id: string;
  name: string;
  university: string;
  designation: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const UniversityPartnershipList: React.FC = () => {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Partnership>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const API_URL = 'https://rass1.onrender.com/api/university-partnership';

  // Fetch all partnership data
  const fetchPartnerships = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(API_URL);
      setPartnerships(response.data);
    } catch (err: any) {
      setError('Failed to fetch partnership data: ' + (err.response?.data?.message || err.message));
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerships();
  }, []);

  // Filter and sort partnerships
  const filteredAndSortedPartnerships = partnerships
    .filter(partner => 
      searchTerm === '' || 
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.designation.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Export to CSV function
  const exportToCSV = () => {
    if (partnerships.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = [
      'Name',
      'University',
      'Designation',
      'Email',
      'Phone',
      'Website',
      'Description',
      'Created At',
      'Updated At'
    ];

    const csvData = partnerships.map(partner => [
      `"${partner.name.replace(/"/g, '""')}"`,
      `"${partner.university.replace(/"/g, '""')}"`,
      `"${partner.designation.replace(/"/g, '""')}"`,
      `"${partner.email}"`,
      `"${partner.phone}"`,
      `"${partner.website}"`,
      `"${partner.description.replace(/"/g, '""')}"`,
      `"${new Date(partner.createdAt).toLocaleDateString()}"`,
      `"${new Date(partner.updatedAt).toLocaleDateString()}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `university-partnerships-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export selected rows to CSV
  const exportSelectedToCSV = () => {
    if (selectedRows.length === 0) {
      alert('Please select rows to export');
      return;
    }

    const selectedPartnerships = partnerships.filter(partner => 
      selectedRows.includes(partner._id)
    );

    const headers = [
      'Name',
      'University',
      'Designation',
      'Email',
      'Phone',
      'Website',
      'Description',
      'Created At',
      'Updated At'
    ];

    const csvData = selectedPartnerships.map(partner => [
      `"${partner.name.replace(/"/g, '""')}"`,
      `"${partner.university.replace(/"/g, '""')}"`,
      `"${partner.designation.replace(/"/g, '""')}"`,
      `"${partner.email}"`,
      `"${partner.phone}"`,
      `"${partner.website}"`,
      `"${partner.description.replace(/"/g, '""')}"`,
      `"${new Date(partner.createdAt).toLocaleDateString()}"`,
      `"${new Date(partner.updatedAt).toLocaleDateString()}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `selected-partnerships-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle row selection
  const handleRowSelect = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  // Select all rows
  const handleSelectAll = () => {
    if (selectedRows.length === filteredAndSortedPartnerships.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredAndSortedPartnerships.map(partner => partner._id));
    }
  };

  // Delete selected partnerships
  const deleteSelected = async () => {
    if (selectedRows.length === 0) {
      alert('Please select rows to delete');
      return;
    }

    setShowDeleteConfirm(false);
    
    try {
      setLoading(true);
      // Assuming your API supports bulk delete
      await Promise.all(
        selectedRows.map(id => 
          axios.delete(`${API_URL}/${id}`)
        )
      );
      
      // Refresh the data
      await fetchPartnerships();
      setSelectedRows([]);
      alert('Selected partnerships deleted successfully');
    } catch (err: any) {
      setError('Failed to delete partnerships: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle sort
  const handleSort = (field: keyof Partnership) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div>
        <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <University className="mr-3 h-8 w-8" />
                  University Partnership Management
                </h1>
                <p className="text-indigo-100 mt-2">
                  Manage and export university partnership inquiries
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={fetchPartnerships}
                  disabled={loading}
                  className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition-all disabled:opacity-50 flex items-center"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={exportToCSV}
                  disabled={partnerships.length === 0}
                  className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition-all disabled:opacity-50 flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, university, email..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as keyof Partnership)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="createdAt">Date</option>
                <option value="name">Name</option>
                <option value="university">University</option>
                <option value="designation">Designation</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="ml-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ChevronDown className={`h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        {selectedRows.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-4 mb-6 border border-blue-200">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center mb-3 sm:mb-0">
                <CheckSquare className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-blue-700 font-medium">
                  {selectedRows.length} row{selectedRows.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={exportSelectedToCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Selected
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={filteredAndSortedPartnerships.length > 0 && selectedRows.length === filteredAndSortedPartnerships.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortBy === 'name' && (
                        <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('university')}
                  >
                    <div className="flex items-center">
                      University
                      {sortBy === 'university' && (
                        <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('designation')}
                  >
                    <div className="flex items-center">
                      Designation
                      {sortBy === 'designation' && (
                        <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Created At
                      {sortBy === 'createdAt' && (
                        <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
                        <p className="text-gray-500">Loading partnership data...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredAndSortedPartnerships.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 text-lg font-medium">
                          {searchTerm ? 'No matching partnerships found' : 'No partnership data found'}
                        </p>
                        <p className="text-gray-400 mt-1">
                          {searchTerm ? 'Try adjusting your search terms' : 'New partnership inquiries will appear here'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedPartnerships.map((partner) => (
                    <tr key={partner._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(partner._id)}
                          onChange={() => handleRowSelect(partner._id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-full">
                            <User className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {partner.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {partner.university}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {partner.designation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 space-y-1">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 text-gray-400 mr-1" />
                            {partner.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 text-gray-400 mr-1" />
                            {partner.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(partner.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total records: {partnerships.length} | 
              Showing: {filteredAndSortedPartnerships.length} | 
              Selected: {selectedRows.length}
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedRows.length} selected partnership{selectedRows.length > 1 ? 's' : ''}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteSelected}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </div>
  );
};

export default UniversityPartnershipList;