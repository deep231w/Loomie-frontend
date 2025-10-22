import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/Signup";
import ProtectedLayout from "./protectedRoute";
import Room from "./components/Room/Room";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); 
  if (!token) {
    return <Navigate to="/login" replace />; 
  }
  return children; 
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
                <ProtectedLayout>
                    <Home/>
                </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/room" element={
          <ProtectedRoute>
                <ProtectedLayout>
                    <Room/>
                </ProtectedLayout>
            </ProtectedRoute>
        }/>
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;