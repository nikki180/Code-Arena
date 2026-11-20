import { apiUrl } from "../../api/axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";

import "./CreateContest.css";

const CreateContest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Please sign in again to create a contest.");

    const response = await fetch(apiUrl("/api/contests"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Failed to create contest");
    }

    const createdContest = await response.json();

    console.log("Contest Created:", createdContest);

    alert("Contest created successfully!");

    navigate("/admin/contests");

  } catch (error) {
    console.error("Create contest error:", error);
    alert(error.message || "Failed to create contest");
  }
};

  return (
    <div className="create-contest-page">

      <div className="create-contest-header">

        <button
          className="create-contest-back"
          onClick={() => navigate("/admin/contests")}
        >
          <FiArrowLeft />
          Back to Contests
        </button>

        <h1>Create Contest</h1>

        <p>
          Create a new coding contest and configure its schedule.
        </p>

      </div>

      <div className="create-contest-card">

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="title">
              Contest Title
            </label>

            <input
              id="title"
              type="text"
              name="title"
              placeholder="Enter contest title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              placeholder="Enter contest description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="startTime">
                Start Date & Time
              </label>

              <input
                id="startTime"
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">
                End Date & Time
              </label>

              <input
                id="endTime"
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="create-contest-actions">

            <button
              type="button"
              className="cancel-contest-btn"
              onClick={() => navigate("/admin/contests")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-contest-btn"
            >
              <FiSave />
              Create Contest
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateContest;
