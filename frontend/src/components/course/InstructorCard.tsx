import React from "react";
import { Linkedin, Twitter, Globe } from "lucide-react";

type Instructor = {
  name: string;
  bio?: string;
  avatar?: string;
  title?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
};

interface Props {
  instructor: Instructor;
}

const InstructorCard: React.FC<Props> = ({ instructor }) => {
  if (!instructor) return null;

  return (
    <section className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Instructor</h2>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {instructor.avatar ? (
            <img
              src={instructor.avatar}
              alt={instructor.name}
              className="w-24 h-24 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 shadow-md">
              {instructor.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-gray-900">
            {instructor.name}
          </h3>
          {instructor.title && (
            <p className="text-sm text-gray-600">{instructor.title}</p>
          )}
          {instructor.bio && (
            <p className="mt-3 text-gray-700 leading-relaxed text-sm">
              {instructor.bio}
            </p>
          )}

          {/* Social Links */}
          <div className="mt-4 flex gap-4 justify-center sm:justify-start">
            {instructor.socials?.linkedin && (
              <a
                href={instructor.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 transition"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {instructor.socials?.twitter && (
              <a
                href={instructor.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-400 transition"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {instructor.socials?.website && (
              <a
                href={instructor.socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-green-600 transition"
              >
                <Globe className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorCard;
