import { apiUrl } from "../../api/axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiShield,
  FiActivity,
  FiCode,
  FiUpload,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import "./AdminUserDetails.css";
const AdminUserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser = JSON.parse(
          localStorage.getItem("user")
        );

        const token = storedUser?.token;

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          apiUrl(`/api/users/${id}`),
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user (${response.status})`
          );
        }

        const result = await response.json();

        console.log("User Detail API Response:", result);

        if (!result.success) {
          throw new Error(
            result.message || "Unable to fetch user details"
          );
        }

        setUser(result.data);
      } catch (err) {
        console.error("User Detail Error:", err);
        setError(
          err.message || "Unable to load user details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="admin-user-details-page">
        <div className="admin-user-details-message">
          <h3>Loading User...</h3>
          <p>Please wait while user details are loading.</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="admin-user-details-page">
        <div className="admin-user-details-message error">
          <FiXCircle />

          <h3>Unable to Load User</h3>

          <p>
            {error || "User details could not be found."}
          </p>

          <button
            onClick={() => navigate("/admin/users")}
          >
            <FiArrowLeft />
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-user-details-page">

      {/* HEADER */}
      <div className="admin-user-details-header">

        <button
          className="admin-user-details-back"
          onClick={() => navigate("/admin/users")}
        >
          <FiArrowLeft />
        </button>

        <div>
          <span>ADMIN PANEL</span>

          <h1>User Details</h1>

          <p>
            View detailed information and activity of this user
          </p>
        </div>

      </div>


      {/* USER PROFILE */}
      <div className="admin-user-details-container">

        <div className="admin-user-profile">

          <div className="admin-user-avatar">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.fullName}
              />
            ) : (
              getInitials(user.fullName)
            )}
          </div>

          <div className="admin-user-profile-info">

            <div className="admin-user-name-row">

              <h2>{user.fullName}</h2>

              <span className="admin-user-role">
                <FiShield />
                {user.role}
              </span>

            </div>

            <div className="admin-user-email">
              <FiMail />
              {user.email}
            </div>

            <div className="admin-user-status">

              {user.isActive ? (
                <span className="status-active">
                  <span className="status-dot"></span>
                  Active
                </span>
              ) : (
                <span className="status-inactive">
                  <span className="status-dot"></span>
                  Inactive
                </span>
              )}

              <span className="status-divider">•</span>

              {user.isVerified ? (
                <span className="verified">
                  <FiCheckCircle />
                  Verified
                </span>
              ) : (
                <span className="not-verified">
                  <FiXCircle />
                  Not Verified
                </span>
              )}

            </div>

          </div>

        </div>


        {/* STATISTICS */}
        <div className="admin-user-stats">

          <div className="admin-user-stat">

            <div className="admin-user-stat-icon">
              <FiCode />
            </div>

            <div>
              <span>Problems Solved</span>
              <strong>
                {user.totalProblemSolved ?? 0}
              </strong>
            </div>

          </div>


          <div className="admin-user-stat">

            <div className="admin-user-stat-icon">
              <FiUpload />
            </div>

            <div>
              <span>Total Submissions</span>
              <strong>
                {user.totalSubmission ?? 0}
              </strong>
            </div>

          </div>


          <div className="admin-user-stat">

            <div className="admin-user-stat-icon">
              <FiActivity />
            </div>

            <div>
              <span>Current Streak</span>
              <strong>
                {user.currentStreak ?? 0}
              </strong>
            </div>

          </div>


          <div className="admin-user-stat">

            <div className="admin-user-stat-icon">
              <FiActivity />
            </div>

            <div>
              <span>Max Streak</span>
              <strong>
                {user.maxStreak ?? 0}
              </strong>
            </div>

          </div>

        </div>


        {/* ACCOUNT INFORMATION */}
        <div className="admin-user-section">

          <div className="admin-user-section-title">

            <FiUser />

            <div>
              <h2>Account Information</h2>

              <p>
                Basic information about this user account
              </p>
            </div>

          </div>


          <div className="admin-user-info-grid">

            <div className="admin-user-info-item">
              <span>User ID</span>
              <strong>{user.id}</strong>
            </div>

            <div className="admin-user-info-item">
              <span>Full Name</span>
              <strong>{user.fullName}</strong>
            </div>

            <div className="admin-user-info-item">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>

            <div className="admin-user-info-item">
              <span>Role</span>
              <strong>{user.role}</strong>
            </div>

            <div className="admin-user-info-item">
              <span>Account Status</span>
              <strong>
                {user.isActive ? "Active" : "Inactive"}
              </strong>
            </div>

            <div className="admin-user-info-item">
              <span>Email Verification</span>
              <strong>
                {user.isVerified
                  ? "Verified"
                  : "Not Verified"}
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminUserDetails;