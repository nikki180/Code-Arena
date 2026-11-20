import { apiUrl } from "../../api/axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";

import "./EditContest.css";

const EditContest = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Convert backend LocalDateTime to datetime-local format
  const formatForInput = (dateTime) => {
    if (!dateTime) return "";

    return dateTime.substring(0, 16);
  };

  // Fetch existing contest
  const fetchContest = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User token not found");
      }

      const response = await fetch(
        apiUrl(`/api/contests/${id}`),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch contest");
      }

      const contest = await response.json();

      setFormData({
        title: contest.title || "",
        description: contest.description || "",
        startTime: formatForInput(contest.startTime),
        endTime: formatForInput(contest.endTime),
      });
    } catch (err) {
      console.error("Fetch contest error:", err);
      setError(err.message || "Failed to load contest.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContest();
  }, [id]);

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
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User token not found");
      }

      const response = await fetch(
        apiUrl(`/api/contests/${id}`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "Update Contest Error:",
          response.status,
          errorText
        );

        throw new Error("Failed to update contest");
      }

      const updatedContest = await response.json();

      console.log("Contest Updated:", updatedContest);

      alert("Contest updated successfully!");

      navigate("/admin/contests");
    } catch (err) {
      console.error("Update contest error:", err);
      setError(err.message || "Failed to update contest.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-contest-page">
        <div className="edit-contest-loading">
          Loading contest...
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="edit-contest-page">
        <div className="edit-contest-error">
          <h2>Failed to Load Contest</h2>
          <p>{error}</p>

          <button
            className="edit-contest-back"
            onClick={() => navigate("/admin/contests")}
          >
            <FiArrowLeft />
            Back to Contests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-contest-page">

      {/* Header */}
      <div className="edit-contest-header">

        <button
          className="edit-contest-back"
          onClick={() => navigate("/admin/contests")}
        >
          <FiArrowLeft />
          Back to Contests
        </button>

        <h1>Edit Contest</h1>

        <p>
          Update the contest details and schedule.
        </p>

      </div>

      {/* Form */}
      <div className="edit-contest-card">

        <form onSubmit={handleSubmit}>

          <div className="edit-form-group">

            <label htmlFor="title">
              Contest Title
            </label>

            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter contest title"
              required
            />

          </div>

          <div className="edit-form-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter contest description"
              rows="5"
            />

          </div>

          <div className="edit-form-row">

            <div className="edit-form-group">

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

            <div className="edit-form-group">

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

          {error && (
            <div className="edit-contest-form-error">
              {error}
            </div>
          )}

          <div className="edit-contest-actions">

            <button
              type="button"
              className="edit-cancel-btn"
              onClick={() => navigate("/admin/contests")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-save-btn"
              disabled={saving}
            >
              <FiSave />

              {saving ? "Updating..." : "Update Contest"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditContest;
