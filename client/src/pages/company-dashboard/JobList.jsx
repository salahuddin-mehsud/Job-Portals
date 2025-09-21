import React, { useEffect, useState } from "react";
import axios from "axios";

const JobList = ({ onSelectJob }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/jobs/my-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <ul className="space-y-2">
      {jobs.map((job) => (
        <li
          key={job._id}
          className="border p-3 rounded cursor-pointer hover:bg-gray-50"
          onClick={() => onSelectJob(job)}
        >
          <h3 className="font-bold">{job.title}</h3>
          <p>{job.description.slice(0, 100)}...</p>
        </li>
      ))}
    </ul>
  );
};

export default JobList;
