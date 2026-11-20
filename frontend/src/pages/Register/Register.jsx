import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCode,
  FaRocket,
  FaTrophy,
  FaChartLine,
} from "react-icons/fa";

import Navbar from "../../components/Navbar/Navbar";
import api from "../../api/axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!termsAccepted) {
      setErrorMessage("Please accept the Terms & Conditions to continue.");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await api.post("/api/auth/register", {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      if (data?.success) {
        setSuccessMessage("Registration successful!");

        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        navigate("/login");

      } else {
        setErrorMessage(data?.message || "Registration failed. Please try again.");
      }

    } catch (error) {
      console.error("Register Error:", error);
      setErrorMessage(
        error.response?.data?.message ||
        (error.response ? "Registration failed. Please check your details." : "Unable to connect to CodeArena. Check the API URL and try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      {/* ================================
NAVBAR
================================= */}

      <Navbar />

      {/* ================================
      REGISTER PAGE
  ================================= */}

      <section className="register-page">

        {/* Background Glow */}

        <div className="register-bg-glow glow-one"></div>
        <div className="register-bg-glow glow-two"></div>


        {/* ================================
        MAIN CONTAINER
    ================================= */}

        <div className="register-container">


          {/* ================================
          LEFT SIDE
      ================================= */}

          <div className="register-left">

            <div className="register-logo">
              <FaCode />
              <span>CodeArena</span>
            </div>


            <p className="register-tag">
              START YOUR JOURNEY
            </p>


            <h1>
              Build Skills.
              <br />

              <span>Crack Placements.</span>
            </h1>


            <p className="register-description">
              Join CodeArena and start your journey towards
              becoming a better developer. Practice coding,
              prepare for interviews and track your progress.
            </p>


            {/* Features */}

            <div className="register-features">

              <div className="register-feature">

                <div className="register-feature-icon">
                  <FaCode />
                </div>

                <span>
                  Practice DSA &amp; Coding Problems
                </span>

              </div>


              <div className="register-feature">

                <div className="register-feature-icon">
                  <FaRocket />
                </div>

                <span>
                  Prepare for Top Companies
                </span>

              </div>


              <div className="register-feature">

                <div className="register-feature-icon">
                  <FaChartLine />
                </div>

                <span>
                  Track Your Learning Progress
                </span>

              </div>


              <div className="register-feature">

                <div className="register-feature-icon">
                  <FaTrophy />
                </div>

                <span>
                  Compete &amp; Improve Your Rank
                </span>

              </div>

            </div>

          </div>


          {/* ================================
          RIGHT SIDE
      ================================= */}

          <div className="register-right">


            {/* Rotating Circle */}

            <div className="register-glow-circle"></div>


            {/* Register Card */}

            <div className="register-card">


              {/* Card Icon */}




              <h2>
                Create Account
              </h2>


              <p className="register-card-subtitle">
                Start your coding journey today
              </p>


              {/* ================================
              FORM
          ================================= */}
              <form
                className="register-form"
                onSubmit={handleRegister}
              >


                {/* Full Name */}

                <div className="register-field">

                  <label>
                    Full Name
                  </label>

                  <div className="register-input-wrapper">

                    <FaUser className="register-input-icon" />

                   <input
  type="text"
  placeholder="Enter your name"
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
  required
/>

                  </div>

                </div>


                {/* Email */}

                <div className="register-field">

                  <label>
                    Email Address
                  </label>

                  <div className="register-input-wrapper">

                    <FaEnvelope className="register-input-icon" />

                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />

                  </div>

                </div>


                {/* Password */}

                <div className="register-field">

                  <label>
                    Password
                  </label>

                  <div className="register-input-wrapper">

                    <FaLock className="register-input-icon" />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      className="register-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>

                  </div>

                </div>


                {/* Confirm Password */}

                <div className="register-field">

                  <label>
                    Confirm Password
                  </label>

                  <div className="register-input-wrapper">

                    <FaLock className="register-input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                       autoComplete="new-password"
                       required
                    />

                    <button
                      type="button"
                      className="register-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>

                  </div>

                </div>


                {/* Terms */}

                <div className="register-terms">

                <input
  type="checkbox"
  id="terms"
  checked={termsAccepted}
  onChange={(e) => setTermsAccepted(e.target.checked)}
/>

                  <label htmlFor="terms">

                    I agree to the{" "}

                    <Link to="/terms">
                      Terms &amp; Conditions
                    </Link>

                  </label>

                </div>


                {/* Submit */}

                <button
                  type="submit"
                  className="register-submit"
                  disabled={submitting}
                >
                  {submitting ? "Creating account..." : "Create Account"}
                </button>


                {/* Login */}

                <p className="register-login">

                  Already have an account?{" "}

                  <Link to="/login">
                    Login
                  </Link>

                </p>
{errorMessage && (
  <p className="register-error-message" role="alert">
    {errorMessage}
  </p>
)}
{successMessage && (
  <p className="register-success-message">
    {successMessage}
  </p>
)}

              </form>

            </div>

          </div>

        </div>

      </section>
    </>


  );
}

export default Register;
