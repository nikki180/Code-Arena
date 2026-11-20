import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaCalendarAlt, FaClock, FaTrophy } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../api/axios";
import "./Contests.css";

function Contests() {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/api/contests")
      .then(({ data }) => {
        const list = data?.data ?? data;
        if (active) setContests(Array.isArray(list) ? list : []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Contests could not be loaded.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const register = async (contestId) => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { state: { from: "/contests" } });
      return;
    }
    setMessage("");
    try {
      await api.post(`/api/contest-registrations/${contestId}`);
      setMessage("You are registered for the contest.");
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || "Could not register. You may already be registered.");
    }
  };

  const dateLabel = (value) => value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "Schedule to be announced";

  return (
    <>
      <Navbar />
      <main className="contests-page">
        <div className="contests-shell">
          <header className="contests-heading"><div><span><FaTrophy /> CODEARENA EVENTS</span><h1>Contests</h1><p>Compete, practice under time pressure, and see how you rank.</p></div></header>
          {message && <p className="contest-message" role="status">{message}</p>}
          <section className="contest-list" aria-label="Available contests">
            {loading ? <div className="contest-empty">Loading contests…</div> : error ? <div className="contest-empty contest-error">{error}</div> : contests.length === 0 ? (
              <div className="contest-empty"><span className="contest-empty-icon"><FaTrophy /></span><h2>No contests scheduled yet</h2><p>New contests will appear here when an admin schedules them.</p></div>
            ) : contests.map((contest) => (
              <article className="contest-card" key={contest.id}>
                <div className="contest-card-icon"><FaTrophy /></div>
                <div className="contest-card-main"><div className="contest-card-top"><h2>{contest.title}</h2><span className={`contest-status ${String(contest.status || "upcoming").toLowerCase()}`}>{contest.status || "UPCOMING"}</span></div>
                  <p>{contest.description || "Put your coding skills to the test."}</p>
                  <div className="contest-dates"><span><FaCalendarAlt /> Starts {dateLabel(contest.startTime)}</span><span><FaClock /> Ends {dateLabel(contest.endTime)}</span></div>
                </div>
                <button type="button" className="contest-register" onClick={() => register(contest.id)}>Register <FaArrowRight /></button>
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Contests;
