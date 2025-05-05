import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";  // Import Link and useNavigate
import axios from "axios"; // Import axios for making HTTP requests

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:1516/auth/login", {
        email,
        password,
      });
      console.log("Logged in user:", res.data);
      const user = res.data;
      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      if (!user.profile_completed) {
        navigate("/profile-setup");
      } else if (user.role === "Teacher") {
        navigate("/teacher-dashboard");
      } else if (user.role === "Student") {
        navigate("/student-dashboard");
      } else {
        // Default fallback
        navigate("/login");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <div id="main" className="bg-white p-10 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg border-1 border-black w-full max-w-md text-sm">
        <h1 className="text-2xl text-center font-bold text-gray-800 mb-6">Login to PresenZio</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-black text-white font-semibold rounded-md hover:bg-blue-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
