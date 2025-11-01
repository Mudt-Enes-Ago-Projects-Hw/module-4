import random
from src.config.database import db
from src.models.realtime_student import RealtimeStudent
from src.models.realtime_assignment import RealtimeAssignment


def run_lottery():
    """
    Run the lottery for exactly 10 students:
    - 1 premium room (corrupt or random)
    - 3 single rooms (top GPA + disabled + random)
    - 3 double rooms (remaining 6 students, 2 per room)
    """
    # Check if we have exactly 10 students
    students = RealtimeStudent.query.all()
    if len(students) != 10:
        raise ValueError(f"Realtime lottery requires exactly 10 students, but found {len(students)}")
    
    RealtimeAssignment.query.delete()
    
    available_students = students.copy()
    random.shuffle(available_students)
    
    assignments = []
    
    # 1. Premium Room
    corrupt_students = [s for s in available_students if s.corruption]
    if corrupt_students:
        premium_student = corrupt_students[0]
    else:
        premium_student = available_students[0]
    
    assignments.append(RealtimeAssignment(
        student_id=premium_student.id,
        room_number=1,
        room_type='premium',
        roommate_id=None
    ))
    available_students.remove(premium_student)
    
    # 2. Single Rooms
    single_room_students = []
    
    # Get top GPA student
    available_students.sort(key=lambda s: s.gpa, reverse=True)
    if available_students:
        single_room_students.append(available_students.pop(0))
    
    # Get disabled student/s
    disabled_students = [s for s in available_students if s.disabled]
    if disabled_students and len(single_room_students) < 3:
        single_room_students.append(disabled_students[0])
        available_students.remove(disabled_students[0])
    
    # Fill remaining single rooms randomly
    while len(single_room_students) < 3 and available_students:
        random_student = random.choice(available_students)
        single_room_students.append(random_student)
        available_students.remove(random_student)
    
    for i, student in enumerate(single_room_students):
        assignments.append(RealtimeAssignment(
            student_id=student.id,
            room_number=2 + i,
            room_type='single',
            roommate_id=None
        ))
    
    # 3. Double Rooms
    random.shuffle(available_students)
    for i in range(0, len(available_students), 2):
        if i + 1 < len(available_students):

            s1 = available_students[i]
            s2 = available_students[i + 1]
            room_number = 5 + (i // 2)
            
            assignments.append(RealtimeAssignment(
                student_id=s1.id,
                room_number=room_number,
                room_type='double',
                roommate_id=s2.id
            ))
            assignments.append(RealtimeAssignment(
                student_id=s2.id,
                room_number=room_number,
                room_type='double',
                roommate_id=s1.id
            ))
    
    for assignment in assignments:
        db.session.add(assignment)
    db.session.commit()
    
    return {
        "message": "Realtime lottery completed successfully",
        "total_students": 10,
        "premium_rooms": 1,
        "single_rooms": 3,
        "double_rooms": 3
    }
