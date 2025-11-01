# Dorm Lottery Backend - Complete Guide

A Flask backend with two separate lottery systems: PreData (100 students demo) and RealTime (10 students live demo).

---

## 🚀 Quick Setup

### 1. Clone & Navigate
```bash
cd /path/to/module-4
```

### 2. Create Virtual Environment
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
# Create .env file from example
cp .env.example .env

# Default settings (edit if needed):
# PORT=3001
# HOST=0.0.0.0
# DB_PATH=backend/data/app.db
# DEBUG=False
```

### 5. Run the Server
```bash
# From project root
./run.sh

# Or manually:
source backend/.venv/bin/activate
python3 backend/src/app.py
```

Server runs on: **http://127.0.0.1:3001**

---

## � API Routes Overview

### PreData System Routes (100 Students Demo)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/preData/students` | Get all students |
| `POST` | `/api/preData/addStudent` | Add a new student |
| `DELETE` | `/api/preData/deleteStudent/:id` | Delete a student by ID |
| `POST` | `/api/preData/runTheLottery` | Run lottery allocation |
| `GET` | `/api/preData/assignments` | Get lottery results |

### RealTime System Routes (10 Students Live Demo)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/realtime/students` | Get all students with count |
| `POST` | `/api/realtime/addStudent` | Add a student (max 10) |
| `DELETE` | `/api/realtime/deleteStudent/:id` | Delete a student by ID |
| `POST` | `/api/realtime/runTheLottery` | Run lottery (requires exactly 10) |
| `GET` | `/api/realtime/assignments` | Get lottery results |
| `POST` | `/api/realtime/clear` | Clear all students & reset system |

---

## �📁 Project Structure

```
backend/
├── src/
│   ├── config/                         # Configuration
│   │   ├── settings.py                # Environment variables
│   │   └── database.py                # SQLAlchemy instance
│   │
│   ├── models/                         # Database models
│   │   ├── student.py                 # PreData Student
│   │   ├── assignment.py              # PreData Assignment
│   │   ├── realtime_student.py        # RealTime Student
│   │   └── realtime_assignment.py     # RealTime Assignment
│   │
│   ├── controllers/
│   │   ├── lottery/                   # PreData System (100 students)
│   │   │   ├── lottery_routes.py     # API routes
│   │   │   └── controllers/          # Business logic
│   │   │
│   │   └── realtime/                  # RealTime System (10 students)
│   │       ├── realtime_routes.py    # API routes
│   │       └── controllers/          # Business logic
│   │
│   └── app.py                         # Flask application
│
├── scripts/
│   └── populate_students.py           # Populate 100 demo students
│
└── requirements.txt                    # Python dependencies
```

---

## 🎯 Two Lottery Systems

### 1. PreData System (`/api/preData/*`)
- **Purpose**: Demo with 100 pre-populated students
- **Room Allocation**: 10 premium + 30 single + 30 double (70 rooms)
- **Database Tables**: `students`, `assignments`

### 2. RealTime System (`/api/realtime/*`)
- **Purpose**: Live demo with exactly 10 students
- **Room Allocation**: 1 premium + 3 single + 3 double (7 rooms)
- **Database Tables**: `realtime_students`, `realtime_assignments`
- **Limit**: Maximum 10 students enforced

---

## 📡 API Routes

### Base URL: `http://127.0.0.1:3001/api`

---

## PreData Routes (100 Students Demo)

### Get All Students
```bash
GET /api/preData/students
```
```bash
curl http://127.0.0.1:3001/api/preData/students
```

### Add Student
```bash
POST /api/preData/addStudent
```
```bash
curl -X POST http://127.0.0.1:3001/api/preData/addStudent \
  -H "Content-Type: application/json" \
  -d '{
    "id": "ST001",
    "name": "John Doe",
    "gpa": 3.75,
    "corruption": false,
    "disabled": false
  }'
```

**Fields:**
- `id` (required): Student ID
- `name` (required): Student name
- `gpa` (required): GPA (0.0 - 5.0)
- `corruption` (optional): Boolean, default false
- `disabled` (optional): Boolean, default false

### Delete Student
```bash
DELETE /api/preData/deleteStudent/:id
```
```bash
curl -X DELETE http://127.0.0.1:3001/api/preData/deleteStudent/ST001
```

### Run Lottery
```bash
POST /api/preData/runTheLottery
```
```bash
curl -X POST http://127.0.0.1:3001/api/preData/runTheLottery
```

**Response:**
```json
{
  "message": "Lottery completed successfully",
  "total_students": 100,
  "premium_rooms": 10,
  "single_rooms": 30,
  "double_rooms": 30
}
```

### Get Assignments
```bash
GET /api/preData/assignments
```
```bash
curl http://127.0.0.1:3001/api/preData/assignments
```

---

## RealTime Routes (10 Students Live Demo)

### Get Student Count
```bash
GET /api/realtime/count
```
```bash
curl http://127.0.0.1:3001/api/realtime/count
```

**Response:**
```json
{
  "count": 5,
  "max": 10,
  "can_add_more": true
}
```

### Get All Students
```bash
GET /api/realtime/students
```
```bash
curl http://127.0.0.1:3001/api/realtime/students
```

**Response:**
```json
{
  "students": [...],
  "count": 5,
  "max": 10
}
```

### Add Student (Max 10)
```bash
POST /api/realtime/addStudent
```
```bash
curl -X POST http://127.0.0.1:3001/api/realtime/addStudent \
  -H "Content-Type: application/json" \
  -d '{
    "id": "RT001",
    "name": "Alice Johnson",
    "gpa": 4.0,
    "corruption": false,
    "disabled": false
  }'
```

**Success Response:**
```json
{
  "id": "RT001",
  "message": "Realtime student added",
  "current_count": 1
}
```

**Error (Limit Reached):**
```json
{
  "error": "Maximum 10 students allowed for realtime lottery"
}
```

### Delete Student
```bash
DELETE /api/realtime/deleteStudent/:id
```
```bash
curl -X DELETE http://127.0.0.1:3001/api/realtime/deleteStudent/RT001
```

### Run Lottery (Requires Exactly 10 Students)
```bash
POST /api/realtime/runTheLottery
```
```bash
curl -X POST http://127.0.0.1:3001/api/realtime/runTheLottery
```

**Success Response:**
```json
{
  "message": "Realtime lottery completed successfully",
  "total_students": 10,
  "premium_rooms": 1,
  "single_rooms": 3,
  "double_rooms": 3
}
```

**Error (Not Enough Students):**
```json
{
  "error": "Realtime lottery requires exactly 10 students, but found 5"
}
```

### Get Assignments
```bash
GET /api/realtime/assignments
```
```bash
curl http://127.0.0.1:3001/api/realtime/assignments
```

### Clear System (Reset)
```bash
POST /api/realtime/clear
```
```bash
curl -X POST http://127.0.0.1:3001/api/realtime/clear
```

---

## 🧪 Testing

### Test RealTime System
```bash
# Run automated test script
./test_realtime.sh
```

This will:
1. Clear the system
2. Add 10 test students
3. Try to add 11th student (will fail)
4. Run lottery
5. Display results

### Populate PreData System
```bash
source backend/.venv/bin/activate
python backend/scripts/populate_students.py
```
Creates 100 demo students for testing.

---

## 🎲 Lottery Allocation Rules

### PreData System (100 Students → 70 Rooms)
1. **10 Premium Rooms (1-10)**
   - Corrupt students first
   - Random fill if less than 10 corrupt

2. **30 Single Rooms (11-40)**
   - Top 10 GPA students
   - Up to 10 disabled students
   - Random fill remaining

3. **30 Double Rooms (41-70) → 60 Students**
   - Remaining students paired randomly

### RealTime System (10 Students → 7 Rooms)
1. **1 Premium Room (Room 1)**
   - Corrupt student or random

2. **3 Single Rooms (Rooms 2-4)**
   - Top 1 GPA student
   - Up to 1 disabled student
   - Random fill remaining

3. **3 Double Rooms (Rooms 5-7) → 6 Students**
   - Remaining students paired randomly

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Database Errors
```bash
# Delete and recreate database
rm backend/data/app.db
./run.sh
```

### Import Errors
```bash
# Ensure virtual environment is activated
source backend/.venv/bin/activate

# Reinstall dependencies
pip install -r backend/requirements.txt
```

### Module Not Found
Make sure you're running from the project root:
```bash
cd /path/to/module-4
./run.sh
```

---

## 🌐 Frontend Integration

### CORS Setup
If building a frontend (Next.js, React, etc.), add CORS support:

1. Install flask-cors:
```bash
pip install flask-cors
echo "flask-cors" >> backend/requirements.txt
```

2. Update `backend/src/app.py`:
```python
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # Add this line
    # ... rest of the code
```

### Example API Calls (JavaScript)

#### Check Capacity
```javascript
const response = await fetch('http://127.0.0.1:3001/api/realtime/count');
const { count, max, can_add_more } = await response.json();
```

#### Add Student
```javascript
const response = await fetch('http://127.0.0.1:3001/api/realtime/addStudent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'RT001',
    name: 'Alice Johnson',
    gpa: 4.0,
    corruption: false,
    disabled: false
  })
});
const result = await response.json();
```

#### Run Lottery
```javascript
const response = await fetch('http://127.0.0.1:3001/api/realtime/runTheLottery', {
  method: 'POST'
});
const result = await response.json();
```

---

## 📦 Dependencies

- **Flask 3.1.2** - Web framework
- **Flask-SQLAlchemy 3.1.1** - ORM
- **SQLAlchemy 2.0.44** - Database toolkit
- **python-dotenv 1.2.1** - Environment variables

---

## 🎬 Quick Demo Workflow

### For Live Presentation (RealTime System)

1. **Start Server**
   ```bash
   ./run.sh
   ```

2. **Clear System**
   ```bash
   curl -X POST http://127.0.0.1:3001/api/realtime/clear
   ```

3. **Add 10 Students** (via frontend or curl)
   ```bash
   # Example for student 1
   curl -X POST http://127.0.0.1:3001/api/realtime/addStudent \
     -H "Content-Type: application/json" \
     -d '{"id":"RT001","name":"Student 1","gpa":3.5}'
   # ... repeat for 10 students
   ```

4. **Run Lottery**
   ```bash
   curl -X POST http://127.0.0.1:3001/api/realtime/runTheLottery
   ```

5. **Show Results**
   ```bash
   curl http://127.0.0.1:3001/api/realtime/assignments
   ```

---

## 📝 Environment Variables

Create a `.env` file in the project root:

```bash
# Server Configuration
PORT=3001
HOST=0.0.0.0
DEBUG=False

# Database Configuration
DB_PATH=backend/data/app.db
```

---

## 🗂️ Database

- **Type**: SQLite
- **Location**: `backend/data/app.db` (auto-created)
- **Tables**:
  - `students` - PreData students
  - `assignments` - PreData assignments
  - `realtime_students` - RealTime students
  - `realtime_assignments` - RealTime assignments

Both systems are **completely independent** with no data sharing.

---

## 📄 License

This project is for educational purposes.
