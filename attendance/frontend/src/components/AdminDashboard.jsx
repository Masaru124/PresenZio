import { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchSubjects();
    fetchStaffs();
    fetchStudents();
    fetchSessions();
    fetchLeaveRequests();
    fetchFeedbacks();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:1516/api/admin/courses");
      setCourses(res.data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:1516/api/admin/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error("Failed to fetch subjects", error);
    }
  };

  const fetchStaffs = async () => {
    try {
      const res = await axios.get("http://localhost:1516/api/admin/staffs");
      setStaffs(res.data);
    } catch (error) {
      console.error("Failed to fetch staffs", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:1516/api/admin/students");
      setStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:1516/api/admin/sessions");
      setSessions(res.data);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    }
  };

  const fetchLeaveRequests = async () => {
    // Implement API call to fetch leave requests
  };

  const fetchFeedbacks = async () => {
    // Implement API call to fetch feedbacks
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Courses</h2>
        <ul>
          {courses.map((course) => (
            <li key={course.id}>{course.name}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Subjects</h2>
        <ul>
          {subjects.map((subject) => (
            <li key={subject.id}>{subject.name}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Staffs</h2>
        <ul>
          {staffs.map((staff) => (
            <li key={staff.id}>{staff.name}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Students</h2>
        <ul>
          {students.map((student) => (
            <li key={student.id}>{student.name}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Sessions</h2>
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>{session.name}</li>
          ))}
        </ul>
      </section>

      {/* Add UI for leave requests and feedbacks */}
    </div>
  );
}

export default AdminDashboard;
