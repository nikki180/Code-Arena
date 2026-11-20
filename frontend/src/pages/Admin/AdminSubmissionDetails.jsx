import { apiUrl } from "../../api/axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCode,
  FiUser,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

import "./AdminSubmissionDetails.css";

const AdminSubmissionDetails = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchSubmission = async () => {

      try {

        setLoading(true);
        setError("");

        const storedUser = JSON.parse(
          localStorage.getItem("user")
        );

        const token = storedUser?.token;

        if (!token) {
          throw new Error(
            "Authentication token not found"
          );
        }

        const response = await fetch(
          apiUrl(`/api/submissions/${id}`),
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
            `Failed to fetch submission (${response.status})`
          );
        }

        const result = await response.json();

        console.log(
          "Submission Detail API Response:",
          result
        );

        if (!result.success) {
          throw new Error(
            result.message ||
              "Unable to fetch submission details"
          );
        }

        setSubmission(result.data);

      } catch (err) {

        console.error(
          "Submission Detail Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load submission details"
        );

      } finally {

        setLoading(false);

      }
    };

    if (id) {
      fetchSubmission();
    }

  }, [id]);


  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString();

  };


  const getStatusClass = (status) => {

    if (!status) {
      return "";
    }

    return status
      .toLowerCase()
      .replace(/\s+/g, "-");

  };


  if (loading) {

    return (

      <div className="admin-submission-details-page">

        <div className="admin-submission-details-message">

          <h3>Loading Submission...</h3>

          <p>
            Please wait while submission details are loading.
          </p>

        </div>

      </div>

    );

  }


  if (error || !submission) {

    return (

      <div className="admin-submission-details-page">

        <div className="admin-submission-details-message error">

          <FiXCircle />

          <h3>Unable to Load Submission</h3>

          <p>
            {error ||
              "Submission details could not be found."}
          </p>

          <button
            onClick={() =>
              navigate("/admin/submissions")
            }
          >
            <FiArrowLeft />
            Back to Submissions
          </button>

        </div>

      </div>

    );

  }


  return (

    <div className="admin-submission-details-page">

      {/* ================= HEADER ================= */}

      <div className="admin-submission-details-header">

        <button
          className="admin-submission-details-back"
          onClick={() =>
            navigate("/admin/submissions")
          }
        >
          <FiArrowLeft />
        </button>

        <div>

          <span>ADMIN PANEL</span>

          <h1>Submission Details</h1>

          <p>
            View complete information and submitted code
          </p>

        </div>

      </div>


      {/* ================= CONTENT ================= */}

      <div className="admin-submission-details-container">


        {/* ================= TOP INFO ================= */}

        <div className="submission-detail-top">

          <div>

            <span className="submission-detail-label">
              SUBMISSION
            </span>

            <h2>
              #{submission.id}
            </h2>

          </div>


          <div
            className={`submission-detail-status ${getStatusClass(
              submission.status
            )}`}
          >

            {submission.status === "ACCEPTED" ? (
              <FiCheckCircle />
            ) : (
              <FiXCircle />
            )}

            {submission.status}

          </div>

        </div>


        {/* ================= BASIC INFORMATION ================= */}

        <div className="submission-detail-section">

          <div className="submission-detail-section-title">

            <FiFileText />

            <div>

              <h2>Submission Information</h2>

              <p>
                Basic details about this submission
              </p>

            </div>

          </div>


          <div className="submission-detail-grid">


            <div className="submission-detail-item">

              <div className="submission-detail-icon">
                <FiUser />
              </div>

              <div>

                <span>User ID</span>

                <strong>
                  {submission.userId}
                </strong>

              </div>

            </div>


            <div className="submission-detail-item">

              <div className="submission-detail-icon">
                <FiCode />
              </div>

              <div>

                <span>Problem ID</span>

                <strong>
                  {submission.problemId}
                </strong>

              </div>

            </div>


            <div className="submission-detail-item">

              <div className="submission-detail-icon">
                <FiCode />
              </div>

              <div>

                <span>Language</span>

                <strong>
                  {submission.language}
                </strong>

              </div>

            </div>


            <div className="submission-detail-item">

              <div className="submission-detail-icon">
                <FiClock />
              </div>

              <div>

                <span>Submitted At</span>

                <strong>
                  {formatDate(
                    submission.submittedAt
                  )}
                </strong>

              </div>

            </div>


          </div>

        </div>


        {/* ================= SOURCE CODE ================= */}

        <div className="submission-detail-section">

          <div className="submission-detail-section-title">

            <FiCode />

            <div>

              <h2>Submitted Code</h2>

              <p>
                Source code submitted by the user
              </p>

            </div>

          </div>


          <div className="submission-code-wrapper">

            <div className="submission-code-header">

              <span>
                {submission.language}
              </span>

              <span>
                Submission #{submission.id}
              </span>

            </div>


            <pre className="submission-source-code">
              <code>
                {submission.sourceCode ||
                  "// No source code available"}
              </code>
            </pre>

          </div>

        </div>


      </div>

    </div>

  );

};

export default AdminSubmissionDetails;