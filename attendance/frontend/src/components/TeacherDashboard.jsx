import { useState, useEffect } from "react";
import axios from "axios";

function TeacherDashboard() {
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [section, setSection] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: true/false }

  // Load student list based on section
  useEffect(() => {
    if (section) {
      // Fetch students for the section
      axios.get(`http://localhost:1516/api/attendance/students?section=${section}`)
        .then(res => {
          setStudentList(res.data.students);
          // Initialize attendance state
          const initialAttendance = {};
          res.data.students.forEach(student => {
            initialAttendance[student.id] = false; // default absent
          });
          setAttendance(initialAttendance);
        })
        .catch(err => {
          console.error("Failed to load students:", err);
        });
    }
  }, [section]);

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSaveAttendance = () => {
    // Prepare attendance data
    const attendanceData = studentList.map(student => ({
      studentId: student.id,
      present: attendance[student.id] || false,
    }));

    // Send attendance data to backend
    axios.post("http://localhost:1516/api/attendance/save", {
      subject,
      date,
      time,
      section,
      attendance: attendanceData,
    })
    .then(res => {
      alert("Attendance saved successfully");
    })
    .catch(err => {
      console.error("Failed to save attendance:", err);
      alert("Failed to save attendance");
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Time</label>
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Section</label>
        <input
          type="text"
          value={section}
          onChange={e => setSection(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <h2 className="text-xl font-semibold mb-2">Student List</h2>
      <ul>
        {studentList.map(student => (
          <li key={student.id} className="mb-1">
            <label>
              <input
                type="checkbox"
                checked={attendance[student.id] || false}
                onChange={() => toggleAttendance(student.id)}
                className="mr-2"
              />
              {student.name} ({student.usn})
            </label>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSaveAttendance}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Attendance
      </button>
    </div>
  );
}

export default TeacherDashboard;
