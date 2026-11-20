import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function Terms() {
  return <><Navbar /><main className="container" style={{ minHeight: "60vh", maxWidth: 900, paddingTop: 56, paddingBottom: 72 }}><p className="section-kicker">CODEARENA</p><h1>Terms &amp; Conditions</h1><p>Use CodeArena to practice programming and participate respectfully in the community. Keep your account credentials private and submit code that you have the right to use.</p><h2>Fair use</h2><p>Do not attempt to disrupt the service, access another member’s account or data, or misuse the code execution environment. Contest submissions should be your own work unless the contest rules say otherwise.</p><h2>Accounts and submissions</h2><p>You are responsible for activity performed through your account. CodeArena may store submitted code and evaluation results to provide problem history and progress features.</p><p>Need to return? <Link to="/register">Back to registration</Link></p></main><Footer /></>;
}

export default Terms;
