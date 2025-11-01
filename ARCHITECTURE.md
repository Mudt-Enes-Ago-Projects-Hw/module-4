# System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FLASK BACKEND (Port 5001)                    │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────┐  ┌───────────────────────────────┐
│      PREDATA SYSTEM (Demo)    │  │   REALTIME SYSTEM (Live)      │
│         100 Students          │  │        10 Students            │
└───────────────────────────────┘  └───────────────────────────────┘
               │                                  │
               │                                  │
      ┌────────▼────────┐                ┌────────▼────────┐
      │   /api/preData/ │                │ /api/realtime/  │
      └────────┬────────┘                └────────┬────────┘
               │                                  │
      ┌────────▼────────────┐           ┌────────▼────────────┐
      │ Routes:             │           │ Routes:             │
      │ • GET /students     │           │ • GET /count        │
      │ • POST /addStudent  │           │ • GET /students     │
      │ • DELETE /delete    │           │ • POST /addStudent  │
      │ • POST /runLottery  │           │ • DELETE /delete    │
      │ • GET /assignments  │           │ • POST /runLottery  │
      └────────┬────────────┘           │ • GET /assignments  │
               │                        │ • POST /clear       │
               │                        └────────┬────────────┘
               │                                 │
      ┌────────▼──────────┐            ┌────────▼──────────┐
      │ Controllers:      │            │ Controllers:      │
      │ • students/       │            │ • realtime/       │
      │ • lottery/        │            │   - student_ctrl  │
      └────────┬──────────┘            │   - run_lottery   │
               │                       │   - get_assigns   │
               │                       └────────┬──────────┘
      ┌────────▼──────────┐            ┌────────▼──────────┐
      │ Models:           │            │ Models:           │
      │ • Student         │            │ • RealtimeStudent │
      │ • Assignment      │            │ • RealtimeAssign  │
      └────────┬──────────┘            └────────┬──────────┘
               │                                 │
      ┌────────▼──────────┐            ┌────────▼──────────┐
      │ DB Tables:        │            │ DB Tables:        │
      │ • students        │            │ • realtime_stud   │
      │ • assignments     │            │ • realtime_asgn   │
      └───────────────────┘            └───────────────────┘

═══════════════════════════════════════════════════════════════════

                        SQLITE DATABASE (app.db)
                    
    ┌─────────────────────────────────────────────────────┐
    │  students (100 max)    │  realtime_students (10 max) │
    │  assignments           │  realtime_assignments       │
    │                        │                             │
    │  COMPLETELY INDEPENDENT - NO DATA SHARING           │
    └─────────────────────────────────────────────────────┘
```

---

## RealTime System Flow (Live Demo)

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (Next.js)                          │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
            ┌───────▼──────┐ ┌────▼─────┐ ┌────▼────────┐
            │ Registration │ │ Student  │ │   Lottery   │
            │     Form     │ │   List   │ │   Runner    │
            └───────┬──────┘ └────┬─────┘ └────┬────────┘
                    │             │             │
                    │      ┌──────▼──────┐      │
                    └──────► API Backend ◄──────┘
                           │ (Flask)     │
                           └──────┬──────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
            ┌───────▼──────┐ ┌────▼─────┐ ┌────▼────────┐
            │ Add Student  │ │   Run    │ │    Get      │
            │ (max 10)     │ │ Lottery  │ │ Assignments │
            └───────┬──────┘ └────┬─────┘ └────┬────────┘
                    │             │             │
                    └─────────────┼─────────────┘
                                  │
                           ┌──────▼───────┐
                           │   Database   │
                           │ (SQLite)     │
                           └──────────────┘
```

---

## Room Allocation Logic

### PreData System (100 Students)
```
100 Students → 70 Rooms
├── 10 Premium Rooms (1-10)
│   └── Corrupt students first, then random
├── 30 Single Rooms (11-40)
│   ├── Top 10 GPA
│   ├── Up to 10 Disabled
│   └── Random fill
└── 30 Double Rooms (41-70) → 60 students
    └── Remaining students paired randomly
```

### RealTime System (10 Students)
```
10 Students → 7 Rooms
├── 1 Premium Room (Room 1)
│   └── Corrupt student or random
├── 3 Single Rooms (Rooms 2-4)
│   ├── Top 1 GPA
│   ├── Up to 1 Disabled
│   └── Random fill
└── 3 Double Rooms (Rooms 5-7) → 6 students
    └── Remaining students paired randomly
```

---

## API Request/Response Flow

### Adding a Student
```
Frontend Request:
POST /api/realtime/addStudent
{
  "id": "RT001",
  "name": "Alice",
  "gpa": 3.8,
  "corruption": false,
  "disabled": false
}
       │
       ▼
Backend Validation:
1. Check count < 10 ✓
2. Check ID unique ✓
3. Validate GPA range ✓
       │
       ▼
Database Insert:
INSERT INTO realtime_students...
       │
       ▼
Response:
{
  "id": "RT001",
  "message": "Realtime student added",
  "current_count": 1
}
```

### Running the Lottery
```
Frontend Request:
POST /api/realtime/runTheLottery
       │
       ▼
Backend Validation:
1. Check exactly 10 students ✓
       │
       ▼
Lottery Algorithm:
1. Clear old assignments
2. Allocate 1 premium room
3. Allocate 3 single rooms
4. Allocate 3 double rooms (6 students)
5. Save to database
       │
       ▼
Response:
{
  "message": "Lottery completed",
  "total_students": 10,
  "premium_rooms": 1,
  "single_rooms": 3,
  "double_rooms": 3
}
```

---

## Error Handling Flow

```
User tries to add 11th student
       │
       ▼
POST /api/realtime/addStudent
       │
       ▼
Backend checks count
count >= 10 → Error! ✗
       │
       ▼
Response 400:
{
  "error": "Maximum 10 students allowed"
}
       │
       ▼
Frontend displays error message
User cannot proceed
```
