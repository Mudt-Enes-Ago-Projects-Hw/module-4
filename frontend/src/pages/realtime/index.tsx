import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { realtimeApi } from '@/utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Student {
  id: number;
  name: string;
  gpa: number;
}

export default function RealtimePage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGPA, setNewStudentGPA] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [corruption, setCorruption] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await realtimeApi.getStudents();
      // Realtime API returns { students: [...], count: x, max: y }
      setStudents(data.students || data);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch students';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDummyData = async () => {
    toast.info('Dummy data feature not available for real-time lottery. Please add students manually.');
  };

  const handleDeleteStudent = async (studentId: number) => {
    try {
      await realtimeApi.deleteStudent(studentId);
      toast.success('Student deleted successfully!');
      await fetchStudents();
    } catch (error: any) {
      console.error('Error deleting student:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to delete student';
      toast.error(errorMessage);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      toast.error('Please enter a student name');
      return;
    }

    const gpa = parseFloat(newStudentGPA);
    if (isNaN(gpa) || gpa < 0 || gpa > 5.0) {
      toast.error('Please enter a valid GPA (0-4.0)');
      return;
    }

    try {
      await realtimeApi.createStudent({
        name: newStudentName,
        gpa: gpa,
        disabled,
        corruption
      });
      toast.success('Student created successfully!');
      setNewStudentName('');
      setNewStudentGPA('');
      setDisabled(false);
      setCorruption(false);
      await fetchStudents();
    } catch (error: any) {
      console.error('Error creating student:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to create student';
      toast.error(errorMessage);
    }
  };

  const handleRunLottery = async () => {
    if (students.length === 0) {
      toast.error('No students available for lottery!');
      return;
    }

    try {
      setLoading(true);
      await realtimeApi.runLottery();
      toast.success('Real-time lottery completed! Redirecting to results...');
      setTimeout(() => {
        router.push('/realtimeResults');
      }, 1000);
    } catch (error: any) {
      console.error('Error running lottery:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to run lottery';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
          ⚡ Real-Time Lottery System
        </h1>

        {/* Action Buttons */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6">
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleCreateDummyData}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              🎭 Create Dummy Data
            </button>
            <button
              onClick={handleRunLottery}
              disabled={loading || students.length === 0}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
            >
              ⚡ RUN REAL-TIME LOTTERY!
            </button>
            <button
              onClick={async () => {
                if (!confirm('Are you sure you want to clear all students and assignments? This cannot be undone.')) return;
                try {
                  await realtimeApi.clearAll();
                  toast.success('All data cleared!');
                  fetchStudents();
                } catch (error: any) {
                  console.error('Error clearing data:', error);
                  toast.error(error.message || 'Failed to clear data');
                }
              }}
              disabled={loading || students.length === 0}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              🗑️ Clear All Data
            </button>
          </div>
        </div>

        {/* Create Student Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">➕ Add New Student</h2>
          <form onSubmit={handleCreateStudent} className="space-y-4">
            <input
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="Student Name"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="number"
              step="0.01"
              value={newStudentGPA}
              onChange={(e) => setNewStudentGPA(e.target.value)}
              placeholder="GPA (0-5.0)"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={disabled}
                  onChange={(e) => setDisabled(e.target.checked)}
                  className="w-5 h-5 rounded bg-white/20 border border-white/30 checked:bg-cyan-500 focus:ring-2 focus:ring-cyan-400"
                />
                <span className="text-white">Disabled</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={corruption}
                  onChange={(e) => setCorruption(e.target.checked)}
                  className="w-5 h-5 rounded bg-white/20 border border-white/30 checked:bg-blue-500 focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-white">Corruption</span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg transform hover:scale-105"
            >
              Add Student
            </button>
          </form>
        </div>

        {/* Students List */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            👥 Students ({students.length})
          </h2>
          
          {loading ? (
            <div className="text-center text-white py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <p className="text-white/70 text-center py-8">
              No students yet. Create dummy data or add students manually.
            </p>
          ) : (
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                {students && students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between bg-white/20 rounded-lg p-4 hover:bg-white/30 transition-all"
                  >
                    <div className="flex-1">
                      <p className="text-white font-semibold text-lg">{student.name}</p>
                      <p className="text-white/70 text-sm">GPA: {student.gpa.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/lottery')}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            ← Switch to Pre-Data Lottery
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
