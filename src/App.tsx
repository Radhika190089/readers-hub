import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Admin from "./Components/Admin";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const isLoggedIn = localStorage.getItem("loggedUser");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={isLoggedIn ? <Admin /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
