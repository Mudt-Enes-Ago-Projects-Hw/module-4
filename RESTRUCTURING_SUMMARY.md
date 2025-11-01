# Backend Restructuring Summary

## Changes Made

### 1. Two Separate Systems Created

#### **PreData System** (`/api/preData/*`)
- For demonstration with 100 pre-populated students
- Room allocation: 10 premium, 30 single, 30 double (70 rooms total)
- Database tables: `students`, `assignments`

#### **RealTime System** (`/api/realtime/*`)
- For live demonstrations with exactly 10 students
- Room allocation: 1 premium, 3 single, 3 double (7 rooms total)
- Database tables: `realtime_students`, `realtime_assignments`
- **Maximum limit: 10 students enforced**

---

## New File Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py                    # Exports all models
│   │   ├── student.py                     # PreData Student model
│   │   ├── assignment.py                  # PreData Assignment model
│   │   ├── realtime_student.py           # RealTime Student model (NEW)
│   │   └── realtime_assignment.py        # RealTime Assignment model (NEW)
│   │
│   ├── controllers/
│   │   ├── routes.py                      # Updated with both systems
│   │   │
│   │   ├── students/                      # PreData student controllers
│   │   │   ├── __init__.py
│   │   │   └── student_controller.py
│   │   │
│   │   ├── lottery/                       # PreData lottery controllers
│   │   │   ├── __init__.py
│   │   │   ├── run_lottery.py
│   │   │   └── get_assignments.py
│   │   │
│   │   └── realtime/                      # RealTime controllers (NEW)
│   │       ├── __init__.py
│   │       ├── realtime_student_controller.py
│   │       ├── run_realtime_lottery.py
│   │       └── get_realtime_assignments.py
│   │
│   ├── db.py
│   └── app.py
│
└── scripts/
    └── populate_students.py               # For PreData system

# Root level
├── API_DOCUMENTATION.md                   # Complete API docs (NEW)
├── test_realtime.sh                       # Test script for RealTime (NEW)
└── run.sh
```

---

## API Routes

### PreData Routes (100 students)
- `GET    /api/preData/students` - Get all students
- `POST   /api/preData/addStudent` - Add student
- `DELETE /api/preData/deleteStudent/:id` - Delete student
- `POST   /api/preData/runTheLottery` - Run lottery
- `GET    /api/preData/assignments` - Get results

### RealTime Routes (10 students)
- `GET    /api/realtime/count` - Get student count & capacity
- `GET    /api/realtime/students` - Get all students
- `POST   /api/realtime/addStudent` - Add student (max 10)
- `DELETE /api/realtime/deleteStudent/:id` - Delete student
- `POST   /api/realtime/runTheLottery` - Run lottery (requires exactly 10)
- `GET    /api/realtime/assignments` - Get results
- `POST   /api/realtime/clear` - Reset system

---

## Key Features

### RealTime System Validation
1. **Student Limit**: Cannot add more than 10 students
2. **Lottery Requirement**: Requires exactly 10 students to run
3. **Count Tracking**: API returns current count with each operation
4. **Clear Function**: Easy reset for multiple demos

### Response Examples

#### Adding Student (Success)
```json
{
  "id": "RT001",
  "message": "Realtime student added",
  "current_count": 1
}
```

#### Adding Student (Limit Reached)
```json
{
  "error": "Maximum 10 students allowed for realtime lottery"
}
```

#### Running Lottery (Not Enough Students)
```json
{
  "error": "Realtime lottery requires exactly 10 students, but found 5"
}
```

#### Checking Count
```json
{
  "count": 5,
  "max": 10,
  "can_add_more": true
}
```

---

## Testing

### Quick Test
```bash
# Start server
./run.sh

# In another terminal, run test script
./test_realtime.sh
```

The test script will:
1. Clear the system
2. Add 10 students
3. Try to add an 11th (will fail)
4. Run the lottery
5. Show results

---

## Next Steps for Frontend (Next.js)

### Pages Needed

#### 1. RealTime Registration Form
- Input fields: ID, Name, GPA, Corruption (checkbox), Disabled (checkbox)
- Real-time count display (e.g., "5/10 students registered")
- Disable form when 10 students reached
- API: `POST /api/realtime/addStudent`
- API: `GET /api/realtime/count` (poll or fetch before submit)

#### 2. RealTime Student List
- Show all registered students
- Delete button for each student
- Total count display
- API: `GET /api/realtime/students`
- API: `DELETE /api/realtime/deleteStudent/:id`

#### 3. RealTime Lottery Runner
- Button: "Run Lottery" (only enabled when count === 10)
- Show lottery results in a nice table
- Room number, room type, student name, roommate (if double)
- API: `POST /api/realtime/runTheLottery`
- API: `GET /api/realtime/assignments`

#### 4. Admin Controls
- Button: "Clear System" (reset for new demo)
- API: `POST /api/realtime/clear`

### Suggested Tech Stack
- Next.js 14+ with App Router
- TailwindCSS for styling
- React Hook Form for form handling
- SWR or React Query for data fetching
- Zod for validation

---

## Running the System

### Start Backend
```bash
cd /path/to/module-4
./run.sh
```

### Test RealTime API
```bash
./test_realtime.sh
```

### Populate PreData (100 students)
```bash
cd /path/to/module-4
source backend/.venv/bin/activate
python backend/scripts/populate_students.py
```

---

## Database Independence

Both systems are **completely independent**:
- Separate tables
- Separate controllers
- Separate API routes
- No data sharing between systems

This means you can:
- Run PreData demos without affecting RealTime
- Clear RealTime without touching PreData
- Test both systems simultaneously
