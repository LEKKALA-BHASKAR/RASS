import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, BookOpen, Award, Edit3, Save, X, GraduationCap, Briefcase } from 'lucide-react';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import { countryCodes } from '../utils/countryCodes';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profile: {
      bio: user?.profile?.bio || '',
      phone: user?.profile?.phone || '',
      countryCode: '+91',
      education: user?.profile?.education || '',
      experience: user?.profile?.experience || ''
    }
  });

  const validatePhone = (phone: string): boolean => {
    const selectedCountry = countryCodes.find(c => c.code === formData.profile.countryCode);
    const requiredLength = selectedCountry?.length || 10;
    const phoneRegex = new RegExp(`^[0-9]{${requiredLength}}$`);
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const selectedCountry = countryCodes.find(c => c.code === formData.profile.countryCode);
    const maxLength = selectedCountry?.length || 10;
    
    if (value.length <= maxLength) {
      setFormData({
        ...formData,
        profile: { ...formData.profile, phone: value }
      });
      
      if (value.length > 0 && value.length < maxLength) {
        setPhoneError(`Phone number must be exactly ${maxLength} digits for ${selectedCountry?.country}`);
      } else if (value.length === maxLength) {
        setPhoneError('');
      } else {
        setPhoneError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number if provided
    if (formData.profile.phone && !validatePhone(formData.profile.phone)) {
      const selectedCountry = countryCodes.find(c => c.code === formData.profile.countryCode);
      const requiredLength = selectedCountry?.length || 10;
      setPhoneError(`Phone number must be exactly ${requiredLength} digits for ${selectedCountry?.country}`);
      return;
    }
    
    try {
      // Combine country code with phone number before submitting
      const updatedFormData = {
        ...formData,
        profile: {
          ...formData.profile,
          phone: formData.profile.phone ? `${formData.profile.countryCode} ${formData.profile.phone}` : ''
        }
      };
      await updateProfile(updatedFormData);
      setEditing(false);
      setPhoneError('');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Profile Settings</h1>
                <p className="text-blue-100 mt-2">Manage your personal information</p>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className={`mt-4 md:mt-0 px-5 py-2.5 rounded-lg font-medium flex items-center ${
                  editing 
                    ? 'bg-white text-blue-600 hover:bg-blue-50' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition-all`}
              >
                {editing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Profile Picture & Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <div className="h-40 w-40 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <User className="h-20 w-20 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600 capitalize">{user?.role}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-3 ${
                    user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user?.role === 'instructor' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user?.role}
                  </span>
                  
                  <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-700 mb-2">Account Status</h3>
                    <div className="flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-green-700">Active</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="lg:col-span-3 space-y-8">
                {/* Basic Info Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center text-gray-900 p-2.5 bg-gray-50 rounded-lg">
                          <User className="h-5 w-5 mr-3 text-gray-400" />
                          {user?.name}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center text-gray-900 p-2.5 bg-gray-50 rounded-lg">
                        <Mail className="h-5 w-5 mr-3 text-gray-400" />
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {editing ? (
                      <div>
                        <div className="flex gap-2">
                          <select
                            value={formData.profile.countryCode}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                profile: { ...formData.profile, countryCode: e.target.value, phone: '' }
                              });
                              setPhoneError('');
                            }}
                            className="w-32 px-2 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm appearance-auto"
                            style={{ minWidth: '128px' }}
                          >
                            {countryCodes.map((item) => (
                              <option key={item.code} value={item.code}>
                                {item.code} - {item.country}
                              </option>
                            ))}
                          </select>
                          <div className="flex-1">
                            <input
                              type="tel"
                              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                phoneError ? 'border-red-500' : 'border-gray-300'
                              }`}
                              value={formData.profile.phone}
                              onChange={handlePhoneChange}
                              placeholder={`Enter ${countryCodes.find(c => c.code === formData.profile.countryCode)?.length || 10} digit mobile number`}
                              maxLength={countryCodes.find(c => c.code === formData.profile.countryCode)?.length || 10}
                            />
                          </div>
                        </div>
                        {phoneError && (
                          <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-900 p-2.5 bg-gray-50 rounded-lg">
                        <Phone className="h-5 w-5 mr-3 text-gray-400" />
                        {user?.profile?.phone || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                    Additional Information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      {editing ? (
                        <textarea
                          rows={3}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.profile.bio}
                          onChange={(e) => setFormData({
                            ...formData,
                            profile: { ...formData.profile, bio: e.target.value }
                          })}
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-900">{user?.profile?.bio || 'No bio provided'}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2 text-blue-600" />
                        Education
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.profile.education}
                          onChange={(e) => setFormData({
                            ...formData,
                            profile: { ...formData.profile, education: e.target.value }
                          })}
                          placeholder="Your educational background"
                        />
                      ) : (
                        <div className="flex items-center text-gray-900 p-2.5 bg-gray-50 rounded-lg">
                          <BookOpen className="h-5 w-5 mr-3 text-gray-400" />
                          {user?.profile?.education || 'Not provided'}
                        </div>
                      )}
                    </div>

                    {user?.role === 'instructor' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                          Experience
                        </label>
                        {editing ? (
                          <textarea
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.profile.experience}
                            onChange={(e) => setFormData({
                              ...formData,
                              profile: { ...formData.profile, experience: e.target.value }
                            })}
                            placeholder="Your professional experience..."
                          />
                        ) : (
                          <div className="flex items-start text-gray-900 p-2.5 bg-gray-50 rounded-lg">
                            <Award className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                            <span>{user?.profile?.experience || 'No experience provided'}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {editing && (
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 font-medium flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
      <Footer />
    </div>
  );
};

export default Profile;