from flask import Flask, request, jsonify
from models import db, User, Attendance
from models_extended import Course, Subject, Session, Leave, Feedback, Result
from datetime import datetime

def register_extended_routes(app, bcrypt, CORS):
    # Admin APIs

    @app.route('/api/admin/courses', methods=['GET', 'POST'])
    def manage_courses():
        if request.method == 'GET':
            courses = Course.query.all()
            return jsonify([{'id': c.id, 'name': c.name, 'description': c.description} for c in courses])
        elif request.method == 'POST':
            data = request.get_json()
            name = data.get('name')
            description = data.get('description')
            if not name:
                return jsonify({'error': 'Course name is required'}), 400
            course = Course(name=name, description=description)
            db.session.add(course)
            db.session.commit()
            return jsonify({'message': 'Course created', 'id': course.id}), 201

    @app.route('/api/admin/courses/<int:course_id>', methods=['PUT', 'DELETE'])
    def update_delete_course(course_id):
        course = Course.query.get(course_id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404
        if request.method == 'PUT':
            data = request.get_json()
            course.name = data.get('name', course.name)
            course.description = data.get('description', course.description)
            db.session.commit()
            return jsonify({'message': 'Course updated'})
        elif request.method == 'DELETE':
            db.session.delete(course)
            db.session.commit()
            return jsonify({'message': 'Course deleted'})

    # Similar CRUD APIs for Subject, Session, Staff (User with role Staff), Students (User with role Student)

    # Leave management APIs

    @app.route('/api/leave/apply', methods=['POST'])
    def apply_leave():
        data = request.get_json()
        user_id = data.get('user_id')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        reason = data.get('reason')
        if not all([user_id, start_date, end_date, reason]):
            return jsonify({'error': 'Missing required fields'}), 400
        leave = Leave(user_id=user_id, start_date=datetime.strptime(start_date, '%Y-%m-%d').date(),
                      end_date=datetime.strptime(end_date, '%Y-%m-%d').date(), reason=reason)
        db.session.add(leave)
        db.session.commit()
        return jsonify({'message': 'Leave applied successfully'})

    @app.route('/api/admin/leave/review/<int:leave_id>', methods=['POST'])
    def review_leave(leave_id):
        data = request.get_json()
        status = data.get('status')  # Approved or Rejected
        leave = Leave.query.get(leave_id)
        if not leave:
            return jsonify({'error': 'Leave request not found'}), 404
        if status not in ['Approved', 'Rejected']:
            return jsonify({'error': 'Invalid status'}), 400
        leave.status = status
        db.session.commit()
        return jsonify({'message': f'Leave {status.lower()}'})

    # Feedback APIs

    @app.route('/api/feedback/send', methods=['POST'])
    def send_feedback():
        data = request.get_json()
        user_id = data.get('user_id')
        message = data.get('message')
        if not all([user_id, message]):
            return jsonify({'error': 'Missing required fields'}), 400
        feedback = Feedback(user_id=user_id, message=message)
        db.session.add(feedback)
        db.session.commit()
        return jsonify({'message': 'Feedback sent'})

    @app.route('/api/admin/feedback/reply/<int:feedback_id>', methods=['POST'])
    def reply_feedback(feedback_id):
        data = request.get_json()
        reply = data.get('reply')
        feedback = Feedback.query.get(feedback_id)
        if not feedback:
            return jsonify({'error': 'Feedback not found'}), 404
        feedback.reply = reply
        db.session.commit()
        return jsonify({'message': 'Reply sent'})

    # Result APIs

    @app.route('/api/staff/results', methods=['POST'])
    def add_update_result():
        data = request.get_json()
        student_id = data.get('student_id')
        subject_id = data.get('subject_id')
        marks = data.get('marks')
        max_marks = data.get('max_marks')
        exam_date = data.get('exam_date')
        if not all([student_id, subject_id, marks, max_marks, exam_date]):
            return jsonify({'error': 'Missing required fields'}), 400
        result = Result.query.filter_by(student_id=student_id, subject_id=subject_id, exam_date=datetime.strptime(exam_date, '%Y-%m-%d').date()).first()
        if result:
            result.marks = marks
            result.max_marks = max_marks
        else:
            result = Result(student_id=student_id, subject_id=subject_id, marks=marks, max_marks=max_marks, exam_date=datetime.strptime(exam_date, '%Y-%m-%d').date())
            db.session.add(result)
        db.session.commit()
        return jsonify({'message': 'Result saved'})

    @app.route('/api/student/results/<int:student_id>', methods=['GET'])
    def get_student_results(student_id):
        results = Result.query.filter_by(student_id=student_id).all()
        results_data = []
        for r in results:
            results_data.append({
                'subject': r.subject.name,
                'marks': r.marks,
                'max_marks': r.max_marks,
                'exam_date': r.exam_date.strftime('%Y-%m-%d')
            })
        return jsonify({'results': results_data})
