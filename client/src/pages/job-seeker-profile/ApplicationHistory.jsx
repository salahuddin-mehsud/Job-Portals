import React from "react";
import { Briefcase, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";

const applications = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechGrowth Inc.",
    status: "Interview",
    appliedAt: "Sep 5, 2025",
    location: "San Francisco, CA (Remote)",
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Innovate Solutions",
    status: "Reviewed",
    appliedAt: "Sep 1, 2025",
    location: "New York, NY (Hybrid)",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "Global Systems",
    status: "Submitted",
    appliedAt: "Aug 28, 2025",
    location: "Austin, TX (On-site)",
  },
  {
    id: 4,
    title: "Product Manager",
    company: "Future Innovations",
    status: "Rejected",
    appliedAt: "Aug 20, 2025",
    location: "Seattle, WA (Remote)",
  },
];

const statusColors = {
  Submitted: "bg-blue-100 text-blue-700",
  Interview: "bg-green-100 text-green-700",
  Reviewed: "bg-yellow-100 text-yellow-700",
  Hired: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

function ApplicationsHistory() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Applications History
        </h1>

        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {app.title}
                  </h2>
                  <p className="text-gray-600">{app.company}</p>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar size={14} /> Applied on {app.appliedAt}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Briefcase size={14} /> {app.location}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[app.status]}`}
                >
                  {app.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button className="px-4 py-2 rounded-lg border text-gray-600 text-sm hover:bg-gray-100">
                  View Details
                </button>
                {app.status === "Interview" && (
                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
                    Schedule Interview
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {applications.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Clock size={40} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No job applications found.</p>
            <button className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationsHistory;
