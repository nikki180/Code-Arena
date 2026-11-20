import "./Explore.css";

import { Link } from "react-router-dom";

import {
  FaCode,
  FaBuilding,
  FaBolt,
  FaTrophy,
  FaArrowRight,
  FaLaptopCode,
  FaCheckCircle,
} from "react-icons/fa";

function Explore() {
  return (
    <section id="explore">

      <div className="container">

        {/* ================= HEADER ================= */}

        <div className="explore-header">

          <h2>
            Master Coding. Crack Placements.
          </h2>

          <p>
            Practice DSA, prepare for top companies, improve your
            coding skills and compete with developers — all from
            one modern platform.
          </p>

        </div>


        {/* ================= FEATURED SECTION ================= */}

        <div className="featured-card">

          <div className="featured-left">

            <span className="featured-badge">
              <FaLaptopCode />
              Featured Platform
            </span>

            <h3>
              Everything You Need
              To Become Interview Ready.
            </h3>

            <p>
              From beginner to placement ready, CodeArena gives
              you all the tools required to become a better
              software engineer.
            </p>


            <div className="feature-list">

              <div className="feature-item">
                <FaCheckCircle />
                <span>1500+ Coding Problems</span>
              </div>

              <div className="feature-item">
                <FaCheckCircle />
                <span>Company Specific Questions</span>
              </div>

              <div className="feature-item">
                <FaCheckCircle />
                <span>Weekly Coding Challenges</span>
              </div>

              <div className="feature-item">
                <FaCheckCircle />
                <span>AI Powered Learning</span>
              </div>

            </div>


            <Link
              to="/problems"
              className="btn btn-primary"
            >
              Explore DSA

              <FaArrowRight />

            </Link>

          </div>


          <div className="featured-right">

            <div className="dashboard-window">

              <div className="window-header">

                <span></span>
                <span></span>
                <span></span>

              </div>


              <div className="dashboard-body">

                <div className="dashboard-card">

                  <h4>Problems Solved</h4>

                  <strong>154</strong>

                </div>


                <div className="dashboard-card">

                  <h4>Current Streak</h4>

                  <strong>28 Days</strong>

                </div>


                <div className="dashboard-card">

                  <h4>Global Rank</h4>

                  <strong>#321</strong>

                </div>


                <div className="dashboard-card">

                  <h4>Accuracy</h4>

                  <strong>91%</strong>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================= EXPLORE CARDS ================= */}

        <div className="explore-grid">


          {/* DSA SHEET */}

          <Link
            to="/problems"
            className="explore-card"
          >

            <div className="explore-icon">
              <FaCode />
            </div>

            <h4>DSA Sheet</h4>

            <p>
              Follow a structured DSA sheet with 100+
              carefully selected problems and track your
              problem-solving progress.
            </p>

            <span>
              Start DSA
              <FaArrowRight />
            </span>

          </Link>


          {/* COMPANY QUESTIONS */}

          <Link
            to="/problems"
            className="explore-card"
          >

            <div className="explore-icon">
              <FaBuilding />
            </div>

            <h4>Company Questions</h4>

            <p>
              Practice interview questions asked by Google,
              Amazon, Microsoft and many more companies.
            </p>

            <span>
              Explore
              <FaArrowRight />
            </span>

          </Link>


          {/* CODING CONTESTS */}

          <Link
            to="/contests"
            className="explore-card"
          >

            <div className="explore-icon">
              <FaBolt />
            </div>

            <h4>Coding Contests</h4>

            <p>
              Participate in weekly contests, improve speed,
              compete and earn achievement badges.
            </p>

            <span>
              Join Contest
              <FaArrowRight />
            </span>

          </Link>


          {/* LEADERBOARD */}

          <Link
            to="/leaderboard"
            className="explore-card"
          >

            <div className="explore-icon">
              <FaTrophy />
            </div>

            <h4>Leaderboard</h4>

            <p>
              Compare your rankings with thousands of learners
              and stay motivated every single day.
            </p>

            <span>
              View Rankings
              <FaArrowRight />
            </span>

          </Link>


        </div>

      </div>

    </section>
  );
}

export default Explore;