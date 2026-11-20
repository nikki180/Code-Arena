import "./About.css";
import { FaCheckCircle } from "react-icons/fa";

function About() {
    return (
        <section className="about" id="about">

            <div className="container about-wrapper">

                {/* LEFT */}

                <div className="about-left">

                    <span className="about-tag">
                        ABOUT CODEARENA
                    </span>

                    <h2>
                        Learn Faster.
                        <span> Practice Smarter.</span>
                    </h2>

                    <p className="about-text">
                        CodeArena is a modern coding platform built for students
                        preparing for internships, placements and software
                        engineering interviews.
                    </p>

                    <p className="about-text">
                        Practice real coding questions, improve your
                        problem-solving skills, analyse your progress and become
                        interview ready—all in one place.
                    </p>

                    <div className="about-list">

                        <div>
                            <FaCheckCircle />
                            Curated Coding Problems
                        </div>

                        <div>
                            <FaCheckCircle />
                            Company Specific Questions
                        </div>

                        <div>
                            <FaCheckCircle />
                            Performance Analytics
                        </div>

                        <div>
                            <FaCheckCircle />
                            AI Powered Learning
                        </div>

                    </div>

                    <div className="about-stats">

                        <div className="stat-item">
                            <h3>10K+</h3>
                            <span>Students</span>
                        </div>

                        <div className="stat-item">
                            <h3>1500+</h3>
                            <span>Problems</span>
                        </div>

                        <div className="stat-item">
                            <h3>95%</h3>
                            <span>Success Rate</span>
                        </div>

                    </div>

                    <button className="btn btn-primary">
                        Explore Platform
                    </button>

                </div>

                {/* RIGHT */}

                <div className="about-right">

                    <div className="dashboard-card">

                        <div className="dashboard-header">

                            <div className="profile">

                                <div className="profile-avatar">
                                    {"</>"}
                                </div>

                                <div>

                                    <h4>CodeArena User</h4>

                                    <p>Placement Journey</p>

                                </div>

                            </div>

                            <span className="online-dot"></span>

                        </div>

                        <div className="dashboard-progress">

                            <div className="progress-info">

                                <span>Interview Readiness</span>

                                <strong>78%</strong>

                            </div>

                            <div className="progress-bar">

                                <div className="progress-fill"></div>

                            </div>

                        </div>

                        <div className="dashboard-stats">

                            <div>
                                <h3>154</h3>
                                <p>Problems</p>
                            </div>

                            <div>
                                <h3>#128</h3>
                                <p>Rank</p>
                            </div>

                            <div>
                                <h3>41</h3>
                                <p>Streak</p>
                            </div>

                        </div>

                        <div className="skills">

                            <span>Java ✓</span>

                            <span>DSA ✓</span>

                            <span>SQL ✓</span>

                            <span>React ✓</span>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default About;