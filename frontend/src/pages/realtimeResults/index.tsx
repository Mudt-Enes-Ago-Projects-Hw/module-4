import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { realtimeApi } from '@/utils/api';
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

export default function RealtimeResults() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [hypePhase, setHypePhase] = useState(0);

  useEffect(() => {
    startHypeSequence();
  }, []);

  const startHypeSequence = async () => {
    // Phase 1: Initial anticipation
    setHypePhase(1);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Phase 2: Building excitement
    setHypePhase(2);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Phase 3: Maximum hype
    setHypePhase(3);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Fetch the results
    try {
      const data = await realtimeApi.getAssignments();
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
        router.push('/realtime');
      }, 2000);
    }
  };

  const getHypeMessage = () => {
    switch (hypePhase) {
      case 1:
        return '⚡ Processing in real-time...';
      case 2:
        return '🔄 Synchronizing data...';
      case 3:
        return '🎊 Results incoming...';
      default:
        return '';
    }
  };

  const categorizeAllStudents = () => {
    // Sort ALL students globally by priority (single category per person):
    // 1. Single room students (ALWAYS FIRST)
    // 2. Corrupt/Premium students
    // 3. Top GPA students
    // 4. Disabled students
    // 5. Random/Rest
    return [...assignments].sort((a, b) => {
      // 1. Single room students ALWAYS first
      const aSingle = a.room_type === 'single';
      const bSingle = b.room_type === 'single';
      if (aSingle && !bSingle) return -1;
      if (!aSingle && bSingle) return 1;
      
      // If both are single room, sort by room number
      if (aSingle && bSingle) {
        return a.room_number - b.room_number;
      }
      
      // For non-single rooms, categorize by single category:
      // 2. Corrupt students
      if (a.corruption && !b.corruption) return -1;
      if (!a.corruption && b.corruption) return 1;
      if (a.corruption && b.corruption) {
        return a.room_number - b.room_number;
      }
      
      // 3. Top GPA students (non-corrupt, non-disabled)
      const aTopGPA = !a.corruption && !a.disabled && a.gpa >= 3.5;
      const bTopGPA = !b.corruption && !b.disabled && b.gpa >= 3.5;
      if (aTopGPA && !bTopGPA) return -1;
      if (!aTopGPA && bTopGPA) return 1;
      if (aTopGPA && bTopGPA) {
        return b.gpa - a.gpa; // Higher GPA first
      }
      
      // 4. Disabled students (non-corrupt, non-top-gpa)
      if (a.disabled && !b.disabled) return -1;
      if (!a.disabled && b.disabled) return 1;
      if (a.disabled && b.disabled) {
        return a.room_number - b.room_number;
      }
      
      // 5. Random/Rest - sort by room number then name
      if (a.room_number !== b.room_number) return a.room_number - b.room_number;
      return (a.name || '').localeCompare(b.name || '');
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            {/* Spinning real-time icon */}
            <div className="text-6xl animate-pulse mb-4">
              ⚡
            </div>
          </div>

          {/* Hype message */}
          <h1 className="text-3xl font-bold text-white mb-4 transition-all duration-300">
            {getHypeMessage()}
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
            ⚡ Real-Time Results ⚡
          </h1>
          <p className="text-2xl text-white/80">
            Live assignment processing complete!
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

        {/* All Assignments - Sorted by Priority */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            � All Assignments (Sorted by Priority)
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
                      {/* Only single room students have category badge */}
                      {assignment.room_type === 'single' && (
                        <span className="bg-cyan-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                          🚪 SINGLE ROOM
                        </span>
                      )}
                    </div>
                    <div className="flex gap-6 text-sm text-white/80 ml-[48px]">
                      <span className="font-medium">Room: <span className="text-white font-bold">#{assignment.room_number}</span></span>
                      <span className="font-medium">ID: <span className="text-white">{assignment.student_id}</span></span>
                      <span className="font-medium">Type: <span className="text-white">{assignment.room_type}</span></span>
                      <span className="font-medium">GPA: <span className="text-cyan-300 font-bold text-base">{assignment.gpa.toFixed(2)}</span></span>
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
              No assignments found. Please run the real-time lottery first.
            </p>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/realtime')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg text-lg"
          >
            ← Back to Real-Time Lottery
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
