"""
RealTime Assignment model - for live 10-student lottery system
"""
from src.db import db


class RealtimeAssignment(db.Model):
    __tablename__ = 'realtime_assignments'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.String(50), db.ForeignKey('realtime_students.id'), nullable=False)
    room_number = db.Column(db.Integer, nullable=False)
    room_type = db.Column(db.String(20), nullable=False)  # 'premium', 'single', 'double'
    roommate_id = db.Column(db.String(50), nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'room_number': self.room_number,
            'room_type': self.room_type,
            'roommate_id': self.roommate_id
        }
