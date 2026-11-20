import { Routes, Route, Link, Navigate, Outlet, useLocation } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Problems from "../pages/Problems/Problems";
import ProblemDetails from "../pages/ProblemDetails/ProblemDetails";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminProblems from "../pages/Admin/AdminProblems";
import AdminCreateProblem from "../pages/Admin/AdminCreateProblem";
import AdminEditProblem from "../pages/Admin/AdminEditProblem";
import AdminUsers from "../pages/Admin/AdminUsers";
import AdminUserDetails from "../pages/Admin/AdminUserDetails";
import AdminSubmissions from "../pages/Admin/AdminSubmissions";
import AdminSubmissionDetails from "../pages/Admin/AdminSubmissionDetails";
import AdminContest from "../pages/Admin/AdminContest";
import CreateContest from "../pages/Admin/CreateContest";
import EditContest from "../pages/Admin/EditContest";
import Profile from "../pages/Profile/Profile";
import Leaderboard from "../pages/Leaderboard/Leaderboard";
import Contests from "../pages/Contests/Contests";
import Terms from "../pages/Terms";
import AdminProblemTestCases from "../pages/Admin/AdminProblemTestCases";

function RouteGuard({ adminOnly = false }) {
  const location = useLocation();
  let user = null;
  try { user = JSON.parse(localStorage.getItem("user") || "null"); }
  catch { user = null; }

  if (!user?.token) return <Navigate to="/login" replace state={{ from: location }} />;
  if (adminOnly && user.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

const AppRoutes = () => {
  return (
    <Routes>

      {/* Home */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Register */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* Problems */}
      <Route
        path="/problems"
        element={<Problems />}
      />

      {/* Problem Details */}
      <Route
        path="/problems/:id"
        element={<ProblemDetails />}
      />

      {/* Dashboard */}
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/contests" element={<Contests />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/dsa" element={<Problems />} />
      <Route path="*" element={<main style={{ minHeight: "65vh", display: "grid", placeContent: "center", textAlign: "center", padding: 24 }}><h1>Page not found</h1><p>This page may have moved or the address is incorrect.</p><Link to="/">Back to home</Link></main>} />

      <Route element={<RouteGuard />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route element={<RouteGuard adminOnly />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

      <Route
        path="/admin/problems"
        element={<AdminProblems />}
      />

      <Route
        path="/admin/problems/create"
        element={<AdminCreateProblem />}
      />

      <Route
        path="/admin/problems/edit/:id"
        element={<AdminEditProblem />}
      />

      <Route
        path="/admin/problems/:id/test-cases"
        element={<AdminProblemTestCases />}
      />

      <Route
        path="/admin/users"
        element={<AdminUsers />}
      />
<Route
  path="/admin/users/:id"
  element={<AdminUserDetails />}
/>
    
    <Route
  path="/admin/submissions"
  element={<AdminSubmissions />}
/>

<Route
  path="/admin/submissions/:id"
  element={<AdminSubmissionDetails />}
/>

<Route path="/admin/contests"
 element={<AdminContest />} />

 <Route
  path="/admin/contests/create"
  element={<CreateContest />}
/>


<Route
  path="/admin/contests/edit/:id"
  element={<EditContest />}
/>
      </Route>
    </Routes>

    


  );
};

export default AppRoutes;
