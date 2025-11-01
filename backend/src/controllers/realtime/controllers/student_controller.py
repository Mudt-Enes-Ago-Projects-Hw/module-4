from src.config.database import db
from src.models.realtime_student import RealtimeStudent


def add_student(student_id, name, gpa, corruption=False, disabled=False):
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


def delete_student(student_id):
    student = RealtimeStudent.query.get(student_id)
    if student:
        db.session.delete(student)
        db.session.commit()
        return True
    return False


def fetch_all_students():
    students = RealtimeStudent.query.all()
    return [student.to_dict() for student in students]


def get_student_count():
    return RealtimeStudent.query.count()


def clear_all_students():
    RealtimeStudent.query.delete()
    db.session.commit()
    return True
