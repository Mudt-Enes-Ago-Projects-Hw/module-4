# Quick Start Guide - RealTime Lottery System

## Setup (One Time)

```bash
# Navigate to project
cd /path/to/module-4

# Make run script executable (if not already)
chmod +x run.sh
chmod +x test_realtime.sh

# Activate virtual environment
source backend/.venv/bin/activate

# Install dependencies (if not already)
pip install -r backend/requirements.txt
```

## Running the Backend

```bash
# Start Flask server
./run.sh
```

Server runs on: `http://127.0.0.1:5001`

---

## Live Demo Workflow

### Step 1: Clear System (Before Demo)
```bash
curl -X POST http://127.0.0.1:5001/api/realtime/clear
```

### Step 2: Check Status
```bash
curl http://127.0.0.1:5001/api/realtime/count
```

### Step 3: Add Students (Frontend Form)
Frontend will POST to: `http://127.0.0.1:5001/api/realtime/addStudent`

Example student data:
```json
{
  "id": "RT001",
  "name": "Alice Johnson",
  "gpa": 3.8,
  "corruption": false,
  "disabled": false
}
```

### Step 4: Run Lottery (When 10 Students Ready)
```bash
curl -X POST http://127.0.0.1:5001/api/realtime/runTheLottery
```

### Step 5: Show Results
```bash
curl http://127.0.0.1:5001/api/realtime/assignments
```

---

## Quick Test (No Frontend)

```bash
# Run automated test script
./test_realtime.sh
```

This will:
1. Clear system
2. Add 10 test students
3. Try to add 11th (will fail)
4. Run lottery
5. Display results

---

## Frontend Integration

### Required API Calls

#### Check Capacity Before Form Render
```javascript
const response = await fetch('http://127.0.0.1:5001/api/realtime/count');
const { count, max, can_add_more } = await response.json();

// Disable form if count >= 10
```

#### Submit New Student
```javascript
const response = await fetch('http://127.0.0.1:5001/api/realtime/addStudent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: studentId,
    name: studentName,
    gpa: parseFloat(gpa),
    corruption: isCorrupt,
    disabled: isDisabled
  })
});

const result = await response.json();
// result.current_count tells you how many students now
```

#### Get All Students
```javascript
const response = await fetch('http://127.0.0.1:5001/api/realtime/students');
const { students, count, max } = await response.json();
```

#### Run Lottery
```javascript
// Only call when count === 10
const response = await fetch('http://127.0.0.1:5001/api/realtime/runTheLottery', {
  method: 'POST'
});
const result = await response.json();
```

#### Get Results
```javascript
const response = await fetch('http://127.0.0.1:5001/api/realtime/assignments');
const assignments = await response.json();

// Each assignment has:
// - student_id, student_name, gpa, corruption, disabled
// - room_number, room_type
// - roommate_id, roommate_name (for double rooms)
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9
```

### Database Errors
```bash
# Delete database and restart
rm backend/data/app.db
./run.sh
```

### Import Errors
```bash
# Make sure you're in virtual environment
source backend/.venv/bin/activate

# Reinstall dependencies
pip install -r backend/requirements.txt
```

---

## Demo Day Checklist

- [ ] Server is running (`./run.sh`)
- [ ] System is cleared (`POST /api/realtime/clear`)
- [ ] Frontend is running
- [ ] Tested form submission
- [ ] Tested that 11th student is rejected
- [ ] Tested lottery with exactly 10 students
- [ ] Results display correctly

---

## CORS Setup (For Frontend)

If you get CORS errors, update `backend/src/app.py`:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Add this line
```

Install flask-cors:
```bash
pip install flask-cors
echo "flask-cors" >> backend/requirements.txt
```
