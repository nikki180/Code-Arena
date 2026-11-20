import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";

function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const storedUser = JSON.parse(
          localStorage.getItem("user")
        );

        setUser(storedUser);

        if (!storedUser?.token) {
          console.error("Authentication token not found.");
          setLoading(false);
          return;
        }

        const { data } = await api.get("/api/dashboard");

        setDashboardData(data);

        setUser((previousUser) => ({
          ...previousUser,
          fullName:
            data.fullName ?? previousUser?.fullName,
          email:
            data.email ?? previousUser?.email,
          profileImage:
            data.profileImage ??
            previousUser?.profileImage,
        }));
      } catch (error) {
        console.error(
          "Dashboard API Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // =====================================================
  // USER DATA
  // =====================================================

  const fullName =
    dashboardData?.fullName ||
    user?.fullName ||
    "Coder";

  const email =
    dashboardData?.email ||
    user?.email ||
    "";

  const profileImage =
    dashboardData?.profileImage ||
    user?.profileImage ||
    null;

  // =====================================================
  // DASHBOARD DATA
  // =====================================================

  const totalProblemSolved =
    dashboardData?.totalProblemSolved ?? 0;

  const totalSubmission =
    dashboardData?.totalSubmission ?? 0;

  const currentStreak =
    dashboardData?.currentStreak ?? 0;

  const maxStreak =
    dashboardData?.maxStreak ?? 0;

  const recentSubmissions =
    dashboardData?.recentSubmissions || [];

  const languageUsage =
    dashboardData?.languageUsage || [];

  const submissionHeatmap =
    dashboardData?.submissionHeatmap || [];

  // =====================================================
  // ACCEPTED SUBMISSIONS
  // =====================================================

  const acceptedSubmissions = useMemo(() => {
    return languageUsage.reduce(
      (total, item) =>
        total + (item?.acceptedCount || 0),
      0
    );
  }, [languageUsage]);

  // =====================================================
  // ACCEPTANCE RATE
  // =====================================================

  const acceptanceRate =
    totalSubmission > 0
      ? Math.round(
          (acceptedSubmissions /
            totalSubmission) *
            100
        )
      : 0;

  // =====================================================
  // STREAK PROGRESS
  // =====================================================

  const streakProgress =
    maxStreak > 0
      ? Math.min(
          Math.round(
            (currentStreak /
              maxStreak) *
              100
          ),
          100
        )
      : 0;

  // =====================================================
  // HEATMAP LOOKUP
  // =====================================================

  const activityMap = useMemo(() => {
    return submissionHeatmap.reduce(
      (map, item) => {
        if (item?.date) {
          map[item.date] =
            item.submissionCount || 0;
        }

        return map;
      },
      {}
    );
  }, [submissionHeatmap]);

  // =====================================================
  // DATE KEY
  // =====================================================

  const getDateKey = (
    year,
    monthIndex,
    day
  ) => {
    return `${year}-${String(
      monthIndex + 1
    ).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  // =====================================================
  // ACTIVITY LEVEL
  // =====================================================

  const getActivityLevel = (count) => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 5) return 3;
    return 4;
  };

  // =====================================================
  // FORMAT SUBMISSION TIME
  // =====================================================

  const formatSubmissionTime = (
    dateValue
  ) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString();
  };

  // =====================================================
  // LANGUAGE PROGRESS
  // =====================================================

  const getLanguageRate = (item) => {
    const submissions =
      item?.submissionCount || 0;

    const accepted =
      item?.acceptedCount || 0;

    if (submissions === 0) {
      return 0;
    }

    return Math.round(
      (accepted / submissions) * 100
    );
  };

  // =====================================================
  // MONTHS
  // =====================================================

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="dashboard-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="dashboard-sidebar">

        {/* Logo */}

        <div className="dashboard-logo">

          <span className="dashboard-logo-icon">
            &lt;/&gt;
          </span>

          <span>
            CodeArena
          </span>

        </div>


        {/* Navigation */}

        <nav className="dashboard-nav">

          <p className="dashboard-nav-title">
            NAVIGATION
          </p>


          {/* Home */}

          <Link
            to="/"
            className="dashboard-nav-item"
          >
            <span className="dashboard-nav-icon">
              ⌂
            </span>

            <span>
              Home
            </span>
          </Link>


          {/* Dashboard */}

          <Link
            to="/dashboard"
            className="dashboard-nav-item active"
          >
            <span className="dashboard-nav-icon">
              ⌂
            </span>

            <span>
              Dashboard
            </span>
          </Link>


          {/* Problems */}

          <Link
            to="/problems"
            className="dashboard-nav-item"
          >
            <span className="dashboard-nav-icon">
              &lt;/&gt;
            </span>

            <span>
              Problems
            </span>
          </Link>


          {/* Contests */}

          <Link
            to="/contests"
            className="dashboard-nav-item"
          >
            <span className="dashboard-nav-icon">
              🏆
            </span>

            <span>
              Contests
            </span>
          </Link>


          {/* Leaderboard */}

          <Link
            to="/leaderboard"
            className="dashboard-nav-item"
          >
            <span className="dashboard-nav-icon">
              ♕
            </span>

            <span>
              Leaderboard
            </span>
          </Link>


          {/* Notifications */}

          <Link
            to="/dashboard"
            className="dashboard-nav-item"
          >
            <span className="dashboard-nav-icon">
              ♧
            </span>

            <span>
              Notifications
            </span>

            <span className="dashboard-notification-badge">
              3
            </span>

          </Link>


          <div className="dashboard-nav-divider"></div>


          <p className="dashboard-nav-title">
            ACCOUNT
          </p>


          {/* Profile */}

          <Link
            to="/profile"
            className="dashboard-nav-item"
          >
            <span className="dashboard-nav-icon">
              ♙
            </span>

            <span>
              Profile
            </span>
          </Link>


          {/* Logout */}

          <button
            type="button"
            className="dashboard-nav-item dashboard-logout-btn"
            onClick={handleLogout}
          >
            <span className="dashboard-nav-icon">
              ↪
            </span>

            <span>
              Logout
            </span>
          </button>

        </nav>


        {/* Upgrade Card */}

        <div className="dashboard-sidebar-card">

          <div className="dashboard-sidebar-card-icon">
            🚀
          </div>

          <h3>
            Upgrade to Pro
          </h3>

          <p>
            Better skills.
            <br />
            A brighter future.
          </p>

        </div>

      </aside>


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <main className="dashboard-main">


        {/* =====================================================
            TOP HEADER
        ===================================================== */}

        <header className="dashboard-topbar">

          <div className="dashboard-search">

            <span className="dashboard-search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search problems, topics..."
            />

            <span className="dashboard-search-shortcut">
              Ctrl K
            </span>

          </div>


          <div className="dashboard-top-actions">

            <button className="dashboard-top-icon" type="button" onClick={toggleTheme} aria-label="Toggle theme">{theme === "dark" ? "☀" : "☾"}</button>


            <button className="dashboard-top-icon notification-icon">

              ♧

              <span>
                3
              </span>

            </button>


            <div className="dashboard-profile">

              <div className="dashboard-profile-avatar">

                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                  />
                ) : (
                  fullName
                    ?.charAt(0)
                    .toUpperCase() || "C"
                )}

              </div>


              <div className="dashboard-profile-info">

                <strong>
                  {fullName}
                </strong>

                <span>
                  {email || "Developer"}
                </span>

              </div>


              <span className="dashboard-profile-arrow">
                ▾
              </span>

            </div>

          </div>

        </header>


        {/* =====================================================
            DASHBOARD CONTENT
        ===================================================== */}

        <section className="dashboard-content">


          {/* =====================================================
              WELCOME
          ===================================================== */}

          <div className="dashboard-welcome">

            <div>

              <p className="dashboard-welcome-label">
                YOUR CODING JOURNEY
              </p>

              <h1>
                Welcome back,{" "}
                <span>
                  {fullName}!
                </span>
              </h1>

              <p className="dashboard-welcome-text">
                Keep practicing, keep improving and get one step
                closer to your dream placement.
              </p>

            </div>


            <div className="dashboard-welcome-badge">

              <span className="dashboard-status-dot"></span>

              <span>
                {loading
                  ? "Loading..."
                  : currentStreak > 0
                  ? "You're on track"
                  : "Start your journey"}

              </span>

            </div>

          </div>


          {/* =====================================================
              STATS
          ===================================================== */}

          <div className="dashboard-stats">


            {/* Problems Solved */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-top">

                <span className="dashboard-stat-icon blue">
                  &lt;/&gt;
                </span>

                <span className="dashboard-stat-change">
                  Live
                </span>

              </div>

              <p>
                Problems Solved
              </p>

              <h2>
                {totalProblemSolved}
              </h2>

              <div className="dashboard-stat-progress">

                <span
                  style={{
                    width:
                      totalProblemSolved > 0
                        ? "68%"
                        : "0%",
                  }}
                ></span>

              </div>

            </div>


            {/* Current Streak */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-top">

                <span className="dashboard-stat-icon orange">
                  🔥
                </span>

                <span className="dashboard-stat-change">
                  Best {maxStreak}
                </span>

              </div>

              <p>
                Current Streak
              </p>

              <h2>

                {currentStreak}

                <small>
                  {" "}days
                </small>

              </h2>

              <div className="dashboard-stat-progress">

                <span
                  style={{
                    width:
                      `${streakProgress}%`,
                  }}
                ></span>

              </div>

            </div>


            {/* Total Submissions */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-top">

                <span className="dashboard-stat-icon purple">
                  #
                </span>

                <span className="dashboard-stat-change">
                  Live
                </span>

              </div>

              <p>
                Total Submissions
              </p>

              <h2>
                {totalSubmission}
              </h2>

              <div className="dashboard-stat-progress">

                <span
                  style={{
                    width:
                      totalSubmission > 0
                        ? "68%"
                        : "0%",
                  }}
                ></span>

              </div>

            </div>


            {/* Acceptance Rate */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-top">

                <span className="dashboard-stat-icon cyan">
                  ✓
                </span>

                <span className="dashboard-stat-change">
                  Live
                </span>

              </div>

              <p>
                Acceptance Rate
              </p>

              <h2>
                {acceptanceRate}%
              </h2>

              <div className="dashboard-stat-progress">

                <span
                  style={{
                    width:
                      `${acceptanceRate}%`,
                  }}
                ></span>

              </div>

            </div>

          </div>


          {/* =====================================================
              LEARNING + PERFORMANCE
          ===================================================== */}

          <div className="dashboard-learning-grid">


            {/* =================================================
                LANGUAGE USAGE
            ================================================= */}

            <div className="dashboard-learning-card">

              <div className="dashboard-section-heading">

                <div>

                  <p>
                    LANGUAGE USAGE
                  </p>

                  <h3>
                    Your coding languages
                  </h3>

                </div>

                <span className="dashboard-progress-percent">
                  {languageUsage.length}
                </span>

              </div>


              {languageUsage.length > 0 ? (

                languageUsage
                  .slice(0, 3)
                  .map((item) => {

                    const languageRate =
                      getLanguageRate(item);

                    return (

                      <div
                        className="dashboard-course"
                        key={item.language}
                      >

                        <div className="dashboard-course-icon">

                          {item.language
                            ?.substring(0, 2)
                            .toUpperCase()}

                        </div>


                        <div className="dashboard-course-info">

                          <span>
                            PROGRAMMING LANGUAGE
                          </span>

                          <h4>
                            {item.language}
                          </h4>


                          <div className="dashboard-course-progress">

                            <span
                              style={{
                                width:
                                  `${languageRate}%`,
                              }}
                            ></span>

                          </div>


                          <div className="dashboard-course-meta">

                            <span>
                              {item.submissionCount || 0} submissions
                            </span>

                            <strong>
                              {item.acceptedCount || 0} accepted
                            </strong>

                          </div>

                        </div>


                        <span className="dashboard-continue-btn">

                          {languageRate}%

                        </span>

                      </div>

                    );

                  })

              ) : (

                <div className="dashboard-course">

                  <div className="dashboard-course-icon">
                    &lt;/&gt;
                  </div>

                  <div className="dashboard-course-info">

                    <span>
                      CODING ACTIVITY
                    </span>

                    <h4>
                      No language data yet
                    </h4>

                    <div className="dashboard-course-meta">

                      <span>
                        Start submitting solutions to track your progress.
                      </span>

                    </div>

                  </div>

                </div>

              )}

            </div>


            {/* =================================================
                PERFORMANCE
            ================================================= */}

            <div className="dashboard-progress-card">

              <div className="dashboard-section-heading">

                <div>

                  <p>
                    YOUR PROGRESS
                  </p>

                  <h3>
                    Submission Performance
                  </h3>

                </div>

                <span className="dashboard-progress-percent">
                  {acceptanceRate}%
                </span>

              </div>


              <div
                className="dashboard-progress-circle"
                style={{
                  background:
                    `conic-gradient(
                      #09c7e8 ${acceptanceRate * 3.6}deg,
                      #1c2638 ${acceptanceRate * 3.6}deg
                    )`,
                }}
              >

                <div className="dashboard-progress-inner">

                  <strong>
                    {acceptanceRate}%
                  </strong>

                  <span>
                    Accepted
                  </span>

                </div>

              </div>


              <div className="dashboard-topic-list">


                <div className="dashboard-topic">

                  <span>

                    <i className="topic-dot green"></i>

                    Problems Solved

                  </span>

                  <strong>
                    {totalProblemSolved}
                  </strong>

                </div>


                <div className="dashboard-topic">

                  <span>

                    <i className="topic-dot blue"></i>

                    Total Submissions

                  </span>

                  <strong>
                    {totalSubmission}
                  </strong>

                </div>


                <div className="dashboard-topic">

                  <span>

                    <i className="topic-dot purple"></i>

                    Accepted

                  </span>

                  <strong>
                    {acceptedSubmissions}
                  </strong>

                </div>


                <div className="dashboard-topic">

                  <span>

                    <i className="topic-dot orange"></i>

                    Current Streak

                  </span>

                  <strong>
                    {currentStreak} days
                  </strong>

                </div>


              </div>

            </div>

          </div>


          {/* =====================================================
              YEARLY CODING CALENDAR
          ===================================================== */}

          <div className="yearly-calendar">


            {/* Header */}

            <div className="yearly-calendar-header">

              <div>

                <span className="section-label">
                  CODING ACTIVITY
                </span>

                <h2>
                  Your Coding Journey
                </h2>

                <p>
                  Keep solving problems and build your consistency.
                </p>

              </div>


              <select
                className="year-select"
                value={selectedYear}
                onChange={(event) =>
                  setSelectedYear(
                    Number(event.target.value)
                  )
                }
              >

                <option value={new Date().getFullYear()}>
                  {new Date().getFullYear()}
                </option>

                <option value={new Date().getFullYear() - 1}>
                  {new Date().getFullYear() - 1}
                </option>

                <option value={new Date().getFullYear() - 2}>
                  {new Date().getFullYear() - 2}
                </option>

              </select>

            </div>


            {/* Calendar Content */}

            <div className="yearly-calendar-content">


              {/* Summary */}

              <div className="calendar-summary">

                <div className="calendar-fire">
                  🔥
                </div>

                <h3>
                  {totalProblemSolved}
                </h3>

                <span>
                  problems solved
                </span>

                <strong>

                  {currentStreak}

                  <small>
                    {" "}day streak
                  </small>

                </strong>

                <p>

                  {currentStreak > 0
                    ? "You're on a great run!"
                    : "Start solving problems to build your streak!"}

                </p>

              </div>


              {/* Year Calendar */}

              <div className="year-calendar-horizontal">

                {months.map(
                  (month, monthIndex) => {

                    const daysInMonth =
                      new Date(
                        selectedYear,
                        monthIndex + 1,
                        0
                      ).getDate();

                    return (

                      <div
                        className="calendar-month-column"
                        key={month}
                      >

                        <div className="calendar-month-name">
                          {month}
                        </div>


                        <div className="calendar-month-days">

                          {Array.from(
                            {
                              length:
                                daysInMonth,
                            },
                            (_, dayIndex) => {

                              const day =
                                dayIndex + 1;

                              const dateKey =
                                getDateKey(
                                  selectedYear,
                                  monthIndex,
                                  day
                                );

                              const submissionCount =
                                activityMap[
                                  dateKey
                                ] || 0;

                              const activity =
                                getActivityLevel(
                                  submissionCount
                                );

                              return (

                                <span
                                  key={dayIndex}
                                  className={`activity-level level-${activity}`}
                                  title={`${dateKey} - ${submissionCount} submission${
                                    submissionCount === 1
                                      ? ""
                                      : "s"
                                  }`}
                                ></span>

                              );

                            }
                          )}

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            </div>


            {/* Legend */}

            <div className="calendar-legend">

              <span>
                Less
              </span>

              <i className="level-0"></i>

              <i className="level-1"></i>

              <i className="level-2"></i>

              <i className="level-3"></i>

              <i className="level-4"></i>

              <span>
                More
              </span>

            </div>

          </div>


          {/* =====================================================
              RECENT ACTIVITY + PRACTICE SUMMARY
          ===================================================== */}

          <div className="dashboard-bottom-grid">


            {/* =================================================
                RECENT ACTIVITY
            ================================================= */}

            <div className="dashboard-activity-card">

              <div className="dashboard-section-heading">

                <div>

                  <p>
                    RECENT ACTIVITY
                  </p>

                  <h3>
                    Your latest coding activity
                  </h3>

                </div>

                <button className="dashboard-view-btn">
                  View All
                </button>

              </div>


              <div className="dashboard-activity-list">

                {recentSubmissions.length > 0 ? (

                  recentSubmissions
                    .slice(0, 10)
                    .map((submission) => {

                      const isAccepted =
                        submission?.status ===
                        "ACCEPTED";

                      return (

                        <div
                          className="dashboard-activity-item"
                          key={
                            submission.submissionId
                          }
                        >

                          <div
                            className={`dashboard-activity-icon ${
                              isAccepted
                                ? "solved"
                                : "attempted"
                            }`}
                          >

                            {isAccepted
                              ? "✓"
                              : "→"}

                          </div>


                          <div className="dashboard-activity-info">

                            <strong>

                              {submission?.problemTitle ||
                                "Unknown Problem"}

                            </strong>

                            <span>

                              {isAccepted
                                ? "Solved"
                                : "Attempted"}

                              {submission?.language
                                ? ` • ${submission.language}`
                                : ""}

                            </span>

                          </div>


                          <span className="dashboard-activity-time">

                            {formatSubmissionTime(
                              submission?.submittedAt
                            )}

                          </span>

                        </div>

                      );

                    })

                ) : (

                  <div className="dashboard-activity-item">

                    <div className="dashboard-activity-icon attempted">
                      →
                    </div>

                    <div className="dashboard-activity-info">

                      <strong>
                        No submissions yet
                      </strong>

                      <span>
                        Start solving problems to see your activity here.
                      </span>

                    </div>

                  </div>

                )}

              </div>

            </div>


            {/* =================================================
                PRACTICE SUMMARY
            ================================================= */}

            <div className="dashboard-challenge-card">

              <div className="dashboard-challenge-glow"></div>


              <div className="dashboard-challenge-top">

                <span className="dashboard-challenge-label">
                  PRACTICE SUMMARY
                </span>

                <span className="dashboard-challenge-fire">
                  🔥
                </span>

              </div>


              <h3>
                Keep improving
                <br />
                one submission at a time
              </h3>


              <div className="dashboard-challenge-meta">

                <span className="challenge-medium">
                  {acceptanceRate}% Accepted
                </span>

                <span>
                  {totalSubmission} submissions
                </span>

              </div>


              <p>
                You have solved{" "}
                <strong>
                  {totalProblemSolved}
                </strong>{" "}
                problems so far. Keep practicing to improve
                your consistency and coding skills.
              </p>


              <Link
                to="/problems"
                className="dashboard-challenge-btn"
              >

                Solve Problems

                <span>
                  →
                </span>

              </Link>


              <div className="dashboard-challenge-streak">

                <span className="challenge-streak-dot"></span>

                <span>
                  {currentStreak} day streak
                </span>

                <span className="challenge-streak-line"></span>

                <span>
                  Best {maxStreak}
                </span>

              </div>

            </div>

          </div>


        </section>

      </main>

    </section>
  );
}

export default Dashboard;
