import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  FiHome,
  FiCode,
  FiUsers,
  FiFileText,
  FiAward,
  FiMessageSquare,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiCalendar,
  FiEye,
  FiEdit3,
  FiTrash2,
  FiUserPlus,
  FiFile,
  FiTerminal,
  FiMenu,
} from "react-icons/fi";

import "./AdminDashboard.css";

function AdminDashboard() {

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    const readList = (response) => {
      const body = response?.data;
      const payload = body?.data ?? body;
      return Array.isArray(payload) ? payload : [];
    };
    Promise.all([
      api.get("/api/users"),
      api.get("/api/problems"),
      api.get("/api/submissions"),
    ]).then(([userResponse, problemResponse, submissionResponse]) => {
      if (!active) return;
      setUsers(readList(userResponse));
      setProblems(readList(problemResponse));
      setSubmissions(readList(submissionResponse));
    }).catch((error) => {
      if (active) setLoadError(error.response?.data?.message || "Admin data could not be loaded.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const stats = [
    { title: "Total Users", value: users.length, growth: "Live", icon: <FiUsers />, type: "purple" },
    { title: "Total Problems", value: problems.length, growth: "Live", icon: <FiFile />, type: "blue" },
    { title: "Total Submissions", value: submissions.length, growth: "Live", icon: <FiTerminal />, type: "green" },
    { title: "Accepted Submissions", value: submissions.filter((item) => item.status === "ACCEPTED").length, growth: "Live", icon: <FiAward />, type: "orange" },
  ];

  const problemRows = useMemo(() => problems.slice(0, 5).map((problem) => {
    const related = submissions.filter((item) => Number(item.problemId) === Number(problem.id));
    const accepted = related.filter((item) => item.status === "ACCEPTED").length;
    return {
      ...problem,
      submissions: related.length,
      acceptance: related.length ? `${Math.round((accepted / related.length) * 100)}%` : "—",
    };
  }), [problems, submissions]);

  const activities = submissions.slice(0, 5).map((submission) => {
    const problem = problems.find((item) => Number(item.id) === Number(submission.problemId));
    return {
      icon: <FiTerminal />,
      type: submission.status === "ACCEPTED" ? "green" : "blue",
      title: `Submission ${submission.status?.toLowerCase().replaceAll("_", " ") ?? "received"}`,
      description: `User ${submission.userId ?? "—"} · ${problem?.title ?? `Problem #${submission.problemId}`}`,
      time: submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : "",
    };
  });

  const dailyActivity = useMemo(() => {
    const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      return { date: dateKey(date), total: 0, accepted: 0 };
    });
    const lookup = new Map(days.map((day) => [day.date, day]));
    submissions.forEach((submission) => {
      if (!submission.submittedAt) return;
      const day = lookup.get(dateKey(new Date(submission.submittedAt)));
      if (!day) return;
      day.total += 1;
      if (submission.status === "ACCEPTED") day.accepted += 1;
    });
    return days;
  }, [submissions]);

  const chartMax = Math.max(1, ...dailyActivity.map((day) => day.total));
  const chartX = (index) => (index / (dailyActivity.length - 1)) * 600;
  const chartY = (value) => 180 - (value / chartMax) * 150;
  const totalPoints = dailyActivity.map((day, index) => `${chartX(index)},${chartY(day.total)}`).join(" ");
  const acceptedPoints = dailyActivity.map((day, index) => `${chartX(index)},${chartY(day.accepted)}`).join(" ");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="admin-dashboard">

      {/* ================= SIDEBAR ================= */}
      <aside className="admin-sidebar">

        <div className="sidebar-logo">
          <div className="logo-symbol">
            <FiCode />
          </div>

          <div className="logo-text">
            Code<span>Arena</span>
          </div>

          <div className="sidebar-divider" />

        </div>

        <nav className="sidebar-nav">


          <button className="sidebar-item active">
            <FiHome />
            <span>Dashboard</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/admin/problems")}
          >
            <FiCode />
            <span>Problems</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/admin/users")}
          >
            <FiUsers />
            <span>Users</span>
          </button>

         <button
  className="sidebar-item"
  onClick={() => navigate("/admin/submissions")}
>
  <FiFileText />
  <span>Submissions</span>
</button>

        <button
  className="sidebar-item"
  onClick={() => navigate("/admin/contests")}
>
  <FiAward />
  <span>Contests</span>
</button>

          <button className="sidebar-item">
            <FiMessageSquare />
            <span>Discussions</span>
          </button>

          <button className="sidebar-item">
            <FiBarChart2 />
            <span>Reports</span>
          </button>

          <button className="sidebar-item">
            <FiSettings />
            <span>Settings</span>
          </button>

        </nav>

  <button
  className="logout-button"
  onClick={handleLogout}
>
  <FiLogOut />
  <span>Logout</span>
</button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="admin-main">

        {/* TOP HEADER */}
        <header className="admin-header">

          <div className="header-spacer" />

          <div className="header-right">

            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search..."
              />
            </div>

            <button className="notification-button">
              <FiBell />
              <span>{submissions.filter((submission) => submission.status === "PENDING").length}</span>
            </button>

            <div className="admin-profile">

              <div className="admin-avatar">
                <FiUsers />
              </div>

              <div className="admin-info">
                <strong>Admin</strong>
                <small>Super Admin</small>
              </div>

              <FiChevronDown className="profile-arrow" />

            </div>

          </div>

        </header>

        {/* PAGE TITLE */}
        <section className="page-heading">

          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, Admin! </p>
          </div>

          <button className="date-filter">
            <FiCalendar />
            <span>Live data</span>
            <FiChevronDown />
          </button>

        </section>

        {/* ================= OVERVIEW ================= */}
        <section className="dashboard-section overview-section">

          <h2>Overview</h2>
          {loadError && <p role="alert" style={{ color: "var(--danger-color, #ef4444)" }}>{loadError}</p>}

          <div className="stats-grid">

            {stats.map((stat) => (
              <div
                className={`stat-card ${stat.type}`}
                key={stat.title}
              >

                <div className="stat-top">

                  <div className={`stat-icon ${stat.type}`}>
                    {stat.icon}
                  </div>

                  <div className="stat-content">
                    <p>{stat.title}</p>
                    <h3>{stat.value}</h3>
                  </div>

                </div>

                <div className="growth">
                  <span>{loading ? "Loading" : loadError ? "Unavailable" : stat.growth}</span>
                  <small>from backend</small>
                </div>

              </div>
            ))}

          </div>

        </section>

        {/* ================= MIDDLE SECTION ================= */}
        <div className="middle-grid">

          {/* SUBMISSION OVERVIEW */}
          <section className="dashboard-card submission-card">

            <div className="card-heading">
              <h2>Submission Overview</h2>

              <span className="period-select">Last 7 Days</span>
            </div>

            <div className="large-chart">

              <div className="chart-y-axis">
                <span>{chartMax}</span>
                <span>{Math.round(chartMax * 0.75)}</span>
                <span>{Math.round(chartMax * 0.5)}</span>
                <span>{Math.round(chartMax * 0.25)}</span>
                <span>0</span>
              </div>

              <div className="chart-area">

                <div className="chart-grid-line line-1" />
                <div className="chart-grid-line line-2" />
                <div className="chart-grid-line line-3" />
                <div className="chart-grid-line line-4" />
                <div className="chart-grid-line line-5" />

                <svg
                  className="submission-svg"
                  viewBox="0 0 600 200"
                  preserveAspectRatio="none"
                >

                  <polyline className="total-line" points={totalPoints} />
                  <polyline className="accepted-line" points={acceptedPoints} />
                  {dailyActivity.map((day, index) => (
                    <g key={day.date}>
                      <circle className="total-dot" cx={chartX(index)} cy={chartY(day.total)} r="4" />
                      <circle className="accepted-dot" cx={chartX(index)} cy={chartY(day.accepted)} r="4" />
                    </g>
                  ))}
                </svg>

                <div className="chart-x-axis">
                  {dailyActivity.map((day) => <span key={day.date}>{new Date(`${day.date}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>)}
                </div>

              </div>

            </div>

            <div className="chart-legend">

              <div>
                <i className="legend-purple" />
                Total Submissions
              </div>

              <div>
                <i className="legend-green" />
                Accepted Submissions
              </div>

            </div>

          </section>

          {/* RECENT ACTIVITY */}
          <section className="dashboard-card activity-card">

            <div className="card-heading">
              <h2>Recent Activity</h2>
              <button className="view-all" onClick={() => navigate("/admin/submissions")}>View All</button>
            </div>

            <div className="activity-list">

              {activities.length ? activities.map((activity, index) => (
                <div
                  className="activity-item"
                  key={index}
                >

                  <div className={`activity-icon ${activity.type}`}>
                    {activity.icon}
                  </div>

                  <div className="activity-content">
                    <strong>{activity.title}</strong>
                    <p>{activity.description}</p>
                  </div>

                  <span className="activity-time">
                    {activity.time}
                  </span>

                </div>
              )) : <p className="empty-activity">{loading ? "Loading activity…" : "No submissions yet."}</p>}

            </div>

          </section>

        </div>

        {/* ================= RECENT PROBLEMS ================= */}
        <section className="dashboard-card problems-card">

          <div className="card-heading">
            <h2>Recent Problems</h2>
            <button className="view-all" onClick={() => navigate("/admin/problems")}>View All</button>
          </div>

          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Category</th>
                  <th>Submissions</th>
                  <th>Acceptance Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {problemRows.map((problem) => (
                  <tr key={problem.id}>

                    <td>{problem.id}</td>

                    <td className="problem-title">
                      {problem.title}
                    </td>

                    <td>
                      <span
                        className={`difficulty ${problem.difficulty.toLowerCase()}`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>

                    <td>{problem.category}</td>

                    <td>{problem.submissions}</td>

                    <td>{problem.acceptance}</td>

                    <td>
                      <div className="action-buttons">

                        <button className="action view" aria-label={`View ${problem.title}`} onClick={() => navigate(`/problems/${problem.id}`)}>
                          <FiEye />
                        </button>

                        <button className="action edit" aria-label={`Edit ${problem.title}`} onClick={() => navigate(`/admin/problems/edit/${problem.id}`)}>
                          <FiEdit3 />
                        </button>

                        <button className="action delete" aria-label={`Manage ${problem.title}`} onClick={() => navigate("/admin/problems")}>
                          <FiTrash2 />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
                {!loading && problemRows.length === 0 && <tr><td colSpan="7">{loadError || "No problems available yet."}</td></tr>}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;
