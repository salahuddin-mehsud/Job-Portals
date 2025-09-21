import React, { useState } from "react";
import axios from "axios";

const JobForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    requirements: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:5000/api/jobs", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Job created successfully!");
      setFormData({ title: "", description: "", salary: "", requirements: "" });
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        name="title"
        placeholder="Job Title"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <textarea
        name="description"
        placeholder="Job Description"
        value={formData.description}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        name="salary"
        placeholder="Salary"
        value={formData.salary}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="requirements"
        placeholder="Requirements"
        value={formData.requirements}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Post Job
      </button>
    </form>
  );
};

export default JobForm;
