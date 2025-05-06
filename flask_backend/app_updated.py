from flask import Flask, request, jsonify, make_response
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from models import db, User, Attendance
from models_extended import Course, Subject, Session, Leave, Feedback, Result
import os
from dotenv import load_dotenv
from datetime import datetime

# Import extended route registration functions
from app_extended_part1 import register_extended_routes as register_routes_part1
from app_extended_part2 import register_extended_routes_part2 as register_routes_part2
from app_extended_part3 import register_extended_routes_part3 as register_routes_part3

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)

@app.before_request
def log_request_info():
    print(f"Received {request.method} request for {request.path}")
    if request.method == 'OPTIONS':
        print(f"OPTIONS request headers: {dict(request.headers)}")

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
bcrypt = Bcrypt(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}, r"/auth/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    usn = data.get('usn')
    password = data.get('password')
    role = data.get('role')

    if not all([email, usn, password, role]):
        return jsonify({'error': 'Missing required fields'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email=email, usn=usn, password=hashed_password, role=role, profile_completed=False)
    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({'id': user.id, 'email': user.email, 'usn': user.usn, 'role': user.role, 'profile_completed': user.profile_completed}), 201
    except Exception as e:
        return jsonify({'error': 'Server error during registration'}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        return jsonify({'id': user.id, 'email': user.email, 'usn': user.usn, 'role': user.role, 'profile_completed': user.profile_completed}), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401

@app.route('/api/profile/setup', methods=['POST', 'OPTIONS'])
def setup_profile():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response

    data = request.get_json()
    user_id = data.get('userId')
    name = data.get('name')
    class_or_department = data.get('classOrDepartment')
    section = data.get('section')

    if not all([user_id, name, class_or_department, section]):
        return jsonify({'error': 'Missing required fields'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.name = name
    user.class_or_department = class_or_department
    user.section = section
    user.profile_completed = True

    try:
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully', 'role': user.role}), 200
    except Exception as e:
        return jsonify({'error': 'Server error during profile setup'}), 500

@app.route('/api/attendance/students', methods=['GET'])
def get_students_by_section():
    section = request.args.get('section')
    if not section:
        return jsonify({'error': 'Section parameter is required'}), 400
    students = User.query.filter_by(role='Student', section=section).all()
    students_data = [{'id': s.id, 'name': s.name, 'usn': s.usn} for s in students]
    return jsonify({'students': students_data}), 200

@app.route('/api/attendance/save', methods=['POST'])
def save_attendance():
    data = request.get_json()
    subject = data.get('subject')
    date_str = data.get('date')
    time_str = data.get('time')
    section = data.get('section')
    attendance_list = data.get('attendance')

    if not all([subject, date_str, time_str, section, attendance_list]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        time = datetime.strptime(time_str, '%H:%M').time()
    except ValueError:
        return jsonify({'error': 'Invalid date or time format'}), 400

    # Save or update attendance records
    for record in attendance_list:
        student_id = record.get('studentId')
        present = record.get('present', False)
        if not student_id:
            continue
        attendance_record = Attendance.query.filter_by(
            student_id=student_id,
            subject=subject,
            date=date,
            time=time,
            section=section
        ).first()
        if attendance_record:
            attendance_record.present = present
        else:
            new_record = Attendance(
                student_id=student_id,
                subject=subject,
                date=date,
                time=time,
                section=section,
                present=present
            )
            db.session.add(new_record)
    try:
        db.session.commit()
        return jsonify({'message': 'Attendance saved successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Server error while saving attendance'}), 500

@app.route('/api/attendance/student/<int:student_id>', methods=['GET'])
def get_student_attendance(student_id):
    student = User.query.filter_by(id=student_id, role='Student').first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    records = Attendance.query.filter_by(student_id=student_id).all()
    attendance_records = []
    subject_counts = {}
    subject_present = {}
    weekly_report = {}

    for record in records:
        date_str = record.date.strftime('%Y-%m-%d')
        attendance_records.append({
            'subject': record.subject,
            'date': date_str,
            'present': record.present
        })
        subject_counts[record.subject] = subject_counts.get(subject, 0) + 1
        if record.present:
            subject_present[record.subject] = subject_present.get(record.subject, 0) + 1

        if date_str not in weekly_report:
            weekly_report[date_str] = {'present': 0, 'absent': 0}
        if record.present:
            weekly_report[date_str]['present'] += 1
        else:
            weekly_report[date_str]['absent'] += 1

    attendance_summary = {}
    for subject, count in subject_counts.items():
        present_count = subject_present.get(subject, 0)
        attendance_summary[subject] = (present_count / count) * 100 if count > 0 else 0

    return jsonify({'records': attendance_records, 'summary': attendance_summary, 'weeklyReport': weekly_report}), 200

# Register extended routes
from app_extended_part1 import register_extended_routes as register_routes_part1
from app_extended_part2 import register_extended_routes_part2 as register_routes_part2
from app_extended_part3 import register_extended_routes_part3 as register_routes_part3

register_routes_part1(app, bcrypt, CORS)
register_routes_part2(app, bcrypt, CORS)
register_routes_part3(app, bcrypt, CORS)

if __name__ == '__main__':
    app.run(port=1516)
