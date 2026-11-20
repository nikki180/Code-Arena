import { apiUrl } from "../../api/axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPlus,
  FiCalendar,
  FiClock,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import "./AdminContest.css";

const AdminContest = () => {
  const navigate = useNavigate();

  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User token not found");
      }

      const response = await fetch(apiUrl("/api/contests"), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Contest API Error:", response.status, errorText);

        throw new Error(
          `Failed to fetch contests (${response.status})`
        );
      }


      const data = await response.json();

      console.log("All Contests API Response:", data);

      setContests(data);
    } catch (err) {
      console.error("Fetch contests error:", err);
      setError(err.message || "Failed to load contests.");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contest?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User token not found");
      }

      const response = await fetch(
        apiUrl(`/api/contests/${id}`),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "Delete Contest Error:",
          response.status,
          errorText
        );

        throw new Error("Failed to delete contest");
      }

      alert("Contest deleted successfully!");

      setContests((prevContests) =>
        prevContests.filter((contest) => contest.id !== id)
      );
    } catch (err) {
      console.error("Delete contest error:", err);
      alert(err.message || "Failed to delete contest.");
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const upcomingCount = contests.filter(
    (contest) => contest.status === "UPCOMING"
  ).length;

  const runningCount = contests.filter(
    (contest) => contest.status === "RUNNING"
  ).length;

  const endedCount = contests.filter(
    (contest) => contest.status === "ENDED"
  ).length;

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return "-";
    }

    return new Date(dateTime).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="admin-contest-page">

      {/* Header */}
      <div className="admin-contest-header">

        <div className="admin-contest-header-left">

          <button
            className="admin-contest-back"
            onClick={() => navigate("/admin/dashboard")}
          >
            <FiArrowLeft />
            Back to Dashboard
          </button>

          <h1>Contest Management</h1>

          <p>
            Create, manage and monitor coding contests.
          </p>

        </div>

        <button
          className="admin-contest-create-btn"
          onClick={() => navigate("/admin/contests/create")}
        >
          <FiPlus />
          Create Contest
        </button>

      </div>

      {/* Stats */}
      <div className="admin-contest-stats">

        <div className="contest-stat-card">
          <div className="contest-stat-content">
            <span>Total Contests</span>
            <strong>{contests.length}</strong>
          </div>
        </div>

        <div className="contest-stat-card">
          <div className="contest-stat-content">
            <span>Upcoming</span>
            <strong>{upcomingCount}</strong>
          </div>
        </div>

        <div className="contest-stat-card">
          <div className="contest-stat-content">
            <span>Running</span>
            <strong>{runningCount}</strong>
          </div>
        </div>

        <div className="contest-stat-card">
          <div className="contest-stat-content">
            <span>Ended</span>
            <strong>{endedCount}</strong>
          </div>
        </div>

      </div>

      {/* Contest Section */}
      <div className="admin-contest-section">

        <div className="admin-contest-section-header">

          <div>
            <h2>All Contests</h2>

            <p>
              Manage all coding contests from here.
            </p>
          </div>

        </div>

        {/* Loading */}
        {loading && (
          <div className="admin-contest-empty">

            <div className="admin-contest-empty-icon">
              <FiCalendar />
            </div>

            <h3>Loading Contests...</h3>

            <p>
              Please wait while contests are being loaded.
            </p>

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="admin-contest-empty">

            <div className="admin-contest-empty-icon">
              <FiCalendar />
            </div>

            <h3>Failed to Load Contests</h3>

            <p>{error}</p>

            <button
              className="admin-contest-create-btn"
              onClick={fetchContests}
            >
              Retry
            </button>

          </div>
        )}

        {/* Empty */}
        {!loading && !error && contests.length === 0 && (
          <div className="admin-contest-empty">

            <div className="admin-contest-empty-icon">
              <FiCalendar />
            </div>

            <h3>No Contests Found</h3>

            <p>
              There are no contests available yet.
              Create your first contest to get started.
            </p>

            <button
              className="admin-contest-create-btn"
              onClick={() => navigate("/admin/contests/create")}
            >
              <FiPlus />
              Create Contest
            </button>

          </div>
        )}

        {/* Contest List */}
        {!loading && !error && contests.length > 0 && (
          <div className="admin-contest-list">

            {contests.map((contest) => (
              <div
                className="admin-contest-card"
                key={contest.id}
              >

                <div className="admin-contest-card-main">

                  <div className="admin-contest-card-title-row">

                    <h3>{contest.title}</h3>

                    <span
                      className={`contest-status contest-status-${(
                        contest.status || ""
                      ).toLowerCase()}`}
                    >
                      {contest.status}
                    </span>

                  </div>

                  <p className="admin-contest-description">
                    {contest.description ||
                      "No description provided."}
                  </p>

                  <div className="admin-contest-time-info">

                    <div>
                      <FiCalendar />

                      <span>
                        Start:{" "}
                        {formatDateTime(contest.startTime)}
                      </span>
                    </div>

                    <div>
                      <FiClock />

                      <span>
                        End:{" "}
                        {formatDateTime(contest.endTime)}
                      </span>
                    </div>

                  </div>

                </div>

                <div className="admin-contest-card-actions">

                  <button
                    className="contest-edit-btn"
                    title="Edit Contest"
                    onClick={() => navigate(`/admin/contests/edit/${contest.id}`)}
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    className="contest-delete-btn"
                    title="Delete Contest"
                    onClick={() => handleDelete(contest.id)}
                  >
                    <FiTrash2 />
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default AdminContest;
