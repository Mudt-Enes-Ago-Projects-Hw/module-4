"""
Script to create 100 sample students for PreData system (demo purposes).
Run as: python backend/scripts/populate_students.py
"""
import os
import sys
import random

# Make project root importable so `src` package imports work when running script directly
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from src.app import app
from src.db import db
from src.models import Student

FIRST_NAMES = [
    "Alex", "Sam", "Jordan", "Taylor", "Morgan", "Casey", "Jamie", "Drew", "Avery", "Riley",
]
LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"]

def random_name():
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"

def create_student_obj(idx):
    sid = f"stu-{idx:03d}"
    name = random_name()
    gpa = round(random.uniform(0.0, 5.0), 2)
    corruption = random.random() < 0.1
    disabled = random.random() < 0.1
    return {
        "id": sid,
        "name": name,
        "gpa": gpa,
        "corruption": corruption,
        "disabled": disabled,
    }

def create_and_upload_students():
    with app.app_context():
        # Ensure tables exist
        db.create_all()
        
        created = []
        try:
            for i in range(1, 101):
                s = create_student_obj(i)
                student = Student(
                    id=s["id"],
                    name=s["name"],
                    gpa=s["gpa"],
                    corruption=s["corruption"],
                    disabled=s["disabled"]
                )
                db.session.add(student)
                created.append(s["id"])
            db.session.commit()
        except Exception:
            db.session.rollback()
            raise
        return created

if __name__ == "__main__":
    created = create_and_upload_students()
    print(f"Created {len(created)} students")
