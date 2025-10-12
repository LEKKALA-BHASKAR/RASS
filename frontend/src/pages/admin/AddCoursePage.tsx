import React, { useState } from 'react';
import { Plus, Upload, Trash2, Save, Eye, X, ChevronDown, ChevronUp, BookOpen, Users, Award, HelpCircle, Tag, FileText, Target, Monitor, Star, CheckCircle } from 'lucide-react';

// Interfaces remain the same
interface CurriculumItem {
  order: number;
  title: string;
  description: string;
}

interface FeatureItem {
  name: string;
}

interface TechStackItem {
  name: string;
  imageUrl: string;
}

interface SkillItem {
  name: string;
}

interface JobRoleItem {
  name: string;
}

interface TestimonialItem {
  name: string;
  imageUrl: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ModuleItem {
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  resources: Array<{
    title: string;
    url: string;
    type: string;
  }>;
}

interface ResourceItem {
  title: string;
  url: string;
  type: string;
}

interface CourseData {
  title: string;
  description: string;
  about: string;
  instructor: string;
  category: string;
  level: string;
  price: number;
  thumbnail: string;
  curriculum: CurriculumItem[];
  features: string[];
  techStack: TechStackItem[];
  skillsGained: string[];
  jobRoles: string[];
  testimonials: TestimonialItem[];
  faqs: FAQItem[];
  modules: ModuleItem[];
  tags: string[];
  requirements: string[];
  learningOutcomes: string[];
}

const AddCoursePage: React.FC = () => {
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    description: '',
    about: '',
    instructor: '',
    category: '',
    level: 'intermediate',
    price: 0,
    thumbnail: '',
    curriculum: [],
    features: [],
    techStack: [],
    skillsGained: [],
    jobRoles: [],
    testimonials: [],
    faqs: [],
    modules: [],
    tags: [],
    requirements: [],
    learningOutcomes: []
  });

  const [newItem, setNewItem] = useState({
    curriculum: { order: 0, title: '', description: '' },
    feature: '',
    techStack: { name: '', imageUrl: '' },
    skill: '',
    jobRole: '',
    testimonial: { name: '', imageUrl: '', description: '' },
    faq: { question: '', answer: '' },
    module: { 
      title: '', 
      description: '', 
      videoUrl: '', 
      duration: 0, 
      order: 0, 
      resources: [] as ResourceItem[] 
    },
    tag: '',
    requirement: '',
    learningOutcome: '',
    resource: { title: '', url: '', type: 'link' }
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    curriculum: true,
    features: true,
    techStack: true,
    skills: true,
    jobs: true,
    testimonials: true,
    faqs: true,
    tags: true,
    requirements: true,
    outcomes: true
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Basic Information
  const handleBasicInfoChange = (field: keyof CourseData, value: string | number) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  // Array Management Functions
  const addToArray = (field: keyof CourseData, item: any) => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), item]
    }));
    setNewItem(prev => ({ ...prev, [field]: getDefaultItem(field) }));
    showNotification(`Item added to ${field}`, 'success');
  };

  const removeFromArray = (field: keyof CourseData, index: number) => {
    setCourseData(prev => {
      const arr = prev[field];
      if (Array.isArray(arr)) {
        return {
          ...prev,
          [field]: arr.filter((_, i) => i !== index)
        };
      }
      return prev;
    });
    showNotification(`Item removed from ${field}`, 'success');
  };

  const getDefaultItem = (field: string): any => {
    const defaults: any = {
      curriculum: { order: 0, title: '', description: '' },
      feature: '',
      techStack: { name: '', imageUrl: '' },
      skill: '',
      jobRole: '',
      testimonial: { name: '', imageUrl: '', description: '' },
      faq: { question: '', answer: '' },
      module: { 
        title: '', 
        description: '', 
        videoUrl: '', 
        duration: 0, 
        order: 0, 
        resources: [] 
      },
      tag: '',
      requirement: '',
      learningOutcome: ''
    };
    return defaults[field] || '';
  };

  const handleNewItemChange = (field: string, value: any) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

 const handleNestedItemChange = (parent: string, field: string, value: any) => {
  setNewItem(prev => ({
    ...prev,
    [parent]: {
      ...(prev[parent] || {}),
      [field]: value
    }
  }));
};



  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    try {
      const response = await fetch('https://rass-h2s1.onrender.com/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        showNotification('Course created successfully!', 'success');
        // Reset form
        setCourseData({
          title: '',
          description: '',
          about: '',
          instructor: '',
          category: '',
          level: 'intermediate',
          price: 0,
          thumbnail: '',
          curriculum: [],
          features: [],
          techStack: [],
          skillsGained: [],
          jobRoles: [],
          testimonials: [],
          faqs: [],
          modules: [],
          tags: [],
          requirements: [],
          learningOutcomes: []
        });
      } else {
        setSubmitStatus('error');
        showNotification('Error creating course', 'error');
      }
    } catch (error) {
      setSubmitStatus('error');
      showNotification(`Error creating course: ${error}`, 'error');
    }
  };

  // Preview Component
  const CoursePreview = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Course Preview</h2>
        <p className="opacity-90">See how your course will appear to students</p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Basic Info */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BookOpen className="mr-2 text-blue-500" size={20} />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Title</p>
              <p className="font-medium">{courseData.title || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium">{courseData.category || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Level</p>
              <p className="font-medium capitalize">{courseData.level || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-medium">${courseData.price || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Description</p>
            <p className="mt-1">{courseData.description || 'Not specified'}</p>
          </div>
          {courseData.thumbnail && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Thumbnail</p>
              <img src={courseData.thumbnail} alt="Course thumbnail" className="mt-2 h-40 rounded-lg object-cover" />
            </div>
          )}
        </div>

        {/* Curriculum */}
        {courseData.curriculum.length > 0 && (
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="mr-2 text-blue-500" size={20} />
              Curriculum
            </h3>
            <div className="space-y-3">
              {courseData.curriculum.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-lg">
                  <p className="font-medium">{item.order}. {item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {courseData.techStack.length > 0 && (
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Monitor className="mr-2 text-blue-500" size={20} />
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {courseData.techStack.map((tech, index) => (
                <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {tech.imageUrl && <img src={tech.imageUrl} alt={tech.name} className="w-4 h-4 mr-1 rounded-full" />}
                  {tech.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Gained */}
        {courseData.skillsGained.length > 0 && (
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Award className="mr-2 text-blue-500" size={20} />
              Skills Gained
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {courseData.skillsGained.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="mr-2 text-green-500" size={16} />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Job Roles */}
        {courseData.jobRoles.length > 0 && (
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="mr-2 text-blue-500" size={20} />
              Job Roles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {courseData.jobRoles.map((role, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded-lg text-center">
                  {role}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials */}
        {courseData.testimonials.length > 0 && (
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Star className="mr-2 text-blue-500" size={20} />
              Testimonials
            </h3>
            <div className="space-y-4">
              {courseData.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    {testimonial.imageUrl && (
                      <img src={testimonial.imageUrl} alt={testimonial.name} className="w-10 h-10 rounded-full mr-3" />
                    )}
                    <p className="font-medium">{testimonial.name}</p>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.description}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {courseData.faqs.length > 0 && (
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <HelpCircle className="mr-2 text-blue-500" size={20} />
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {courseData.faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <p className="font-medium mb-2">Q: {faq.question}</p>
                  <p className="text-gray-600">A: {faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {courseData.tags.length > 0 && (
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Tag className="mr-2 text-blue-500" size={20} />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {courseData.tags.map((tag, index) => (
                <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        {courseData.requirements.length > 0 && (
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="mr-2 text-blue-500" size={20} />
              Requirements
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {courseData.requirements.map((requirement, index) => (
                <li key={index} className="text-gray-700">{requirement}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Learning Outcomes */}
        {courseData.learningOutcomes.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="mr-2 text-blue-500" size={20} />
              Learning Outcomes
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {courseData.learningOutcomes.map((outcome, index) => (
                <li key={index} className="text-gray-700">{outcome}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  // Form Sections
  const renderArraySection = (
    title: string,
    field: keyof CourseData,
    items: any[],
    renderItem: (item: any, index: number) => React.ReactNode,
    inputFields: React.ReactNode,
    icon: React.ReactNode
  ) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex justify-between items-center cursor-pointer"
        onClick={() => toggleSection(field)}
      >
        <h3 className="text-lg font-semibold flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
          <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
            {items.length}
          </span>
        </h3>
        {expandedSections[field] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      
      {expandedSections[field] && (
        <div className="p-6">
          {/* Input Fields */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add New {title.slice(0, -1)}</h4>
            <div className="space-y-3">
              {inputFields}
              <button
                type="button"
                onClick={() => addToArray(field, newItem[field])}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus size={16} />
                Add {title.slice(0, -1)}
              </button>
            </div>
          </div>

          {/* List Items */}
          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  {renderItem(item, index)}
                  <button
                    type="button"
                    onClick={() => removeFromArray(field, index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No {title.toLowerCase()} added yet. Add your first {title.slice(0, -1).toLowerCase()} above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Course</h1>
          <p className="text-gray-600">Fill in the details to create a comprehensive course</p>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white flex items-center`}>
            {notification.type === 'success' ? <CheckCircle size={20} className="mr-2" /> : <X size={20} className="mr-2" />}
            {notification.message}
          </div>
        )}

        {/* Toggle Preview */}
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              previewMode 
                ? 'bg-gray-500 text-white hover:bg-gray-600' 
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            <Eye size={20} />
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
        </div>

        {previewMode ? (
          <CoursePreview />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('basic')}
              >
                <h3 className="text-lg font-semibold flex items-center">
                  <BookOpen className="mr-2" size={20} />
                  Basic Information
                </h3>
                {expandedSections.basic ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              
              {expandedSections.basic && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={courseData.title}
                        onChange={(e) => handleBasicInfoChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="MERN Stack Development"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <input
                        type="text"
                        required
                        value={courseData.category}
                        onChange={(e) => handleBasicInfoChange('category', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Web Development"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Level *
                      </label>
                      <select
                        required
                        value={courseData.level}
                        onChange={(e) => handleBasicInfoChange('level', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (INR) *
                      </label>
                      <input
                        type="number"
                        required
                        value={courseData.price}
                        onChange={(e) => handleBasicInfoChange('price', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="4999"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        required
                        value={courseData.description}
                        onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Build powerful full-stack web applications using MongoDB, Express, React, and Node.js..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        About Course *
                      </label>
                      <textarea
                        required
                        value={courseData.about}
                        onChange={(e) => handleBasicInfoChange('about', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="This course provides a complete guide to becoming a professional MERN Stack Developer..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thumbnail URL *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          required
                          value={courseData.thumbnail}
                          onChange={(e) => handleBasicInfoChange('thumbnail', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="https://res.cloudinary.com/demo/image/upload/..."
                        />
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                        >
                          <Upload size={16} className="mr-2" />
                          Upload
                        </button>
                      </div>
                      {courseData.thumbnail && (
                        <div className="mt-2">
                          <img src={courseData.thumbnail} alt="Course thumbnail" className="h-20 rounded-lg object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructor ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={courseData.instructor}
                        onChange={(e) => handleBasicInfoChange('instructor', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="68eb53bc03477b59f82c71d4"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Curriculum */}
            {renderArraySection(
              'Curriculum',
              'curriculum',
              courseData.curriculum,
              (item, index) => (
                <div className="flex-1">
                  <p className="font-medium">{item.order}. {item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ),
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="Order"
                    value={newItem.curriculum.order}
                    onChange={(e) => handleNestedItemChange('curriculum', 'order', parseInt(e.target.value) || 0)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={newItem.curriculum.title}
                    onChange={(e) => handleNestedItemChange('curriculum', 'title', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newItem.curriculum.description}
                    onChange={(e) => handleNestedItemChange('curriculum', 'description', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>,
              <FileText size={20} />
            )}

            {/* Features */}
            {renderArraySection(
              'Features',
              'features',
              courseData.features,
              (item, index) => <p>{item}</p>,
              <input
                type="text"
                placeholder="Feature (e.g., 100+ hours of video content)"
                value={newItem.feature}
                onChange={(e) => handleNewItemChange('feature', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />,
              <Star size={20} />
            )}

            {/* Tech Stack */}
            {renderArraySection(
              'Tech Stack',
              'techStack',
              courseData.techStack,
              (item, index) => (
                <div className="flex items-center">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-6 h-6 mr-2 rounded-full" />}
                  <p>{item.name}</p>
                </div>
              ),
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Technology Name"
                    value={newItem.techStack.name}
                    onChange={(e) => handleNestedItemChange('techStack', 'name', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={newItem.techStack.imageUrl}
                    onChange={(e) => handleNestedItemChange('techStack', 'imageUrl', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>,
              <Monitor size={20} />
            )}

            {/* Skills Gained */}
            {renderArraySection(
              'Skills Gained',
              'skillsGained',
              courseData.skillsGained,
              (item, index) => (
                <div className="flex items-center">
                  <CheckCircle className="mr-2 text-green-500" size={16} />
                  <p>{item}</p>
                </div>
              ),
              <input
                type="text"
                placeholder="Skill (e.g., Problem Solving)"
                value={newItem.skill}
                onChange={(e) => handleNewItemChange('skill', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />,
              <Award size={20} />
            )}

            {/* Job Roles */}
            {renderArraySection(
              'Job Roles',
              'jobRoles',
              courseData.jobRoles,
              (item, index) => <p>{item}</p>,
              <input
                type="text"
                placeholder="Job Role (e.g., Full Stack Developer)"
                value={newItem.jobRole}
                onChange={(e) => handleNewItemChange('jobRole', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />,
              <Users size={20} />
            )}



            {/* Tags */}
            {renderArraySection(
              'Tags',
              'tags',
              courseData.tags,
              (item, index) => <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">#{item}</span>,
              <input
                type="text"
                placeholder="Tag (e.g., mern, react)"
                value={newItem.tag}
                onChange={(e) => handleNewItemChange('tag', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />,
              <Tag size={20} />
            )}

            {/* Requirements */}
            {renderArraySection(
              'Requirements',
              'requirements',
              courseData.requirements,
              (item, index) => <p>{item}</p>,
              <input
                type="text"
                placeholder="Requirement (e.g., Basic knowledge of HTML)"
                value={newItem.requirement}
                onChange={(e) => handleNewItemChange('requirement', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />,
              <FileText size={20} />
            )}

            {/* Learning Outcomes */}
            {renderArraySection(
              'Learning Outcomes',
              'learningOutcomes',
              courseData.learningOutcomes,
              (item, index) => <p>{item}</p>,
              <input
                type="text"
                placeholder="Learning Outcome (e.g., Build scalable web applications)"
                value={newItem.learningOutcome}
                onChange={(e) => handleNewItemChange('learningOutcome', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />,
              <Target size={20} />
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={submitStatus === 'submitting'}
                className={`flex items-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold transition-colors ${
                  submitStatus === 'submitting'
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {submitStatus === 'submitting' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Course...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Create Course
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddCoursePage;