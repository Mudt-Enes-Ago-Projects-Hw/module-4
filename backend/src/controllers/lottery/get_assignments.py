"""
Get assignments controller
"""
from src.models import Assignment, Student


def get_assignments():
    """Get all lottery assignments with student details"""
    assignments = Assignment.query.join(Student).order_by(Assignment.room_number, Assignment.student_id).all()
    
    result = []
    for a in assignments:
        result.append({
            "id": a.id,
            "student_id": a.student_id,
            "name": a.student.name,
            "gpa": a.student.gpa,
            "corruption": a.student.corruption,
            "disabled": a.student.disabled,
            "room_number": a.room_number,
            "room_type": a.room_type,
            "roommate_id": a.roommate_id
        })
    
    return result
