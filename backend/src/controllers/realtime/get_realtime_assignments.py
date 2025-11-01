"""
RealTime lottery assignments getter - for live 10-student lottery system
"""
from src.models.realtime_assignment import RealtimeAssignment
from src.models.realtime_student import RealtimeStudent


def get_realtime_assignments():
    """Get all realtime lottery assignments with student details"""
    assignments = RealtimeAssignment.query.join(RealtimeStudent).order_by(
        RealtimeAssignment.room_number,
        RealtimeAssignment.student_id
    ).all()
    
    result = []
    for assignment in assignments:
        student = assignment.student
        roommate_name = None
        if assignment.roommate_id:
            roommate = RealtimeStudent.query.get(assignment.roommate_id)
            if roommate:
                roommate_name = roommate.name
        
        result.append({
            'assignment_id': assignment.id,
            'student_id': student.id,
            'student_name': student.name,
            'gpa': student.gpa,
            'corruption': student.corruption,
            'disabled': student.disabled,
            'room_number': assignment.room_number,
            'room_type': assignment.room_type,
            'roommate_id': assignment.roommate_id,
            'roommate_name': roommate_name
        })
    
    return result
