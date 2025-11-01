"""
RealTime lottery runner - for live 10-student lottery system
Simplified allocation: 1 premium, 3 single, 3 double rooms (10 students total)
"""
import random
from src.db import db
from src.models.realtime_student import RealtimeStudent
from src.models.realtime_assignment import RealtimeAssignment


def run_realtime_lottery():
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
    
    # Clear previous assignments
    RealtimeAssignment.query.delete()
    
    # Create a mutable list of students
    available_students = students.copy()
    random.shuffle(available_students)
    
    assignments = []
    
    # 1. Premium Room (Room 1) - 1 student
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
    
    # 2. Single Rooms (Rooms 2-4) - 3 students
    single_room_students = []
    
    # Get top GPA student
    available_students.sort(key=lambda s: s.gpa, reverse=True)
    if available_students:
        single_room_students.append(available_students.pop(0))
    
    # Get disabled students (up to 1 more)
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
    
    # 3. Double Rooms (Rooms 5-7) - 6 students (3 rooms)
    random.shuffle(available_students)
    for i in range(0, len(available_students), 2):
        if i + 1 < len(available_students):
            student1 = available_students[i]
            student2 = available_students[i + 1]
            room_number = 5 + (i // 2)
            
            assignments.append(RealtimeAssignment(
                student_id=student1.id,
                room_number=room_number,
                room_type='double',
                roommate_id=student2.id
            ))
            assignments.append(RealtimeAssignment(
                student_id=student2.id,
                room_number=room_number,
                room_type='double',
                roommate_id=student1.id
            ))
    
    # Save all assignments
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
