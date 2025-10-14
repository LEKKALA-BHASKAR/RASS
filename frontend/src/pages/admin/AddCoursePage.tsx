import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
interface CurriculumItem {
  order: number;
  title: string;
  subtitle: string;
  description: string;
}


interface TechStackItem {
  name: string;
  imageUrl: string;
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

interface ResourceItem {
  title: string;
  url: string;
  type: string;
}

interface ModuleItem {
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  resources: ResourceItem[];
}

const AddCoursePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Basic Information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [about, setAbout] = useState('');
  const [instructor, setInstructor] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('beginner');
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  
  // Array states
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<TechStackItem[]>([]);
  const [skillsGained, setSkillsGained] = useState<string[]>([]);
  const [jobRoles, setJobRoles] = useState<string[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([]);
  
  // Temporary input states for array items
  const [newCurriculumItem, setNewCurriculumItem] = useState({ order: 1, title: '', subtitle: '', description: '' });
  const [newFeature, setNewFeature] = useState('');
  const [newTechStackItem, setNewTechStackItem] = useState({ name: '', imageUrl: '' });
  const [newSkill, setNewSkill] = useState('');
  const [newJobRole, setNewJobRole] = useState('');
  const [newTestimonial, setNewTestimonial] = useState({ name: '', imageUrl: '', description: '' });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newModule, setNewModule] = useState({ title: '', description: '', videoUrl: '', duration: 0, order: 1, resources: [] });
  const [newTag, setNewTag] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newLearningOutcome, setNewLearningOutcome] = useState('');
  const [newResource, setNewResource] = useState({ title: '', url: '', type: 'link' });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Helper functions for array management
  const addCurriculumItem = () => {
    if (newCurriculumItem.title && newCurriculumItem.description) {
      setCurriculum([...curriculum, { ...newCurriculumItem, order: curriculum.length + 1 }]);
      setNewCurriculumItem({ order: curriculum.length + 2, title: '', subtitle: '', description: '' });
    }
  };

  const removeCurriculumItem = (index: number) => {
    const updated = curriculum.filter((_, i) => i !== index);
    setCurriculum(updated.map((item, i) => ({ ...item, order: i + 1 })));
  };

  const addFeature = () => {
    if (newFeature) {
      setFeatures([...features, newFeature]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addTechStackItem = () => {
    if (newTechStackItem.name && newTechStackItem.imageUrl) {
      setTechStack([...techStack, newTechStackItem]);
      setNewTechStackItem({ name: '', imageUrl: '' });
    }
  };

  const removeTechStackItem = (index: number) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (newSkill) {
      setSkillsGained([...skillsGained, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkillsGained(skillsGained.filter((_, i) => i !== index));
  };

  const addJobRole = () => {
    if (newJobRole) {
      setJobRoles([...jobRoles, newJobRole]);
      setNewJobRole('');
    }
  };

  const removeJobRole = (index: number) => {
    setJobRoles(jobRoles.filter((_, i) => i !== index));
  };

  const addTestimonial = () => {
    if (newTestimonial.name && newTestimonial.description) {
      setTestimonials([...testimonials, newTestimonial]);
      setNewTestimonial({ name: '', imageUrl: '', description: '' });
    }
  };

  const removeTestimonial = (index: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setFaqs([...faqs, newFaq]);
      setNewFaq({ question: '', answer: '' });
    }
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const addResourceToModule = () => {
    if (newResource.title && newResource.url) {
      setNewModule({
        ...newModule,
        resources: [...newModule.resources, newResource]
      });
      setNewResource({ title: '', url: '', type: 'link' });
    }
  };

  const removeResourceFromModule = (index: number) => {
    setNewModule({
      ...newModule,
      resources: newModule.resources.filter((_, i) => i !== index)
    });
  };

  const addModule = () => {
    if (newModule.title && newModule.description) {
      setModules([...modules, { ...newModule, order: modules.length + 1 }]);
      setNewModule({ title: '', description: '', videoUrl: '', duration: 0, order: modules.length + 2, resources: [] });
    }
  };

  const removeModule = (index: number) => {
    const updated = modules.filter((_, i) => i !== index);
    setModules(updated.map((item, i) => ({ ...item, order: i + 1 })));
  };

  const addTag = () => {
    if (newTag) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addRequirement = () => {
    if (newRequirement) {
      setRequirements([...requirements, newRequirement]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addLearningOutcome = () => {
    if (newLearningOutcome) {
      setLearningOutcomes([...learningOutcomes, newLearningOutcome]);
      setNewLearningOutcome('');
    }
  };

  const removeLearningOutcome = (index: number) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const courseData = {
        title,
        description,
        about,
        instructor,
        category,
        level,
        price: parseInt(price),
        thumbnail,
        curriculum,
        features,
        techStack,
        skillsGained,
        jobRoles,
        testimonials,
        faqs,
        modules,
        tags,
        requirements,
        learningOutcomes
      };
      
      const response = await fetch('https://rass-h2s1.onrender.com/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create course');
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/courses');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-indigo-700">
            <h1 className="text-2xl font-bold text-white">Add New Course</h1>
            <p className="mt-1 text-sm text-indigo-200">Create a new course for the platform</p>
          </div>
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 m-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Course created successfully! Redirecting...
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information Section */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Course Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                    Instructor ID
                  </label>
                  <input
                    type="text"
                    id="instructor"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <select
                    id="level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    id="thumbnail"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div className="mt-6">
                <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                  About
                </label>
                <textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            
            
            {/* Tech Stack Section */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Tech Stack</h2>
              
              <div className="space-y-4">
                {techStack.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md shadow">
                    <div className="flex items-center space-x-3">
                      <img src={item.imageUrl} alt={item.name} className="h-8 w-8 object-contain" />
                      <p>{item.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTechStackItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <div className="p-3 bg-white rounded-md shadow">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Technology name"
                      value={newTechStackItem.name}
                      onChange={(e) => setNewTechStackItem({ ...newTechStackItem, name: e.target.value })}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={newTechStackItem.imageUrl}
                      onChange={(e) => setNewTechStackItem({ ...newTechStackItem, imageUrl: e.target.value })}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={addTechStackItem}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Add Tech
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            
<div className="bg-gray-50 p-4 rounded-md">
  <h2 className="text-lg font-medium text-gray-900 mb-4">Curriculum</h2>

  <div className="space-y-4">
    {/* Display Curriculum List */}
    {curriculum.map((item, index) => (
      <div key={index} className="p-3 bg-white rounded-md shadow space-y-2">
        <div className="flex justify-between items-center">
          <p className="font-semibold">
            {item.order}. {item.title}
          </p>
          <button
            type="button"
            onClick={() => removeCurriculumItem(index)}
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
        {item.subtitle && (
          <p className="text-sm font-medium text-gray-800">{item.subtitle}</p>
        )}
        {item.description && (
          <p className="text-sm text-gray-600">{item.description}</p>
        )}
      </div>
    ))}

    {/* Add New Curriculum Item */}
    <div className="p-3 bg-white rounded-md shadow space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Order"
          value={newCurriculumItem.order}
          onChange={(e) =>
            setNewCurriculumItem({
              ...newCurriculumItem,
              order: parseInt(e.target.value, 10),
            })
          }
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        <input
          type="text"
          placeholder="Title"
          value={newCurriculumItem.title}
          onChange={(e) =>
            setNewCurriculumItem({ ...newCurriculumItem, title: e.target.value })
          }
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        <input
          type="text"
          placeholder="Subtitle"
          value={newCurriculumItem.subtitle}
          onChange={(e) =>
            setNewCurriculumItem({
              ...newCurriculumItem,
              subtitle: e.target.value,
            })
          }
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <textarea
        placeholder="Description"
        value={newCurriculumItem.description}
        onChange={(e) =>
          setNewCurriculumItem({
            ...newCurriculumItem,
            description: e.target.value,
          })
        }
        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
      />

      <div>
        <button
          type="button"
          onClick={addCurriculumItem}
          className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Curriculum
        </button>
      </div>
    </div>
  </div>
</div>


            {/* Job Roles Section */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Job Roles</h2>
              
              <div className="space-y-4">
                {jobRoles.map((role, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md shadow">
                    <p>{role}</p>
                    <button
                      type="button"
                      onClick={() => removeJobRole(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <div className="p-3 bg-white rounded-md shadow">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Add a job role"
                      value={newJobRole}
                      onChange={(e) => setNewJobRole(e.target.value)}
                      className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={addJobRole}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonials Section */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Testimonials</h2>
              
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="p-3 bg-white rounded-md shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <img src={testimonial.imageUrl} alt={testimonial.name} className="h-10 w-10 rounded-full" />
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-gray-500">{testimonial.description}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTestimonial(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="p-3 bg-white rounded-md shadow">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={newTestimonial.imageUrl}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, imageUrl: e.target.value })}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newTestimonial.description}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, description: e.target.value })}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={addTestimonial}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* FAQs Section */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-3 bg-white rounded-md shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Q: {faq.question}</p>
                        <p className="text-sm text-gray-500">A: {faq.answer}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="p-3 bg-white rounded-md shadow">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Question"
                      value={newFaq.question}
                      onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <textarea
                      placeholder="Answer"
                      value={newFaq.answer}
                      onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                      rows={2}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={addFaq}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Add FAQ
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modules Section */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Course Modules</h2>
              
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div key={index} className="p-3 bg-white rounded-md shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{module.order}. {module.title}</p>
                        <p className="text-sm text-gray-500">{module.description}</p>
                        <p className="text-xs text-gray-400">Duration: {module.duration} minutes</p>
                        <p className="text-xs text-gray-400">Resources: {module.resources.length}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeModule(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="p-3 bg-white rounded-md shadow">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Module Title"
                        value={newModule.title}
                        onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Duration (minutes)"
                        value={newModule.duration}
                        onChange={(e) => setNewModule({ ...newModule, duration: parseInt(e.target.value) || 0 })}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    
                    <textarea
                      placeholder="Module Description"
                      value={newModule.description}
                      onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                      rows={2}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    
                    <input
                      type="url"
                      placeholder="Video URL"
                      value={newModule.videoUrl}
                      onChange={(e) => setNewModule({ ...newModule, videoUrl: e.target.value })}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Module Resources</h3>
                      <div className="space-y-2">
                        {newModule.resources.map((resource, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                            <p className="text-sm">{resource.title} ({resource.type})</p>
                            <button
                              type="button"
                              onClick={() => removeResourceFromModule(idx)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          <input
                            type="text"
                            placeholder="Resource Title"
                            value={newResource.title}
                            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <input
                            type="url"
                            placeholder="Resource URL"
                            value={newResource.url}
                            onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <select
                            value={newResource.type}
                            onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="link">Link</option>
                            <option value="document">Document</option>
                            <option value="video">Video</option>
                          </select>
                          <button
                            type="button"
                            onClick={addResourceToModule}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                          >
                            Add Resource
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={addModule}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Add Module
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tags Section */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Tags</h2>
              
              <div className="space-y-4">
                {tags.map((tag, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md shadow">
                    <p>{tag}</p>
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <div className="p-3 bg-white rounded-md shadow">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            
            
            {/* Learning Outcomes Section */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Learning Outcomes</h2>
              
              <div className="space-y-4">
                {learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md shadow">
                    <p>{outcome}</p>
                    <button
                      type="button"
                      onClick={() => removeLearningOutcome(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <div className="p-3 bg-white rounded-md shadow">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Add a learning outcome"
                      value={newLearningOutcome}
                      onChange={(e) => setNewLearningOutcome(e.target.value)}
                      className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={addLearningOutcome}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {isLoading ? 'Creating Course...' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default AddCoursePage;