import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  FaSearch,
  FaBell,
  FaSun,
  FaMoon,
  FaCode,
  FaTrophy,
  FaPlay,
  FaMedal,
  FaUser,
  FaSignOutAlt,
  FaFire,
  FaFilter,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
} from "react-icons/fa";

import "./Problems.css";

import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";


function Problems() {
  const { theme, toggleTheme } = useTheme();

  // =========================================================
  // STATE
  // =========================================================

  const [problems, setProblems] = useState([]);

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeDifficulty, setActiveDifficulty] =
    useState("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [sortBy, setSortBy] =
    useState("Newest");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [showFilters, setShowFilters] =
    useState(false);


  const problemsPerPage = 6;


  // =========================================================
  // USER DATA
  // =========================================================

  const storedUser = useMemo(() => {

    try {

      return JSON.parse(
        localStorage.getItem("user") || "null"
      );

    } catch (error) {

      console.error(
        "Invalid user data in localStorage",
        error
      );

      return null;
    }

  }, []);


  const userName =
    dashboardData?.fullName ||
    storedUser?.fullName ||
    storedUser?.name ||
    "Coder";


  const userEmail =
    dashboardData?.email ||
    storedUser?.email ||
    "";


  // =========================================================
  // FETCH PROBLEMS + USER DASHBOARD DATA
  // =========================================================

  useEffect(() => {

    const fetchData = async () => {

      setLoading(true);
      setError("");

      try {

        /*
         * Problems API
         *
         * Existing backend endpoint:
         * GET /api/problems
         */

        const problemsResponse =
          await api.get("/api/problems");


        /*
         * Dashboard API
         *
         * Uses JWT from axios interceptor.
         * This gives the currently logged-in user's:
         *
         * - solved problems
         * - submissions
         * - streak
         * - recent submissions
         */

        let dashboardResponse = null;

        try {

          dashboardResponse =
            await api.get("/api/dashboard");

        } catch (dashboardError) {

          console.warn(
            "Dashboard data could not be loaded:",
            dashboardError
          );

        }


        // -----------------------------------------------------
        // PROBLEMS RESPONSE
        // -----------------------------------------------------

        const problemResponseData =
          problemsResponse?.data;


        let problemList = [];


        /*
         * ApiResponse format:
         *
         * {
         *   success: true,
         *   data: [...]
         * }
         *
         * Also support direct array response.
         */

        if (
          Array.isArray(problemResponseData)
        ) {

          problemList =
            problemResponseData;

        } else if (
          Array.isArray(
            problemResponseData?.data
          )
        ) {

          problemList =
            problemResponseData.data;

        }


        setProblems(problemList);


        // -----------------------------------------------------
        // DASHBOARD RESPONSE
        // -----------------------------------------------------

        if (dashboardResponse?.data) {

          setDashboardData(
            dashboardResponse.data
          );

        }

      } catch (err) {

        console.error(
          "Problems page API error:",
          err
        );

        setError(
          "Unable to load problems. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchData();

  }, []);


  // =========================================================
  // NORMALIZE PROBLEM DATA
  // =========================================================

  const normalizedProblems = useMemo(() => {

    return problems.map((problem) => {

      const difficulty =
        String(
          problem?.difficulty || ""
        ).toUpperCase();


      return {

        ...problem,

        id:
          problem?.id,

        title:
          problem?.title ||
          "Untitled Problem",

        description:
          problem?.description ||
          "Solve this coding problem.",

        difficulty:
          difficulty || "UNKNOWN",

        topic:
          problem?.topic ||
          problem?.category ||
          "",

        category:
          problem?.category ||
          problem?.topic ||
          "General",

        acceptance:
          problem?.acceptance ??
          problem?.acceptanceRate ??
          "—",

        solved:
          problem?.solved ??
          problem?.solvedCount ??
          0,

        xp:
          problem?.xp ??
          0,

        isNew:
          problem?.isNew ?? false,

      };

    });

  }, [problems]);


  // =========================================================
  // PROBLEM STATISTICS
  // =========================================================

  const totalProblems =
    normalizedProblems.length;


  const easyProblems =
    normalizedProblems.filter(
      (problem) =>
        problem.difficulty === "EASY"
    ).length;


  const mediumProblems =
    normalizedProblems.filter(
      (problem) =>
        problem.difficulty === "MEDIUM"
    ).length;


  const hardProblems =
    normalizedProblems.filter(
      (problem) =>
        problem.difficulty === "HARD"
    ).length;


  const solvedProblems =
    dashboardData?.totalProblemSolved ??
    0;


  const totalSubmissions =
    dashboardData?.totalSubmission ??
    0;


  const currentStreak =
    dashboardData?.currentStreak ??
    0;


  // =========================================================
  // ACCEPTED SUBMISSIONS
  // =========================================================

  const acceptedSubmissions =
    useMemo(() => {

      const languageUsage =
        dashboardData?.languageUsage || [];


      return languageUsage.reduce(
        (total, item) =>
          total +
          Number(
            item?.acceptedCount || 0
          ),
        0
      );

    }, [dashboardData]);


  // =========================================================
  // ACCEPTANCE RATE
  // =========================================================

  const acceptanceRate =
    totalSubmissions > 0
      ? Math.round(
          (acceptedSubmissions /
            totalSubmissions) *
            100
        )
      : 0;


  // =========================================================
  // FILTER + SEARCH + SORT
  // =========================================================

  const filteredProblems = useMemo(() => {

    let result = [
      ...normalizedProblems,
    ];


    // -------------------------------------------------------
    // DIFFICULTY
    // -------------------------------------------------------

    if (
      activeDifficulty !== "All"
    ) {

      result =
        result.filter(
          (problem) =>
            problem.difficulty ===
            activeDifficulty.toUpperCase()
        );

    }


    // -------------------------------------------------------
    // SEARCH
    // -------------------------------------------------------

    const search =
      searchTerm.trim().toLowerCase();


    if (search !== "") {

      result =
        result.filter((problem) => {
          // Search all fields users may use to identify a problem.
          // Backend versions can return tags/topics as strings or arrays.
          const searchableText = [
            problem.title,
            problem.slug,
            problem.description,
            problem.topic,
            problem.category,
            problem.tags,
            problem.topics,
            problem.companies,
          ]
            .flatMap((value) => Array.isArray(value) ? value : [value])
            .filter((value) => value !== null && value !== undefined)
            .map((value) => String(value).toLocaleLowerCase())
            .join(" ");

          return searchableText.includes(search);

        });

    }


    // -------------------------------------------------------
    // SORT
    // -------------------------------------------------------

    if (sortBy === "Name") {

      result.sort(
        (a, b) =>
          a.title.localeCompare(
            b.title
          )
      );

    }


    else if (
      sortBy === "Easy First"
    ) {

      const order = {
        EASY: 1,
        MEDIUM: 2,
        HARD: 3,
        UNKNOWN: 4,
      };


      result.sort(
        (a, b) =>
          order[a.difficulty] -
          order[b.difficulty]
      );

    }


    else if (
      sortBy === "Hard First"
    ) {

      const order = {
        EASY: 1,
        MEDIUM: 2,
        HARD: 3,
        UNKNOWN: 4,
      };


      result.sort(
        (a, b) =>
          order[b.difficulty] -
          order[a.difficulty]
      );

    }


    else if (
      sortBy === "Oldest"
    ) {

      result.sort(
        (a, b) =>
          Number(a.id || 0) -
          Number(b.id || 0)
      );

    }


    else {

      // Newest

      result.sort(
        (a, b) =>
          Number(b.id || 0) -
          Number(a.id || 0)
      );

    }


    return result;

  }, [
    normalizedProblems,
    activeDifficulty,
    searchTerm,
    sortBy,
  ]);


  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredProblems.length /
          problemsPerPage
      )
    );


  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages
    );


  const startIndex =
    (safeCurrentPage - 1) *
    problemsPerPage;


  const visibleProblems =
    filteredProblems.slice(
      startIndex,
      startIndex +
        problemsPerPage
    );


  // =========================================================
  // HANDLERS
  // =========================================================

  const handleDifficultyChange =
    (difficulty) => {

      setActiveDifficulty(
        difficulty
      );

      setCurrentPage(1);

    };


  const handleSearchChange =
    (event) => {

      setSearchTerm(
        event.target.value
      );

      setCurrentPage(1);

    };


  const handleSortChange =
    (event) => {

      setSortBy(
        event.target.value
      );

      setCurrentPage(1);

    };


  const clearFilters = () => {

    setActiveDifficulty("All");

    setSearchTerm("");

    setSortBy("Newest");

    setCurrentPage(1);

  };


  // =========================================================
  // DIFFICULTY CLASS
  // =========================================================

  const getDifficultyClass =
    (difficulty) => {

      return String(
        difficulty || "unknown"
      ).toLowerCase();

    };


  // =========================================================
  // DISPLAY VALUE
  // =========================================================

  const displayValue =
    (value) => {

      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {

        return "—";

      }

      return value;

    };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href =
      "/login";

  };


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <section className="problems-page">


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="problems-sidebar">


        {/* LOGO */}

        <div className="problems-logo">

          <div className="problems-logo-icon">

            &lt;/&gt;

          </div>

          <span>

            Code<span>Arena</span>

          </span>

        </div>


        {/* NAVIGATION */}

        <p className="problems-nav-title">
          NAVIGATION
        </p>


        <nav className="problems-nav">


          <Link
            to="/leaderboard"
            className="problems-nav-item"
          >

            <FaMedal />

            <span>
              Leaderboard
            </span>

          </Link>


          <Link
            to="/dashboard"
            className="problems-nav-item notification-nav"
          >

            <FaBell />

            <span>
              Notifications
            </span>

            <small>
              3
            </small>

          </Link>


        </nav>


        <div className="problems-sidebar-divider"></div>


        {/* ACCOUNT */}

        <p className="problems-nav-title">
          ACCOUNT
        </p>


        <nav className="problems-nav">


          <Link
            to="/profile"
            className="problems-nav-item"
          >

            <FaUser />

            <span>
              Profile
            </span>

          </Link>


          <button
            type="button"
            className="problems-nav-item logout"
            onClick={handleLogout}
          >

            <FaSignOutAlt />

            <span>
              Logout
            </span>

          </button>


        </nav>


        {/* KEEP CODING CARD */}

        <div className="problems-sidebar-card">

          <div className="problems-sidebar-card-icon">

            <FaFire />

          </div>

          <div>

            <strong>
              Keep Coding 🔥
            </strong>

            <p>
              {currentStreak > 0
                ? `${currentStreak} day streak`
                : "Build your streak."}
            </p>

          </div>

        </div>


      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="problems-main">


        {/* ===================================================
            TOPBAR
        =================================================== */}

        <header className="problems-topbar">


          <div className="problems-search">

            <FaSearch />

            <input
              type="text"
              aria-label="Search problems by name, topic, or keyword"
              placeholder="Search problems, topics..."
              value={searchTerm}
              onChange={
                handleSearchChange
              }
            />

            <span>
              Ctrl K
            </span>

          </div>


          <div className="problems-top-actions">


            <button type="button" className="problems-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">{theme === "dark" ? <FaSun /> : <FaMoon />}</button>


            <button
              type="button"
              className="problems-icon-btn problems-bell"
            >

              <FaBell />

              <small>
                3
              </small>

            </button>


            <div className="problems-profile">


              <div className="problems-avatar">

                {userName
                  .charAt(0)
                  .toUpperCase()}

              </div>


              <div>

                <strong>
                  {userName}
                </strong>

                <span>
                  {userEmail || "Developer"}
                </span>

              </div>


              <FaChevronDown />


            </div>


          </div>


        </header>


        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <div className="problems-content">


          {/* =================================================
              HERO
          ================================================= */}

          <section className="problems-hero">


            <div>

              <p className="problems-eyebrow">
                CODE CHALLENGES
              </p>


              <h1>

                Sharpen Your{" "}

                <span>
                  Skills.
                </span>

              </h1>


              <p>
                Solve coding problems, master DSA and
                prepare for your next opportunity.
              </p>

            </div>


            {/* STREAK */}

            <div className="problems-streak">


              <div className="streak-icon">

                <FaFire />

              </div>


              <div>

                <strong>
                  {currentStreak}
                </strong>

                <span>
                  Day Streak
                </span>

              </div>


            </div>


          </section>


          {/* =================================================
              STATS
          ================================================= */}

          <section className="problems-stats">


            {/* TOTAL PROBLEMS */}

            <div className="problem-stat">


              <div className="stat-icon blue">

                <FaCode />

              </div>


              <div>

                <span>
                  Total Problems
                </span>

                <strong>

                  {loading
                    ? "..."
                    : totalProblems}

                </strong>

              </div>


            </div>


            {/* SOLVED */}

            <div className="problem-stat">


              <div className="stat-icon green">

                ✓

              </div>


              <div>

                <span>
                  Solved
                </span>

                <strong>

                  {loading
                    ? "..."
                    : solvedProblems}

                </strong>

              </div>


            </div>


            {/* EASY */}

            <div className="problem-stat">


              <div className="stat-icon orange">

                <FaFire />

              </div>


              <div>

                <span>
                  Easy
                </span>

                <strong>

                  {loading
                    ? "..."
                    : easyProblems}

                </strong>

              </div>


            </div>


            {/* SUBMISSIONS */}

            <div className="problem-stat">


              <div className="stat-icon purple">

                <FaTrophy />

              </div>


              <div>

                <span>
                  Submissions
                </span>

                <strong>

                  {loading
                    ? "..."
                    : totalSubmissions}

                </strong>

              </div>


            </div>


          </section>


          {/* =================================================
              FILTER BAR
          ================================================= */}

          <section className="problems-filter-bar">


            <div className="difficulty-tabs">


              {[
                "All",
                "Easy",
                "Medium",
                "Hard",
              ].map(
                (difficulty) => (

                  <button
                    key={difficulty}
                    type="button"
                    className={
                      activeDifficulty ===
                      difficulty
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      handleDifficultyChange(
                        difficulty
                      )
                    }
                  >

                    {difficulty === "All"
                      ? "All Problems"
                      : difficulty}

                  </button>

                )
              )}


            </div>


            <div className="problem-filter-actions">


              <button
                type="button"
                className="filter-button"
                onClick={() =>
                  setShowFilters(
                    (previous) =>
                      !previous
                  )
                }
              >

                <FaFilter />

                Filters

              </button>


              <div className="sort-wrapper">

                <span>
                  Sort:
                </span>


                <select
                  value={sortBy}
                  onChange={
                    handleSortChange
                  }
                >

                  <option value="Newest">
                    Newest
                  </option>

                  <option value="Oldest">
                    Oldest
                  </option>

                  <option value="Name">
                    Name
                  </option>

                  <option value="Easy First">
                    Easy First
                  </option>

                  <option value="Hard First">
                    Hard First
                  </option>

                </select>

              </div>


            </div>


          </section>


          {/* =================================================
              FILTER INFORMATION
          ================================================= */}

          {showFilters && (

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                padding: "10px 14px",
                marginBottom: "12px",
                borderRadius: "10px",
                background:
                  "rgba(20, 35, 60, 0.55)",
                border:
                  "1px solid rgba(80, 150, 220, 0.15)",
              }}
            >

              <span
                style={{
                  fontSize: "13px",
                  opacity: 0.75,
                }}
              >

                {activeDifficulty !== "All"
                  ? `Difficulty: ${activeDifficulty}`
                  : "All difficulties"}

                {searchTerm
                  ? ` • Search: ${searchTerm}`
                  : ""}

              </span>


              <button
                type="button"
                onClick={clearFilters}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#43b8ff",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >

                Clear Filters

              </button>


            </div>

          )}


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div
              style={{
                padding: "14px",
                marginBottom: "14px",
                borderRadius: "10px",
                background:
                  "rgba(255, 70, 70, 0.08)",
                border:
                  "1px solid rgba(255, 70, 70, 0.2)",
                color: "#ff8b8b",
              }}
            >

              {error}

            </div>

          )}


          {/* =================================================
              PROBLEM LIST
          ================================================= */}

          <section className="problems-list-container">


            <div className="problems-list-header">


              <div>

                <p>
                  PROBLEMS
                </p>

                <h2>
                  Start Solving
                </h2>

              </div>


              <span>

                {loading
                  ? "Loading..."
                  : `${filteredProblems.length} problems`}

              </span>


            </div>


            {/* TABLE HEADER */}

            <div className="problem-table-head">

              <span>
                #
              </span>

              <span>
                Problem
              </span>

              <span>
                Difficulty
              </span>

              <span>
                Topics
              </span>

              <span>
                Acceptance
              </span>

              <span>
                Solved
              </span>

              <span>
                XP
              </span>

              <span></span>

            </div>


            {/* PROBLEMS */}

            <div className="problem-rows">


              {loading ? (

                <div className="no-problems">

                  <FaSearch />

                  <h3>
                    Loading problems...
                  </h3>

                  <p>
                    Fetching problems from CodeArena.
                  </p>

                </div>

              ) : visibleProblems.length > 0 ? (

                visibleProblems.map(
                  (problem, index) => (

                    <div
                      className="problem-row"
                      key={problem.id}
                    >


                      {/* NUMBER */}

                      <span className="problem-number">

                        {startIndex +
                          index +
                          1}
                        .

                      </span>


                      {/* PROBLEM */}

                      <div className="problem-name">


                        <FaStar />


                        <div>


                          <Link
                            to={`/problems/${problem.id}`}
                          >

                            {problem.title}

                          </Link>


                          {problem.isNew && (

                            <small>
                              New
                            </small>

                          )}


                          <p>

                            {problem.description}

                          </p>


                        </div>


                      </div>


                      {/* DIFFICULTY */}

                      <span
                        className={`difficulty ${getDifficultyClass(
                          problem.difficulty
                        )}`}
                      >

                        {displayValue(
                          problem.difficulty
                        )}

                      </span>


                      {/* TOPIC */}

                      <span className="topic-tag">

                        {displayValue(
                          problem.category
                        )}

                      </span>


                      {/* ACCEPTANCE */}

                      <span className="acceptance">

                        {displayValue(
                          problem.acceptance
                        )}

                      </span>


                      {/* SOLVED */}

                      <span className="solved-count">

                        {displayValue(
                          problem.solved
                        )}

                      </span>


                      {/* XP */}

                      <span className="xp">

                        {Number(
                          problem.xp || 0
                        )}{" "}

                        ⚡

                      </span>


                      {/* SOLVE */}

                      <Link
                        to={`/problems/${problem.id}`}
                        className="solve-button"
                      >

                        <FaPlay />

                      </Link>


                    </div>

                  )
                )

              ) : (

                <div className="no-problems">

                  <FaSearch />

                  <h3>
                    No problems found
                  </h3>

                  <p>
                    Try another search or difficulty.
                  </p>

                </div>

              )}


            </div>


            {/* =================================================
                PAGINATION
            ================================================= */}

            <div className="problem-pagination">


              <span>

                Showing{" "}

                {filteredProblems.length === 0
                  ? 0
                  : startIndex + 1}

                {" - "}

                {Math.min(
                  startIndex +
                    problemsPerPage,
                  filteredProblems.length
                )}

                {" "}of{" "}

                {filteredProblems.length}

              </span>


              <div className="pagination-buttons">


                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={
                    safeCurrentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      safeCurrentPage - 1
                    )
                  }
                >

                  <FaChevronLeft />

                </button>


                {/* PAGE NUMBERS */}

                {Array.from(
                  {
                    length:
                      totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map(
                  (page) => (

                    <button
                      type="button"
                      key={page}
                      className={
                        safeCurrentPage ===
                        page
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                    >

                      {page}

                    </button>

                  )
                )}


                {/* NEXT */}

                <button
                  type="button"
                  disabled={
                    safeCurrentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      safeCurrentPage + 1
                    )
                  }
                >

                  <FaChevronRight />

                </button>


              </div>


            </div>


          </section>


        </div>


      </main>


    </section>

  );

}


export default Problems;
