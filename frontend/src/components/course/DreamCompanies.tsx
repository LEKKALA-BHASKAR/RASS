import React from "react";

export interface Company {
  name: string;
  logo?: string;
}

interface Props {
  companies: Company[];
}

const DreamCompanies: React.FC<Props> = ({ companies }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Dream Companies</h2>
      <div className="flex flex-wrap gap-6">
        {companies.map((c, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-lg shadow border flex items-center justify-center w-32 h-20 hover:shadow-md transition"
          >
            {c.logo ? (
              <img
                src={c.logo}
                alt={c.name}
                className="max-h-12 object-contain"
              />
            ) : (
              <span className="text-sm text-gray-700">{c.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default DreamCompanies;
