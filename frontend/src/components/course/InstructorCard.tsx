import React from "react";
import { Linkedin, Twitter, Globe, Award } from "lucide-react";
import { motion } from "framer-motion";

type Instructor = {
  name: string;
  bio?: string;
  avatar?: string;
  title?: string;
  experience?: string;
  achievements?: string[];
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
    <section className="py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Meet Your Instructor
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-md border p-8 flex flex-col sm:flex-row gap-8 items-center"
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          {instructor.avatar ? (
            <img
              src={instructor.avatar}
              alt={instructor.name}
              className="w-28 h-28 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-md">
              {instructor.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-semibold text-gray-900">{instructor.name}</h3>
          {instructor.title && (
            <p className="text-sm text-gray-600">{instructor.title}</p>
          )}
          {instructor.experience && (
            <p className="text-sm text-indigo-600 font-medium mt-1">
              {instructor.experience}
            </p>
          )}
          {instructor.bio && (
            <p className="mt-4 text-gray-700 leading-relaxed text-sm">
              {instructor.bio}
            </p>
          )}

          {/* Achievements */}
          {instructor.achievements && instructor.achievements.length > 0 && (
            <ul className="mt-4 space-y-2">
              {instructor.achievements.map((ach, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <Award className="h-4 w-4 text-yellow-500" />
                  {ach}
                </li>
              ))}
            </ul>
          )}

          {/* Social Links */}
          <div className="mt-6 flex gap-4 justify-center sm:justify-start">
            {instructor.socials?.linkedin && (
              <a
                href={instructor.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 transition"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            )}
            {instructor.socials?.twitter && (
              <a
                href={instructor.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-400 transition"
              >
                <Twitter className="h-6 w-6" />
              </a>
            )}
            {instructor.socials?.website && (
              <a
                href={instructor.socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-green-600 transition"
              >
                <Globe className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default InstructorCard;
