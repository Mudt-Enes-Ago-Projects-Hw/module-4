from src.config.database import db
from src.models import Student
import random


def fetch_all_students():
    return [s.to_dict() for s in Student.query.all()]


def add_student(name: str, gpa: float, corruption: bool = False, disabled: bool = False):
    try:
        # Check if we already have 100 students
        student_count = Student.query.count()
        if student_count >= 100:
            raise ValueError("Maximum 100 students allowed for PreData lottery")
        
        # Generate new student ID by finding the latest ID and incrementing
        all_students = Student.query.all()
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
    except ValueError:
        raise
    except Exception as e:
        db.session.rollback()
        raise Exception(f"Failed to add student: {str(e)}")


def delete_student(student_id: str):
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


def clear_all_students():
    try:
        Student.query.delete()
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        raise Exception(f"Failed to clear students: {str(e)}")


def populate_dummy_students():
    FIRST_NAMES = [
        "Alex", "Sam", "Jordan", "Taylor", "Morgan", "Casey", "Jamie", "Drew", "Avery", "Riley",
    ]
    LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"]
    
    def random_name():
        return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
    
    try:
        # Check if students already exist
        existing_count = Student.query.count()
        if existing_count > 0:
            raise ValueError(f"Database already has {existing_count} students. Please clear the system first using /api/preData/clear")
        
        created = []
        for i in range(1, 101):
            sid = f"stu-{i:03d}"
            name = random_name()
            gpa = round(random.uniform(0.0, 5.0), 2)
            corruption = random.random() < 0.1
            disabled = random.random() < 0.1
            
            student = Student(
                id=sid,
                name=name,
                gpa=gpa,
                corruption=corruption,
                disabled=disabled
            )
            db.session.add(student)
            created.append(sid)
        
        db.session.commit()
        return created
    except ValueError:
        raise
    except Exception as e:
        db.session.rollback()
        raise Exception(f"Failed to populate students: {str(e)}")
