import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="flex justify-between items-center p-4 shadow-md">
      <Link to="/" className="text-xl font-bold">MediaMate</Link>
      <div className="space-x-4 flex items-center">
        <Link to="/mainpage" className="hover:text-blue-500 transition-colors">
          Main Page
        </Link>
        {user ? (
          <>
            <Link to="/journal">Journal</Link>
            <button onClick={logout} className="text-red-500">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
