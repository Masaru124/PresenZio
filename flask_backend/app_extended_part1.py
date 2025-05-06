from flask import Flask, request, jsonify
from models import db, User, Attendance
from models_extended import Course, Subject
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

    # CRUD APIs for Subject

    @app.route('/api/admin/subjects', methods=['GET', 'POST'])
    def manage_subjects():
        if request.method == 'GET':
            subjects = Subject.query.all()
            return jsonify([{'id': s.id, 'name': s.name, 'course_id': s.course_id} for s in subjects])
        elif request.method == 'POST':
            data = request.get_json()
            name = data.get('name')
            course_id = data.get('course_id')
            if not all([name, course_id]):
                return jsonify({'error': 'Name and course_id are required'}), 400
            subject = Subject(name=name, course_id=course_id)
            db.session.add(subject)
            db.session.commit()
            return jsonify({'message': 'Subject created', 'id': subject.id}), 201

    @app.route('/api/admin/subjects/<int:subject_id>', methods=['PUT', 'DELETE'])
    def update_delete_subject(subject_id):
        subject = Subject.query.get(subject_id)
        if not subject:
            return jsonify({'error': 'Subject not found'}), 404
        if request.method == 'PUT':
            data = request.get_json()
            subject.name = data.get('name', subject.name)
            subject.course_id = data.get('course_id', subject.course_id)
            db.session.commit()
            return jsonify({'message': 'Subject updated'})
        elif request.method == 'DELETE':
            db.session.delete(subject)
            db.session.commit()
            return jsonify({'message': 'Subject deleted'})
