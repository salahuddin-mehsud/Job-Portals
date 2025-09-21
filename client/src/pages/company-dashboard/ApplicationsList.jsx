import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ApplicationsList = ({ jobId }) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `http://localhost:5000/api/jobs/${jobId}/applications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplications(res.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, [jobId]);

  const handleStatusChange = async (appId, status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${appId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  return (
    <ul className="space-y-3">
      {applications.map((app) => (
        <li key={app._id} className="border p-3 rounded">
          <p><strong>Candidate:</strong> {app.user.name}</p>
          <Link to={`/profile/${app.user._id}`} className="text-blue-600 underline">
            View Profile
          </Link>
          <p><strong>Status:</strong> {app.status}</p>
          <div className="space-x-2 mt-2">
            <button
              onClick={() => handleStatusChange(app._id, "accepted")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Accept
            </button>
            <button
              onClick={() => handleStatusChange(app._id, "pending")}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusChange(app._id, "rejected")}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ApplicationsList;
