const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const BASE_URL = `${API_URL}/api`;

// Helper function to handle fetch requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, config).catch((err) => {
    // Network error
    throw {
      message: 'Network Error',
      response: {
        data: { error: 'Failed to connect to server' },
        status: 0,
        statusText: 'Network Error',
      },
    };
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    // Don't create a new Error object, just throw a plain object
    throw {
      message: errorData.error || errorData.message || 'Request failed',
      response: {
        data: errorData,
        status: response.status,
        statusText: response.statusText,
      },
    };
  }

  return response.json();
}

// Pre-Data Lottery API calls
export const preDataApi = {
  // Get all students
  getStudents: () => fetchAPI('/preData/students'),

  // Get student by ID
  getStudentById: (id: number) => fetchAPI(`/preData/students/${id}`),

  // Create new student
  createStudent: (data: { name: string; gpa: number; corruption?: boolean; disabled?: boolean }) => 
    fetchAPI('/preData/addStudent', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Delete student
  deleteStudent: (id: number) => 
    fetchAPI(`/preData/deleteStudent/${id}`, { method: 'DELETE' }),

  // Create dummy data
  createDummyData: () => 
    fetchAPI('/preData/dummyData', { method: 'POST' }),

  // Run lottery
  runLottery: () => 
    fetchAPI('/preData/runTheLottery', { method: 'POST' }),

  // Get assignments
  getAssignments: () => fetchAPI('/preData/assignments'),

  // Clear all data
  clearAll: () =>
    fetchAPI('/preData/clear', { method: 'POST' }),
};

// Real-Time Lottery API calls
export const realtimeApi = {
  // Get all students
  getStudents: () => fetchAPI('/realtime/students'),

  // Get student by ID
  getStudentById: (id: number) => fetchAPI(`/realtime/students/${id}`),

  // Create new student
  createStudent: (data: { name: string; gpa: number; corruption?: boolean; disabled?: boolean }) => 
    fetchAPI('/realtime/addStudent', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Delete student
  deleteStudent: (id: number) => 
    fetchAPI(`/realtime/deleteStudent/${id}`, { method: 'DELETE' }),

  // Run lottery
  runLottery: () => 
    fetchAPI('/realtime/runTheLottery', { method: 'POST' }),

  // Get assignments
  getAssignments: () => fetchAPI('/realtime/assignments'),

  // Clear all data
  clearAll: () =>
    fetchAPI('/realtime/clear', { method: 'POST' }),
};
