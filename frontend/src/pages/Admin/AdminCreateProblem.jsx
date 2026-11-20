import { apiUrl } from "../../api/axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiCode,
  FiFileText,
  FiSettings,
  FiBookOpen,
} from "react-icons/fi";
import "./AdminCreateProblem.css";

const AdminCreateProblem = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    inputFormat: "",
    outputFormat: "",
    constraints: "",
    sampleInput: "",
    sampleOutput: "",
    explanation: "",
    difficulty: "",
    category: "",
    timeLimit: 1000,
    memoryLimit: 256,
    points: 100,
    starterCodeJava: "",
    starterCodePython: "",
    starterCodeCpp: "",
    starterCodeJavascript: "",
    editorial: "",
    hints: "",
    editorialUnlockAttempts: 3,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    console.log("Problem Form Data:", formData);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Admin login token not found. Please login again.");
      return;
    }

    const response = await fetch(
      apiUrl("/api/problems"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          timeLimit: Number(formData.timeLimit),
          memoryLimit: Number(formData.memoryLimit),
          points: Number(formData.points),
          editorialUnlockAttempts: Number(
            formData.editorialUnlockAttempts
          ),
        }),
      }
    );

    const data = await response.json();

    console.log("Create Problem Response:", data);

    if (response.ok) {
      alert("Problem created successfully! 🎉");

      navigate("/admin/problems");
    } else {
      alert(
        data.message ||
          "Failed to create problem."
      );
    }
  } catch (error) {
    console.error("Create Problem Error:", error);

    alert(
      "Unable to connect to Spring Boot backend."
    );
  }
};

  return (
    <div className="admin-create-page">

      {/* ================= HEADER ================= */}

      <div className="admin-create-header">

        <div className="admin-create-heading">

          <button
            className="admin-back-btn"
            onClick={() => navigate("/admin/problems")}
          >
            <FiArrowLeft />
          </button>

          <div>
            <span className="admin-page-tag">
              ADMIN PANEL
            </span>

            <h1>Create Problem</h1>

            <p>
              Add a new coding problem to CodeArena
            </p>
          </div>

        </div>

      </div>


      {/* ================= FORM ================= */}

      <form
        className="admin-create-form"
        onSubmit={handleSubmit}
      >

        {/* ================= BASIC INFORMATION ================= */}

        <div className="create-section">

          <div className="create-section-header">
            <div className="create-section-icon">
              <FiFileText />
            </div>

            <div>
              <h2>Basic Information</h2>
              <p>Define the basic details of the problem</p>
            </div>
          </div>


          <div className="create-form-grid">

            <div className="create-field">
              <label>
                Problem Title <span>*</span>
              </label>

              <input
                type="text"
                name="title"
                placeholder="e.g. Two Sum"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>


            <div className="create-field">
              <label>
                Slug <span>*</span>
              </label>

              <input
                type="text"
                name="slug"
                placeholder="e.g. two-sum"
                value={formData.slug}
                onChange={handleChange}
                required
              />
            </div>


            <div className="create-field">
              <label>
                Difficulty <span>*</span>
              </label>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select difficulty
                </option>

                <option value="EASY">
                  Easy
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HARD">
                  Hard
                </option>
              </select>
            </div>


            <div className="create-field">
              <label>
                Category <span>*</span>
              </label>

              <input
                type="text"
                name="category"
                placeholder="e.g. Arrays"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

          </div>


          <div className="create-field full-width">
            <label>
              Description <span>*</span>
            </label>

            <textarea
              name="description"
              placeholder="Write the complete problem statement..."
              value={formData.description}
              onChange={handleChange}
              rows="6"
              required
            />
          </div>

        </div>


        {/* ================= INPUT / OUTPUT ================= */}

        <div className="create-section">

          <div className="create-section-header">

            <div className="create-section-icon">
              <FiSettings />
            </div>

            <div>
              <h2>Input & Output</h2>
              <p>Define how users should solve the problem</p>
            </div>

          </div>


          <div className="create-form-grid">

            <div className="create-field">

              <label>
                Input Format
              </label>

              <textarea
                name="inputFormat"
                placeholder="Describe the input format..."
                value={formData.inputFormat}
                onChange={handleChange}
                rows="5"
              />

            </div>


            <div className="create-field">

              <label>
                Output Format
              </label>

              <textarea
                name="outputFormat"
                placeholder="Describe the expected output..."
                value={formData.outputFormat}
                onChange={handleChange}
                rows="5"
              />

            </div>

          </div>


          <div className="create-field full-width">

            <label>
              Constraints
            </label>

            <textarea
              name="constraints"
              placeholder="e.g. 1 <= nums.length <= 10^5"
              value={formData.constraints}
              onChange={handleChange}
              rows="4"
            />

          </div>

        </div>


        {/* ================= EXAMPLES ================= */}

        <div className="create-section">

          <div className="create-section-header">

            <div className="create-section-icon">
              <FiCode />
            </div>

            <div>
              <h2>Examples</h2>
              <p>Add sample input, output and explanation</p>
            </div>

          </div>


          <div className="create-form-grid">

            <div className="create-field">

              <label>
                Sample Input
              </label>

              <textarea
                className="code-textarea"
                name="sampleInput"
                placeholder="Example input..."
                value={formData.sampleInput}
                onChange={handleChange}
                rows="6"
              />

            </div>


            <div className="create-field">

              <label>
                Sample Output
              </label>

              <textarea
                className="code-textarea"
                name="sampleOutput"
                placeholder="Example output..."
                value={formData.sampleOutput}
                onChange={handleChange}
                rows="6"
              />

            </div>

          </div>


          <div className="create-field full-width">

            <label>
              Explanation
            </label>

            <textarea
              name="explanation"
              placeholder="Explain the sample solution..."
              value={formData.explanation}
              onChange={handleChange}
              rows="5"
            />

          </div>

        </div>


        {/* ================= LIMITS ================= */}

        <div className="create-section">

          <div className="create-section-header">

            <div className="create-section-icon">
              <FiSettings />
            </div>

            <div>
              <h2>Problem Settings</h2>
              <p>Configure limits and scoring</p>
            </div>

          </div>


          <div className="create-form-grid three-columns">

            <div className="create-field">

              <label>
                Time Limit (ms) <span>*</span>
              </label>

              <input
                type="number"
                name="timeLimit"
                min="1"
                value={formData.timeLimit}
                onChange={handleChange}
                required
              />

            </div>


            <div className="create-field">

              <label>
                Memory Limit (MB) <span>*</span>
              </label>

              <input
                type="number"
                name="memoryLimit"
                min="1"
                value={formData.memoryLimit}
                onChange={handleChange}
                required
              />

            </div>


            <div className="create-field">

              <label>
                Points <span>*</span>
              </label>

              <input
                type="number"
                name="points"
                min="1"
                value={formData.points}
                onChange={handleChange}
                required
              />

            </div>

          </div>

        </div>


        {/* ================= STARTER CODE ================= */}

        <div className="create-section">

          <div className="create-section-header">

            <div className="create-section-icon">
              <FiCode />
            </div>

            <div>
              <h2>Starter Code</h2>
              <p>Add starter code for supported languages</p>
            </div>

          </div>


          <div className="create-field">

            <label>
              Java
            </label>

            <textarea
              className="code-editor"
              name="starterCodeJava"
              placeholder="Enter Java starter code..."
              value={formData.starterCodeJava}
              onChange={handleChange}
              rows="8"
            />

          </div>


          <div className="create-field">

            <label>
              Python
            </label>

            <textarea
              className="code-editor"
              name="starterCodePython"
              placeholder="Enter Python starter code..."
              value={formData.starterCodePython}
              onChange={handleChange}
              rows="8"
            />

          </div>


          <div className="create-field">

            <label>
              C++
            </label>

            <textarea
              className="code-editor"
              name="starterCodeCpp"
              placeholder="Enter C++ starter code..."
              value={formData.starterCodeCpp}
              onChange={handleChange}
              rows="8"
            />

          </div>


          <div className="create-field">

            <label>
              JavaScript
            </label>

            <textarea
              className="code-editor"
              name="starterCodeJavascript"
              placeholder="Enter JavaScript starter code..."
              value={formData.starterCodeJavascript}
              onChange={handleChange}
              rows="8"
            />

          </div>

        </div>


        {/* ================= EDITORIAL ================= */}

        <div className="create-section">

          <div className="create-section-header">

            <div className="create-section-icon">
              <FiBookOpen />
            </div>

            <div>
              <h2>Editorial & Hints</h2>
              <p>Help users understand the solution</p>
            </div>

          </div>


          <div className="create-field full-width">

            <label>
              Editorial
            </label>

            <textarea
              name="editorial"
              placeholder="Write the complete solution explanation..."
              value={formData.editorial}
              onChange={handleChange}
              rows="8"
            />

          </div>


          <div className="create-form-grid">

            <div className="create-field">

              <label>
                Hints
              </label>

              <textarea
                name="hints"
                placeholder="Add helpful hints..."
                value={formData.hints}
                onChange={handleChange}
                rows="6"
              />

            </div>


            <div className="create-field">

              <label>
                Editorial Unlock Attempts
              </label>

              <input
                type="number"
                name="editorialUnlockAttempts"
                min="0"
                value={formData.editorialUnlockAttempts}
                onChange={handleChange}
              />

              <small>
                Number of failed attempts before editorial unlocks.
              </small>

            </div>

          </div>

        </div>


        {/* ================= ACTIONS ================= */}

        <div className="create-form-actions">

          <button
            type="button"
            className="create-cancel-btn"
            onClick={() => navigate("/admin/problems")}
          >
            Cancel
          </button>


          <button
            type="submit"
            className="create-submit-btn"
          >
            <FiSave />
            Create Problem
          </button>

        </div>

      </form>

    </div>
  );
};

export default AdminCreateProblem;