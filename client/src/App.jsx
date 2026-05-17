import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Journal from "./pages/Journal";
import MediaSuggestionPage from "./pages/mainpage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mainpage" element={<MediaSuggestionPage />} />

        {/* Protected routes — must be logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/journal" element={<Journal />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;