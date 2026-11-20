import "./Footer.css";

import { Link } from "react-router-dom";

import {
    FaCode,
    FaArrowRight
} from "react-icons/fa";

function Footer() {

    return (

        <footer className="footer">

            <div className="container">

                <div className="footer-wrapper">

                    {/* ================= MAIN ================= */}

                    <div className="footer-main">

                        {/* LEFT */}

                        <div className="footer-left">

                            <span className="footer-tag">
                                GET STARTED
                            </span>

                            <h2>
                                Start Your Coding Journey.
                            </h2>

                            <p>
                                Practice coding, solve real interview
                                questions, improve your problem solving
                                skills and become placement ready with
                                CodeArena.
                            </p>

                            <div className="footer-buttons">

                                <Link
                                    to="/problems"
                                    className="btn btn-primary"
                                >
                                    Start Coding

                                    <FaArrowRight />

                                </Link>

                            </div>

                        </div>

                        {/* RIGHT */}

                        <div className="footer-right">

                            {/* Brand */}

                            <div className="footer-brand">

                                <div className="footer-logo">

                                    <FaCode />

                                    <h3>CodeArena</h3>

                                </div>

                                <p>

                                    One platform to practice coding,
                                    prepare for placements and crack
                                    technical interviews.

                                </p>

                            </div>

                            {/* Platform */}

                            <div className="footer-links-card">

                                <h4>Platform</h4>

                                <Link to="/problems">
                                    Problems
                                </Link>

                                <Link to="/leaderboard">
                                    Leaderboard
                                </Link>

                                <Link to="/problems">
                                    AI Code Review
                                </Link>

                                <Link to="/problems">
                                    Coding Contests
                                </Link>

                                <Link to="/problems">
                                    Company Questions
                                </Link>

                            </div>

                            {/* Resources */}

                            <div className="footer-links-card">

                                <h4>Resources</h4>

                                <a href="#">
                                    FAQs
                                </a>

                                <a href="#">
                                    Privacy Policy
                                </a>

                                <a href="#">
                                    Terms & Conditions
                                </a>

                                <a href="#">
                                    Support
                                </a>

                            </div>

                        </div>

                    </div>

                    {/* Divider */}

                    <div className="footer-divider"></div>

                    {/* Bottom */}

                    <div className="footer-bottom">

                        <p>

                            © 2026 CodeArena • Built with ❤️ using
                            React • Spring Boot • MySQL

                        </p>

                    </div>

                </div>

            </div>

        </footer>

    );

}

export default Footer;
