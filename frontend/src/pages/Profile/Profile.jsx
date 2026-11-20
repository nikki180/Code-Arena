import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBolt, FaCalendarAlt, FaCode, FaFire, FaTrophy, FaUser } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../api/axios";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null") ?? {}; }
    catch { return {}; }
  });
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    let active = true;
    api.get("/api/dashboard")
      .then(({ data }) => {
        const result = data?.data ?? data;
        if (active && result && typeof result === "object") setProfile((current) => ({ ...current, ...result }));
      })
      .catch(() => { if (active) setConnected(false); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const name = profile.fullName ?? profile.name ?? "Coder";
  const joined = profile.createdAt ?? profile.joinedAt;
  const joinedLabel = joined && !Number.isNaN(new Date(joined).getTime())
    ? new Date(joined).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : "CodeArena member";

  return (
    <>
      <Navbar />
      <main className="profile-page">
        <div className="profile-shell">
          <div className="profile-title"><div><span>YOUR SPACE</span><h1>Profile</h1><p>Your coding journey, all in one place.</p></div><Link to="/problems">Practice problems <FaArrowRight /></Link></div>
          <section className="profile-identity">
            <div className="profile-avatar">{profile.profileImage ? <img src={profile.profileImage} alt={`${name}'s profile`} /> : name.charAt(0).toUpperCase()}</div>
            <div className="profile-identity-copy"><span className="profile-member">CODEARENA MEMBER</span><h2>{name}</h2><p>{profile.email ?? "Sign in to connect your account"}</p><span className="profile-joined"><FaCalendarAlt /> {joinedLabel}</span></div>
            <Link className="profile-edit-link" to={profile.email ? "/dashboard" : "/login"}><FaUser /> {profile.email ? "Open dashboard" : "Sign in"}</Link>
          </section>
          {!connected && <div className="profile-notice">Showing saved account details. Sign in and connect to your backend to load live activity.</div>}
          <div className="profile-stats">
            <article><span className="profile-stat-icon blue"><FaCode /></span><small>Problems solved</small><strong>{loading ? "—" : profile.totalProblemSolved ?? profile.problemsSolved ?? 0}</strong></article>
            <article><span className="profile-stat-icon orange"><FaFire /></span><small>Current streak</small><strong>{loading ? "—" : <>{profile.currentStreak ?? 0}<em> days</em></>}</strong></article>
            <article><span className="profile-stat-icon cyan"><FaBolt /></span><small>Submissions</small><strong>{loading ? "—" : profile.totalSubmission ?? profile.totalSubmissions ?? 0}</strong></article>
            <article><span className="profile-stat-icon purple"><FaTrophy /></span><small>Best streak</small><strong>{loading ? "—" : <>{profile.maxStreak ?? 0}<em> days</em></>}</strong></article>
          </div>
          <section className="profile-next"><div className="profile-next-icon"><FaCode /></div><div><h3>Keep your momentum going</h3><p>Choose a problem, write a solution, and build your daily streak.</p></div><Link to="/problems">Browse problems <FaArrowRight /></Link></section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Profile;
