import React, { useState, useEffect } from 'react';
import { certificateAPI } from '../../services/api';
import { Award, Download, Eye, Calendar, CheckCircle } from 'lucide-react';
import { Certificate } from '../../types';

const Certificates: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await certificateAPI.getMyCertificates();
      setCertificates(response.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (certificate: Certificate) => {
    // In a real app, this would download the actual certificate PDF
    const link = document.createElement('a');
    link.href = certificate.certificateUrl || '#';
    link.download = `${certificate.course.title}_Certificate.pdf`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-600 mt-2">View and download your course completion certificates</p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <div key={certificate._id} className="card hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{certificate.course.title}</h3>
                <p className="text-sm text-gray-600">by {certificate.course.instructor.name}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Certificate ID:</span>
                  <span className="font-mono text-gray-900">{certificate.certificateId}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Grade:</span>
                  <span className={`font-semibold ${
                    certificate.grade.startsWith('A') ? 'text-green-600' :
                    certificate.grade.startsWith('B') ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {certificate.grade}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Issued:</span>
                  <span className="text-gray-900">
                    {new Date(certificate.issuedAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">Verified</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(certificate)}
                  className="flex-1 btn-primary text-sm flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
                <button className="flex-1 btn-secondary text-sm flex items-center justify-center">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
          <p className="text-gray-600 mb-6">Complete courses to earn certificates</p>
          <button className="btn-primary">Browse Courses</button>
        </div>
      )}
    </div>
  );
};

export default Certificates;