"""
RealTime student controller - for live 10-student lottery system
"""
from src.db import db
from src.models.realtime_student import RealtimeStudent


def add_realtime_student(student_id, name, gpa, corruption=False, disabled=False):
    """Add a new realtime student (max 10 students allowed)"""
    # Check if we already have 10 students
    student_count = RealtimeStudent.query.count()
    if student_count >= 10:
        raise ValueError("Maximum 10 students allowed for realtime lottery")
    
    # Check if student already exists
    existing = RealtimeStudent.query.get(student_id)
    if existing:
        raise ValueError(f"Student with ID {student_id} already exists")
    
    student = RealtimeStudent(
        id=student_id,
        name=name,
        gpa=gpa,
        corruption=corruption,
        disabled=disabled
    )
    db.session.add(student)
    db.session.commit()
    return student.id


def delete_realtime_student(student_id):
    """Delete a realtime student by ID"""
    student = RealtimeStudent.query.get(student_id)
    if student:
        db.session.delete(student)
        db.session.commit()
        return True
    return False


def fetch_all_realtime_students():
    """Get all realtime students"""
    students = RealtimeStudent.query.all()
    return [student.to_dict() for student in students]


def get_realtime_student_count():
    """Get the current count of realtime students"""
    return RealtimeStudent.query.count()


def clear_all_realtime_students():
    """Clear all realtime students (for resetting the system)"""
    RealtimeStudent.query.delete()
    db.session.commit()
    return True
