import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, BookOpen, Award, Edit3, Save, X, GraduationCap, Briefcase } from 'lucide-react';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
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

  // Comprehensive list of country codes
  const countryCodes = [
    { code: "+93", country: "Afghanistan" },
    { code: "+355", country: "Albania" },
    { code: "+213", country: "Algeria" },
    { code: "+1-684", country: "American Samoa" },
    { code: "+376", country: "Andorra" },
    { code: "+244", country: "Angola" },
    { code: "+1-264", country: "Anguilla" },
    { code: "+672", country: "Antarctica" },
    { code: "+1-268", country: "Antigua and Barbuda" },
    { code: "+54", country: "Argentina" },
    { code: "+374", country: "Armenia" },
    { code: "+297", country: "Aruba" },
    { code: "+61", country: "Australia" },
    { code: "+43", country: "Austria" },
    { code: "+994", country: "Azerbaijan" },
    { code: "+1-242", country: "Bahamas" },
    { code: "+973", country: "Bahrain" },
    { code: "+880", country: "Bangladesh" },
    { code: "+1-246", country: "Barbados" },
    { code: "+375", country: "Belarus" },
    { code: "+32", country: "Belgium" },
    { code: "+501", country: "Belize" },
    { code: "+229", country: "Benin" },
    { code: "+1-441", country: "Bermuda" },
    { code: "+975", country: "Bhutan" },
    { code: "+591", country: "Bolivia" },
    { code: "+387", country: "Bosnia and Herzegovina" },
    { code: "+267", country: "Botswana" },
    { code: "+55", country: "Brazil" },
    { code: "+246", country: "British Indian Ocean Territory" },
    { code: "+1-284", country: "British Virgin Islands" },
    { code: "+673", country: "Brunei" },
    { code: "+359", country: "Bulgaria" },
    { code: "+226", country: "Burkina Faso" },
    { code: "+257", country: "Burundi" },
    { code: "+855", country: "Cambodia" },
    { code: "+237", country: "Cameroon" },
    { code: "+1", country: "Canada" },
    { code: "+238", country: "Cape Verde" },
    { code: "+1-345", country: "Cayman Islands" },
    { code: "+236", country: "Central African Republic" },
    { code: "+235", country: "Chad" },
    { code: "+56", country: "Chile" },
    { code: "+86", country: "China" },
    { code: "+61", country: "Christmas Island" },
    { code: "+61", country: "Cocos Islands" },
    { code: "+57", country: "Colombia" },
    { code: "+269", country: "Comoros" },
    { code: "+682", country: "Cook Islands" },
    { code: "+506", country: "Costa Rica" },
    { code: "+385", country: "Croatia" },
    { code: "+53", country: "Cuba" },
    { code: "+599", country: "Curacao" },
    { code: "+357", country: "Cyprus" },
    { code: "+420", country: "Czech Republic" },
    { code: "+243", country: "Democratic Republic of the Congo" },
    { code: "+45", country: "Denmark" },
    { code: "+253", country: "Djibouti" },
    { code: "+1-767", country: "Dominica" },
    { code: "+1-809", country: "Dominican Republic" },
    { code: "+670", country: "East Timor" },
    { code: "+593", country: "Ecuador" },
    { code: "+20", country: "Egypt" },
    { code: "+503", country: "El Salvador" },
    { code: "+240", country: "Equatorial Guinea" },
    { code: "+291", country: "Eritrea" },
    { code: "+372", country: "Estonia" },
    { code: "+251", country: "Ethiopia" },
    { code: "+500", country: "Falkland Islands" },
    { code: "+298", country: "Faroe Islands" },
    { code: "+679", country: "Fiji" },
    { code: "+358", country: "Finland" },
    { code: "+33", country: "France" },
    { code: "+689", country: "French Polynesia" },
    { code: "+241", country: "Gabon" },
    { code: "+220", country: "Gambia" },
    { code: "+995", country: "Georgia" },
    { code: "+49", country: "Germany" },
    { code: "+233", country: "Ghana" },
    { code: "+350", country: "Gibraltar" },
    { code: "+30", country: "Greece" },
    { code: "+299", country: "Greenland" },
    { code: "+1-473", country: "Grenada" },
    { code: "+1-671", country: "Guam" },
    { code: "+502", country: "Guatemala" },
    { code: "+44-1481", country: "Guernsey" },
    { code: "+224", country: "Guinea" },
    { code: "+245", country: "Guinea-Bissau" },
    { code: "+592", country: "Guyana" },
    { code: "+509", country: "Haiti" },
    { code: "+504", country: "Honduras" },
    { code: "+852", country: "Hong Kong" },
    { code: "+36", country: "Hungary" },
    { code: "+354", country: "Iceland" },
    { code: "+91", country: "India" },
    { code: "+62", country: "Indonesia" },
    { code: "+98", country: "Iran" },
    { code: "+964", country: "Iraq" },
    { code: "+353", country: "Ireland" },
    { code: "+44-1624", country: "Isle of Man" },
    { code: "+972", country: "Israel" },
    { code: "+39", country: "Italy" },
    { code: "+225", country: "Ivory Coast" },
    { code: "+1-876", country: "Jamaica" },
    { code: "+81", country: "Japan" },
    { code: "+44-1534", country: "Jersey" },
    { code: "+962", country: "Jordan" },
    { code: "+7", country: "Kazakhstan" },
    { code: "+254", country: "Kenya" },
    { code: "+686", country: "Kiribati" },
    { code: "+383", country: "Kosovo" },
    { code: "+965", country: "Kuwait" },
    { code: "+996", country: "Kyrgyzstan" },
    { code: "+856", country: "Laos" },
    { code: "+371", country: "Latvia" },
    { code: "+961", country: "Lebanon" },
    { code: "+266", country: "Lesotho" },
    { code: "+231", country: "Liberia" },
    { code: "+218", country: "Libya" },
    { code: "+423", country: "Liechtenstein" },
    { code: "+370", country: "Lithuania" },
    { code: "+352", country: "Luxembourg" },
    { code: "+853", country: "Macau" },
    { code: "+389", country: "Macedonia" },
    { code: "+261", country: "Madagascar" },
    { code: "+265", country: "Malawi" },
    { code: "+60", country: "Malaysia" },
    { code: "+960", country: "Maldives" },
    { code: "+223", country: "Mali" },
    { code: "+356", country: "Malta" },
    { code: "+692", country: "Marshall Islands" },
    { code: "+222", country: "Mauritania" },
    { code: "+230", country: "Mauritius" },
    { code: "+262", country: "Mayotte" },
    { code: "+52", country: "Mexico" },
    { code: "+691", country: "Micronesia" },
    { code: "+373", country: "Moldova" },
    { code: "+377", country: "Monaco" },
    { code: "+976", country: "Mongolia" },
    { code: "+382", country: "Montenegro" },
    { code: "+1-664", country: "Montserrat" },
    { code: "+212", country: "Morocco" },
    { code: "+258", country: "Mozambique" },
    { code: "+95", country: "Myanmar" },
    { code: "+264", country: "Namibia" },
    { code: "+674", country: "Nauru" },
    { code: "+977", country: "Nepal" },
    { code: "+31", country: "Netherlands" },
    { code: "+599", country: "Netherlands Antilles" },
    { code: "+687", country: "New Caledonia" },
    { code: "+64", country: "New Zealand" },
    { code: "+505", country: "Nicaragua" },
    { code: "+227", country: "Niger" },
    { code: "+234", country: "Nigeria" },
    { code: "+683", country: "Niue" },
    { code: "+850", country: "North Korea" },
    { code: "+1-670", country: "Northern Mariana Islands" },
    { code: "+47", country: "Norway" },
    { code: "+968", country: "Oman" },
    { code: "+92", country: "Pakistan" },
    { code: "+680", country: "Palau" },
    { code: "+970", country: "Palestine" },
    { code: "+507", country: "Panama" },
    { code: "+675", country: "Papua New Guinea" },
    { code: "+595", country: "Paraguay" },
    { code: "+51", country: "Peru" },
    { code: "+63", country: "Philippines" },
    { code: "+64", country: "Pitcairn" },
    { code: "+48", country: "Poland" },
    { code: "+351", country: "Portugal" },
    { code: "+1-787", country: "Puerto Rico" },
    { code: "+974", country: "Qatar" },
    { code: "+242", country: "Republic of the Congo" },
    { code: "+262", country: "Reunion" },
    { code: "+40", country: "Romania" },
    { code: "+7", country: "Russia" },
    { code: "+250", country: "Rwanda" },
    { code: "+590", country: "Saint Barthelemy" },
    { code: "+290", country: "Saint Helena" },
    { code: "+1-869", country: "Saint Kitts and Nevis" },
    { code: "+1-758", country: "Saint Lucia" },
    { code: "+590", country: "Saint Martin" },
    { code: "+508", country: "Saint Pierre and Miquelon" },
    { code: "+1-784", country: "Saint Vincent and the Grenadines" },
    { code: "+685", country: "Samoa" },
    { code: "+378", country: "San Marino" },
    { code: "+239", country: "Sao Tome and Principe" },
    { code: "+966", country: "Saudi Arabia" },
    { code: "+221", country: "Senegal" },
    { code: "+381", country: "Serbia" },
    { code: "+248", country: "Seychelles" },
    { code: "+232", country: "Sierra Leone" },
    { code: "+65", country: "Singapore" },
    { code: "+1-721", country: "Sint Maarten" },
    { code: "+421", country: "Slovakia" },
    { code: "+386", country: "Slovenia" },
    { code: "+677", country: "Solomon Islands" },
    { code: "+252", country: "Somalia" },
    { code: "+27", country: "South Africa" },
    { code: "+82", country: "South Korea" },
    { code: "+211", country: "South Sudan" },
    { code: "+34", country: "Spain" },
    { code: "+94", country: "Sri Lanka" },
    { code: "+249", country: "Sudan" },
    { code: "+597", country: "Suriname" },
    { code: "+47", country: "Svalbard and Jan Mayen" },
    { code: "+268", country: "Swaziland" },
    { code: "+46", country: "Sweden" },
    { code: "+41", country: "Switzerland" },
    { code: "+963", country: "Syria" },
    { code: "+886", country: "Taiwan" },
    { code: "+992", country: "Tajikistan" },
    { code: "+255", country: "Tanzania" },
    { code: "+66", country: "Thailand" },
    { code: "+228", country: "Togo" },
    { code: "+690", country: "Tokelau" },
    { code: "+676", country: "Tonga" },
    { code: "+1-868", country: "Trinidad and Tobago" },
    { code: "+216", country: "Tunisia" },
    { code: "+90", country: "Turkey" },
    { code: "+993", country: "Turkmenistan" },
    { code: "+1-649", country: "Turks and Caicos Islands" },
    { code: "+688", country: "Tuvalu" },
    { code: "+1-340", country: "U.S. Virgin Islands" },
    { code: "+256", country: "Uganda" },
    { code: "+380", country: "Ukraine" },
    { code: "+971", country: "United Arab Emirates" },
    { code: "+44", country: "United Kingdom" },
    { code: "+1", country: "United States" },
    { code: "+598", country: "Uruguay" },
    { code: "+998", country: "Uzbekistan" },
    { code: "+678", country: "Vanuatu" },
    { code: "+379", country: "Vatican" },
    { code: "+58", country: "Venezuela" },
    { code: "+84", country: "Vietnam" },
    { code: "+681", country: "Wallis and Futuna" },
    { code: "+212", country: "Western Sahara" },
    { code: "+967", country: "Yemen" },
    { code: "+260", country: "Zambia" },
    { code: "+263", country: "Zimbabwe" },
  ];

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setFormData({
        ...formData,
        profile: { ...formData.profile, phone: value }
      });
      
      if (value.length > 0 && value.length < 10) {
        setPhoneError('Phone number must be exactly 10 digits');
      } else if (value.length === 10) {
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
      setPhoneError('Phone number must be exactly 10 digits');
      return;
    }
    
    try {
      // Combine country code with phone number before submitting
      const updatedFormData = {
        ...formData,
        profile: {
          ...formData.profile,
          phone: formData.profile.phone ? `${formData.profile.countryCode}${formData.profile.phone}` : ''
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
                            onChange={(e) => setFormData({
                              ...formData,
                              profile: { ...formData.profile, countryCode: e.target.value }
                            })}
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
                              placeholder="Enter 10 digit mobile number"
                              maxLength={10}
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