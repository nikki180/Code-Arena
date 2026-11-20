import { apiUrl } from "../../api/axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUsers,
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiAward,
  FiAlertCircle,
} from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import "./AdminUsers.css";

const AdminUsers = () => {

  const navigate = useNavigate();

  // =========================================================
  // STATES
  // =========================================================

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================================================
  // FETCH ALL USERS
  // =========================================================

  useEffect(() => {

    const fetchUsers = async () => {

      try {

        setLoading(true);
        setError("");

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          throw new Error("User session not found.");
        }

        const loggedInUser = JSON.parse(storedUser);

        const token = loggedInUser?.token;

        if (!token) {
          throw new Error("Authentication token not found.");
        }


        const response = await fetch(
          apiUrl("/api/users"),
          {
            method: "GET",

            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );


        console.log(
          "Users API Status:",
          response.status
        );


        const result = await response.json();


        console.log(
          "Users API Response:",
          result
        );


        if (!response.ok) {
          throw new Error(
            result?.message ||
            "Failed to fetch users."
          );
        }


        // Backend response:
        // {
        //   success: true,
        //   message: "...",
        //   data: [...]
        // }

        setUsers(
          Array.isArray(result?.data)
            ? result.data
            : []
        );

      } catch (err) {

        console.error(
          "Users Fetch Error:",
          err
        );

        setError(
          err.message ||
          "Unable to connect to Spring Boot."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchUsers();

  }, []);


  // =========================================================
  // SEARCH USERS
  // =========================================================

  const filteredUsers = users.filter((user) => {

    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      return true;
    }

    const fullName =
      user?.fullName?.toLowerCase() || "";

    const email =
      user?.email?.toLowerCase() || "";

    const role =
      user?.role?.toLowerCase() || "";

    return (
      fullName.includes(search) ||
      email.includes(search) ||
      role.includes(search)
    );

  });


  // =========================================================
  // GET USER INITIALS
  // =========================================================

  const getInitials = (name) => {

    if (!name) {
      return "U";
    }

    const words = name
      .trim()
      .split(" ")
      .filter(Boolean);

    if (words.length === 1) {
      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      words[0][0] +
      words[words.length - 1][0]
    ).toUpperCase();

  };


  // =========================================================
  // VIEW USER
  // =========================================================

  const handleViewUser = (userId) => {

    navigate(`/admin/users/${userId}`);

  };


  // =========================================================
  // BACK TO ADMIN DASHBOARD
  // =========================================================

  const handleBack = () => {

    navigate("/admin/dashboard");

  };


  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {

    return (

      <div className="admin-users-page">

        <div className="admin-users-header">

          <div className="admin-users-heading">

            <button
              className="admin-users-back"
              onClick={handleBack}
            >
              <FiArrowLeft />
            </button>

            <div>

              <span>ADMIN PANEL</span>

              <h1>User Management</h1>

              <p>
                Manage registered users and monitor platform activity
              </p>

            </div>

          </div>

        </div>


        <div className="admin-users-container">

          <div className="admin-users-title">

            <FiUsers />

            <div>

              <h2>All Users</h2>

              <p>
                Loading users...
              </p>

            </div>

          </div>


          <div className="admin-users-empty">

            <FiUsers />

            <h3>
              Loading Users
            </h3>

            <p>
              Fetching users from Spring Boot...
            </p>

          </div>

        </div>

      </div>

    );

  }


  // =========================================================
  // MAIN UI
  // =========================================================

  return (

    <div className="admin-users-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="admin-users-header">

        <div className="admin-users-heading">

          <button
            className="admin-users-back"
            onClick={handleBack}
            title="Back to Dashboard"
          >
            <FiArrowLeft />
          </button>


          <div>

            <span>
              ADMIN PANEL
            </span>

            <h1>
              User Management
            </h1>

            <p>
              Manage registered users and monitor platform activity
            </p>

          </div>

        </div>

      </div>



      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="admin-users-container">


        {/* ===================================================
            TITLE
        =================================================== */}

        <div className="admin-users-title">

          <FiUsers />

          <div>

            <h2>
              All Users
            </h2>

            <p>
              {users.length} registered user
              {users.length !== 1 ? "s" : ""}
            </p>

          </div>

        </div>



        {/* ===================================================
            SEARCH TOOLBAR
        =================================================== */}

        <div className="admin-users-toolbar">

          <div className="admin-users-search">

            <FiSearch />

            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

        </div>



        {/* ===================================================
            ERROR STATE
        =================================================== */}

        {error ? (

          <div className="admin-users-empty">

            <FiAlertCircle />

            <h3>
              Unable to Load Users
            </h3>

            <p>
              {error}
            </p>

          </div>

        ) : filteredUsers.length === 0 ? (

          /* =================================================
             NO USERS / NO SEARCH RESULT
             ================================================= */

          <div className="admin-users-empty">

            <FiUsers />

            <h3>
              {users.length === 0
                ? "No Users Found"
                : "No Matching Users"}
            </h3>

            <p>
              {users.length === 0
                ? "There are no registered users yet."
                : "Try searching with a different name or email."}
            </p>

          </div>

        ) : (

          /* =================================================
             USERS TABLE
             ================================================= */

          <div className="admin-users-table-wrapper">

            <table className="admin-users-table">


              {/* =============================================
                  TABLE HEADER
                  ============================================= */}

              <thead>

                <tr>

                  <th>
                    #
                  </th>

                  <th>
                    User
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Problems
                  </th>

                  <th>
                    Submissions
                  </th>

                  <th>
                    Streak
                  </th>

                  <th>
                    Verified
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>



              {/* =============================================
                  TABLE BODY
                  ============================================= */}

              <tbody>

                {filteredUsers.map(
                  (user, index) => (

                    <tr key={user.id}>


                      {/* =====================================
                          NUMBER
                          ===================================== */}

                      <td>
                        {index + 1}
                      </td>



                      {/* =====================================
                          USER
                          ===================================== */}

                      <td>

                        <div className="admin-user-info">


                          {/* Avatar */}

                          <div className="admin-user-avatar">

                            {user?.profileImage ? (

                              <img
                                src={user.profileImage}
                                alt={user.fullName}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                }}
                              />

                            ) : (

                              getInitials(
                                user?.fullName
                              )

                            )}

                          </div>


                          {/* User Details */}

                          <div className="admin-user-details">

                            <span className="admin-user-name">

                              {user?.fullName ||
                                "Unknown User"}

                            </span>

                            <span className="admin-user-email">

                              {user?.email ||
                                "No email"}

                            </span>

                          </div>

                        </div>

                      </td>



                      {/* =====================================
                          ROLE
                          ===================================== */}

                      <td>

                        <span className="admin-role-badge">

                          {user?.role ||
                            "USER"}

                        </span>

                      </td>



                      {/* =====================================
                          STATUS
                          ===================================== */}

                      <td>

                        {user?.isActive ? (

                          <span className="admin-status active">

                            Active

                          </span>

                        ) : (

                          <span className="admin-status inactive">

                            Inactive

                          </span>

                        )}

                      </td>



                      {/* =====================================
                          PROBLEMS SOLVED
                          ===================================== */}

                      <td>

                        <span className="admin-user-stat">

                          <FiCheckCircle
                            className="admin-user-stat-icon"
                          />

                          {user?.totalProblemSolved ?? 0}

                        </span>

                      </td>



                      {/* =====================================
                          TOTAL SUBMISSIONS
                          ===================================== */}

                      <td>

                        <span className="admin-user-stat">

                          <FiActivity
                            className="admin-user-stat-icon"
                          />

                          {user?.totalSubmission ?? 0}

                        </span>

                      </td>



                      {/* =====================================
                          STREAK
                          ===================================== */}

                      <td>

                        <span className="admin-streak">

                          <FaFire />

                          {user?.currentStreak ?? 0}

                        </span>

                      </td>



                      {/* =====================================
                          VERIFIED
                          ===================================== */}

                      <td>

                        {user?.isVerified ? (

                          <span className="admin-verified verified">

                            <FiCheckCircle />

                            Verified

                          </span>

                        ) : (

                          <span className="admin-verified not-verified">

                            <FiXCircle />

                            Not Verified

                          </span>

                        )}

                      </td>



                      {/* =====================================
                          VIEW ACTION
                          ===================================== */}

                      <td>

                        <button
                          className="admin-user-view-btn"
                          onClick={() =>
                            handleViewUser(user.id)
                          }
                          title="View User"
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


export default AdminUsers;