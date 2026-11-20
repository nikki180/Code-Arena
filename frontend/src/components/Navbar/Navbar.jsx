// import { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import { FaCode } from "react-icons/fa";
// import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
// import "./Navbar.css";
// import { useTheme } from "../../context/ThemeContext";

// const Navbar = () => {
// const { theme, toggleTheme } = useTheme();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   const closeMenu = () => {
//     setMenuOpen(false);
//   };

//   useEffect(() => {
//     if (menuOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }

//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [menuOpen]);

//   return (

//     <header className="navbar">

//       <div className="container nav-container">

//         {/* Logo */}

//         <NavLink
//           to="/"
//           className="logo"
//           onClick={closeMenu}
//         >
//           <FaCode className="logo-icon" />
//           <span>CodeArena</span>
//         </NavLink>

//         {/* Desktop + Mobile Menu */}

//         <nav className={menuOpen ? "nav-menu active" : "nav-menu"}>

//           <ul className="nav-links">

//             <li>
//               <a href="/#home" onClick={closeMenu}>
//                 Home
//               </a>
//             </li>

//             <li>
//               <a href="/#explore" onClick={closeMenu}>
//                 Explore
//               </a>
//             </li>

//             <li>
//               <a href="/#about" onClick={closeMenu}>
//                 About
//               </a>
//             </li>

//             <li>
//               <NavLink
//                 to="/problems"
//                 onClick={closeMenu}
//               >
//                 Problems
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to="/leaderboard"
//                 onClick={closeMenu}
//               >
//                 Leaderboard
//               </NavLink>
//             </li>

//           </ul>

//           {/* Mobile Buttons */}

//           <div className="mobile-buttons">
// <button
//     className="theme-btn"
//     onClick={toggleTheme}
// >

//     {theme === "dark"
//         ? <FiSun />
//         : <FiMoon />
//     }

// </button>

//             <NavLink
//               to="/login"
//               className="login-btn"
//               onClick={closeMenu}
//             >
//               Login
//             </NavLink>

//             <NavLink
//               to="/register"
//               className="signup-btn"
//               onClick={closeMenu}
//             >
//               Sign Up
//             </NavLink>

//           </div>

//         </nav>

//         {/* Desktop Right */}

//         <div className="nav-right">

//           <button className="theme-btn">
//             <FiSun />
//           </button>

//           <NavLink
//             to="/login"
//             className="login-btn"
//           >
//             Login
//           </NavLink>

//           <NavLink
//             to="/register"
//             className="signup-btn"
//           >
//             Sign Up
//           </NavLink>

//         </div>

//         {/* Hamburger */}

//         <button
//           className="menu-btn"
//           onClick={toggleMenu}
//         >
//           {menuOpen ? <FiX /> : <FiMenu />}
//         </button>

//       </div>

//     </header>

//   );
// };

// export default Navbar;






















import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaCode } from "react-icons/fa";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";

import "./Navbar.css";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {

  const { theme, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  });

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    closeMenu();
  };

  useEffect(() => {

    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };

  }, [menuOpen]);

  return (

    <header className="navbar">

      <div className="container nav-container">

        {/* ===========================
            LOGO
        =========================== */}

        <NavLink
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          <FaCode className="logo-icon" />

          <span>CodeArena</span>
        </NavLink>


        {/* ===========================
            NAVIGATION
        =========================== */}

        <nav
          className={
            menuOpen
              ? "nav-menu active"
              : "nav-menu"
          }
        >

          <ul className="nav-links">

            <li>
              <a
                href="/#home"
                onClick={closeMenu}
              >
                Home
              </a>
            </li>

            <li>
              <a
                href="/#explore"
                onClick={closeMenu}
              >
                Explore
              </a>
            </li>

            <li>
              <a
                href="/#about"
                onClick={closeMenu}
              >
                About
              </a>
            </li>

            <li>
              <NavLink
                to="/problems"
                onClick={closeMenu}
              >
                Problems
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/leaderboard"
                onClick={closeMenu}
              >
                Leaderboard
              </NavLink>
            </li>

            {user && <li><NavLink to="/profile" onClick={closeMenu}>Profile</NavLink></li>}

          </ul>


          {/* ===========================
              MOBILE BUTTONS
          =========================== */}

          <div className="mobile-buttons">

            {/* Mobile Theme */}

            <button
              type="button"
              className="theme-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >

              {theme === "dark" ? (
                <FiSun />
              ) : (
                <FiMoon />
              )}

            </button>


            {/* Mobile Login */}

            {user ? <button type="button" className="login-btn" onClick={logout}>Sign out</button> : <NavLink to="/login" className="login-btn" onClick={closeMenu}>Login</NavLink>}


            {/* Mobile Sign Up */}

            {user ? <NavLink to={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"} className="signup-btn" onClick={closeMenu}>Dashboard</NavLink> : <NavLink to="/register" className="signup-btn" onClick={closeMenu}>Sign Up</NavLink>}

          </div>

        </nav>


        {/* ===========================
            DESKTOP RIGHT SECTION
        =========================== */}

        <div className="nav-right">

          {/* Theme */}

          <button
            type="button"
            className="theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >

            {theme === "dark" ? (
              <FiSun />
            ) : (
              <FiMoon />
            )}

          </button>


          {/* Login */}

          {user ? <button type="button" className="login-btn" onClick={logout}>Sign out</button> : <NavLink to="/login" className="login-btn">Login</NavLink>}


          {/* Sign Up */}

            {user ? <NavLink to={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"} className="signup-btn">Dashboard</NavLink> : <NavLink to="/register" className="signup-btn">Sign Up</NavLink>}

        </div>


        {/* ===========================
            HAMBURGER
        =========================== */}

        <button
          type="button"
          className="menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >

          {menuOpen ? (
            <FiX />
          ) : (
            <FiMenu />
          )}

        </button>

      </div>

    </header>

  );
};

export default Navbar;
