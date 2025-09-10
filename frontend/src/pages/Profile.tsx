import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, BookOpen, Award } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profile: {
      bio: user?.profile?.bio || '',
      phone: user?.profile?.phone || '',
      dateOfBirth: user?.profile?.dateOfBirth || '',
      education: user?.profile?.education || '',
      experience: user?.profile?.experience || ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <button
            onClick={() => setEditing(!editing)}
            className={editing ? 'btn-secondary' : 'btn-primary'}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Picture */}
            <div className="md:col-span-1">
              <div className="text-center">
                <div className="h-32 w-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-16 w-16 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600 capitalize">{user?.role}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                  user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user?.role === 'instructor' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Profile Information */}
            <div className="md:col-span-2 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        className="input-field"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {user?.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="flex items-center text-gray-900">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {user?.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        className="input-field"
                        value={formData.profile.phone}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: { ...formData.profile, phone: e.target.value }
                        })}
                      />
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {user?.profile?.phone || 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    {editing ? (
                      <input
                        type="date"
                        className="input-field"
                        value={formData.profile.dateOfBirth}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: { ...formData.profile, dateOfBirth: e.target.value }
                        })}
                      />
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {user?.profile?.dateOfBirth ? 
                          new Date(user.profile.dateOfBirth).toLocaleDateString() : 
                          'Not provided'
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    {editing ? (
                      <textarea
                        rows={3}
                        className="input-field"
                        value={formData.profile.bio}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: { ...formData.profile, bio: e.target.value }
                        })}
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900">{user?.profile?.bio || 'No bio provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        className="input-field"
                        value={formData.profile.education}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: { ...formData.profile, education: e.target.value }
                        })}
                        placeholder="Your educational background"
                      />
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                        {user?.profile?.education || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {user?.role === 'instructor' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience
                      </label>
                      {editing ? (
                        <textarea
                          rows={3}
                          className="input-field"
                          value={formData.profile.experience}
                          onChange={(e) => setFormData({
                            ...formData,
                            profile: { ...formData.profile, experience: e.target.value }
                          })}
                          placeholder="Your professional experience..."
                        />
                      ) : (
                        <div className="flex items-start text-gray-900">
                          <Award className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                          <span>{user?.profile?.experience || 'No experience provided'}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {editing && (
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;