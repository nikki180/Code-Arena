import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaMedal, FaTrophy } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../api/axios";
import "./Leaderboard.css";

const unwrap = (payload) => payload?.data?.data ?? payload?.data ?? [];

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/api/leaderboard")
      .then((response) => {
        const result = unwrap(response);
        const list = Array.isArray(result) ? result : result?.leaderboard ?? result?.users ?? [];
        if (active) setEntries(list);
      })
      .catch(() => { if (active) setError("Leaderboard data is unavailable right now."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const rankedEntries = useMemo(
    () => [...entries].sort((a, b) =>
      (a.currentRank ?? Number.MAX_SAFE_INTEGER) - (b.currentRank ?? Number.MAX_SAFE_INTEGER) ||
      (b.totalScore ?? 0) - (a.totalScore ?? 0)
    ),
    [entries]
  );

  return (
    <>
      <Navbar />
      <main className="leaderboard-page">
        <div className="leaderboard-shell">
          <div className="leaderboard-heading">
            <div>
              <span className="leaderboard-eyebrow"><FaTrophy /> CODEARENA COMMUNITY</span>
              <h1>Leaderboard</h1>
              <p>See how your practice stacks up against the community.</p>
            </div>
            <span className="leaderboard-all-time">ALL TIME</span>
          </div>

          <section className="leaderboard-card" aria-label="Leaderboard rankings">
            <div className="leaderboard-card-head"><div><h2>Top coders</h2><p>Ranked by points earned</p></div><span className="leaderboard-live"><i /> Live rankings</span></div>
            {loading ? <div className="leaderboard-state">Loading rankings…</div> : error ? <div className="leaderboard-state leaderboard-error">{error}<button onClick={() => window.location.reload()}>Try again</button></div> : rankedEntries.length === 0 ? (
              <div className="leaderboard-state leaderboard-empty"><span className="leaderboard-empty-icon"><FaMedal /></span><h3>Your name could be here</h3><p>Start solving problems and earn points to appear on the leaderboard.</p><Link to="/problems">Explore problems <FaArrowRight /></Link></div>
            ) : (
              <div className="leaderboard-table-wrap"><table className="leaderboard-table"><thead><tr><th>Rank</th><th>Coder</th><th>Problems solved</th><th>Points</th></tr></thead><tbody>
                {rankedEntries.map((entry, index) => <tr key={entry.id ?? entry.userId ?? entry.email ?? index}>
                  <td><span className={`rank-number rank-${index + 1}`}>{index < 3 ? <FaMedal /> : `#${entry.currentRank ?? index + 1}`}</span></td>
                  <td><div className="rank-user"><span className="rank-avatar">{String(entry.fullName ?? entry.name ?? entry.userId ?? "C").charAt(0).toUpperCase()}</span><span><strong>{entry.fullName ?? entry.name ?? `Coder #${entry.userId ?? "—"}`}</strong><small>{entry.username ? `@${entry.username}` : entry.email ?? `User ID ${entry.userId ?? "—"}`}</small></span></div></td>
                  <td>{entry.totalProblemsSolved ?? entry.totalProblemSolved ?? entry.problemsSolved ?? 0}</td>
                  <td><strong className="rank-points">{entry.totalScore ?? entry.points ?? entry.score ?? 0}</strong></td>
                </tr>)}
              </tbody></table></div>
            )}
          </section>
          <div className="leaderboard-cta"><div><strong>Ready to climb the ranks?</strong><span>Every accepted solution brings you closer.</span></div><Link to="/problems">Start solving <FaArrowRight /></Link></div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Leaderboard;
