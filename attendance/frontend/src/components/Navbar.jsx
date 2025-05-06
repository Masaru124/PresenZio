import { NavLink } from "react-router-dom";

const Navbar = () => {
  const activeStyle = {
    fontWeight: "bold",
    textDecoration: "underline",
  };

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <NavLink to="/login" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        Login
      </NavLink>{" | "}
      <NavLink to="/signup" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        Signup
      </NavLink>{" | "}
      <NavLink to="/profile-setup" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        Profile Setup
      </NavLink>{" | "}
      <NavLink to="/teacher-dashboard" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        Teacher Dashboard
      </NavLink>{" | "}
      <NavLink to="/student-dashboard" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        Student Dashboard
      </NavLink>{" | "}
      <NavLink to="/admin-dashboard" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        Admin Dashboard
      </NavLink>
    </nav>
  );
};

export default Navbar;
