import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProblemDetails.css";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const ProblemDetails = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleToggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  };

  // =========================================================
  // STATE
  // =========================================================

  const [problem, setProblem] = useState(null);
  const [problemError, setProblemError] = useState("");
  const [testCases, setTestCases] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  const [editorHeight, setEditorHeight] = useState(430);

  const [activeTab, setActiveTab] = useState("testcases");

  const [loadingTests, setLoadingTests] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [executionResults, setExecutionResults] = useState([]);

  const [showHints, setShowHints] = useState(false);

  const [submitMessage, setSubmitMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);


  // =========================================================
  // GET LOGGED-IN USER
  // =========================================================

  const getLoggedInUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to read logged-in user:", error);
      return null;
    }
  };

  // =========================================================
  // FETCH PROBLEM
  // =========================================================

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await api.get(`/api/problems/${id}`);

        console.log("Problem Details API Response:", response.data);

        if (response.data.success) {
          const data = response.data.data;

          const formattedProblem = {
            id: data.id,
            title: data.title,
            slug: data.slug,
            difficulty: data.difficulty,
            category: data.category,
            points: data.points,

            description: data.description,
            inputFormat: data.inputFormat,
            outputFormat: data.outputFormat,
            constraints: data.constraints
              ? data.constraints.split("\n")
              : [],

            sampleInput: data.sampleInput,
            sampleOutput: data.sampleOutput,
            explanation: data.explanation,

            starterCodeJava: data.starterCodeJava || "",
            starterCodePython: data.starterCodePython || "",
            starterCodeCpp: data.starterCodeCpp || "",
            starterCodeJavascript: data.starterCodeJavascript || "",

            hints: data.hints || "",
            editorial: data.editorial || "",
            editorialUnlockAttempts:
              data.editorialUnlockAttempts,

            timeLimit: data.timeLimit,
            memoryLimit: data.memoryLimit,
          };

          setProblem(formattedProblem);

          // Default JavaScript code
          setCode(
            data.starterCodeJavascript ||
              data.starterCodeJava ||
              data.starterCodePython ||
              data.starterCodeCpp ||
              ""
          );

          // Fetch test cases after problem loads
          fetchTestCases(data.id);
        }
      } catch (error) {
        console.error("Failed to fetch problem:", error);
        setProblemError(error.response?.data?.message || "Problem could not be loaded. Check your connection and try again.");
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id]);

  // =========================================================
  // FETCH REAL TEST CASES
  // =========================================================

  const fetchTestCases = async (problemId) => {
    try {
      setLoadingTests(true);

      const response = await api.get(
        `/api/problems/${problemId}/test-cases`
      );

      console.log("Test Cases API Response:", response.data);

      if (response.data.success) {
        setTestCases((response.data.data || []).filter(
          (testCase) => !testCase.isHidden || testCase.isSample
        ));
      } else {
        setTestCases([]);
      }
    } catch (error) {
      console.error("Failed to fetch test cases:", error);
      setTestCases([]);
    } finally {
      setLoadingTests(false);
    }
  };

  // =========================================================
  // FETCH USER SUBMISSIONS
  // =========================================================

  const fetchSubmissions = async () => {
    const user = getLoggedInUser();

    if (!user?.userId) {
      return;
    }

    try {
      setLoadingSubmissions(true);

      const response = await api.get(
        `/api/submissions/user/${user.userId}`
      );

      console.log("Submissions API Response:", response.data);

      if (response.data.success) {
        const allSubmissions = response.data.data || [];

        // Only show submissions for current problem
        const problemSubmissions = allSubmissions.filter(
          (submission) =>
            Number(submission.problemId) === Number(id)
        );

        setSubmissions(problemSubmissions);
      } else {
        setSubmissions([]);
      }
    } catch (error) {
      console.error(
        "Failed to fetch submissions:",
        error
      );

      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // =========================================================
  // LANGUAGE CHANGE
  // =========================================================

  const handleLanguageChange = (event) => {
    const language = event.target.value;

    setSelectedLanguage(language);

    if (!problem) {
      return;
    }

    const starterCodes = {
      javascript: problem.starterCodeJavascript,
      java: problem.starterCodeJava,
      cpp: problem.starterCodeCpp,
      python: problem.starterCodePython,
    };

    setCode(starterCodes[language] || "");
  };

  // =========================================================
  // RESET CODE
  // =========================================================

  const handleResetCode = () => {
    if (!problem) {
      return;
    }

    const starterCodes = {
      javascript: problem.starterCodeJavascript,
      java: problem.starterCodeJava,
      cpp: problem.starterCodeCpp,
      python: problem.starterCodePython,
    };

    setCode(starterCodes[selectedLanguage] || "");
    setSubmitMessage("");
  };

  // =========================================================
  // HINTS
  // =========================================================

  const handleHints = () => {
    setShowHints((previous) => !previous);
  };

  // =========================================================
  // SUBMIT CODE
  // =========================================================

  const handleSubmit = async () => {
    const user = getLoggedInUser();

    if (!user?.userId) {
      setSubmitSuccess(false);
      setSubmitMessage(
        "Please login before submitting your solution."
      );
      setActiveTab("submissions");
      return;
    }

    if (!code.trim()) {
      setSubmitSuccess(false);
      setSubmitMessage(
        "Please write your solution before submitting."
      );
      return;
    }

    try {
      setSubmitting(true);
      setSubmitMessage("");

      const languageMap = {
        javascript: "JAVASCRIPT",
        java: "JAVA",
        cpp: "CPP",
        python: "PYTHON",
      };

      const request = {
        userId: user.userId,
        problemId: Number(id),
        language: languageMap[selectedLanguage],
        sourceCode: code,
      };

      console.log("Submission Request:", request);

      const response = await api.post(
        "/api/submissions",
        request
      );

      console.log("Submission Response:", response.data);

      if (response.data.success) {
        const status = response.data.data?.status || "PENDING";
        setSubmitSuccess(status === "ACCEPTED");
        setSubmitMessage(`Submission result: ${status.replaceAll("_", " ")} — ${response.data.message || "Evaluated."}`);

        await fetchSubmissions();

        setActiveTab("submissions");
      } else {
        setSubmitSuccess(false);

        setSubmitMessage(
          response.data.message ||
            "Submission failed."
        );
      }
    } catch (error) {
      console.error(
        "Submission failed:",
        error
      );

      setSubmitSuccess(false);

      setSubmitMessage(
        error.response?.data?.message ||
          "Unable to submit solution."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // RUN CODE
  // =========================================================

  const languageMap = {
    javascript: "JAVASCRIPT",
    java: "JAVA",
    cpp: "CPP",
    python: "PYTHON",
  };

  const executeCase = async (testCase, index) => {
    const { data } = await api.post("/api/execution/run", {
      language: languageMap[selectedLanguage],
      sourceCode: code,
      input: getTestInput(testCase),
      expectedOutput: getExpectedOutput(testCase),
      compareOutput: testCase.compareOutput !== false,
    });
    return { ...data, testCaseNumber: index + 1, input: getTestInput(testCase), expected: getExpectedOutput(testCase) };
  };

  const handleRun = async () => {
    if (!getLoggedInUser()?.token) {
      setSubmitMessage("Please log in before running code.");
      setActiveTab("testcases");
      return;
    }
    if (!code.trim()) {
      setSubmitMessage("Write some code before running it.");
      setActiveTab("testcases");
      return;
    }

    const visibleCases = testCases.filter((testCase) => !testCase.isHidden || testCase.isSample);
    const casesToRun = visibleCases.length ? visibleCases : [{
        inputData: problem.sampleInput || "",
        expectedOutput: problem.sampleOutput || "",
        isSample: true,
      }];

    setRunning(true);
    setSubmitMessage("");
    setExecutionResults([]);
    setActiveTab("testcases");
    try {
      const results = [];
      for (let index = 0; index < casesToRun.length; index++) {
        const result = await executeCase(casesToRun[index], index);
        results.push(result);
        setExecutionResults([...results]);
      }
    } catch (error) {
      setSubmitMessage(error.response?.data?.message || "Could not run this code. Check that the backend and Docker are available.");
    } finally {
      setRunning(false);
    }
  };

  // =========================================================
  // =========================================================
  // RESIZE EDITOR
  // =========================================================

  const handleResizeStart = (e) => {
    e.preventDefault();

    const startY = e.clientY;
    const startHeight = editorHeight;

    const handleMouseMove = (event) => {
      const newHeight =
        startHeight + (event.clientY - startY);

      const limitedHeight = Math.min(
        Math.max(newHeight, 180),
        650
      );

      setEditorHeight(limitedHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      document.removeEventListener(
        "mouseup",
        handleMouseUp
      );
    };

    document.addEventListener(
      "mousemove",
      handleMouseMove
    );

    document.addEventListener(
      "mouseup",
      handleMouseUp
    );
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    try {
      return new Date(date).toLocaleString();
    } catch {
      return date;
    }
  };

  // =========================================================
  // GET TEST CASE INPUT
  // =========================================================

  const getTestInput = (testCase) => {
    return (
      testCase.input ??
      testCase.inputData ??
      testCase.testInput ??
      testCase.sampleInput ??
      ""
    );
  };

  // =========================================================
  // GET EXPECTED OUTPUT
  // =========================================================

  const getExpectedOutput = (testCase) => {
    return (
      testCase.expectedOutput ??
      testCase.output ??
      testCase.testOutput ??
      ""
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (!problem) {
    return (
      <div className="problem-page">
        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          {problemError || "Loading problem..."}
          {problemError && <p><button type="button" onClick={() => window.location.reload()}>Try again</button></p>}
        </div>
      </div>
    );
  }

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="problem-page">

      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <header className="problem-topbar">

        <button
          className="back-button"
          onClick={() => navigate("/problems")}
        >
          ← <span>Back to Problems</span>
        </button>

        <div className="topbar-actions">

          <select
            className="language-select"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            <option value="javascript">
              JS &nbsp; JavaScript
            </option>

            <option value="java">
              ☕ Java
            </option>

            <option value="cpp">
              C++
            </option>

            <option value="python">
              Python
            </option>
          </select>

          <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle theme">{theme === "dark" ? <FaSun /> : <FaMoon />}</button>

          <button className="icon-button" type="button" onClick={handleToggleFullscreen} aria-label="Toggle fullscreen">⛶</button>

        </div>

      </header>

      {/* =====================================================
          MAIN WORKSPACE
      ====================================================== */}

      <main className="problem-workspace">

        {/* ===================================================
            LEFT PANEL
        ==================================================== */}

        <section className="problem-panel">

          {/* Problem Header */}

          <div className="problem-header">

            <div className="problem-heading-row">

              <div>

                <div className="problem-meta">

                  <span>
                    Problem #{problem.id}
                  </span>

                  <span className="difficulty">
                    {problem.difficulty}
                  </span>

                </div>

                <h1>
                  {problem.title}
                </h1>

              </div>

              <button className="bookmark-button">
                ♧
              </button>

            </div>

            <p className="problem-short-description">
              {problem.description}
            </p>

            <div className="problem-stats">

              <span>
                ◇ {problem.category}
              </span>

              <span>
                ⏱ {problem.timeLimit ?? "—"} ms
              </span>

              <span>
                💾 {problem.memoryLimit ?? "—"} MB
              </span>

              <span className="points">
                🔥 {problem.points} Points
              </span>

            </div>

          </div>

          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <div className="info-section">

            <h2>
              <span className="section-icon">
                ‹/›
              </span>

              Problem Description
            </h2>

            <p>
              {problem.description}
            </p>

          </div>

          {/* =================================================
              INPUT FORMAT
          ================================================== */}

          <div className="info-section">

            <h2>
              <span className="section-icon">
                ↳
              </span>

              Input Format
            </h2>

            <p>
              {problem.inputFormat || "Not specified."}
            </p>

          </div>

          {/* =================================================
              OUTPUT FORMAT
          ================================================== */}

          <div className="info-section">

            <h2>
              <span className="section-icon">
                ↗
              </span>

              Output Format
            </h2>

            <p>
              {problem.outputFormat || "Not specified."}
            </p>

          </div>

          {/* =================================================
              EXAMPLES + CONSTRAINTS
          ================================================== */}

          <div className="lower-info">

            <div className="examples-section">

              <h2>
                <span className="section-icon">
                  ϟ
                </span>

                Examples
              </h2>

              <div className="example">

                <h3>
                  Example 1:
                </h3>

                <div className="example-box">

                  <div>

                    <span className="example-label input-label">
                      Input
                    </span>

                    <pre>
                      {problem.sampleInput || "—"}
                    </pre>

                  </div>

                  <div>

                    <span className="example-label output-label">
                      Output
                    </span>

                    <pre>
                      {problem.sampleOutput || "—"}
                    </pre>

                  </div>

                </div>

                {problem.explanation && (
                  <p className="explanation">
                    <strong>
                      Explanation:
                    </strong>{" "}
                    {problem.explanation}
                  </p>
                )}

              </div>

            </div>

            <div className="constraints-section">

              <h2>
                <span className="section-icon">
                  ♧
                </span>

                Constraints
              </h2>

              <ul>

                {problem.constraints.length > 0 ? (
                  problem.constraints.map(
                    (constraint, index) => (
                      <li key={index}>
                        {constraint}
                      </li>
                    )
                  )
                ) : (
                  <li>
                    No constraints specified.
                  </li>
                )}

              </ul>

            </div>

          </div>

          {/* =================================================
              HINTS
          ================================================== */}

          {problem.hints && (
            <div className="info-section">

              <h2
                onClick={handleHints}
                style={{
                  cursor: "pointer",
                }}
              >
                <span className="section-icon">
                  💡
                </span>

                Hints

                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "14px",
                  }}
                >
                  {showHints ? "▲" : "▼"}
                </span>

              </h2>

              {showHints && (
                <div
                  style={{
                    whiteSpace: "pre-line",
                  }}
                >
                  {problem.hints}
                </div>
              )}

            </div>
          )}

        </section>

        {/* ===================================================
            RIGHT PANEL
        ==================================================== */}

        <section className="coding-panel">

          {/* Editor Header */}

          <div className="editor-header">

            <div className="editor-tabs">

              <button
                className="editor-tab active"
              >
                &lt;/&gt; Code
              </button>

              <button
                className={`editor-tab ${
                  activeTab === "testcases"
                    ? "active-small"
                    : ""
                }`}
                onClick={() => {
                  setActiveTab("testcases");

                  if (testCases.length === 0) {
                    fetchTestCases(problem.id);
                  }
                }}
              >
                ▦ Test Cases
              </button>

              <button
                className={`editor-tab ${
                  activeTab === "submissions"
                    ? "active-small"
                    : ""
                }`}
                onClick={() => {
                  setActiveTab("submissions");
                  fetchSubmissions();
                }}
              >
                ◷ Submissions
              </button>

            </div>

            <div className="editor-actions">

              <button
                className="reset-button"
                onClick={handleResetCode}
              >
                ↻ Reset Code
              </button>

              <button className="editor-icon">
                ⛶
              </button>

              <button className="editor-icon">
                ⚙
              </button>

            </div>

          </div>

          {/* =================================================
              CODE EDITOR
          ================================================== */}

          <div
            className="code-editor"
            style={{
              height: `${editorHeight}px`,
              flex: "none",
            }}
          >

            <div className="line-numbers">

              {code.split("\n").map(
                (_, index) => (
                  <span key={index}>
                    {index + 1}
                  </span>
                )
              )}

            </div>

            <textarea
              value={code}
              onChange={(e) =>
                setCode(e.target.value)
              }
              spellCheck="false"
              className="code-input"
            />

          </div>

          <div
            className="editor-resizer"
            onMouseDown={handleResizeStart}
          />

          {/* =================================================
              RESULT AREA
          ================================================== */}

          <div className="result-area">

            <div className="result-tabs">

              <button
                className={
                  activeTab === "testcases"
                    ? "result-tab active"
                    : "result-tab"
                }
                onClick={() =>
                  setActiveTab("testcases")
                }
              >
                Test Cases
              </button>

              <button
                className={
                  activeTab === "submissions"
                    ? "result-tab active"
                    : "result-tab"
                }
                onClick={() => {
                  setActiveTab("submissions");
                  fetchSubmissions();
                }}
              >
                Submissions
              </button>

            </div>

            <div className="result-content">

              {/* =================================================
                  REAL TEST CASES
              ================================================== */}

              {activeTab === "testcases" && (
                <>

                  {loadingTests ? (
                    <div className="empty-result">
                      <p>
                        Loading test cases...
                      </p>
                    </div>
                  ) : testCases.length === 0 ? (
                    <div className="empty-result">
                      <p>
                        No test cases available.
                      </p>
                    </div>
                  ) : (
                    <>
                      <section className="test-case-results-list">
                        <div className="test-case-results-heading">
                          <h3>Test Cases</h3>
                          {executionResults.length > 0 && (
                            <strong>{executionResults.filter((result) => result.status === "ACCEPTED").length}/{executionResults.length} passed</strong>
                          )}
                        </div>
                        {running && <p className="test-run-progress">Running test cases…</p>}
                        {submitMessage && <p className="test-run-message" role="status">{submitMessage}</p>}
                        {executionResults.length > 0 ? executionResults.map((result) => {
                          const passed = result.status === "ACCEPTED";
                          const customOutput = result.status === "COMPLETED";
                          return (
                            <article className={`test-case-result ${passed ? "passed" : customOutput ? "completed" : "failed"}`} key={result.testCaseNumber}>
                              <div className="test-case-result-top">
                                <strong>Test case {result.testCaseNumber}</strong>
                                <span>{passed ? "PASSED" : customOutput ? "OUTPUT READY" : result.status?.replaceAll("_", " ") || "FAILED"}</span>
                              </div>
                              <div className="test-case-result-grid">
                                <div><small>Input</small><pre>{result.input || "(empty)"}</pre></div>
                                <div><small>Expected</small><pre>{result.expected || "(empty)"}</pre></div>
                                <div><small>Output</small><pre>{result.output || "(no output)"}</pre></div>
                              </div>
                              {result.errorMessage && <pre className="test-case-error">{result.errorMessage}</pre>}
                              {result.executionTime != null && <small className="test-case-time">{result.executionTime} ms</small>}
                            </article>
                          );
                        }) : testCases.filter((testCase) => !testCase.isHidden || testCase.isSample).map((testCase, index) => (
                          <article className="test-case-result pending" key={testCase.id || index}>
                            <div className="test-case-result-top"><strong>Test case {index + 1}</strong><span>NOT RUN</span></div>
                            <div className="test-case-result-grid">
                              <div><small>Input</small><pre>{getTestInput(testCase) || "(empty)"}</pre></div>
                              <div><small>Expected</small><pre>{getExpectedOutput(testCase) || "(empty)"}</pre></div>
                            </div>
                          </article>
                        ))}
                      </section>
                    </>
                  )}

                </>
              )}

              {/* =================================================
                  SUBMISSIONS
              ================================================== */}

              {activeTab === "submissions" && (
                <>

                  {submitMessage && (
                    <div
                      style={{
                        padding: "12px",
                        marginBottom: "12px",
                        borderRadius: "8px",
                      }}
                    >
                      {submitMessage}
                    </div>
                  )}

                  {loadingSubmissions ? (
                    <div className="empty-result">
                      <p>
                        Loading submissions...
                      </p>
                    </div>
                  ) : submissions.length === 0 ? (
                    <div className="empty-result">

                      <span>
                        ◷
                      </span>

                      <p>
                        No submissions for this
                        problem yet.
                      </p>

                    </div>
                  ) : (
                    <div className="test-results">

                      <h3>
                        <span>◷</span>
                        Submission History
                      </h3>

                      {submissions.map(
                        (submission) => (
                          <div
                            className="test-row"
                            key={
                              submission.id
                            }
                          >

                            <div>

                              <strong>
                                #{submission.id}
                              </strong>

                              <br />

                              <small>
                                {formatDate(
                                  submission.submittedAt
                                )}
                              </small>

                            </div>

                            <div>

                              <span>
                                Language:{" "}
                                {submission.language}
                              </span>

                              <span>
                                Status:{" "}
                                {submission.status}
                              </span>

                            </div>

                          </div>
                        )
                      )}

                    </div>
                  )}

                </>
              )}

            </div>

          </div>

        </section>

      </main>

      {/* =====================================================
          BOTTOM ACTION BAR
      ====================================================== */}

      <footer className="action-bar">

        <div className="save-status">

          <span>✓</span>

          <strong>
            Saved
          </strong>

          <small>
            ◉ Auto-saved
          </small>

        </div>

        <div className="action-buttons">

          <button
            className="run-button"
            title="Run every visible test case and show pass or fail"
            onClick={handleRun}
            disabled={running || submitting}
          >
            ▷ <span>Run Code</span>
            <small>
              Ctrl + Enter
            </small>
          </button>

          <button
            className="submit-button"
            title="Submit against all public and hidden test cases"
            onClick={handleSubmit}
            disabled={submitting}
          >
            ➤

            <span>
              {submitting
                ? "Submitting..."
                : "Submit"}
            </span>

            <small>
              Ctrl + Shift + Enter
            </small>

          </button>

        </div>

      </footer>

    </div>
  );
};

export default ProblemDetails;
