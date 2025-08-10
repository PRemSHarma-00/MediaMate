import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import TestPage from "./pages/Journal";
import MediaSuggestionPage from "./pages/mainpage";
function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route>
          <Route path="/" element={<Home />} />
        <Route path="/journal" element={<TestPage />} />
        <Route path="/mainpage" element={<MediaSuggestionPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;