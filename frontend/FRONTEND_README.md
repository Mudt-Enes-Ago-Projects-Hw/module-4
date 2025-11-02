# Dormitory Lottery System - Frontend

A Next.js frontend for the Dormitory Lottery System with beautiful animations and real-time updates.

## Features

### Pre-Data Lottery (`/lottery`)
- View all students with scrollable list
- Create dummy data for testing
- Add new students with name and GPA
- Delete individual students
- Run the lottery and see animated results
- Beautiful gradient UI with glass-morphism effects

### Real-Time Lottery (`/realtime`)
- Similar features to Pre-Data Lottery
- Uses real-time API endpoints
- Alternative color scheme (emerald/teal/cyan)

### Results Pages
- `/lotteryResults` - Shows pre-data lottery results
- `/realtimeResults` - Shows real-time lottery results
- Exciting hype loading sequence before showing results
- Room-based grouping of students
- Stats dashboard (total students, rooms, average GPA)
- Animated reveals with staggered animations

## Tech Stack

- **Next.js 15** with Pages Router
- **TypeScript** for type safety
- **Axios** for API calls (default backend: localhost:3001)
- **React-Toastify** for notifications
- **Tailwind CSS** for styling
- Custom animations and transitions

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

The app will automatically redirect to `/lottery`

## API Configuration

The frontend is configured to connect to the backend at `http://localhost:3001`.

To change this, edit `src/lib/axios.ts`:

```typescript
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001', // Change this URL
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Pages Structure

```
src/pages/
├── index.tsx              # Redirects to /lottery
├── lottery/
│   └── index.tsx         # Main pre-data lottery page
├── lotteryResults/
│   └── index.tsx         # Pre-data lottery results
├── realtime/
│   └── index.tsx         # Real-time lottery page
└── realtimeResults/
    └── index.tsx         # Real-time lottery results
```

## API Endpoints Used

### Pre-Data Lottery
- `GET /api/preData/students` - Fetch all students
- `POST /api/preData/students` - Create a student
- `DELETE /api/preData/students/:id` - Delete a student
- `POST /api/preData/dummyData` - Create dummy data
- `POST /api/preData/lottery` - Run the lottery
- `GET /api/preData/assignments` - Get lottery results

### Real-Time Lottery
- `GET /api/realtime/students` - Fetch all students
- `POST /api/realtime/students` - Create a student
- `DELETE /api/realtime/students/:id` - Delete a student
- `POST /api/realtime/dummyData` - Create dummy data
- `POST /api/realtime/lottery` - Run the lottery
- `GET /api/realtime/assignments` - Get lottery results

## Features Highlights

- 🎨 Beautiful gradient backgrounds with glass-morphism
- 📱 Responsive design
- 🔄 Loading states with spinners
- 🎊 Exciting lottery result reveals with animations
- 🎯 Toast notifications for all actions
- 📊 Statistics dashboard
- 🎭 Smooth transitions and hover effects
- 📜 Scrollable student lists (max 10 visible, rest scrollable)
- 💫 Custom scrollbar styling

## User Flow

1. **Start** → Redirected to `/lottery`
2. **Add Students** → Use "Create Dummy Data" or add manually
3. **Run Lottery** → Click "RUN THE LOTTERY!" button
4. **Watch Hype** → 4.5 seconds of exciting loading animation
5. **View Results** → See room assignments with stats
6. **Switch Mode** → Toggle between Pre-Data and Real-Time lottery

## Customization

### Colors
The app uses Tailwind CSS gradients. Main color schemes:
- **Pre-Data Lottery**: Purple → Blue → Indigo
- **Real-Time Lottery**: Emerald → Teal → Cyan

### Animations
Custom animations defined in `<style jsx>` blocks:
- `fade-in` - For headers
- `slide-in` - For room cards
- `bounce` - For lottery balls
- `ping` - For loading rings

## Notes

- Maximum 10 students visible at once (scrollable for more)
- GPA must be between 0.0 and 4.0
- Student names are required
- Lottery requires at least 1 student
- Results are grouped by room number
- Each page includes toast notifications for user feedback
