import { apiUrl } from "../../api/axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiArrowLeft,
    FiPlus,
    FiEdit3,
    FiTrash2,
    FiEye,
    FiSearch,
    FiX,
    FiList,
} from "react-icons/fi";
import "./AdminProblems.css";

const AdminProblems = () => {
    const navigate = useNavigate();

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    // CREATE MODAL
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    // FORM DATA
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
        timeLimit: 1,
        memoryLimit: 128,
        points: 100,
        starterCodeJava: "",
        starterCodePython: "",
        starterCodeCpp: "",
        starterCodeJavascript: "",
        editorial: "",
        hints: "",
        editorialUnlockAttempts: 0,
    });

    // =========================
    // FETCH PROBLEMS
    // =========================

    const fetchProblems = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                apiUrl("/api/problems"),
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            console.log("Admin Problems Response:", data);

            if (response.ok) {
                const problemList = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
                        ? data.data
                        : Array.isArray(data.data?.content)
                            ? data.data.content
                            : [];

                setProblems(problemList);
            } else {
                setError(data.message || "Failed to load problems.");
            }
        } catch (err) {
            console.error("Fetch Problems Error:", err);
            setError("Unable to connect to Spring Boot.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (problem) => {
        const problemId = problem.id || problem.problemId;

        if (!problemId) {
            alert("Problem ID not found.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${problem.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                apiUrl(`/api/problems/${problemId}`),
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Delete Status:", response.status);

            // Don't force JSON parsing for DELETE response
            if (response.ok) {
                alert("Problem deleted successfully!");

                setProblems((prevProblems) =>
                    prevProblems.filter(
                        (p) => (p.id || p.problemId) !== problemId
                    )
                );
            } else {
                let errorMessage = "Failed to delete problem.";

                try {
                    const data = await response.json();
                    errorMessage = data.message || errorMessage;
                } catch {
                    // Response doesn't contain JSON
                }

                alert(errorMessage);
            }
        } catch (error) {
            console.error("Delete Problem Error:", error);

            alert("Unable to connect to Spring Boot.");
        }
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // CREATE PROBLEM
    // =========================

    const handleCreateProblem = async (e) => {
        e.preventDefault();

        try {
            setCreating(true);
            setCreateError("");

            const token = localStorage.getItem("token");

            const payload = {
                ...formData,
                timeLimit: Number(formData.timeLimit),
                memoryLimit: Number(formData.memoryLimit),
                points: Number(formData.points),
                editorialUnlockAttempts:
                    Number(formData.editorialUnlockAttempts),
            };

            console.log("Create Problem Payload:", payload);

            const response = await fetch(
                apiUrl("/api/problems"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            console.log("Create Problem Response:", data);

            if (response.ok && data.success) {
                // close modal
                setShowCreateModal(false);

                // reset form
                setFormData({
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
                    timeLimit: 1,
                    memoryLimit: 128,
                    points: 100,
                    starterCodeJava: "",
                    starterCodePython: "",
                    starterCodeCpp: "",
                    starterCodeJavascript: "",
                    editorial: "",
                    hints: "",
                    editorialUnlockAttempts: 0,
                });

                // refresh list
                fetchProblems();
            } else {
                setCreateError(
                    data.message || "Failed to create problem."
                );
            }
        } catch (err) {
            console.error("Create Problem Error:", err);
            setCreateError(
                "Unable to connect to Spring Boot."
            );
        } finally {
            setCreating(false);
        }
    };

    // =========================
    // SEARCH
    // =========================

    const filteredProblems = problems.filter((problem) =>
        (problem.title || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="admin-problems-page">

            {/* ================= HEADER ================= */}

            <div className="admin-problems-header">

                <div className="admin-problems-heading">

                    <button
                        className="admin-back-btn"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        <FiArrowLeft />
                    </button>

                    <div>
                        <span className="admin-page-tag">
                            ADMIN PANEL
                        </span>

                        <h1>Problems</h1>

                        <p>
                            Manage coding problems and challenges
                        </p>
                    </div>

                </div>

                <button
                    className="create-problem-btn"
                    onClick={() => navigate("/admin/problems/create")}
                >
                    <FiPlus />
                    Create Problem
                </button>

            </div>

            {/* ================= TOOLBAR ================= */}

            <div className="admin-problems-toolbar">

                <div className="admin-problem-search">
                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Search problems..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="problem-count">
                    {filteredProblems.length} Problems
                </div>

            </div>

            {/* ================= CONTENT ================= */}

            <div className="admin-problems-container">

                {loading && (
                    <div className="admin-problems-state">
                        Loading problems...
                    </div>
                )}

                {!loading && error && (
                    <div className="admin-problems-state error">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    filteredProblems.length === 0 && (
                        <div className="admin-problems-state">
                            No problems found.
                        </div>
                    )}

                {!loading &&
                    !error &&
                    filteredProblems.length > 0 && (

                        <div className="admin-problems-table-wrapper">

                            <table className="admin-problems-table">

                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Problem</th>
                                        <th>Difficulty</th>
                                        <th>Category</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredProblems.map((problem, index) => (

                                        <tr
                                            key={
                                                problem.id ||
                                                problem.problemId
                                            }
                                        >

                                            <td className="problem-number">
                                                {index + 1}
                                            </td>

                                            <td>
                                                <div className="problem-title-cell">

                                                    <strong>
                                                        {problem.title ||
                                                            "Untitled Problem"}
                                                    </strong>

                                                    {problem.description && (
                                                        <span>
                                                            {problem.description.slice(
                                                                0,
                                                                70
                                                            )}

                                                            {problem.description
                                                                .length > 70
                                                                ? "..."
                                                                : ""}
                                                        </span>
                                                    )}

                                                </div>
                                            </td>

                                            <td>

                                                <span
                                                    className={`admin-difficulty ${(
                                                        problem.difficulty ||
                                                        ""
                                                    ).toLowerCase()
                                                        }`}
                                                >
                                                    {problem.difficulty ||
                                                        "N/A"}
                                                </span>

                                            </td>

                                            <td>

                                                <span className="admin-category">
                                                    {problem.category ||
                                                        problem.topic ||
                                                        "General"}
                                                </span>

                                            </td>

                                            <td>

                                                <div className="problem-actions">

                                                    <button
                                                        className="problem-action view"
                                                        title="View"
                                                        onClick={() =>
                                                            navigate(`/problems/${problem.id || problem.problemId}`)
                                                        }
                                                    >
                                                        <FiEye />
                                                    </button>

                                                    <button
                                                        className="problem-action edit"
                                                        title="Edit"
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/problems/edit/${problem.id || problem.problemId}`
                                                            )
                                                        }
                                                    >
                                                        <FiEdit3 />
                                                    </button>

                                                    <button
                                                        className="problem-action test-cases"
                                                        title="Manage test cases"
                                                        onClick={() => navigate(`/admin/problems/${problem.id || problem.problemId}/test-cases`)}
                                                    >
                                                        <FiList />
                                                    </button>

                                                    <button
                                                        className="problem-action delete"
                                                        title="Delete"
                                                        onClick={() => handleDelete(problem)}
                                                    >
                                                        <FiTrash2 />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

            </div>

            {/* =====================================================
          CREATE PROBLEM MODAL
      ===================================================== */}

            {showCreateModal && (

                <div className="create-problem-overlay">

                    <div className="create-problem-modal">

                        {/* MODAL HEADER */}

                        <div className="create-modal-header">

                            <div>
                                <span className="admin-page-tag">
                                    ADMIN PANEL
                                </span>

                                <h2>
                                    Create New Problem
                                </h2>

                                <p>
                                    Add a new coding challenge
                                </p>
                            </div>

                            <button
                                className="create-modal-close"
                                onClick={() =>
                                    setShowCreateModal(false)
                                }
                            >
                                <FiX />
                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            className="create-problem-form"
                            onSubmit={handleCreateProblem}
                        >

                            {/* BASIC INFORMATION */}

                            <div className="form-section-title">
                                Basic Information
                            </div>

                            <div className="form-grid">

                                <div className="admin-form-group">
                                    <label>Title *</label>

                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="e.g. Two Sum"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>Slug *</label>

                                    <input
                                        type="text"
                                        name="slug"
                                        placeholder="e.g. two-sum"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            </div>

                            <div className="admin-form-group">
                                <label>Description *</label>

                                <textarea
                                    name="description"
                                    placeholder="Describe the problem..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                />
                            </div>

                            <div className="form-grid">

                                <div className="admin-form-group">
                                    <label>Difficulty *</label>

                                    <select
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleChange}
                                        required
                                    >
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

                                <div className="admin-form-group">
                                    <label>Category *</label>

                                    <input
                                        type="text"
                                        name="category"
                                        placeholder="e.g. Array"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            </div>

                            {/* FORMAT */}

                            <div className="form-section-title">
                                Problem Format
                            </div>

                            <div className="admin-form-group">
                                <label>Input Format</label>

                                <textarea
                                    name="inputFormat"
                                    placeholder="Describe the input..."
                                    value={formData.inputFormat}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Output Format</label>

                                <textarea
                                    name="outputFormat"
                                    placeholder="Describe the output..."
                                    value={formData.outputFormat}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Constraints</label>

                                <textarea
                                    name="constraints"
                                    placeholder="e.g. 1 <= n <= 10^5"
                                    value={formData.constraints}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>

                            {/* EXAMPLES */}

                            <div className="form-section-title">
                                Examples
                            </div>

                            <div className="form-grid">

                                <div className="admin-form-group">
                                    <label>Sample Input</label>

                                    <textarea
                                        name="sampleInput"
                                        placeholder="Example input..."
                                        value={formData.sampleInput}
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>Sample Output</label>

                                    <textarea
                                        name="sampleOutput"
                                        placeholder="Example output..."
                                        value={formData.sampleOutput}
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                </div>

                            </div>

                            <div className="admin-form-group">
                                <label>Explanation</label>

                                <textarea
                                    name="explanation"
                                    placeholder="Explain the example..."
                                    value={formData.explanation}
                                    onChange={handleChange}
                                    rows="4"
                                />
                            </div>

                            {/* LIMITS */}

                            <div className="form-section-title">
                                Limits & Points
                            </div>

                            <div className="form-grid-three">

                                <div className="admin-form-group">
                                    <label>Time Limit</label>

                                    <input
                                        type="number"
                                        name="timeLimit"
                                        min="1"
                                        value={formData.timeLimit}
                                        onChange={handleChange}
                                        required
                                    />
                                    <small>seconds</small>
                                </div>

                                <div className="admin-form-group">
                                    <label>Memory Limit</label>

                                    <input
                                        type="number"
                                        name="memoryLimit"
                                        min="1"
                                        value={formData.memoryLimit}
                                        onChange={handleChange}
                                        required
                                    />
                                    <small>MB</small>
                                </div>

                                <div className="admin-form-group">
                                    <label>Points</label>

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

                            {/* STARTER CODE */}

                            <div className="form-section-title">
                                Starter Code
                            </div>

                            <div className="admin-form-group">
                                <label>Java</label>

                                <textarea
                                    name="starterCodeJava"
                                    placeholder="Java starter code..."
                                    value={formData.starterCodeJava}
                                    onChange={handleChange}
                                    rows="5"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Python</label>

                                <textarea
                                    name="starterCodePython"
                                    placeholder="Python starter code..."
                                    value={formData.starterCodePython}
                                    onChange={handleChange}
                                    rows="5"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>C++</label>

                                <textarea
                                    name="starterCodeCpp"
                                    placeholder="C++ starter code..."
                                    value={formData.starterCodeCpp}
                                    onChange={handleChange}
                                    rows="5"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>JavaScript</label>

                                <textarea
                                    name="starterCodeJavascript"
                                    placeholder="JavaScript starter code..."
                                    value={formData.starterCodeJavascript}
                                    onChange={handleChange}
                                    rows="5"
                                />
                            </div>

                            {/* EDITORIAL */}

                            <div className="form-section-title">
                                Editorial & Hints
                            </div>

                            <div className="admin-form-group">
                                <label>Hints</label>

                                <textarea
                                    name="hints"
                                    placeholder="Add hints for users..."
                                    value={formData.hints}
                                    onChange={handleChange}
                                    rows="4"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Editorial</label>

                                <textarea
                                    name="editorial"
                                    placeholder="Write the solution explanation..."
                                    value={formData.editorial}
                                    onChange={handleChange}
                                    rows="5"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>
                                    Editorial Unlock Attempts
                                </label>

                                <input
                                    type="number"
                                    name="editorialUnlockAttempts"
                                    min="0"
                                    value={
                                        formData.editorialUnlockAttempts
                                    }
                                    onChange={handleChange}
                                />
                            </div>

                            {/* ERROR */}

                            {createError && (
                                <div className="create-problem-error">
                                    {createError}
                                </div>
                            )}

                            {/* BUTTONS */}

                            <div className="create-modal-actions">

                                <button
                                    type="button"
                                    className="create-cancel-btn"
                                    onClick={() =>
                                        setShowCreateModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="create-submit-btn"
                                    disabled={creating}
                                >
                                    {creating
                                        ? "Creating..."
                                        : "Create Problem"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminProblems;
