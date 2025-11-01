import random
from src.config.database import db
from src.models import Student, Assignment


def run_lottery():
    """
    Run the lottery with new distribution:
    - 10 premium rooms (for our relatives/friends that are students)
    - 30 single rooms (top 10 GPA + 10 disabled + 10 random)
    - 60 double rooms (remaining students, 2 per room)
    """
    students = [s.to_dict() for s in Student.query.all()]
    
    if len(students) != 100:
        raise RuntimeError(f"Expected 100 students in DB, found {len(students)}")

    # Clear previous assignments
    Assignment.query.delete()
    db.session.commit()

    students_by_id = {s["id"]: s for s in students}
    assignments_list = []

    # 1) Premium rooms (10 corrupt students, or all corrupt if less than 10)
    corrupt_students = [s for s in students if s["corruption"]]
    
    # If less than 10 corrupt students, fill remaining with random students
    if len(corrupt_students) < 10:
        non_corrupt = [s for s in students if not s["corruption"]]
        random.shuffle(non_corrupt)
        premium_students = corrupt_students + non_corrupt[:10 - len(corrupt_students)]
    else:
        premium_students = corrupt_students[:10]
    
    for idx, student in enumerate(premium_students, start=1):
        assignments_list.append({
            "student_id": student["id"],
            "room_number": idx,
            "room_type": "premium",
            "roommate_id": None
        })
    
    selected_ids = [s["id"] for s in premium_students]

    # 2) Single rooms (30 total: top GPA + disabled + random)
    remaining = [s for s in students if s["id"] not in selected_ids]
    
    # Top 10 GPA
    top_gpa = sorted(remaining, key=lambda x: x.get("gpa", 0), reverse=True)[:10]
    single_students = top_gpa.copy()
    selected_ids.extend([s["id"] for s in top_gpa])
    
    # Disabled students (up to 10)
    remaining = [s for s in students if s["id"] not in selected_ids]
    disabled = [s for s in remaining if s.get("disabled")]
    if len(disabled) > 10:
        disabled_pick = random.sample(disabled, 10)
    else:
        disabled_pick = disabled
    single_students.extend(disabled_pick)
    selected_ids.extend([s["id"] for s in disabled_pick])
    
    # Random to fill up to 30 singles
    remaining = [s for s in students if s["id"] not in selected_ids]
    need = 30 - len(single_students)
    if need > 0:
        random_pick = random.sample(remaining, need)
        single_students.extend(random_pick)
        selected_ids.extend([s["id"] for s in random_pick])
    
    # Assign single rooms (11-40)
    for idx, student in enumerate(single_students, start=11):
        assignments_list.append({
            "student_id": student["id"],
            "room_number": idx,
            "room_type": "single",
            "roommate_id": None
        })

    # 3) Double rooms (60 students = 30 rooms)
    remaining = [s for s in students if s["id"] not in selected_ids]
    random.shuffle(remaining)
    
    if len(remaining) != 60:
        raise RuntimeError(f"Expected 60 students for double rooms, got {len(remaining)}")
    
    room_num = 41  # Start double rooms at 41 (cuz 40 rooms are single rooms)
    i = 0
    while i < len(remaining):
        s1 = remaining[i]
        s2 = remaining[i + 1]
        
        assignments_list.append({
            "student_id": s1["id"],
            "room_number": room_num,
            "room_type": "double",
            "roommate_id": s2["id"]
        })
        assignments_list.append({
            "student_id": s2["id"],
            "room_number": room_num,
            "room_type": "double",
            "roommate_id": s1["id"]
        })
        
        room_num += 1
        i += 2

    # Persist all assignments to database
    try:
        for assignment_data in assignments_list:
            assignment = Assignment(
                student_id=assignment_data["student_id"],
                room_number=assignment_data["room_number"],
                room_type=assignment_data["room_type"],
                roommate_id=assignment_data["roommate_id"]
            )
            db.session.add(assignment)
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise

    return {
        "message": "Lottery completed successfully",
        "premium_rooms": 10,
        "single_rooms": 30,
        "double_rooms": 30,
        "total_students": 100
    }
