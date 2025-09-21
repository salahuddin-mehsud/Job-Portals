import React from "react";
import { Bookmark, MapPin, DollarSign, Briefcase } from "lucide-react";

const savedJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechGrowth Inc.",
    location: "San Francisco, CA (Remote)",
    salary: "$120,000 - $150,000",
    skills: ["React", "TypeScript", "Redux"],
    savedAt: "2 days ago",
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Innovate Solutions",
    location: "New York, NY (Hybrid)",
    salary: "$90,000 - $120,000",
    skills: ["Figma", "User Research", "Prototyping"],
    savedAt: "5 days ago",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "Global Systems",
    location: "Austin, TX (On-site)",
    salary: "$110,000 - $140,000",
    skills: ["Node.js", "React", "MongoDB"],
    savedAt: "1 week ago",
  },
];

function SavedJobs() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Saved Jobs</h1>

        <div className="space-y-6">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {job.title}
                  </h2>
                  <p className="text-gray-600">{job.company}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign size={16} /> {job.salary}
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-500">
                  <Bookmark size={22} />
                </button>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
                <span>Saved {job.savedAt}</span>
                <div className="flex gap-3">
                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
                    Apply Now
                  </button>
                  <button className="px-4 py-2 rounded-lg border text-gray-600 text-sm hover:bg-gray-100">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {savedJobs.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Briefcase size={40} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg">You haven’t saved any jobs yet.</p>
            <button className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedJobs;
