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
  FaChartLine,
  FaTrophy,
} from "react-icons/fa";

import Navbar from "../../components/Navbar/Navbar";
import api from "../../api/axios";
import "./Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const { data } = await api.post("/api/auth/login", { email, password });

      if (!data?.success || !data?.data?.token) {
        setErrorMessage(data?.message || "Invalid email or password");
        setPassword("");
        return;
      }

      const user = data.data;
      localStorage.setItem("token", user.token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate(user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");

    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage(
        error.response?.data?.message ||
        (error.response ? "Invalid email or password." : "Unable to connect to CodeArena. Check the API URL and try again.")
      );
    }
  };

  return (
    <>
      <Navbar />

      {/* ================= BACKGROUND ================= */}

      <div className="login-page">

        <div className="login-bg-glow login-glow-one"></div>
        <div className="login-bg-glow login-glow-two"></div>

        <div className="login-orbit login-orbit-one"></div>
        <div className="login-orbit login-orbit-two"></div>

        <div className="login-container">

          {/* ================= LEFT SIDE ================= */}

          <div className="login-left">

            <div className="login-logo">
              <FaCode />
              <span>CodeArena</span>
            </div>

            <p className="login-tag">
              WELCOME BACK
            </p>

            <h1>
              Continue Your
              <br />
              <span>Coding Journey.</span>
            </h1>

            <p className="login-description">
              Login to CodeArena and continue practicing coding,
              preparing for interviews and improving your skills.
            </p>

            <div className="login-features">

              <div className="login-feature">
                <div className="login-feature-icon">
                  <FaCode />
                </div>

                <span>
                  Practice DSA &amp; Coding Problems
                </span>
              </div>

              <div className="login-feature">
                <div className="login-feature-icon">
                  <FaRocket />
                </div>

                <span>
                  Prepare for Top Companies
                </span>
              </div>

              <div className="login-feature">
                <div className="login-feature-icon">
                  <FaChartLine />
                </div>

                <span>
                  Track Your Learning Progress
                </span>
              </div>

              <div className="login-feature">
                <div className="login-feature-icon">
                  <FaTrophy />
                </div>

                <span>
                  Compete &amp; Improve Your Rank
                </span>
              </div>

            </div>

          </div>


          {/* ================= RIGHT SIDE ================= */}

          <div className="login-right">

            <div className="login-glow-circle"></div>

            <div className="login-card">

              {/* Card Icon */}

              <div className="login-card-icon">
                <FaUser />
              </div>

              <h2>
                Welcome Back
              </h2>

              <p className="login-card-subtitle">
                Login to continue your coding journey
              </p>


              {/* ================= FORM ================= */}
<form
  className="login-form"
  onSubmit={handleLogin}
>

                {/* EMAIL */}

                <div className="login-field">

                  <label>
                    Email Address
                  </label>

                  <div className="login-input-wrapper">

                    <FaEnvelope className="login-input-icon" />

<input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  autoComplete="off"
/>
                  </div>

                </div>


                {/* PASSWORD */}

                <div className="login-field">

                  <label>
                    Password
                  </label>

                  <div className="login-input-wrapper">

                    <FaLock className="login-input-icon" />

<input
  type={showPassword ? "text" : "password"}
  placeholder="Enter your password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
 autoComplete="off"
/>

                 <button
  type="button"
  className="login-password-toggle"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? <FaEyeSlash /> : <FaEye />}
</button>

                  </div>

                </div>


                {/* REMEMBER / FORGOT */}

                <div className="login-options">

                  <label className="login-remember">

                    <input
  type="checkbox"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
/>

                    <span>
                      Remember me
                    </span>

                  </label>

                </div>


                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  className="login-submit"
                >
                  Login
                </button>
{errorMessage && (
  <p className="login-error-message">
    {errorMessage}
  </p>
)}

                {/* REGISTER */}

                <p className="login-register">

                  Don't have an account?{" "}

                  <Link to="/register">
                    Create Account
                  </Link>

                </p>

              </form>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default Login;
