# StudyBuddy AI

An AI-powered student learning platform built with the MERN stack. Upload study notes, generate AI summaries, create automatic quizzes, and track your learning progress.

## Features

- **Authentication** - Signup, Login, JWT-based auth with bcrypt hashing
- **Dashboard** - Stats, charts, recent activity, quick actions
- **Upload Notes** - Drag & drop upload (PDF, DOC, DOCX, TXT) with Cloudinary storage
- **AI Summary Generator** - Short & detailed summaries, key points extraction using Google Gemini
- **AI Quiz Generator** - MCQs, True/False, difficulty levels, timer-based quiz with instant scoring
- **History** - View all notes, summaries, and quiz attempts with search & filter
- **Profile** - Update info, avatar upload, learning stats, achievement badges
- **Dark Mode** - Modern glassmorphism UI with smooth animations

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcrypt |
| File Storage | Cloudinary |
| AI | Google Gemini API (gemini-1.5-flash) |
| Charts | Recharts |

---

## Project Structure

```
class-hackathon/
├── .env.example
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── gemini.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Note.js
│   │   ├── Summary.js
│   │   └── Quiz.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── noteRoutes.js
│   │   ├── summaryRoutes.js
│   │   ├── quizRoutes.js
│   │   └── statsRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── noteController.js
│   │   ├── summaryController.js
│   │   ├── quizController.js
│   │   └── statsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   └── utils/
│       ├── generateToken.js
│       └── extractText.js
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx
        ├── utils/
        │   └── api.js
        ├── components/
        │   ├── Layout.jsx
        │   ├── LoadingSpinner.jsx
        │   └── EmptyState.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── UploadNotes.jsx
            ├── Summaries.jsx
            ├── Quizzes.jsx
            ├── QuizAttempt.jsx
            ├── History.jsx
            └── Profile.jsx
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Google Gemini API key

### Step 1: Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Environment Variables

Copy `.env.example` to `.env` in the root directory and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Any random secret string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - From Cloudinary dashboard
- `GEMINI_API_KEY` - From Google AI Studio

### Step 3: Get API Keys

#### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string and replace `<password>` with your DB password

#### Cloudinary
1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free
3. Go to Dashboard → copy Cloud Name, API Key, API Secret

#### Google Gemini API
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

### Step 4: Run the Application

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |
| PUT | /api/auth/avatar | Upload avatar |

### Notes
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/notes | Get all notes |
| POST | /api/notes | Upload note |
| GET | /api/notes/:id | Get single note |
| DELETE | /api/notes/:id | Delete note |

### Summaries
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/summaries | Get all summaries |
| POST | /api/summaries/generate/:noteId | Generate AI summary |
| GET | /api/summaries/:id | Get single summary |
| DELETE | /api/summaries/:id | Delete summary |

### Quizzes
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/quizzes | Get all quizzes |
| POST | /api/quizzes/generate/:noteId | Generate AI quiz |
| POST | /api/quizzes/:id/submit | Submit quiz answers |
| GET | /api/quizzes/:id | Get single quiz |
| DELETE | /api/quizzes/:id | Delete quiz |

### Stats
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/stats | Get dashboard statistics |

---

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com) → Import Project
3. Select the `frontend` folder
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variable: `VITE_API_URL` = your backend URL

### Backend (Render)

1. Go to [Render](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Set root directory: `backend`
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add all environment variables from `.env`

### Backend (Railway)

1. Go to [Railway](https://railway.app) → New Project
2. Deploy from GitHub repo
3. Select the `backend` folder
4. Add environment variables
5. Railway auto-detects Node.js and deploys

---

## Gemini API Integration Guide

The app uses `@google/generative-ai` SDK to interact with Gemini 1.5 Flash.

### For Summaries:
```javascript
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const result = await model.generateContent(prompt);
const response = result.response.text();
```

### For Quizzes:
The quiz generator asks Gemini to return JSON-formatted questions with:
- Question text
- 4 options (MCQ) or True/False
- Correct answer
- Explanation

---

## License

MIT
