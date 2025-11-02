import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { preDataApi } from '@/utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Student {
  id: number;
  name: string;
  gpa: number;
  disabled: boolean;
  corruption: boolean;
}

export default function LotteryPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [gpa, setGpa] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [corruption, setCorruption] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await preDataApi.getStudents();
      setStudents(data);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch students';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDummyData = async () => {
    try {
      await preDataApi.createDummyData();
      toast.success('Dummy data created successfully!');
      await fetchStudents();
    } catch (error: any) {
      console.error('Error creating dummy data:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to create dummy data';
      toast.error(errorMessage);
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    try {
      await preDataApi.deleteStudent(studentId);
      toast.success('Student deleted successfully!');
      await fetchStudents();
    } catch (error: any) {
      console.error('Error deleting student:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to delete student';
      toast.error(errorMessage);
    }
  };

  const handleCreateStudent = async () => {
    if (!name.trim() || !gpa) {
      toast.error('Please enter both name and GPA');
      return;
    }

    const gpaNum = parseFloat(gpa);
    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 5) {
      toast.error('GPA must be between 0 and 4');
      return;
    }

    try {
      await preDataApi.createStudent({ 
        name: name.trim(), 
        gpa: gpaNum,
        disabled,
        corruption
      });
      toast.success(`Student ${name} created!`);
      setName('');
      setGpa('');
      setDisabled(false);
      setCorruption(false);
      fetchStudents();
    } catch (error: any) {
      console.error('Error creating student:', error);
      toast.error(error.message || 'Failed to create student');
    }
  };

  const handleRunLottery = async () => {
    try {
      setLoading(true);
      await preDataApi.runLottery();
      toast.success('Lottery executed! Redirecting to results...');
      setTimeout(() => {
        router.push('/lotteryResults');
      }, 1000);
    } catch (error: any) {
      console.error('Error running lottery:', error);
      toast.error(error.message || 'Failed to run lottery');
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all students and assignments? This cannot be undone.')) {
      return;
    }

    try {
      await preDataApi.clearAll();
      toast.success('All data cleared!');
      fetchStudents();
    } catch (error: any) {
      console.error('Error clearing data:', error);
      toast.error(error.message || 'Failed to clear data');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
          Dormitory Lottery System
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
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
            >
              🎰 RUN THE LOTTERY!
            </button>
            <button
              onClick={handleClearAll}
              disabled={loading || students.length === 0}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              🗑️ Clear All Data
            </button>
          </div>
        </div>

        {/* Create Student Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Add New Student</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                placeholder="GPA (0-5)"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                step="0.01"
                min="0"
                max="4"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="space-y-2">
                <p className="text-white font-semibold">Student Status:</p>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="studentStatus"
                      checked={!disabled && !corruption}
                      onChange={() => {
                        setDisabled(false);
                        setCorruption(false);
                      }}
                      className="w-5 h-5 text-green-500 focus:ring-2 focus:ring-green-400"
                    />
                    <span className="text-white">Regular</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="studentStatus"
                      checked={disabled}
                      onChange={() => {
                        setDisabled(true);
                        setCorruption(false);
                      }}
                      className="w-5 h-5 text-blue-500 focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="text-white">Disabled</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="studentStatus"
                      checked={corruption}
                      onChange={() => {
                        setDisabled(false);
                        setCorruption(true);
                      }}
                      className="w-5 h-5 text-orange-500 focus:ring-2 focus:ring-orange-400"
                    />
                    <span className="text-white">Corruption</span>
                  </label>
                </div>
              </div>
              <button
                onClick={handleCreateStudent}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg"
              >
                Add Student
              </button>
            </div>
          </div>

        {/* Students List */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Students ({students.length})
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
                {students && [...students].sort((a, b) => {
                  // Sort: corrupt first, then disabled, then regular
                  if (a.corruption && !b.corruption) return -1;
                  if (!a.corruption && b.corruption) return 1;
                  if (a.disabled && !b.disabled) return -1;
                  if (!a.disabled && b.disabled) return 1;
                  return 0;
                }).map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between bg-white/20 rounded-lg p-4 hover:bg-white/30 transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-semibold text-lg">{student.name}</p>
                        {student.corruption && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            CORRUPT
                          </span>
                        )}
                        {student.disabled && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            DISABLED
                          </span>
                        )}
                      </div>
                      <p className="text-white/70 text-sm">
                        GPA: {student.gpa.toFixed(2)} | 
                        Status: {student.corruption ? ' Corrupt' : student.disabled ? ' Disabled' : ' Regular'}
                      </p>
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
        <div className="text-center">
          <button
            onClick={() => router.push('/realtime')}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Switch to Real-Time Lottery →
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
