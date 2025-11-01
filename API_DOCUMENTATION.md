# Dorm Lottery API Documentation

This backend has two separate lottery systems:

## 1. PreData System (100 Students Demo)
For demonstration purposes with pre-populated data.

### Endpoints:

#### GET /api/preData/students
Get all predata students.
```bash
curl http://127.0.0.1:5001/api/preData/students
```

#### POST /api/preData/addStudent
Add a new student to predata system.
```bash
curl -X POST http://127.0.0.1:5001/api/preData/addStudent \
  -H "Content-Type: application/json" \
  -d '{
    "id": "ST101",
    "name": "John Doe",
    "gpa": 3.75,
    "corruption": false,
    "disabled": false
  }'
```

#### DELETE /api/preData/deleteStudent/:id
Delete a student from predata system.
```bash
curl -X DELETE http://127.0.0.1:5001/api/preData/deleteStudent/ST101
```

#### POST /api/preData/runTheLottery
Run the lottery for 100 students (10 premium, 30 single, 60 double).
```bash
curl -X POST http://127.0.0.1:5001/api/preData/runTheLottery
```

#### GET /api/preData/assignments
Get all predata lottery assignments.
```bash
curl http://127.0.0.1:5001/api/preData/assignments
```

---

## 2. RealTime System (10 Students Live Demo)
For live demonstrations with exactly 10 students.

### Room Allocation Rules (10 Students):
- **1 Premium Room** (Room 1): Corrupt student or random
- **3 Single Rooms** (Rooms 2-4): Top GPA + Disabled + Random
- **3 Double Rooms** (Rooms 5-7): Remaining 6 students paired

### Endpoints:

#### GET /api/realtime/count
Get current student count and capacity.
```bash
curl http://127.0.0.1:5001/api/realtime/count
```
Response:
```json
{
  "count": 5,
  "max": 10,
  "can_add_more": true
}
```

#### GET /api/realtime/students
Get all realtime students with count.
```bash
curl http://127.0.0.1:5001/api/realtime/students
```
Response:
```json
{
  "students": [...],
  "count": 5,
  "max": 10
}
```

#### POST /api/realtime/addStudent
Add a new student (max 10). Returns error if limit reached.
```bash
curl -X POST http://127.0.0.1:5001/api/realtime/addStudent \
  -H "Content-Type: application/json" \
  -d '{
    "id": "RT001",
    "name": "Alice Smith",
    "gpa": 4.0,
    "corruption": false,
    "disabled": false
  }'
```
Response:
```json
{
  "id": "RT001",
  "message": "Realtime student added",
  "current_count": 1
}
```

#### DELETE /api/realtime/deleteStudent/:id
Delete a realtime student.
```bash
curl -X DELETE http://127.0.0.1:5001/api/realtime/deleteStudent/RT001
```

#### POST /api/realtime/runTheLottery
Run the lottery (requires exactly 10 students).
```bash
curl -X POST http://127.0.0.1:5001/api/realtime/runTheLottery
```
Response:
```json
{
  "message": "Realtime lottery completed successfully",
  "total_students": 10,
  "premium_rooms": 1,
  "single_rooms": 3,
  "double_rooms": 3
}
```

#### GET /api/realtime/assignments
Get all realtime lottery results.
```bash
curl http://127.0.0.1:5001/api/realtime/assignments
```

#### POST /api/realtime/clear
Clear all realtime students and assignments (reset system).
```bash
curl -X POST http://127.0.0.1:5001/api/realtime/clear
```
Response:
```json
{
  "message": "Realtime system cleared successfully",
  "count": 0
}
```

---

## Error Handling

### Adding Student When Limit Reached
```bash
# When 10 students already exist:
curl -X POST http://127.0.0.1:5001/api/realtime/addStudent \
  -H "Content-Type: application/json" \
  -d '{"id": "RT011", "name": "Too Many", "gpa": 3.0}'
```
Response:
```json
{
  "error": "Maximum 10 students allowed for realtime lottery"
}
```

### Running Lottery Without Enough Students
```bash
# When less than 10 students:
curl -X POST http://127.0.0.1:5001/api/realtime/runTheLottery
```
Response:
```json
{
  "error": "Realtime lottery requires exactly 10 students, but found 5"
}
```

---

## Workflow for Live Demo

1. **Clear system** (if needed):
   ```bash
   curl -X POST http://127.0.0.1:5001/api/realtime/clear
   ```

2. **Check capacity**:
   ```bash
   curl http://127.0.0.1:5001/api/realtime/count
   ```

3. **Add students** (repeat until 10):
   ```bash
   curl -X POST http://127.0.0.1:5001/api/realtime/addStudent \
     -H "Content-Type: application/json" \
     -d '{"id": "RT001", "name": "Student 1", "gpa": 3.5}'
   ```

4. **View all students**:
   ```bash
   curl http://127.0.0.1:5001/api/realtime/students
   ```

5. **Run lottery**:
   ```bash
   curl -X POST http://127.0.0.1:5001/api/realtime/runTheLottery
   ```

6. **View results**:
   ```bash
   curl http://127.0.0.1:5001/api/realtime/assignments
   ```

---

## Database Tables

### PreData System:
- `students` - PreData students (100)
- `assignments` - PreData lottery results

### RealTime System:
- `realtime_students` - Live demo students (max 10)
- `realtime_assignments` - Live demo lottery results

Both systems are completely independent and use separate database tables.
