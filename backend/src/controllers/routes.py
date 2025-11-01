from flask import Blueprint, request, jsonify
from src.controllers.lottery import run_lottery, get_assignments
from src.controllers.students import add_student, delete_student, fetch_all_students
from src.controllers.realtime import (
    run_realtime_lottery,
    get_realtime_assignments,
    add_realtime_student,
    delete_realtime_student,
    fetch_all_realtime_students,
    get_realtime_student_count,
    clear_all_realtime_students
)

bp = Blueprint("api", __name__)


# ==================== PRE-DATA ROUTES (100 students demo) ====================

@bp.route("/preData/addStudent", methods=["POST"])
def add_predata_student_endpoint():
    body = request.get_json()
    if not body:
        return jsonify({"error": "Request body required"}), 400
    
    required_fields = ["id", "name", "gpa"]
    for field in required_fields:
        if field not in body:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    try:
        student_id = add_student(
            student_id=body["id"],
            name=body["name"],
            gpa=float(body["gpa"]),
            corruption=bool(body.get("corruption", False)),
            disabled=bool(body.get("disabled", False))
        )
        return jsonify({"id": student_id, "message": "PreData student added"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route("/preData/deleteStudent/<student_id>", methods=["DELETE"])
def delete_predata_student_endpoint(student_id):
    try:
        deleted = delete_student(student_id)
        if deleted:
            return jsonify({"message": f"PreData student {student_id} deleted"}), 200
        else:
            return jsonify({"error": "Student not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route("/preData/students", methods=["GET"])
def get_predata_students_endpoint():
    try:
        students = fetch_all_students()
        return jsonify(students), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route("/preData/runTheLottery", methods=["POST"])
def run_predata_lottery_endpoint():
    try:
        result = run_lottery()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route("/preData/assignments", methods=["GET"])
def get_predata_assignments_endpoint():
    try:
        assignments = get_assignments()
        return jsonify(assignments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ==================== REALTIME ROUTES (10 students live demo) ====================

@bp.route("/realtime/addStudent", methods=["POST"])
def add_realtime_student_endpoint():
    body = request.get_json()
    if not body:
        return jsonify({"error": "Request body required"}), 400
    
    required_fields = ["id", "name", "gpa"]
    for field in required_fields:
        if field not in body:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    try:
        student_id = add_realtime_student(
            student_id=body["id"],
            name=body["name"],
            gpa=float(body["gpa"]),
            corruption=bool(body.get("corruption", False)),
            disabled=bool(body.get("disabled", False))
        )
        return jsonify({
            "id": student_id,
            "message": "Realtime student added",
            "current_count": get_realtime_student_count()
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/realtime/deleteStudent/<student_id>", methods=["DELETE"])
def delete_realtime_student_endpoint(student_id):
    try:
        deleted = delete_realtime_student(student_id)
        if deleted:
            return jsonify({
                "message": f"Realtime student {student_id} deleted",
                "current_count": get_realtime_student_count()
            }), 200
        else:
            return jsonify({"error": "Student not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route("/realtime/students", methods=["GET"])
def get_realtime_students_endpoint():
    try:
        students = fetch_all_realtime_students()
        return jsonify({
            "students": students,
            "count": len(students),
            "max": 10
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route("/realtime/count", methods=["GET"])
def get_realtime_count_endpoint():
    try:
        count = get_realtime_student_count()
        return jsonify({
            "count": count,
            "max": 10,
            "can_add_more": count < 10
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route("/realtime/runTheLottery", methods=["POST"])
def run_realtime_lottery_endpoint():
    try:
        result = run_realtime_lottery()
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/realtime/assignments", methods=["GET"])
def get_realtime_assignments_endpoint():
    try:
        assignments = get_realtime_assignments()
        return jsonify(assignments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route("/realtime/clear", methods=["POST"])
def clear_realtime_system_endpoint():
    """Clear all realtime students and assignments for a fresh start"""
    try:
        clear_all_realtime_students()
        return jsonify({
            "message": "Realtime system cleared successfully",
            "count": 0
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
