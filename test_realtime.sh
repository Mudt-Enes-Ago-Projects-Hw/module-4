#!/bin/bash

# Test script for RealTime Lottery System (10 students)
# Run this after starting the Flask server with ./run.sh

API="http://127.0.0.1:5001/api"

echo "=========================================="
echo "REALTIME LOTTERY SYSTEM TEST"
echo "=========================================="
echo ""

# 1. Clear the system
echo "1. Clearing realtime system..."
curl -s -X POST "$API/realtime/clear" | python3 -m json.tool
echo ""
echo ""

# 2. Check count
echo "2. Checking student count..."
curl -s "$API/realtime/count" | python3 -m json.tool
echo ""
echo ""

# 3. Add 10 students
echo "3. Adding 10 students..."
echo ""

students=(
  '{"id":"RT001","name":"Alice Johnson","gpa":4.0,"corruption":false,"disabled":false}'
  '{"id":"RT002","name":"Bob Smith","gpa":3.8,"corruption":true,"disabled":false}'
  '{"id":"RT003","name":"Charlie Brown","gpa":3.5,"corruption":false,"disabled":true}'
  '{"id":"RT004","name":"Diana Prince","gpa":3.9,"corruption":false,"disabled":false}'
  '{"id":"RT005","name":"Eve Davis","gpa":3.2,"corruption":false,"disabled":false}'
  '{"id":"RT006","name":"Frank Miller","gpa":2.8,"corruption":false,"disabled":false}'
  '{"id":"RT007","name":"Grace Lee","gpa":3.6,"corruption":false,"disabled":false}'
  '{"id":"RT008","name":"Henry Wilson","gpa":3.3,"corruption":false,"disabled":false}'
  '{"id":"RT009","name":"Iris Taylor","gpa":3.7,"corruption":false,"disabled":false}'
  '{"id":"RT010","name":"Jack Anderson","gpa":3.1,"corruption":false,"disabled":false}'
)

for student in "${students[@]}"; do
  echo "Adding student..."
  curl -s -X POST "$API/realtime/addStudent" \
    -H "Content-Type: application/json" \
    -d "$student" | python3 -m json.tool
  echo ""
done

echo ""

# 4. Check count again
echo "4. Checking count after adding students..."
curl -s "$API/realtime/count" | python3 -m json.tool
echo ""
echo ""

# 5. Try to add 11th student (should fail)
echo "5. Trying to add 11th student (should fail)..."
curl -s -X POST "$API/realtime/addStudent" \
  -H "Content-Type: application/json" \
  -d '{"id":"RT011","name":"Too Many","gpa":3.0}' | python3 -m json.tool
echo ""
echo ""

# 6. Get all students
echo "6. Getting all students..."
curl -s "$API/realtime/students" | python3 -m json.tool
echo ""
echo ""

# 7. Run the lottery
echo "7. Running the lottery..."
curl -s -X POST "$API/realtime/runTheLottery" | python3 -m json.tool
echo ""
echo ""

# 8. Get assignments
echo "8. Getting lottery results..."
curl -s "$API/realtime/assignments" | python3 -m json.tool
echo ""
echo ""

echo "=========================================="
echo "TEST COMPLETED!"
echo "=========================================="
