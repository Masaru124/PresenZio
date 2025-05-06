import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './index.css'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import ProfileSetup from './components/ProfileSetup.jsx'
import TeacherDashboard from './components/TeacherDashboard.jsx'
import StudentDashboard from './components/StudentDashboard.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import Navbar from './components/Navbar.jsx'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
