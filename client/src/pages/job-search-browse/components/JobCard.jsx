// JobCard.jsx
import React from "react";

const JobCard = ({ job, isSaved, onSave, onSelect, isSelected, formatTimeAgo }) => {
  return (
    <div
      onClick={onSelect}
      className={`border rounded-lg p-4 cursor-pointer ${isSelected ? "border-blue-500" : "border-gray-300"}`}
    >
      <h2 className="text-xl font-bold">{job.title}</h2>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-gray-500">{job.location}</p>
      <p className="text-sm text-gray-400">Posted {formatTimeAgo(job.postedDate)}</p>
      <p className="mt-2">{job.salaryRange}</p>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSave();
        }}
        className={`mt-2 px-4 py-1 rounded ${isSaved ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}
      >
        {isSaved ? "Unsave" : "Save"}
      </button>
    </div>
  );
};

export default JobCard;
