import { apiUrl } from "../../api/axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import "./AdminEditProblem.css";

const AdminEditProblem = () => {
  const { id } = useParams();
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
    difficulty: "EASY",
    category: "",
    timeLimit: 1000,
    memoryLimit: 256,
    points: 10,
    starterCodeJava: "",
    starterCodePython: "",
    starterCodeCpp: "",
    starterCodeJavascript: "",
    editorial: "",
    hints: "",
    editorialUnlockAttempts: 3,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        apiUrl(`/api/problems/${id}`),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      console.log("Edit Problem Response:", result);

      if (!response.ok) {
        setError(result.message || "Failed to load problem.");
        return;
      }

      const problem = result.data || result;

      setFormData({
        title: problem.title || "",
        slug: problem.slug || "",
        description: problem.description || "",
        inputFormat: problem.inputFormat || "",
        outputFormat: problem.outputFormat || "",
        constraints: problem.constraints || "",
        sampleInput: problem.sampleInput || "",
        sampleOutput: problem.sampleOutput || "",
        explanation: problem.explanation || "",
        difficulty: problem.difficulty || "EASY",
        category: problem.category || "",
        timeLimit: problem.timeLimit || 1000,
        memoryLimit: problem.memoryLimit || 256,
        points: problem.points || 10,
        starterCodeJava: problem.starterCodeJava || "",
        starterCodePython: problem.starterCodePython || "",
        starterCodeCpp: problem.starterCodeCpp || "",
        starterCodeJavascript:
          problem.starterCodeJavascript || "",
        editorial: problem.editorial || "",
        hints: problem.hints || "",
        editorialUnlockAttempts:
          problem.editorialUnlockAttempts ?? 3,
      });
    } catch (err) {
      console.error("Fetch Problem Error:", err);
      setError("Unable to connect to Spring Boot.");
    } finally {
      setLoading(false);
    }
  };

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
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        apiUrl(`/api/problems/${id}`),
        {
          method: "PUT",
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

      const result = await response.json();

      console.log("Update Problem Response:", result);

      if (response.ok) {
        alert("Problem updated successfully! ✨");

        navigate("/admin/problems");
      } else {
        setError(
          result.message || "Failed to update problem."
        );
      }
    } catch (err) {
      console.error("Update Problem Error:", err);
      setError("Unable to connect to Spring Boot.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-edit-page">
        <div className="admin-edit-loading">
          Loading problem...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-edit-page">

      <div className="admin-edit-header">

        <button
          className="admin-edit-back"
          onClick={() => navigate("/admin/problems")}
        >
          <FiArrowLeft />
        </button>

        <div>
          <span>ADMIN PANEL</span>

          <h1>Edit Problem</h1>

          <p>
            Update problem details and configuration
          </p>
        </div>

      </div>

      {error && (
        <div className="admin-edit-error">
          {error}
        </div>
      )}

      <form
        className="admin-edit-form"
        onSubmit={handleSubmit}
      >

        {/* BASIC INFORMATION */}

        <section className="admin-edit-section">

          <h2>Basic Information</h2>

          <div className="admin-edit-grid">

            <div className="admin-edit-field">
              <label>Problem Title</label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-edit-field">
              <label>Slug</label>

              <input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-edit-field">
              <label>Difficulty</label>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>

            <div className="admin-edit-field">
              <label>Category</label>

              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="admin-edit-field full">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

        </section>


        {/* INPUT OUTPUT */}

        <section className="admin-edit-section">

          <h2>Input & Output</h2>

          <div className="admin-edit-two">

            <div className="admin-edit-field">
              <label>Input Format</label>

              <textarea
                name="inputFormat"
                value={formData.inputFormat}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <div className="admin-edit-field">
              <label>Output Format</label>

              <textarea
                name="outputFormat"
                value={formData.outputFormat}
                onChange={handleChange}
                rows="5"
              />
            </div>

          </div>

        </section>


        {/* CONSTRAINTS */}

        <section className="admin-edit-section">

          <h2>Constraints</h2>

          <div className="admin-edit-field">
            <textarea
              name="constraints"
              value={formData.constraints}
              onChange={handleChange}
              rows="4"
            />
          </div>

        </section>


        {/* SAMPLE */}

        <section className="admin-edit-section">

          <h2>Sample</h2>

          <div className="admin-edit-two">

            <div className="admin-edit-field">
              <label>Sample Input</label>

              <textarea
                name="sampleInput"
                value={formData.sampleInput}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <div className="admin-edit-field">
              <label>Sample Output</label>

              <textarea
                name="sampleOutput"
                value={formData.sampleOutput}
                onChange={handleChange}
                rows="5"
              />
            </div>

          </div>

          <div className="admin-edit-field">
            <label>Explanation</label>

            <textarea
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              rows="4"
            />
          </div>

        </section>


        {/* LIMITS */}

        <section className="admin-edit-section">

          <h2>Limits & Points</h2>

          <div className="admin-edit-grid">

            <div className="admin-edit-field">
              <label>Time Limit</label>

              <input
                type="number"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="admin-edit-field">
              <label>Memory Limit</label>

              <input
                type="number"
                name="memoryLimit"
                value={formData.memoryLimit}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="admin-edit-field">
              <label>Points</label>

              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="admin-edit-field">
              <label>Editorial Unlock Attempts</label>

              <input
                type="number"
                name="editorialUnlockAttempts"
                value={formData.editorialUnlockAttempts}
                onChange={handleChange}
                min="0"
              />
            </div>

          </div>

        </section>


        {/* STARTER CODE */}

        <section className="admin-edit-section">

          <h2>Starter Code</h2>

          <div className="admin-edit-field">
            <label>Java</label>

            <textarea
              name="starterCodeJava"
              value={formData.starterCodeJava}
              onChange={handleChange}
              rows="8"
            />
          </div>

          <div className="admin-edit-field">
            <label>Python</label>

            <textarea
              name="starterCodePython"
              value={formData.starterCodePython}
              onChange={handleChange}
              rows="8"
            />
          </div>

          <div className="admin-edit-field">
            <label>C++</label>

            <textarea
              name="starterCodeCpp"
              value={formData.starterCodeCpp}
              onChange={handleChange}
              rows="8"
            />
          </div>

          <div className="admin-edit-field">
            <label>JavaScript</label>

            <textarea
              name="starterCodeJavascript"
              value={formData.starterCodeJavascript}
              onChange={handleChange}
              rows="8"
            />
          </div>

        </section>


        {/* HINTS & EDITORIAL */}

        <section className="admin-edit-section">

          <h2>Hints & Editorial</h2>

          <div className="admin-edit-field">
            <label>Hints</label>

            <textarea
              name="hints"
              value={formData.hints}
              onChange={handleChange}
              rows="5"
            />
          </div>

          <div className="admin-edit-field">
            <label>Editorial</label>

            <textarea
              name="editorial"
              value={formData.editorial}
              onChange={handleChange}
              rows="8"
            />
          </div>

        </section>


        {/* SAVE */}

        <div className="admin-edit-actions">

          <button
            type="button"
            className="admin-edit-cancel"
            onClick={() => navigate("/admin/problems")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-edit-save"
            disabled={saving}
          >
            <FiSave />

            {saving
              ? "Updating..."
              : "Update Problem"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default AdminEditProblem;