from src.config.database import db
from src.models.realtime_student import RealtimeStudent


def add_student(name, gpa, corruption=False, disabled=False):
    # Check if we already have 10 students
    student_count = RealtimeStudent.query.count()
    if student_count >= 10:
        raise ValueError("Maximum 10 students allowed for realtime lottery")
    
    # Generate new student ID by finding the latest ID and incrementing
    all_students = RealtimeStudent.query.all()
    if all_students:
        # Extract numeric part from student IDs (format: stu-XXX)
        max_id = 0
        for student in all_students:
            try:
                # Extract number from format like "stu-001"
                num = int(student.id.split('-')[1])
                if num > max_id:
                    max_id = num
            except (IndexError, ValueError):
                continue
        new_id_num = max_id + 1
    else:
        new_id_num = 0
    
    student_id = f"stu-{new_id_num:03d}"
    
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
