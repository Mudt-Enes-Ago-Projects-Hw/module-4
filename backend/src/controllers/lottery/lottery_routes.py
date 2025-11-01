from flask import Blueprint, request, jsonify
from src.controllers.lottery import (
    run_lottery,
    get_assignments,
    add_student,
    delete_student,
    fetch_all_students
)

lottery_bp = Blueprint("preData", __name__)


@lottery_bp.route("/students", methods=["GET"])
def get_students_endpoint():
    try:
        students = fetch_all_students()
        return jsonify(students), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@lottery_bp.route("/addStudent", methods=["POST"])
def add_student_endpoint():
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


@lottery_bp.route("/deleteStudent/<student_id>", methods=["DELETE"])
def delete_student_endpoint(student_id):
    try:
        deleted = delete_student(student_id)
        if deleted:
            return jsonify({"message": f"PreData student {student_id} deleted"}), 200
        else:
            return jsonify({"error": "Student not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@lottery_bp.route("/runTheLottery", methods=["POST"])
def run_lottery_endpoint():
    try:
        result = run_lottery()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@lottery_bp.route("/assignments", methods=["GET"])
def get_assignments_endpoint():
    try:
        assignments = get_assignments()
        return jsonify(assignments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
