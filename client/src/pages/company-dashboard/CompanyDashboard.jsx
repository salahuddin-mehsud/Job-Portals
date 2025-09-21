import React, { useState } from "react";
import JobForm from "./JobForm";
import JobList from "./JobList";
import ApplicationsList from "./ApplicationsList";

const CompanyDashboard = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Company Dashboard</h1>

      {/* Create Job Section */}
      <section className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Create a Job Posting</h2>
        <JobForm />
      </section>

      {/* My Jobs Section */}
      <section className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-2">My Job Postings</h2>
        <JobList onSelectJob={setSelectedJob} />
      </section>

      {/* Applications Section */}
      {selectedJob && (
        <section className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">
            Applications for: {selectedJob.title}
          </h2>
          <ApplicationsList jobId={selectedJob._id} />
        </section>
      )}
    </div>
  );
};

export default CompanyDashboard;
