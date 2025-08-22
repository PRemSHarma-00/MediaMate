import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { Menu, X } from "lucide-react"; // install lucide-react or use your own icons

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkBase =
    "block px-3 py-2 font-medium transition-colors duration-200 hover:text-purple-400";
  const activeClass = "text-purple-400";

  return (
    <nav className="sticky top-0 z-50 bg-black backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand text only */}
        <Link
          to="/"
          className="font-heading text-2xl font-bold tracking-wide text-white"
        >
          MediaMate
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/mainpage"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : "text-gray-200"}`
            }
          >
            Main Page
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/journal"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : "text-gray-200"}`
                }
              >
                Journal
              </NavLink>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : "text-gray-200"}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition"
              >
                Signup
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-200 hover:text-purple-400 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Slide-out Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur border-t border-gray-800 px-4 py-3 space-y-2">
          <NavLink
            to="/mainpage"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : "text-gray-200"}`
            }
            onClick={() => setMenuOpen(false)}
          >
            Main Page
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/journal"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : "text-gray-200"}`
                }
                onClick={() => setMenuOpen(false)}
              >
                Journal
              </NavLink>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : "text-gray-200"}`
                }
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="block px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition"
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
