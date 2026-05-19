# StudyBuddy AI - Complete Project Prompt

**You are an expert full-stack MERN developer.** Build a **complete, production-ready** AI-powered student learning platform called **StudyBuddy AI** using the MERN Stack with modern UI/UX.

## Project Overview
StudyBuddy AI allows students to upload study notes/PDFs, generate AI summaries, create automatic quizzes, track progress, and manage their learning efficiently.

---

## Core Features

### 1. Authentication Module
- Signup, Login, Logout
- Forgot Password (email reset link)
- Protected Routes
- JWT Authentication + bcrypt password hashing
- MongoDB User model
- Optional: Google Login

### 2. Dashboard Page
- Responsive sidebar navigation
- Welcome message with user name
- Recent uploads
- Progress tracking cards
- Quick action buttons (Upload, Summary, Quiz)
- Study statistics (charts)
- Recent activity feed
- Dark mode support

### 3. Upload Notes Page
- Drag & Drop file upload (PDF, DOC, DOCX, TXT)
- Cloudinary integration for file storage
- Upload progress indicator
- File preview
- Title, description, category/tags
- Voice note upload (optional)

### 4. AI Summary Generator
- Select uploaded note → Generate Summary
- Short Summary + Detailed Summary
- Key points & important topics extraction
- Copy to clipboard & Download as PDF/TXT
- Save summary option
- Use **Google Gemini API** (preferred)

### 5. AI Quiz Generator
- Generate MCQs + True/False from notes
- Difficulty levels (Easy, Medium, Hard)
- Number of questions selector
- Timer-based quiz interface
- Instant scoring with explanations
- Retry quiz & review answers

### 6. History & Saved Content
- View all uploaded notes, summaries, and quiz attempts
- Search and filter functionality
- View / Delete options

### 7. User Profile Page
- Update profile information
- Profile picture upload (Cloudinary)
- Learning statistics
- Achievement badges
- Account settings

---

## Tech Stack (Must Follow)

- **Frontend**: Next.js 14+ (App Router) or React.js (Vite) + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **AI Integration**: Google Gemini API (gemini-1.5-flash recommended)
- **State Management**: Context API + useReducer (or Redux Toolkit)
- **UI Library**: Tailwind CSS + Framer Motion (animations)
- **Charts**: Recharts or Chart.js

---

## Design Requirements
- Modern, clean, student-friendly UI
- Primary **Dark Mode**
- Glassmorphism / neumorphism cards
- Smooth animations
- Fully responsive (mobile + desktop)
- Professional typography (Inter / Poppins)

---

## Deliverables Expected

1. Complete project folder structure
2. Backend code first (models, routes, controllers, middleware)
3. Frontend code (pages + components)
4. `.env.example` file with all required variables
5. Setup & installation instructions
6. Gemini API integration guide
7. Deployment instructions (Vercel + Render/Railway)

**Instructions for AI:**
- Write clean, well-commented, and scalable code
- Follow best practices
- Use proper error handling and loading states
- Make it production-ready
- Start by showing the complete folder structure, then proceed step by step.

Now start building the project. First, give me the complete folder structure and setup guide.