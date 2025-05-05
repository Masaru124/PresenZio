import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProfileSetup() {
  const [name, setName] = useState("");
  const [classOrDepartment, setClassOrDepartment] = useState("");
  const [section, setSection] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.profile_completed) {
      const role = user.role;
      if (role === "Teacher") {
        navigate("/teacher-dashboard");
      } else if (role === "Student") {
        navigate("/student-dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Get userId from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        console.error("User not logged in");
        navigate("/login");
        return;
      }
      const userId = user.id;

      const res = await axios.post(`http://localhost:1516/api/profile/setup`, {
        userId,
        name,
        classOrDepartment,
        section,
      });

      if (res.status === 200) {
        // Update localStorage user profile_completed to true
        user.profile_completed = true;
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect to dashboard based on role after profile completion
        const role = res.data.role;
        if (role === "Teacher") {
          navigate("/teacher-dashboard");
        } else if (role === "Student") {
          navigate("/student-dashboard");
        } else {
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Profile setup failed:", error.response?.data || error.message);
    }
  };

  return (
    <div id="main" className="bg-white p-10 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg border-1 border-black w-full max-w-md text-sm">
        <h1 className="text-2xl text-center font-bold text-gray-800 mb-6">Complete Your Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="classOrDepartment" className="block text-gray-700 font-semibold mb-2">Class / Department</label>
            <input
              type="text"
              id="classOrDepartment"
              placeholder="Enter your class or department"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
              onChange={(e) => setClassOrDepartment(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="section" className="block text-gray-700 font-semibold mb-2">Section</label>
            <input
              type="text"
              id="section"
              placeholder="Enter your section"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
              onChange={(e) => setSection(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-black text-white font-semibold rounded-md hover:bg-blue-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;
