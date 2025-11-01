"""
Student management controller
"""
from src.db import db
from src.models import Student


def fetch_all_students():
    """Fetch all students from the database"""
    return [s.to_dict() for s in Student.query.all()]


def add_student(student_id: str, name: str, gpa: float, corruption: bool = False, disabled: bool = False):
    """Add a new student to the database"""
    try:
        student = Student(
            id=student_id,
            name=name,
            gpa=gpa,
            corruption=corruption,
            disabled=disabled
        )
        db.session.add(student)
        db.session.commit()
        return student_id
    except Exception as e:
        db.session.rollback()
        raise Exception(f"Failed to add student: {str(e)}")


def delete_student(student_id: str):
    """Delete a student from the database"""
    try:
        student = Student.query.get(student_id)
        if student:
            db.session.delete(student)
            db.session.commit()
            return True
        return False
    except Exception as e:
        db.session.rollback()
        raise Exception(f"Failed to delete student: {str(e)}")
