import AppRoutes from "./routes/AppRoutes";
import { useLocation } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "./context/ThemeContext";

function AdminThemeToggle() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  if (!pathname.startsWith("/admin")) return null;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme"
      title="Toggle theme"
      style={{
        position: "fixed", right: 22, bottom: 22, zIndex: 9999,
        width: 46, height: 46, borderRadius: 14,
        display: "grid", placeItems: "center",
        color: "var(--text-primary)", background: "var(--section-color)",
        border: "1px solid var(--border-color)", boxShadow: "var(--shadow-card)",
      }}
    >
      {theme === "dark" ? <FaSun /> : <FaMoon />}
    </button>
  );
}

function App() {
  return (
    <>
      <AppRoutes />
      <AdminThemeToggle />
    </>
  );
}

export default App;
