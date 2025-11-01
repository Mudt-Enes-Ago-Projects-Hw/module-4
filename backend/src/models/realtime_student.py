"""
RealTime Student model - for live 10-student lottery system
"""
from src.config.database import db


class RealtimeStudent(db.Model):
    __tablename__ = 'realtime_students'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    gpa = db.Column(db.Float, nullable=False)
    corruption = db.Column(db.Boolean, default=False)
    disabled = db.Column(db.Boolean, default=False)
    
    # Relationship
    assignment = db.relationship('RealtimeAssignment', backref='student', uselist=False, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'gpa': self.gpa,
            'corruption': self.corruption,
            'disabled': self.disabled
        }
