import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiPlus, FiSave, FiTrash2, FiX } from "react-icons/fi";
import api from "../../api/axios";
import "./AdminProblemTestCases.css";

const emptyForm = { inputData: "", expectedOutput: "", isSample: false, isHidden: true };

export default function AdminProblemTestCases() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadPage = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [problemResponse, casesResponse] = await Promise.all([
        api.get(`/api/problems/${id}`),
        api.get(`/api/admin/problems/${id}/test-cases`),
      ]);
      setProblem(problemResponse.data?.data ?? problemResponse.data);
      setCases(casesResponse.data?.data ?? []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Test cases could not be loaded. Make sure you are signed in as an admin.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadPage(); }, [loadPage]);

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload = {
      ...form,
      inputData: form.inputData,
      expectedOutput: form.expectedOutput,
      isHidden: form.isSample ? false : form.isHidden,
    };
    try {
      if (editingId) {
        await api.put(`/api/test-cases/${editingId}`, payload);
        setNotice("Test case updated.");
      } else {
        await api.post(`/api/problems/${id}/test-cases`, payload);
        setNotice("Test case added.");
      }
      resetForm();
      await loadPage();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save this test case.");
    } finally {
      setSaving(false);
    }
  };

  const editCase = (testCase) => {
    setEditingId(testCase.id);
    setForm({
      inputData: testCase.inputData ?? "",
      expectedOutput: testCase.expectedOutput ?? "",
      isSample: Boolean(testCase.isSample),
      isHidden: Boolean(testCase.isHidden),
    });
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCase = async (testCase) => {
    if (!window.confirm(`Delete test case ${testCase.id}?`)) return;
    setError("");
    try {
      await api.delete(`/api/test-cases/${testCase.id}`);
      setCases((items) => items.filter((item) => item.id !== testCase.id));
      setNotice("Test case deleted.");
      if (editingId === testCase.id) resetForm();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete this test case.");
    }
  };

  return (
    <main className="admin-testcases-page">
      <header className="admin-testcases-header">
        <button type="button" className="testcases-back" onClick={() => navigate("/admin/problems")}><FiArrowLeft /> Problems</button>
        <span>ADMIN PANEL</span>
        <h1>Test Cases</h1>
        <p>{problem?.title || `Problem #${id}`} · Add expected inputs and outputs used by Check and Submit.</p>
      </header>

      {error && <div className="testcases-alert error" role="alert">{error}</div>}
      {notice && <div className="testcases-alert success" role="status">{notice}</div>}

      <section className="testcases-form-card">
        <h2>{editingId ? "Edit test case" : "Add a test case"}</h2>
        <p>Enter exactly the input your program reads and the expected output it should print.</p>
        <form onSubmit={handleSubmit}>
          <label>Input<textarea required value={form.inputData} onChange={(event) => setForm({ ...form, inputData: event.target.value })} placeholder="Example: 121" rows={3} /></label>
          <label>Expected output<textarea required value={form.expectedOutput} onChange={(event) => setForm({ ...form, expectedOutput: event.target.value })} placeholder="Example: true" rows={3} /></label>
          <div className="testcases-options">
            <label><input type="checkbox" checked={form.isSample} onChange={(event) => setForm({ ...form, isSample: event.target.checked, isHidden: event.target.checked ? false : form.isHidden })} /> Show as sample</label>
            <label><input type="checkbox" checked={form.isHidden} disabled={form.isSample} onChange={(event) => setForm({ ...form, isHidden: event.target.checked })} /> Hide from learners (still used by Submit)</label>
          </div>
          <div className="testcases-form-actions">
            {editingId && <button type="button" className="testcases-cancel" onClick={resetForm}><FiX /> Cancel edit</button>}
            <button type="submit" className="testcases-save" disabled={saving}>{editingId ? <FiSave /> : <FiPlus />}{saving ? " Saving..." : editingId ? " Save changes" : " Add test case"}</button>
          </div>
        </form>
      </section>

      <section className="testcases-list-card">
        <div className="testcases-list-heading"><div><h2>Saved test cases</h2><p>Visible cases are shown on the problem page; hidden cases are used only for Submit.</p></div><strong>{cases.length}</strong></div>
        {loading ? <p className="testcases-empty">Loading test cases...</p> : cases.length === 0 ? <p className="testcases-empty">No saved cases yet. Add the first one above.</p> : (
          <div className="testcases-list">
            {cases.map((testCase, index) => (
              <article className="testcase-admin-row" key={testCase.id}>
                <div className="testcase-admin-meta"><strong>Case {index + 1}</strong><span>{testCase.isSample ? "Sample" : testCase.isHidden ? "Hidden" : "Public"}</span></div>
                <div className="testcase-admin-data"><div><small>Input</small><pre>{testCase.inputData}</pre></div><div><small>Expected output</small><pre>{testCase.expectedOutput}</pre></div></div>
                <div className="testcase-admin-actions"><button type="button" title="Edit" onClick={() => editCase(testCase)}><FiEdit2 /></button><button type="button" title="Delete" onClick={() => deleteCase(testCase)}><FiTrash2 /></button></div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
