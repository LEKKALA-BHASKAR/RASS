import React, { useState } from 'react';

interface Section {
  subtitle: string;
  description: string;
}

interface CurriculumItem {
  order: number;
  title: string;
  sections: Section[];
}

const AdminCurriculumForm = () => {
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [newCurriculumItem, setNewCurriculumItem] = useState<CurriculumItem>({
    order: 1,
    title: '',
    sections: [
      {
        subtitle: '',
        description: '',
      },
    ],
  });

  const handleSectionChange = (index: number, field: keyof Section, value: string) => {
    const updatedSections = [...newCurriculumItem.sections];
    updatedSections[index][field] = value;
    setNewCurriculumItem({ ...newCurriculumItem, sections: updatedSections });
  };

  const addSectionField = () => {
    setNewCurriculumItem({
      ...newCurriculumItem,
      sections: [...newCurriculumItem.sections, { subtitle: '', description: '' }],
    });
  };

  const removeSectionField = (index: number) => {
    const updatedSections = newCurriculumItem.sections.filter((_, i) => i !== index);
    setNewCurriculumItem({ ...newCurriculumItem, sections: updatedSections });
  };

  const addCurriculumItem = () => {
    setCurriculum([...curriculum, newCurriculumItem]);
    setNewCurriculumItem({
      order: newCurriculumItem.order + 1,
      title: '',
      sections: [{ subtitle: '', description: '' }],
    });
  };

  const removeCurriculumItem = (index: number) => {
    setCurriculum(curriculum.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Curriculum</h2>

      <div className="space-y-4">
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
            {item.sections.map((section, idx) => (
              <div key={idx} className="ml-4">
                <p className="text-sm font-medium text-gray-800">{section.subtitle}</p>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            ))}
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
                setNewCurriculumItem({ ...newCurriculumItem, order: parseInt(e.target.value, 10) })
              }
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <input
              type="text"
              placeholder="Title"
              value={newCurriculumItem.title}
              onChange={(e) => setNewCurriculumItem({ ...newCurriculumItem, title: e.target.value })}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Sections */}
          {newCurriculumItem.sections.map((section, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <input
                type="text"
                placeholder="Subtitle"
                value={section.subtitle}
                onChange={(e) => handleSectionChange(index, 'subtitle', e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
              />
              <textarea
                placeholder="Description"
                value={section.description}
                onChange={(e) => handleSectionChange(index, 'description', e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => removeSectionField(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove Section
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSectionField}
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            + Add Section
          </button>

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
  );
};

export default AdminCurriculumForm;
