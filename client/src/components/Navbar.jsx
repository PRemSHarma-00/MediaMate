import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { Menu, X, BookOpen, Clapperboard, LogOut, LogIn, UserPlus } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const NavItem = ({ to, children, icon: Icon, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all duration-200 group ${
          isActive
            ? "text-blue-400"
            : "text-gray-300 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {Icon && <Icon size={15} className="shrink-0" />}
          {children}
          <span
            className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-blue-500 transition-all duration-300 ${
              isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100"
            }`}
          />
        </>
      )}
    </NavLink>
  );

  return (
    <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/[0.07]"
      style={{ boxShadow: "0 1px 0 0 rgba(168,85,247,0.12)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
        >
          <img
            src="/sanji.png"
            alt="MediaMate Logo"
            className="w-8 h-8 rounded-full ring-1 ring-blue-500/40 group-hover:ring-blue-400 transition-all duration-300 group-hover:scale-105"
          />
          <span className="font-heading text-xl font-bold text-blue-400 tracking-wide">
            MediaMate
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavItem to="/mainpage" icon={Clapperboard}>Discover</NavItem>

          {user ? (
            <>
              <NavItem to="/journal" icon={BookOpen}>Journal</NavItem>
              <button
                onClick={logout}
                className="ml-3 flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-red-400 border border-red-500/30 rounded-full hover:bg-red-500/10 hover:border-red-400/50 transition-all duration-200"
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavItem to="/login" icon={LogIn}>Login</NavItem>
              <NavLink
                to="/signup"
                className="ml-3 flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white rounded-full bg-blue-600 hover:bg-blue-500 transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-blue-800/50"
              >
                <UserPlus size={14} />
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Slide-down Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass border-t border-white/[0.07] px-4 py-3 space-y-1">
          <NavLink
            to="/mainpage"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? "bg-blue-500/20 text-blue-300" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            <Clapperboard size={16} /> Discover
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/journal"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive ? "bg-blue-500/20 text-blue-300" : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                <BookOpen size={16} /> Journal
              </NavLink>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive ? "bg-blue-500/20 text-blue-300" : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                <LogIn size={16} /> Login
              </NavLink>
              <NavLink
                to="/signup"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all"
                onClick={() => setMenuOpen(false)}
              >
                <UserPlus size={16} /> Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
