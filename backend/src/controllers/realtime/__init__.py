"""
RealTime lottery controllers
"""
from src.controllers.realtime.controllers.lottery_controller import run_lottery
from src.controllers.realtime.controllers.assignments_controller import get_assignments
from src.controllers.realtime.controllers.student_controller import (
    add_student,
    delete_student,
    fetch_all_students,
    get_student_count,
    clear_all_students
)

__all__ = [
    'run_lottery',
    'get_assignments',
    'add_student',
    'delete_student',
    'fetch_all_students',
    'get_student_count',
    'clear_all_students'
]
