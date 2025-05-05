import { useState, useEffect } from "react";
import axios from "axios";

function StudentDashboard() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({}); // subject: percentage
  const [weeklyReport, setWeeklyReport] = useState({}); // date: {present: count, absent: count}

  useEffect(() => {
    // Get logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      console.error("User not logged in");
      return;
    }
    const studentId = user.id;

    axios.get(`http://localhost:1516/api/attendance/student/${studentId}`)
      .then(res => {
        setAttendanceRecords(res.data.records);
        setAttendanceSummary(res.data.summary);
        generateWeeklyReport(res.data.records);
      })
      .catch(err => {
        console.error("Failed to load attendance records:", err);
      });
  }, []);

  const generateWeeklyReport = (records) => {
    // Generate a simple weekly report summary grouped by date
    const report = {};
    records.forEach(record => {
      const date = record.date;
      if (!report[date]) {
        report[date] = { present: 0, absent: 0 };
      }
      if (record.present) {
        report[date].present += 1;
      } else {
        report[date].absent += 1;
      }
    });
    setWeeklyReport(report);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

      <h2 className="text-xl font-semibold mb-2">Attendance Records</h2>
      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Subject</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map((record, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{record.subject}</td>
              <td className="border border-gray-300 p-2">{record.date}</td>
              <td className="border border-gray-300 p-2">{record.present ? "Present" : "Absent"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mb-2">Attendance Summary (%)</h2>
      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Subject</th>
            <th className="border border-gray-300 p-2">Attendance %</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(attendanceSummary).map(([subject, percent]) => (
            <tr key={subject}>
              <td className="border border-gray-300 p-2">{subject}</td>
              <td className="border border-gray-300 p-2">{percent.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mb-2">Weekly Report</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Present</th>
            <th className="border border-gray-300 p-2">Absent</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(weeklyReport).map(([date, counts]) => (
            <tr key={date}>
              <td className="border border-gray-300 p-2">{date}</td>
              <td className="border border-gray-300 p-2">{counts.present}</td>
              <td className="border border-gray-300 p-2">{counts.absent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentDashboard;
