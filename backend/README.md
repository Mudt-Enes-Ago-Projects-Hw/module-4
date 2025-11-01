# Lotto Dorm Assignment Backend (Flask + Firestore)

This small backend implements a dorm-room lottery for 100 students using SQLite (local file).

Features
- Populate 100 sample students in Firestore
- Run lottery to assign 40 single rooms and the rest double rooms
- Selection rules for single rooms:
  - 10 admin-picked students (passed to endpoint)
  - 10 top GPA students (excluding admin picks)
  - 10 disabled students (random if more than 10)
  - 10 random students from remaining

Quick setup
1. Ensure you have Python 3.8+ and create a virtualenv and install:
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
2. (Optional) change the DB path in `.env` (default: `DB_PATH=./data/app.db`).
3. Run the populate script to create 100 students:
```bash
python scripts/populate_students.py
```
4. Start the Flask app:
```bash
flask run
```

API Endpoints
- POST /populate  -> populate Firestore with 100 students (for local/dev)
- POST /lottery   -> run lottery; JSON body may include {"admin_picks": [id1, id2, ...]} (up to 10)
- GET /assignments -> returns current assignments

Assumptions
- If `admin_picks` is not provided, admin selection is treated as empty.
- Student object includes `corruption: bool` and `disabled: bool` fields but `corruption` is only stored (not used automatically). Admin picks are provided as IDs.
