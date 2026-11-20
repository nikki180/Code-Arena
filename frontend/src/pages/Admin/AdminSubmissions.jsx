import { apiUrl } from "../../api/axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUpload,
  FiSearch,
  FiEye,
} from "react-icons/fi";

import "./AdminSubmissions.css";

const AdminSubmissions = () => {

  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {

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
        apiUrl("/api/submissions"),
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
          `Failed to fetch submissions (${response.status})`
        );
      }

      const result = await response.json();

      console.log(
        "All Submissions API Response:",
        result
      );

      if (!result.success) {
        throw new Error(
          result.message || "Unable to fetch submissions"
        );
      }

      setSubmissions(result.data || []);

    } catch (err) {

      console.error("Submission Error:", err);

      setError(
        err.message || "Unable to load submissions"
      );

    } finally {

      setLoading(false);

    }
  };


  const filteredSubmissions = submissions.filter(
    (submission) => {

      const searchText = search.toLowerCase();

      return (
        String(submission.id || "")
          .toLowerCase()
          .includes(searchText) ||

        String(submission.userId || "")
          .toLowerCase()
          .includes(searchText) ||

        String(submission.problemId || "")
          .toLowerCase()
          .includes(searchText) ||

        String(submission.status || "")
          .toLowerCase()
          .includes(searchText)
      );
    }
  );


  return (

    <div className="admin-submissions-page">

      {/* ================= HEADER ================= */}

      <div className="admin-submissions-header">

        <div className="admin-submissions-heading">

          <button
            className="admin-submissions-back"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            <FiArrowLeft />
          </button>

          <div>

            <span>ADMIN PANEL</span>

            <h1>Submission Management</h1>

            <p>
              Monitor coding submissions and platform activity
            </p>

          </div>

        </div>

      </div>


      {/* ================= MAIN ================= */}

      <div className="admin-submissions-container">

        {/* TITLE */}

        <div className="admin-submissions-title">

          <FiUpload />

          <div>

            <h2>All Submissions</h2>

            <p>
              {submissions.length} total submissions
            </p>

          </div>

        </div>


        {/* SEARCH */}

        <div className="admin-submissions-toolbar">

          <div className="admin-submissions-search">

            <FiSearch />

            <input
              type="text"
              placeholder="Search by ID, user, problem or status..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="admin-submissions-message">

            <h3>Loading Submissions...</h3>

            <p>
              Please wait while submissions are loading.
            </p>

          </div>

        )}


        {/* ERROR */}

        {!loading && error && (

          <div className="admin-submissions-message error">

            <h3>Unable to Load Submissions</h3>

            <p>{error}</p>

            <button onClick={fetchSubmissions}>
              Try Again
            </button>

          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredSubmissions.length === 0 && (

            <div className="admin-submissions-message">

              <FiUpload />

              <h3>No Submissions Found</h3>

              <p>
                No submissions match your search.
              </p>

            </div>

          )}


        {/* TABLE */}

        {!loading &&
          !error &&
          filteredSubmissions.length > 0 && (

            <div className="admin-submissions-table-wrapper">

              <table className="admin-submissions-table">

                <thead>

                  <tr>

                    <th>ID</th>
                    <th>User</th>
                    <th>Problem</th>
                    <th>Language</th>
                    <th>Status</th>
                    <th>Action</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredSubmissions.map(
                    (submission) => (

                      <tr key={submission.id}>

                        <td>
                          #{submission.id}
                        </td>

                        <td>
                          User #{submission.userId}
                        </td>

                        <td>
                          Problem #{submission.problemId}
                        </td>

                        <td>
                          {submission.language || "N/A"}
                        </td>

                        <td>

                          <span
                            className={`submission-status ${
                              submission.status
                                ?.toLowerCase()
                                .replace(/\s+/g, "-") || ""
                            }`}
                          >
                            {submission.status || "N/A"}
                          </span>

                        </td>

                        <td>

                        <button
  className="submission-view-btn"
  onClick={() =>
    navigate(`/admin/submissions/${submission.id}`)
  }
>
  <FiEye />
  View
</button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

      </div>

    </div>

  );
};

export default AdminSubmissions;