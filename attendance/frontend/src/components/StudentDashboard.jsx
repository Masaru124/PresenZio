import { useState, useEffect } from "react";
import axios from "axios";

function StudentDashboard({ studentId }) {
  const [attendanceSummary, setAttendanceSummary] = useState({});
  const [results, setResults] = useState([]);
  const [leaveStatus, setLeaveStatus] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchAttendanceSummary();
    fetchResults();
    fetchLeaveStatus();
    fetchFeedbacks();
  }, [studentId]);

  const fetchAttendanceSummary = async () => {
    try {
      const res = await axios.get(`http://localhost:1516/api/attendance/student/${studentId}`);
      setAttendanceSummary(res.data.summary);
    } catch (error) {
      console.error("Failed to fetch attendance summary", error);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await axios.get(`http://localhost:1516/api/student/results/${studentId}`);
      setResults(res.data.results);
    } catch (error) {
      console.error("Failed to fetch results", error);
    }
  };

  const fetchLeaveStatus = async () => {
    // Implement API call to fetch leave status for student
  };

  const fetchFeedbacks = async () => {
    // Implement API call to fetch feedbacks for student
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Attendance Summary</h2>
        <ul>
          {Object.entries(attendanceSummary).map(([subject, percent]) => (
            <li key={subject}>
              {subject}: {percent.toFixed(2)}%
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Results</h2>
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              {result.subject}: {result.marks} / {result.max_marks} (Exam Date: {result.exam_date})
            </li>
          ))}
        </ul>
      </section>

      {/* Add UI for leave status and feedbacks */}
    </div>
  );
}

export default StudentDashboard;
