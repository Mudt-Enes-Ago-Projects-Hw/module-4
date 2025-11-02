import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { preDataApi } from '@/utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Assignment {
  id: number;
  student_id: number;
  name: string;
  room_number: number;
  room_type: string;
  gpa: number;
  corruption: boolean;
  disabled: boolean;
  roommate_id?: number;
}

export default function LotteryResults() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [hypePhase, setHypePhase] = useState(0);

  useEffect(() => {
    startHypeSequence();
  }, []);

  const startHypeSequence = async () => {
    setHypePhase(1);
    await new Promise(resolve => setTimeout(resolve, 750));

    setHypePhase(2);
    await new Promise(resolve => setTimeout(resolve, 750));

    setHypePhase(3);
    await new Promise(resolve => setTimeout(resolve, 750));

    // Fetch the results
    try {
      const data = await preDataApi.getAssignments();
      setAssignments(data);
      setHypePhase(4); // Results ready
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching lottery results:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch lottery results';
      toast.error(errorMessage);
      setLoading(false);
      setTimeout(() => {
        router.push('/lottery');
      }, 2000);
    }
  };


  const categorizeAllStudents = () => {
    // Sort by room number
    return [...assignments].sort((a, b) => {
      return a.room_number - b.room_number;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            {/* Spinning lottery ball */}
            <div className="text-6xl animate-pulse mb-4">
              🎲
            </div>
          </div>

          {/* Hype message */}
          <h1 className="text-3xl font-bold text-white mb-4 transition-all duration-300">
            Running The Lotto...
          </h1>

          {/* Progress bar */}
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${(hypePhase / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  const sortedAssignments = categorizeAllStudents();
  const totalRooms = new Set(assignments.map(a => a.room_number)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🏆 Lottery Results 🏆
          </h1>
          <p className="text-2xl text-white/80">
            Congratulations to all the winners!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold text-white">{assignments.length}</div>
            <div className="text-white/70">Total Students</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">🚪</div>
            <div className="text-3xl font-bold text-white">{totalRooms}</div>
            <div className="text-white/70">Rooms Assigned</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold text-white">
              {assignments.length > 0 ? (assignments.reduce((sum, a) => sum + a.gpa, 0) / assignments.length).toFixed(2) : '0.00'}
            </div>
            <div className="text-white/70">Average GPA</div>
          </div>
        </div>

        {/* All Assignments - Sorted by Room Number */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            📋 All Assignments (Sorted by Room Number)
          </h2>
          <div className="space-y-2">
            {sortedAssignments && sortedAssignments.map((assignment, idx) => (
              <div
                key={assignment.id}
                className="bg-white/20 rounded-lg p-4 hover:bg-white/30 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white/60 font-mono text-sm min-w-[40px]">#{idx + 1}</span>
                      <p className="text-white font-semibold text-xl">{assignment.name}</p>
                      {/* Room type badges based on student attributes and room type */}
                      {assignment.room_type === 'single' && assignment.corruption ? (
                        <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                          🔶 CORRUPT PREMIUM ROOM
                        </span>
                      ) : assignment.room_type === 'single' && !assignment.corruption && assignment.gpa >= 3.5 ? (
                        <span className="bg-yellow-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                          ⭐ SCHOLARSHIP ROOM
                        </span>
                      ) : assignment.room_type === 'single' && assignment.disabled ? (
                        <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                          ♿ DISABLED ROOM
                        </span>
                      ) : assignment.room_type === 'single' ? (
                        <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                          🎰 LOTTO WON SINGLE ROOM
                        </span>
                      ) : assignment.room_type === 'premium' && assignment.corruption ? (
                        <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                          🔶 CORRUPT PREMIUM
                        </span>
                      ) : assignment.room_type === 'premium' ? (
                        <span className="bg-purple-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                          💎 RANDOM PREMIUM
                        </span>
                      ) : null}
                    </div>
                    <div className="flex gap-6 text-sm text-white/80 ml-[48px]">
                      <span className="font-medium">Room: <span className="text-white font-bold">#{assignment.room_number}</span></span>
                      <span className="font-medium">ID: <span className="text-white">{assignment.student_id}</span></span>
                      <span className="font-medium">Type: <span className="text-white">{assignment.room_type}</span></span>
                      <span className="font-medium">GPA: <span className="text-emerald-300 font-bold text-base">{assignment.gpa.toFixed(2)}</span></span>
                      <span className="font-medium">
                        Status: 
                        <span className={`ml-1 font-bold ${
                          assignment.corruption ? 'text-orange-300' : 
                          assignment.disabled ? 'text-blue-300' : 
                          'text-green-300'
                        }`}>
                          {assignment.corruption ? 'Corrupt' : assignment.disabled ? 'Disabled' : 'Regular'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {assignments.length === 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-12 text-center">
            <p className="text-2xl text-white/70">
              No assignments found. Please run the lottery first.
            </p>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/lottery')}
            className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg text-lg"
          >
            ← Back to Lottery
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}
