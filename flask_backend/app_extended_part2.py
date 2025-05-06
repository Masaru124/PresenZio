from flask import Flask, request, jsonify
from models import db, User, Attendance
from models_extended import Session, Leave, Feedback, Result
from datetime import datetime

def register_extended_routes_part2(app, bcrypt, CORS):
    # CRUD APIs for Session

    @app.route('/api/admin/sessions', methods=['GET', 'POST'])
    def manage_sessions():
        if request.method == 'GET':
            sessions = Session.query.all()
            return jsonify([{'id': s.id, 'name': s.name, 'start_date': s.start_date.strftime('%Y-%m-%d'), 'end_date': s.end_date.strftime('%Y-%m-%d')} for s in sessions])
        elif request.method == 'POST':
            data = request.get_json()
            name = data.get('name')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            if not all([name, start_date, end_date]):
                return jsonify({'error': 'Name, start_date and end_date are required'}), 400
            session = Session(name=name, start_date=datetime.strptime(start_date, '%Y-%m-%d').date(), end_date=datetime.strptime(end_date, '%Y-%m-%d').date())
            db.session.add(session)
            db.session.commit()
            return jsonify({'message': 'Session created', 'id': session.id}), 201

    @app.route('/api/admin/sessions/<int:session_id>', methods=['PUT', 'DELETE'])
    def update_delete_session(session_id):
        session = Session.query.get(session_id)
        if not session:
            return jsonify({'error': 'Session not found'}), 404
        if request.method == 'PUT':
            data = request.get_json()
            session.name = data.get('name', session.name)
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            if start_date:
                session.start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            if end_date:
                session.end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            db.session.commit()
            return jsonify({'message': 'Session updated'})
        elif request.method == 'DELETE':
            db.session.delete(session)
            db.session.commit()
            return jsonify({'message': 'Session deleted'})

    # CRUD APIs for Staff (Users with role 'Staff')

    @app.route('/api/admin/staffs', methods=['GET', 'POST'])
    def manage_staffs():
        if request.method == 'GET':
            staffs = User.query.filter_by(role='Staff').all()
            return jsonify([{'id': s.id, 'name': s.name, 'email': s.email, 'usn': s.usn} for s in staffs])
        elif request.method == 'POST':
            data = request.get_json()
            email = data.get('email')
            usn = data.get('usn')
            password = data.get('password')
            name = data.get('name')
            if not all([email, usn, password, name]):
                return jsonify({'error': 'Missing required fields'}), 400
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            staff = User(email=email, usn=usn, password=hashed_password, role='Staff', name=name, profile_completed=True)
            db.session.add(staff)
            db.session.commit()
            return jsonify({'message': 'Staff created', 'id': staff.id}), 201

    @app.route('/api/admin/staffs/<int:staff_id>', methods=['PUT', 'DELETE'])
    def update_delete_staff(staff_id):
        staff = User.query.filter_by(id=staff_id, role='Staff').first()
        if not staff:
            return jsonify({'error': 'Staff not found'}), 404
        if request.method == 'PUT':
            data = request.get_json()
            staff.name = data.get('name', staff.name)
            staff.email = data.get('email', staff.email)
            staff.usn = data.get('usn', staff.usn)
            db.session.commit()
            return jsonify({'message': 'Staff updated'})
        elif request.method == 'DELETE':
            db.session.delete(staff)
            db.session.commit()
            return jsonify({'message': 'Staff deleted'})

    # CRUD APIs for Students (Users with role 'Student')

    @app.route('/api/admin/students', methods=['GET', 'POST'])
    def manage_students():
        if request.method == 'GET':
            students = User.query.filter_by(role='Student').all()
            return jsonify([{'id': s.id, 'name': s.name, 'email': s.email, 'usn': s.usn} for s in students])
        elif request.method == 'POST':
            data = request.get_json()
            email = data.get('email')
            usn = data.get('usn')
            password = data.get('password')
            name = data.get('name')
            class_or_department = data.get('class_or_department')
            section = data.get('section')
            if not all([email, usn, password, name, class_or_department, section]):
                return jsonify({'error': 'Missing required fields'}), 400
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            student = User(email=email, usn=usn, password=hashed_password, role='Student', name=name, class_or_department=class_or_department, section=section, profile_completed=True)
            db.session.add(student)
            db.session.commit()
            return jsonify({'message': 'Student created', 'id': student.id}), 201

    @app.route('/api/admin/students/<int:student_id>', methods=['PUT', 'DELETE'])
    def update_delete_student(student_id):
        student = User.query.filter_by(id=student_id, role='Student').first()
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        if request.method == 'PUT':
            data = request.get_json()
            student.name = data.get('name', student.name)
            student.email = data.get('email', student.email)
            student.usn = data.get('usn', student.usn)
            student.class_or_department = data.get('class_or_department', student.class_or_department)
            student.section = data.get('section', student.section)
            db.session.commit()
            return jsonify({'message': 'Student updated'})
        elif request.method == 'DELETE':
            db.session.delete(student)
            db.session.commit()
            return jsonify({'message': 'Student deleted'})
