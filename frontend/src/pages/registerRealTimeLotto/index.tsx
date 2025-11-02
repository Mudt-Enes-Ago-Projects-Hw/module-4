import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { realtimeApi } from '@/utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterRealTimeLotto() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [gpa, setGpa] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [corruption, setCorruption] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    // Check if user has already registered
    const registered = sessionStorage.getItem('realtimeLottoRegistered');
    if (registered === 'true') {
      setHasRegistered(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check session storage again before submission
    if (sessionStorage.getItem('realtimeLottoRegistered') === 'true') {
      toast.error('You have already registered for the lottery!');
      setHasRegistered(true);
      return;
    }

    if (!name.trim() || !gpa) {
      toast.error('Please enter both name and GPA');
      return;
    }

    const gpaNum = parseFloat(gpa);
    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 5) {
      toast.error('GPA must be between 0 and 5');
      return;
    }

    try {
      setLoading(true);

      // Check existing students if trying to register as disabled or corrupt
      if (disabled || corruption) {
        try {
          const response = await realtimeApi.getStudents();
          console.log('API Response:', response);
          
          const existingStudents = response?.students || []
          console.log('Existing students:', existingStudents);
          
          if (disabled) {
            const disabledStudents = existingStudents.filter((s: any) => s.disabled === true);
            console.log('Disabled students found:', disabledStudents);
            if (disabledStudents.length >= 1) {
              toast.error('Cannot register: Only 1 disabled student is allowed!');
              setLoading(false);
              return;
            }
          }

          if (corruption) {
            const corruptStudents = existingStudents.filter((s: any) => s.corruption === true);
            console.log('Corrupt students found:', corruptStudents);
            if (corruptStudents.length >= 1) {
              toast.error('Cannot register: Only 1 corrupt student is allowed!');
              setLoading(false);
              return;
            }
          }
        } catch (validationError) {
          console.error('Error checking existing students:', validationError);
          toast.error('Failed to validate registration. Please try again.');
          setLoading(false);
          return;
        }
      }

      await realtimeApi.createStudent({
        name: name.trim(),
        gpa: gpaNum,
        disabled,
        corruption
      });

      // Set session storage to mark registration as complete
      sessionStorage.setItem('realtimeLottoRegistered', 'true');
      setHasRegistered(true);

      toast.success('Registration successful! You have been added to the lottery.');
      
      // Clear form
      setName('');
      setGpa('');
      setDisabled(false);
      setCorruption(false);
    } catch (error: any) {
      console.error('Error registering:', error);
      toast.error(error.message || 'Failed to register for lottery');
    } finally {
      setLoading(false);
    }
  };

  if (hasRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-8 flex items-center justify-center">
        <ToastContainer position="top-right" autoClose={3000} />
        
        <div className="max-w-2xl w-full">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Already Registered!
            </h1>
            <p className="text-xl text-white/80 mb-6">
              You have already registered for the real-time lottery. You can only register once per session.
            </p>
            <p className="text-white/60 mb-8">
              Good luck with the lottery! The results will be available once the lottery is run.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold mb-6 text-white">Student Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                GPA (0-5.0) *
              </label>
              <input
                type="number"
                placeholder="Enter your GPA"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                step="0.01"
                min="0"
                max="5"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                required
              />
            </div>

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
                    disabled={loading}
                    className="w-5 h-5 text-green-500 focus:ring-2 focus:ring-green-400 disabled:opacity-50"
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
                    disabled={loading}
                    className="w-5 h-5 text-cyan-500 focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
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
                    disabled={loading}
                    className="w-5 h-5 text-blue-500 focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                  />
                  <span className="text-white">Corruption</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                'Register for Lottery'
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
