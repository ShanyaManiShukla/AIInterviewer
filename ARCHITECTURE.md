# AI Interview Question Generator - Complete Architecture

## 1. PRODUCT OVERVIEW

### Product Description
A web application that generates technical interview questions for students and professionals. Users can select specific skills, topics, difficulty levels, and question types to create customized practice sessions. The system provides both a curated static question bank and AI-generated questions with model answers, scoring, and feedback.

### Target Users
- Students preparing for technical interviews
- Junior developers seeking skill improvement
- Bootcamp graduates practicing coding interviews
- Career switchers entering tech roles

### Problem Solved
- Eliminates need to search multiple resources for interview practice
- Provides structured, difficulty-graded questions
- Offers instant AI-powered feedback on answers
- Creates realistic mock interview experience
- Tracks progress over time with history

### Core Features
1. Question generation (static + AI)
2. Mock interview mode with timer
3. AI-powered answer evaluation
4. PDF export of sessions
5. Progress tracking and history
6. Admin question bank management

### In-Scope Features
- Text-based interviews
- Static and AI-generated questions
- Model answer generation
- AI scoring with detailed feedback
- PDF export
- User history and analytics
- Admin question management

### Out-of-Scope Features
- Voice-based interviews (Phase 2)
- Video interviews
- Real-time collaborative interviews
- Live interviewer matching
- Mobile native apps
- Integration with external ATS systems

---

## 2. USER ROLES

| Role | Description | Permissions |
|------|-------------|-------------|
| **Student** | Regular user practicing interviews | - Generate questions<br>- Take mock interviews<br>- View answers and scores<br>- Export PDFs<br>- View own history<br>- Update profile |
| **Admin** | System administrator | - All Student permissions<br>- Manage question bank (CRUD)<br>- Manage skills/topics/difficulty<br>- View system analytics<br>- Manage prompt templates<br>- View audit logs |
| **Reviewer** | Content reviewer (optional) | - View all questions<br>- Approve/reject AI-generated questions<br>- Edit question content<br>- Manage question categories |

---

## 3. MAIN MODULES

### 3.1 Authentication Module
| Aspect | Details |
|--------|---------|
| **Purpose** | User registration, login, session management |
| **Main Actions** | Sign up, Sign in, Sign out, Password reset, Profile update |
| **Data Required** | Email, password, name, role |
| **API Endpoints** | POST /auth/signup, POST /auth/login, POST /auth/logout, GET /auth/me |
| **Edge Cases** | - Invalid credentials<br>- Email already exists<br>- Password reset token expiry<br>- Session token invalidation |

### 3.2 Dashboard Module
| Aspect | Details |
|--------|---------|
| **Purpose** | User landing page with quick actions and stats |
| **Main Actions** | View stats, Quick actions, Recent activity, Recommended practice |
| **Data Required** | User stats, recent sessions, skill progress |
| **API Endpoints** | GET /dashboard/stats, GET /dashboard/recent-sessions |
| **Edge Cases** | - New user with no history<br>- Failed sessions<br>- Partial data availability |

### 3.3 Question Generation Module
| Aspect | Details |
|--------|---------|
| **Purpose** | Generate questions based on user criteria |
| **Main Actions** | Select parameters, Generate static questions, Generate AI questions, View questions |
| **Data Required** | Skill, topic, difficulty, question type, count, mode |
| **API Endpoints** | GET /questions/static, POST /questions/generate-ai, GET /questions/:id |
| **Edge Cases** | - No questions match criteria<br>- AI generation timeout<br>- Rate limit exceeded<br>- Invalid parameter combination |

### 3.4 Static Question Bank Module
| Aspect | Details |
|--------|---------|
| **Purpose** | Manage pre-created questions |
| **Main Actions** | Query questions, Filter by criteria, Retrieve question details |
| **Data Required** | Question ID, filters, pagination |
| **API Endpoints** | GET /questions, GET /questions/:id, GET /skills, GET /topics, GET /difficulty-levels |
| **Edge Cases** | - Empty question bank<br>- Deactivated questions<br>- Version conflicts |

### 3.5 AI Question Generation Module
| Aspect | Details |
|--------|---------|
| **Purpose** | Generate questions using AI (Gemini/OpenAI) |
| **Main Actions** | Send generation request, Process AI response, Validate output, Store generated question |
| **Data Required** | Generation parameters, prompt template |
| **API Endpoints** | POST /questions/generate-ai (internal), GET /prompts/templates |
| **Edge Cases** | - AI timeout (>30s)<br>- Invalid JSON response<br>- Content policy violation<br>- Rate limiting<br>- Provider unavailability |

### 3.6 AI Answer Generation Module
| Aspect | Details |
|--------|---------|
| **Purpose** | Generate model answers for questions |
| **Main Actions** | Request answer generation, Process answer, Cache answer |
| **Data Required** | Question ID, question text, skill, topic |
| **API Endpoints** | POST /answers/generate-ai |
| **Edge Cases** | - Answer already exists<br>- Question not found<br>- AI generation failure |

### 3.7 Mock Interview Module
| Aspect | Details |
|--------|---------|
| **Purpose** | Simulate real interview experience |
| **Main Actions** | Start session, Navigate questions, Track time, Auto-submit, End session |
| **Data Required** | Session config, questions, timer state, answers |
| **API Endpoints** | POST /sessions/start, GET /sessions/:id, PUT /sessions/:id/answer, POST /sessions/:id/submit, POST /sessions/:id/end |
| **Edge Cases** | - Session timeout<br>- Browser refresh mid-session<br>- Network disconnection<br>- Incomplete answers |

### 3.8 Timer Module
| Aspect | Details |
|--------|---------|
| **Purpose** | Track interview time per question and total |
| **Main Actions** | Start timer, Pause timer, Resume timer, Alert on time limit, Force submit |
| **Data Required** | Session ID, question time limits, total time limit |
| **Implementation** | Client-side countdown with server sync on submit |
| **Edge Cases** | - Tab switch during timer<br>- System clock manipulation<br>- Slow network on auto-submit |

### 3.9 Answer Submission Module
| Aspect | Details |
|--------|---------|
| **Purpose** | Accept and store user answers |
| **Main Actions** | Submit answer, Save draft, Edit answer, Auto-save |
| **Data Required** | Session ID, question ID, answer text, timestamp |
| **API Endpoints** | PUT /sessions/:sessionId/questions/:questionId/answer |
| **Edge Cases** | - Empty answer submission<br>- Session already ended<br>- Late submission<br>- Character limit exceeded |

### 3.10 AI Scoring Module
| Aspect | Details |
|--------|---------|
| **Purpose** | Evaluate answers and provide feedback |
| **Main Actions** | Score answer, Generate feedback, Compare with model answer, Calculate metrics |
| **Data Required** | Question text, model answer, user answer, scoring rubric |
| **API Endpoints** | POST /scoring/score-answer |
| **Edge Cases** | - Very short answer<br>- Off-topic answer<br>- AI scoring failure<br>- Inconsistent scores |

### 3.11 PDF Export Module
| Aspect | Details |
|--------|---------|
| **Purpose** | Export interview session as PDF |
| **Main Actions** | Generate PDF from session data, Download PDF, Store export record |
| **Data Required** | Session details, questions, answers, scores, user info |
| **API Endpoints** | POST /exports/generate, GET /exports/:id/download |
| **Edge Cases** | - Session not found<br>- PDF generation failure<br>- Large session (>50 questions)<br>- Missing images/charts |

### 3.12 User History Module
| Aspect | Details |
|--------|---------|
| **Purpose** | Track and display user's interview sessions |
| **Main Actions** | View all sessions, Filter sessions, View session details, Delete history |
| **Data Required** | User ID, pagination, filters, session summaries |
| **API Endpoints** | GET /history, GET /history/:sessionId, DELETE /history/:sessionId |
| **Edge Cases** | - No history available<br>- Session in progress<br>- Partially completed sessions |

### 3.13 Admin Panel Module
| Aspect | Details |
|--------|---------|
| **Purpose** | Admin dashboard for system management |
| **Main Actions** | View analytics, Manage users, System settings, View logs |
| **Data Required** | Analytics data, user list, system metrics |
| **API Endpoints** | GET /admin/analytics, GET /admin/users, GET /admin/logs |
| **Edge Cases** | - Super admin self-deletion<br>- Permission escalation<br>- Data export limits |

### 3.14 Question Bank Management Module
| Aspect | Details |
|--------|---------|
| **Purpose** | CRUD operations for question bank |
| **Main Actions** | Add question, Edit question, Delete question, Import questions, Export questions |
| **Data Required** | Question details, skill mapping, topic mapping, difficulty |
| **API Endpoints** | POST /admin/questions, PUT /admin/questions/:id, DELETE /admin/questions/:id, POST /admin/questions/import |
| **Edge Cases** | - Delete question in active session<br>- Bulk import validation errors<br>- Duplicate question detection<br>- Cascade to versions |

---

## 4. USER FLOWS

### 4.1 Register/Login Flow
```
1. User visits app → Redirected to login if not authenticated
2. Clicks "Sign Up" → Enters email, password, name
3. System validates → Creates account → Assigns "student" role
4. System sends verification email (optional, configurable)
5. User logs in → System issues JWT token
6. User redirected to Dashboard
```

### 4.2 Generate Static Questions Flow
```
1. User navigates to "Generate Questions" page
2. Selects: Skill (e.g., JavaScript), Topic (e.g., Closures), Difficulty (Medium), Type (Conceptual), Count (5)
3. Toggles "Static Questions" mode
4. Clicks "Generate"
5. System queries database with filters
6. Returns matching questions from question bank
7. User views questions in list view
8. Can expand each question to see details
9. Can start mock interview with these questions
```

### 4.3 Generate AI Questions Flow
```
1. User navigates to "Generate Questions" page
2. Selects: Skill (Python), Topic (Data Structures), Difficulty (Hard), Type (Coding), Count (3)
3. Toggles "AI Generated" mode
4. Clicks "Generate"
5. System calls AI adapter with prompt template
6. AI generates questions in JSON format
7. System validates JSON structure
8. Questions stored temporarily (not in bank)
9. User views AI-generated questions
10. Can request model answers (separate API call)
11. Can start mock interview with AI questions
```

### 4.4 View Answers Flow
```
1. User on question list view
2. Clicks "Show Model Answer" on any question
3. System checks if answer exists
   - If static question: retrieve from database
   - If AI question: generate via AI (if not cached)
4. Model answer displayed with explanation
5. User can compare with own answer (if submitted)
```

### 4.5 Start Mock Interview Flow
```
1. User on generated questions page
2. Clicks "Start Mock Interview"
3. Selects interview mode:
   - Timed per question (configurable minutes)
   - Total time limit
   - Untimed practice mode
4. System creates practice session record
5. Redirects to interview interface
6. Question 1 displayed, timer starts
7. User types answer in text area
8. Auto-saves every 30 seconds (draft)
```

### 4.6 Submit Answer Flow
```
1. User in mock interview
2. Completes answer text
3. Clicks "Submit Answer" OR timer expires (auto-submit)
4. System validates answer (not empty, length check)
5. Answer stored in session_questions table
6. System optionally scores immediately (async)
7. Moves to next question OR shows summary if last
```

### 4.7 Get AI Score Flow
```
1. After answer submission
2. System sends to AI adapter:
   - Question text
   - Model answer
   - User answer
   - Rubric/grading criteria
3. AI returns JSON with:
   - score (0-100)
   - strengths array
   - improvements array
   - detailed_feedback text
4. Score stored in scores table
5. User sees score and feedback
6. Can view model answer for comparison
```

### 4.8 Export PDF Flow
```
1. User completes interview session
2. On summary page, clicks "Export PDF"
3. System generates PDF with:
   - Session metadata (date, duration, skill, score summary)
   - All questions with user answers
   - Model answers
   - Scores and feedback
4. PDF generated via html-to-pdf library
5. Stored in Supabase Storage (optional)
6. Download URL returned
7. Browser downloads PDF
8. Export record created
```

### 4.9 View History Flow
```
1. User clicks "History" in navigation
2. Sees list of all practice sessions
3. Filters by: Date range, Skill, Score range
4. Sorts by: Date, Score, Duration
5. Clicks session to view details
6. See full session with all questions, answers, scores
7. Can re-take session, export, or delete
```

### 4.10 Admin Adds/Edits Questions Flow
```
1. Admin logs in
2. Navigates to Admin Panel → Question Bank
3. Clicks "Add New Question"
4. Fills form:
   - Question text
   - Skill selection (dropdown)
   - Topic selection (dropdown)
   - Difficulty level (dropdown)
   - Question type (dropdown)
   - Model answer
   - Tags
5. Clicks "Save"
6. System validates
7. Question created with new version
8. Question available in static bank
9. For edit: Click existing question → Modify → Save new version
```

---

## 5. FRONTEND ARCHITECTURE

### Page List

| Page | Route | Purpose |
|------|-------|---------|
| Login | `/login` | User authentication |
| Register | `/register` | New user signup |
| Dashboard | `/dashboard` | User home with stats |
| Generate Questions | `/generate` | Question generation interface |
| Static Questions | `/questions/static` | Browse static question bank |
| Mock Interview | `/interview/:sessionId` | Interview interface |
| Session Summary | `/session/:sessionId` | Post-interview summary |
| History | `/history` | User session history |
| Session Detail | `/history/:sessionId` | View past session |
| Settings | `/settings` | User profile settings |
| Admin Dashboard | `/admin` | Admin main page |
| Admin Questions | `/admin/questions` | Question bank management |
| Admin Skills | `/admin/skills` | Manage skills |
| Admin Topics | `/admin/topics` | Manage topics |
| Admin Analytics | `/admin/analytics` | System analytics |
| Admin Prompts | `/admin/prompts` | Manage AI prompt templates |

### Route Structure

```
/                           → Redirect to /dashboard or /login
/login                      → Auth login page
/register                   → Auth signup page
/dashboard                  → User dashboard
/generate                   → Question generation wizard
/questions/static           → Browse static questions
/interview/[sessionId]      → Mock interview interface
/session/[sessionId]        → Session summary/results
/history                    → Session history list
/history/[sessionId]        → Session detail view
/settings                   → User settings
/admin                      → Admin dashboard (role-protected)
/admin/questions            → Question CRUD
/admin/questions/[id]/edit  → Edit question
/admin/skills               → Skill management
/admin/topics               → Topic management
/admin/difficulty           → Difficulty levels
/admin/analytics            → System analytics
/admin/prompts              → Prompt template management
/admin/users                → User management
/admin/logs                 → Audit logs
```

### Component List

#### UI Components (shadcn/ui based)
- Button, Input, Textarea, Select
- Card, Dialog, Modal, Drawer
- Table, Pagination, Filter
- Toast, Alert, Skeleton
- Tabs, Accordion, Collapsible
- DropdownMenu, Command, Popover
- Form, Label, Checkbox, Radio
- Progress, Badge, Avatar

#### Feature Components

| Component | Purpose |
|-----------|---------|
| `AuthForm` | Login/Register forms |
| `DashboardStats` | Dashboard statistics cards |
| `QuickActions` | Dashboard action buttons |
| `QuestionFilters` | Skill/Topic/Difficulty selectors |
| `QuestionCard` | Display single question |
| `QuestionList` | List of questions |
| `QuestionWizard` | Multi-step question generation |
| `InterviewTimer` | Countdown timer with alerts |
| `InterviewQuestion` | Current question display |
| `AnswerInput` | Text area with auto-save |
| `ScoreDisplay` | Show score and feedback |
| `SessionSummary` | Post-interview summary |
| `HistoryList` | Session history list |
| `AdminTable` | CRUD table for admin |
| `QuestionForm` | Add/Edit question form |
| `PromptEditor` | Edit prompt templates |
| `PDFExportButton` | Trigger PDF download |
| `AnalyticsChart` | Charts for admin |

### Folder Structure

```
frontend/
├── app/                      # Next.js app router pages
│   ├── (auth)/               # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (main)/               # Main app routes (authenticated)
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── generate/
│   │   │   └── page.tsx
│   │   ├── questions/
│   │   │   └── static/
│   │   │       └── page.tsx
│   │   ├── interview/
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx
│   │   ├── session/
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx
│   │   ├── history/
│   │   │   ├── page.tsx
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── admin/                 # Admin routes (role-protected)
│   │   ├── page.tsx
│   │   ├── questions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── skills/
│   │   │   └── page.tsx
│   │   ├── topics/
│   │   │   └── page.tsx
│   │   ├── difficulty/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── prompts/
│   │   │   └── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   └── logs/
│   │       └── page.tsx
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home (redirect)
│
├── components/               # Reusable components
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── form.tsx
│   │   ├── toast.tsx
│   │   └── ... (other UI components)
│   └── features/             # Feature-specific components
│       ├── auth/
│       │   └── AuthForm.tsx
│       ├── dashboard/
│       │   ├── StatsCards.tsx
│       │   ├── QuickActions.tsx
│       │   └── RecentSessions.tsx
│       ├── questions/
│       │   ├── QuestionCard.tsx
│       │   ├── QuestionList.tsx
│       │   ├── QuestionFilters.tsx
│       │   ├── QuestionWizard.tsx
│       │   └── QuestionForm.tsx
│       ├── interview/
│       │   ├── InterviewTimer.tsx
│       │   ├── InterviewQuestion.tsx
│       │   ├── AnswerInput.tsx
│       │   ├── QuestionNav.tsx
│       │   └── ScoreDisplay.tsx
│       ├── history/
│       │   ├── HistoryList.tsx
│       │   ├── SessionCard.tsx
│       │   └── SessionSummary.tsx
│       ├── admin/
│       │   ├── AdminTable.tsx
│       │   ├── AnalyticsChart.tsx
│       │   ├── PromptEditor.tsx
│       │   └── UserManagement.tsx
│       └── common/
│           ├── Navbar.tsx
│           ├── Sidebar.tsx
│           ├── PDFExportButton.tsx
│           ├── LoadingState.tsx
│           └── ErrorBoundary.tsx
│
├── features/                 # Feature modules (optional, can merge with components/features)
│   └── (empty for now, kept for future expansion)
│
├── services/                 # API service layer
│   ├── api.ts                # Base API client (Supabase client setup)
│   ├── auth.service.ts       # Auth API calls
│   ├── questions.service.ts  # Questions API calls
│   ├── sessions.service.ts   # Session API calls
│   ├── scoring.service.ts    # Scoring API calls
│   ├── history.service.ts    # History API calls
│   ├── export.service.ts     # PDF export API calls
│   └── admin.service.ts      # Admin API calls
│
├── hooks/                    # Custom React hooks
│   ├── useAuth.ts            # Auth state and methods
│   ├── useQuestions.ts       # Question generation logic
│   ├── useInterview.ts       # Interview session state
│   ├── useTimer.ts           # Timer countdown logic
│   ├── useAutoSave.ts        # Auto-save draft answers
│   └── useHistory.ts         # History queries
│
├── types/                    # TypeScript type definitions
│   ├── auth.types.ts
│   ├── question.types.ts
│   ├── session.types.ts
│   ├── score.types.ts
│   ├── user.types.ts
│   ├── admin.types.ts
│   └── api.types.ts
│
├── lib/                      # Utilities and helpers
│   ├── supabase/             # Supabase client setup
│   │   ├── client.ts         # Browser client
│   │   ├── server.ts         # Server client
│   │   └── admin.ts          # Admin client (service role)
│   ├── utils.ts              # General utilities
│   ├── constants.ts          # App constants
│   ├── validators.ts         # Zod schemas for validation
│   └── pdf-generator.ts      # PDF generation utilities
│
├── styles/                   # Global styles
│   └── globals.css           # Tailwind imports, custom CSS
│
├── public/                   # Static assets
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
│
├── .env.local                # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Key Frontend Architecture Points

| Folder | Purpose |
|--------|---------|
| `app/` | Next.js 13+ app router - file-based routing |
| `components/ui/` | Reusable UI primitives (shadcn/ui) |
| `components/features/` | Domain-specific components |
| `services/` | API abstraction layer (calls Supabase/Edge Functions) |
| `hooks/` | Custom hooks for stateful logic |
| `types/` | TypeScript interfaces and types |
| `lib/` | Utilities, Supabase clients, constants |

---

## 6. BACKEND ARCHITECTURE

Since we're using Supabase, the backend is split between:
1. **Supabase Database** - PostgreSQL with RLS
2. **Supabase Edge Functions** - Serverless Deno functions for business logic
3. **Next.js API Routes** - Optional for simple operations

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                  │
│  - React Components                                      │
│  - Client-side state                                      │
│  - Calls Supabase directly (with RLS)                    │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌───────────────┐          ┌────────────────┐
│  Supabase     │          │   Edge         │
│  Client SDK   │          │   Functions    │
│  - Auth       │          │  - AI Adapter  │
│  - Database   │          │  - Scoring     │
│  - Storage    │          │  - PDF Gen     │
│  (RLS)        │          │  - Cron Jobs   │
└───────┬───────┘          └────────┬───────┘
        │                           │
        └───────────┬───────────────┘
                    │
                    ▼
          ┌─────────────────┐
          │   PostgreSQL     │
          │   (Supabase DB) │
          │  - Tables       │
          │  - RLS Policies │
          │  - Functions    │
          │  - Triggers     │
          └─────────────────┘
```

### Edge Functions Structure

```
supabase/
├── functions/
│   ├── generate-questions/       # AI question generation
│   │   └── index.ts
│   ├── generate-answers/         # AI answer generation
│   │   └── index.ts
│   ├── score-answer/             # AI answer scoring
│   │   └── index.ts
│   ├── generate-pdf/            # PDF generation
│   │   └── index.ts
│   ├── admin-operations/        # Admin CRUD operations
│   │   └── index.ts
│   └── _shared/                  # Shared utilities
│       ├── ai-adapter.ts         # Gemini/OpenAI adapter
│       ├── prompt-templates.ts   # Prompt templates
│       └── validation.ts        # Input validation
│
├── migrations/                   # SQL migrations
│   ├── 001_initial_schema.sql
│   ├── 002_rls_policies.sql
│   ├── 003_triggers.sql
│   └── ...
│
├── seed.sql                      # Initial data
└── config.toml                   # Supabase config
```

### Edge Function Details

| Function | Purpose | Trigger |
|----------|---------|---------|
| `generate-questions` | Call AI to generate questions | POST request from frontend |
| `generate-answers` | Generate model answer for question | POST request, or cron for bulk |
| `score-answer` | Evaluate user answer vs model | POST after answer submission |
| `generate-pdf` | Create PDF from session | POST from summary page |
| `admin-operations` | Complex admin operations | POST with admin JWT |

### AI Adapter Layer

```typescript
// supabase/functions/_shared/ai-adapter.ts

interface AIProvider {
  generate(prompt: string): Promise<string>;
  score(question: string, answer: string, userAnswer: string): Promise<ScoreResult>;
}

class GeminiProvider implements AIProvider {
  async generate(prompt: string): Promise<string> {
    // Gemini API call
  }
  async score(...): Promise<ScoreResult> {
    // Gemini scoring
  }
}

class OpenAIProvider implements AIProvider {
  async generate(prompt: string): Promise<string> {
    // OpenAI API call
  }
  async score(...): Promise<ScoreResult> {
    // OpenAI scoring
  }
}

export function getAIProvider(): AIProvider {
  const provider = Deno.env.get('AI_PROVIDER') || 'gemini';
  return provider === 'openai' ? new OpenAIProvider() : new GeminiProvider();
}
```

### Next.js API Routes (for simple operations)

```
app/api/
├── auth/
│   └── [...nextauth]/route.ts    # NextAuth or Supabase auth wrapper
├── webhooks/
│   └── stripe/route.ts           # Payment webhooks (if needed)
└── health/
    └── route.ts                  # Health check endpoint
```

### Error Handling Strategy

| Layer | Error Handling |
|-------|---------------|
| Frontend Services | Try-catch, show toast notifications, error boundaries |
| Edge Functions | Try-catch, structured error responses, logging |
| Database | Constraints, triggers, RLS policies for data integrity |

### Request Flow Example

```
User clicks "Generate AI Questions"
        │
        ▼
Frontend validates inputs
        │
        ▼
POST /functions/v1/generate-questions
Headers: Authorization: Bearer <JWT>
Body: { skill, topic, difficulty, count, type }
        │
        ▼
Edge Function:
1. Validate JWT → Get user
2. Check rate limits
3. Load prompt template
4. Call AI adapter
5. Parse JSON response
6. Validate structure
7. Return to frontend
        │
        ▼
Frontend displays questions
```

---

## 7. DATABASE DESIGN

### Entity Relationship Diagram

```
users ─┬─> practice_sessions ─┬─> session_questions ─┬─> answers ───> scores
       │                      │                       │
       └─> roles              └─> questions ──────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────┐
        │                             │                         │
        ▼                             ▼                         ▼
    skills                      question_types            difficulty_levels
        │
        ▼
    topics
```

### Table Definitions

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role_id UUID REFERENCES roles(id) DEFAULT (SELECT id FROM roles WHERE name = 'student'),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);
```
| Column | Purpose |
|--------|---------|
| id | Primary key |
| email | Unique email for login |
| password_hash | Bcrypt hashed password |
| name | Display name |
| role_id | Foreign key to roles |
| created_at/updated_at | Timestamps |
| last_login | Last login time |
| is_active | Soft delete flag |

#### roles
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
```
| Column | Purpose |
|--------|---------|
| id | Primary key |
| name | Role name: 'student', 'admin', 'reviewer' |
| permissions | Array of permission strings |

#### skills
```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```
| Column | Purpose |
|--------|---------|
| id | Primary key |
| name | Skill name e.g., 'JavaScript', 'Python', 'React' |
| description | Brief description |
| is_active | Active flag for soft delete |

**Sample Data**: 'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Java'

#### topics
```sql
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(skill_id, name)
);
```
| Column | Purpose |
|--------|---------|
| id | Primary key |
| skill_id | Parent skill |
| name | Topic name e.g., 'Closures', 'Async/Await' |
| description | Topic description |

**Sample Data**:
- JavaScript: Closures, Prototypes, Async/Await, Event Loop
- Python: Decorators, Generators, OOP, Data Structures
- React: Hooks, State Management, Lifecycle, Performance

#### difficulty_levels
```sql
CREATE TABLE difficulty_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  level INT UNIQUE NOT NULL,
  description TEXT,
  time_limit_minutes INT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```
| Column | Purpose |
|--------|---------|
| id | Primary key |
| name | 'Easy', 'Medium', 'Hard', 'Expert' |
| level | Numeric level 1-4 |
| time_limit_minutes | Suggested time for question |

**Sample Data**:
- Easy (1): 5 minutes
- Medium (2): 10 minutes
- Hard (3): 15 minutes
- Expert (4): 20 minutes

#### question_types
```sql
CREATE TABLE question_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  answer_format TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```
| Column | Purpose |
|--------|---------|
| id | Primary key |
| name | 'Conceptual', 'Coding', 'System Design', 'Behavioral' |
| answer_format | Expected answer format |

**Sample Data**: 'Conceptual', 'Coding', 'System Design', 'Behavioral'

#### questions
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID REFERENCES skills(id),
  topic_id UUID REFERENCES topics(id),
  difficulty_id UUID REFERENCES difficulty_levels(id),
  type_id UUID REFERENCES question_types(id),
  question_text TEXT NOT NULL,
  model_answer TEXT,
  is_static BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  times_used INT DEFAULT 0,
  avg_score DECIMAL(5,2),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
| Column | Purpose |
|--------|---------|
| id | Primary key |
| skill_id, topic_id, difficulty_id, type_id | Categorization |
| question_text | The actual question |
| model_answer | Expected answer (can be null initially) |
| is_static | True if from bank, false if AI-generated |
| is_active | Active flag |
| tags | Search tags |
| times_used | Usage count for analytics |
| avg_score | Average score for quality metrics |

#### question_versions
```sql
CREATE TABLE question_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  question_text TEXT NOT NULL,
  model_answer TEXT,
  change_reason TEXT,
  changed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(question_id, version_number)
);
```
| Column | Purpose |
|--------|---------|
| id | Primary key |
| question_id | Parent question |
| version_number | Sequential version |
| question_text, model_answer | Snapshot of content |
| change_reason | Why edited |

**Purpose**: Audit trail for question edits

#### practice_sessions
```sql
CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id),
  mode TEXT NOT NULL,
  total_questions INT NOT NULL,
  time_limit_minutes INT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  total_duration_seconds INT,
  status TEXT DEFAULT 'in_progress',
  total_score DECIMAL(5,2),
  avg_score DECIMAL(5,2),
  config JSONB
);
```
| Column | Purpose |
|--------|---------|
| id | Primary key |
| user_id | Session owner |
| skill_id | Primary skill practiced |
| mode | 'timed_per_question', 'total_time_limit', 'untimed' |
| total_questions | Number of questions in session |
| time_limit_minutes | Configured time limit |
| started_at, ended_at | Session duration |
| status | 'in_progress', 'completed', 'abandoned' |
| total_score, avg_score | Aggregate scores |
| config | Session configuration JSON |

#### session_questions
```sql
CREATE TABLE session_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES practice_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id),
  question_order INT NOT NULL,
  time_limit_seconds INT,
  started_at TIMESTAMPTZ,
  answered_at TIMESTAMPTZ,
  time_spent_seconds INT,
  is_auto_submitted BOOLEAN DEFAULT false,
  UNIQUE(session_id, question_order)
);
```
| Column | Purpose |
|--------|---------|
| id | Primary key |
| session_id, question_id | Relations |
| question_order | Sequence in session |
| time_limit_seconds | Per-question time limit |
| started_at, answered_at | Timing data |
| is_auto_submitted | True if timed out |

#### answers
```sql
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_question_id UUID REFERENCES session_questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  answer_text TEXT NOT NULL,
  word_count INT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  is_draft BOOLEAN DEFAULT false,
  UNIQUE(session_question_id)
);
```
| Column | Purpose |
|--------|---------|
| id | Primary key |
| session_question_id | Relation to session question |
| answer_text | User's answer |
| word_count | Count for analytics |
| is_draft | Auto-saved draft flag |

#### scores
```sql
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id UUID REFERENCES answers(id) ON DELETE CASCADE,
  score DECIMAL(5,2) NOT NULL,
  max_score DECIMAL(5,2) DEFAULT 100,
  percentage DECIMAL(5,2) GENERATED ALWAYS AS (score / max_score * 100) STORED,
  strengths JSONB DEFAULT '[]'::jsonb,
  improvements JSONB DEFAULT '[]'::jsonb,
  detailed_feedback TEXT,
  scored_at TIMESTAMPTZ DEFAULT now(),
  scoring_model TEXT,
  UNIQUE(answer_id)
);
```
| Column | Purpose |
|--------|---------|
| id | Primary key |
| answer_id | Relation to answer |
| score | Numeric score |
| strengths | Array of positive points |
| improvements | Array of improvements needed |
| detailed_feedback | Full text feedback |
| scoring_model | AI model used |

#### pdf_exports
```sql
CREATE TABLE pdf_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES practice_sessions(id),
  user_id UUID REFERENCES users(id),
  file_path TEXT,
  file_size_kb INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);
```
| Column | Purpose |
|--------|---------|
| id | Primary key |
| session_id | Session exported |
| file_path | Storage path |
| file_size_kb | Size metric |
| expires_at | Cleanup time (configurable) |

#### prompt_templates
```sql
CREATE TABLE prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  template_text TEXT NOT NULL,
  variables JSONB,
  is_active BOOLEAN DEFAULT true,
  version INT DEFAULT 1,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
| Column | Purpose |
|--------|---------|
| id | Primary key |
| name | 'question_gen_v1', 'answer_scoring_v2' |
| category | 'question_gen', 'answer_gen', 'scoring', 'summary' |
| template_text | Actual prompt template |
| variables | Expected variables list |
| version | Version tracking |

**Categories**:
- 'question_gen' - Question generation prompts
- 'answer_gen' - Model answer generation prompts
- 'scoring' - Answer scoring prompts
- 'summary' - Session summary prompts

#### audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```
| Column | Purpose |
|--------|---------|
| id | Primary key |
| user_id | User who performed action |
| action | 'CREATE', 'UPDATE', 'DELETE', 'LOGIN' |
| entity_type | Table name |
| entity_id | Affected record ID |
| old_values, new_values | Change data |
| ip_address, user_agent | Request metadata |

### Relationships Summary

| Table | Relations |
|-------|-----------|
| users | has many practice_sessions, created questions, audit_logs |
| roles | assigned to users |
| skills | has many topics, used in questions and sessions |
| topics | belongs to skill, used in questions |
| difficulty_levels | used in questions |
| question_types | used in questions |
| questions | belongs to skill, topic, difficulty, type; has many versions; used in sessions |
| practice_sessions | belongs to user, skill; has many session_questions |
| session_questions | belongs to session, question; has one answer |
| answers | belongs to session_question; has one score |
| scores | belongs to answer |
| pdf_exports | belongs to session, user |

---

## 8. API DESIGN

### Base URL
- **Frontend to Supabase**: Direct client SDK calls (with RLS)
- **Edge Functions**: `https://<project>.supabase.co/functions/v1/<function-name>`

### Authentication Header
```
Authorization: Bearer <supabase_jwt_token>
apikey: <supabase_anon_key>
```

### API Endpoints

#### Auth Endpoints (Supabase Client SDK)

| Method | SDK Function | Purpose |
|--------|--------------|---------|
| POST | `supabase.auth.signUp()` | Register new user |
| POST | `supabase.auth.signInWithPassword()` | Login |
| POST | `supabase.auth.signOut()` | Logout |
| GET | `supabase.auth.getUser()` | Get current user |
| POST | `supabase.auth.resetPasswordForEmail()` | Password reset |

#### Skills & Topics Endpoints

| Method | URL | Purpose | Request | Response |
|--------|-----|---------|---------|----------|
| GET | `/rest/v1/skills?select=*` | List all skills | - | `[{id, name, description}]` |
| GET | `/rest/v1/topics?skill_id=eq.<id>` | List topics for skill | - | `[{id, skill_id, name}]` |
| GET | `/rest/v1/difficulty_levels` | List difficulties | - | `[{id, name, level}]` |
| GET | `/rest/v1/question_types` | List question types | - | `[{id, name}]` |

#### Question Generation Endpoints

| Method | URL | Purpose | Request Body | Response |
|--------|-----|---------|--------------|----------|
| POST | `/functions/v1/generate-questions` | Generate AI questions | `{skill_id, topic_id, difficulty_id, type_id, count, mode}` | `{questions: [{question_text, ...}]}` |
| GET | `/rest/v1/questions?select=*&skill_id=eq.<id>&topic_id=eq.<id>` | Get static questions | Query params | `[{id, question_text, ...}]` |
| GET | `/rest/v1/questions/<id>` | Get single question | - | `{id, question_text, model_answer, ...}` |
| POST | `/functions/v1/generate-answer` | Generate model answer | `{question_id, question_text}` | `{answer: "model answer text"}` |

#### Practice Session Endpoints

| Method | URL | Purpose | Request Body | Response |
|--------|-----|---------|--------------|----------|
| POST | `/rest/v1/practice_sessions` | Create new session | `{skill_id, mode, total_questions, time_limit_minutes, question_ids: []}` | `{id, session_id}` |
| GET | `/rest/v1/practice_sessions/<id>` | Get session details | - | Full session object with questions |
| PATCH | `/rest/v1/practice_sessions/<id>` | Update session (end, etc) | `{status, ended_at, total_score}` | Updated session |
| POST | `/rest/v1/session_questions` | Add questions to session | `[{session_id, question_id, order}]` | Created records |

#### Answer & Scoring Endpoints

| Method | URL | Purpose | Request Body | Response |
|--------|-----|---------|--------------|----------|
| POST | `/rest/v1/answers` | Submit answer | `{session_question_id, answer_text, user_id}` | `{id, answer_text}` |
| POST | `/functions/v1/score-answer` | Get AI score | `{answer_id, question_text, model_answer, user_answer}` | `{score, strengths: [], improvements: [], feedback}` |
| GET | `/rest/v1/scores?answer_id=eq.<id>` | Get score for answer | - | Score object |

#### History Endpoints

| Method | URL | Purpose | Request Body | Response |
|--------|-----|---------|--------------|----------|
| GET | `/rest/v1/practice_sessions?user_id=eq.<id>&select=*,session_questions(count)` | Get user history | - | Array of sessions with counts |
| GET | `/rest/v1/practice_sessions/<id>?select=*,session_questions(*,questions(*),answers(*,scores(*)))` | Full session detail | - | Complete nested object |
| DELETE | `/rest/v1/practice_sessions/<id>` | Delete session | - | Success status |

#### PDF Export Endpoints

| Method | URL | Purpose | Request Body | Response |
|--------|-----|---------|--------------|----------|
| POST | `/functions/v1/generate-pdf` | Generate PDF | `{session_id}` | `{download_url, file_path}` |
| GET | `/storage/v1/object/pdf/<path>` | Download PDF | - | PDF file stream |

#### Admin Endpoints

| Method | URL | Purpose | Request Body | Response |
|--------|-----|---------|--------------|----------|
| POST | `/rest/v1/questions` | Add question | Full question object | Created question |
| PATCH | `/rest/v1/questions/<id>` | Edit question | Updated fields | Updated question |
| DELETE | `/rest/v1/questions/<id>` | Delete question | - | Success |
| POST | `/rest/v1/skills` | Add skill | `{name, description}` | Created skill |
| POST | `/rest/v1/topics` | Add topic | `{skill_id, name}` | Created topic |
| GET | `/rest/v1/audit_logs?select=*&order=created_at.desc` | View audit logs | - | Array of logs |
| GET | `/functions/v1/admin-operations` | Complex admin ops | `{operation: 'analytics', params}` | Analytics data |

### Request/Response Examples

#### Generate AI Questions Request
```json
POST /functions/v1/generate-questions

{
  "skill_id": "uuid-here",
  "topic_id": "uuid-here",
  "difficulty_id": "uuid-here",
  "type_id": "uuid-here",
  "count": 5,
  "mode": "ai"
}

Response:
{
  "questions": [
    {
      "question_text": "Explain the concept of closures in JavaScript and provide an example.",
      "skill_id": "uuid",
      "topic_id": "uuid",
      "difficulty_id": "uuid",
      "type_id": "uuid"
    },
    ...
  ],
  "generated_at": "2024-01-15T10:30:00Z",
  "model": "gemini-pro"
}
```

#### Submit Answer Request
```json
POST /rest/v1/answers

{
  "session_question_id": "uuid-here",
  "user_id": "uuid-here",
  "answer_text": "A closure is a function that has access to variables from its outer scope...",
  "word_count": 45
}

Response:
{
  "id": "uuid",
  "session_question_id": "uuid",
  "answer_text": "...",
  "submitted_at": "2024-01-15T10:35:00Z"
}
```

#### Score Answer Request
```json
POST /functions/v1/score-answer

{
  "answer_id": "uuid",
  "question_text": "Explain closures...",
  "model_answer": "A closure is...",
  "user_answer": "A closure is a function..."
}

Response:
{
  "score": 85,
  "max_score": 100,
  "percentage": 85.0,
  "strengths": [
    "Correctly identifies closure concept",
    "Good use of terminology"
  ],
  "improvements": [
    "Could add more detailed example",
    "Missing memory management aspect"
  ],
  "detailed_feedback": "Your answer demonstrates good understanding... (full feedback text)"
}
```

### Pagination
```
GET /rest/v1/questions?select=*&offset=0&limit=20
Headers: Prefer: count=exact
Response includes: Content-Range: 0-19/156
```

### Filtering
```
GET /rest/v1/questions?skill_id=eq.<uuid>&difficulty_id=eq.<uuid>&is_active=eq.true
```

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "count",
        "message": "Count must be between 1 and 20"
      }
    ]
  },
  "status": 400
}
```

---

## 9. AI ARCHITECTURE

### Architecture Overview

```
┌──────────────┐
│ Edge Function │
│  (Deno)       │
└───────┬──────┘
        │
        ▼
┌──────────────────┐
│   AI Adapter     │
│   (Abstraction)  │
├──────┬───────────┤
│      │           │
▼      ▼           ▼
┌────┐ ┌─────┐
│Gem │ │Open │
│ini │ │ AI  │
└────┘ └─────┘
```

### AI Adapter Implementation

```typescript
// supabase/functions/_shared/ai-adapter.ts

interface GenerationConfig {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

interface QuestionGenerationResult {
  questions: QuestionData[];
  model: string;
  generatedAt: string;
}

interface ScoreResult {
  score: number;
  strengths: string[];
  improvements: string[];
  detailed_feedback: string;
}

export abstract class AIProvider {
  abstract generateQuestions(
    params: QuestionGenParams,
    config?: GenerationConfig
  ): Promise<QuestionGenerationResult>;

  abstract generateAnswer(
    question: string,
    context: AnswerContext
  ): Promise<string>;

  abstract scoreAnswer(
    question: string,
    modelAnswer: string,
    userAnswer: string,
    rubric?: ScoringRubric
  ): Promise<ScoreResult>;

  abstract generateSummary(
    sessionData: SessionSummaryInput
  ): Promise<SessionSummary>;
}

export class GeminiProvider extends AIProvider {
  private apiKey: string;
  private apiEndpoint: string;

  constructor() {
    this.apiKey = Deno.env.get('GEMINI_API_KEY')!;
    this.apiEndpoint = Deno.env.get('GEMINI_ENDPOINT') || 
      'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
  }

  async generateQuestions(params: QuestionGenParams, config?: GenerationConfig): Promise<QuestionGenerationResult> {
    const prompt = this.buildQuestionPrompt(params);
    const response = await this.callGemini(prompt, config);
    const questions = this.parseQuestionResponse(response);
    return {
      questions,
      model: 'gemini-pro',
      generatedAt: new Date().toISOString()
    };
  }

  async generateAnswer(question: string, context: AnswerContext): Promise<string> {
    const prompt = this.buildAnswerPrompt(question, context);
    const response = await this.callGemini(prompt, { temperature: 0.3 });
    return this.parseAnswerResponse(response);
  }

  async scoreAnswer(
    question: string,
    modelAnswer: string,
    userAnswer: string,
    rubric?: ScoringRubric
  ): Promise<ScoreResult> {
    const prompt = this.buildScoringPrompt(question, modelAnswer, userAnswer, rubric);
    const response = await this.callGemini(prompt, { temperature: 0.2 });
    return this.parseScoreResponse(response);
  }

  async generateSummary(sessionData: SessionSummaryInput): Promise<SessionSummary> {
    const prompt = this.buildSummaryPrompt(sessionData);
    const response = await this.callGemini(prompt, { temperature: 0.3 });
    return this.parseSummaryResponse(response);
  }

  private async callGemini(prompt: string, config?: GenerationConfig): Promise<any> {
    const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: config?.temperature ?? 0.7,
          maxOutputTokens: config?.maxTokens ?? 2048,
          topP: config?.topP ?? 0.95
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  // ... prompt building and parsing methods
}

export class OpenAIProvider extends AIProvider {
  private apiKey: string;
  private apiEndpoint: string;

  constructor() {
    this.apiKey = Deno.env.get('OPENAI_API_KEY')!;
    this.apiEndpoint = Deno.env.get('OPENAI_ENDPOINT') || 
      'https://api.openai.com/v1/chat/completions';
  }

  async generateQuestions(params: QuestionGenParams, config?: GenerationConfig): Promise<QuestionGenerationResult> {
    const prompt = this.buildQuestionPrompt(params);
    const response = await this.callOpenAI(prompt, config);
    const questions = this.parseQuestionResponse(response);
    return {
      questions,
      model: 'gpt-4',
      generatedAt: new Date().toISOString()
    };
  }

  // ... other implementations similar to Gemini
}

// Factory function
export function getAIProvider(): AIProvider {
  const provider = Deno.env.get('AI_PROVIDER')?.toLowerCase() || 'gemini';
  
  if (provider === 'openai') {
    return new OpenAIProvider();
  } else if (provider === 'gemini') {
    return new GeminiProvider();
  }
  
  throw new Error(`Unsupported AI provider: ${provider}`);
}
```

### Environment Variables

```bash
# AI Provider Selection
AI_PROVIDER=gemini  # or 'openai'

# Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key
GEMINI_ENDPOINT=https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_ENDPOINT=https://api.openai.com/v1/chat/completions
OPENAI_MODEL=gpt-4  # or gpt-3.5-turbo

# Rate Limiting
AI_RATE_LIMIT_PER_MINUTE=10
AI_RATE_LIMIT_PER_DAY=100

# Timeouts
AI_REQUEST_TIMEOUT_MS=30000
```

### Provider Selection Logic

```typescript
// Runtime provider selection
const provider = getAIProvider();

// Can also switch dynamically based on queue/load
if (isRateLimited('gemini')) {
  provider = new OpenAIProvider(); // Fallback
}
```

### Prompt Versioning

```typescript
// Load from database
async function getPromptTemplate(category: string, version?: number): Promise<string> {
  const { data } = await supabase
    .from('prompt_templates')
    .select('*')
    .eq('category', category)
    .eq('version', version || 'latest')
    .eq('is_active', true)
    .single();
  
  return data.template_text;
}

// Use in provider
const template = await getPromptTemplate('question_gen', 1);
const filledPrompt = fillTemplate(template, variables);
```

### Error Handling

```typescript
// Retry with exponential backoff
async function callWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on validation errors
      if (error.code === 'VALIDATION_ERROR') throw error;
      
      // Exponential backoff
      await sleep(Math.pow(2, i) * 1000);
    }
  }
  
  throw lastError;
}

// Rate limit handling
class RateLimiter {
  private requests: number[] = [];
  
  async waitForSlot(): Promise<void> {
    const now = Date.now();
    const minuteAgo = now - 60000;
    
    this.requests = this.requests.filter(t => t > minuteAgo);
    
    if (this.requests.length >= RATE_LIMIT_PER_MINUTE) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = 60000 - (now - oldestRequest);
      await sleep(waitTime);
    }
    
    this.requests.push(now);
  }
}
```

### JSON Output Validation

```typescript
// Zod schema for question generation
const QuestionSchema = z.object({
  question_text: z.string().min(10),
  skill: z.string(),
  topic: z.string(),
  difficulty: z.string(),
  type: z.string()
});

const QuestionsArraySchema = z.object({
  questions: z.array(QuestionSchema).min(1).max(20)
});

function validateQuestions(json: unknown): QuestionsArray {
  const result = QuestionsArraySchema.safeParse(json);
  
  if (!result.success) {
    throw new ValidationError('Invalid question format', result.error.errors);
  }
  
  return result.data;
}

// Robust JSON extraction
function extractJSON(text: string): unknown {
  // Try direct parse
  try {
    return JSON.parse(text);
  } catch {}
  
  // Extract from code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return JSON.parse(codeBlockMatch[1]);
  }
  
  // Find JSON object/array in text
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  throw new Error('Could not extract valid JSON from response');
}
```

---

## 10. PROMPT TEMPLATES

### Question Generation Prompt

**Template ID**: `question_gen_v1`  
**Category**: `question_gen`

```
You are an expert technical interviewer. Generate {{count}} interview questions for the following criteria:

Skill/Technology: {{skill}}
Topic: {{topic}}
Difficulty Level: {{difficulty}}
Question Type: {{type}}

Requirements:
1. Questions must be specific and avoid generic queries
2. Match the difficulty level to the topic depth
3. Focus on practical understanding, not just theory
4. Avoid questions that can be answered with simple yes/no
5. For coding questions, describe the problem with example inputs/outputs

Return ONLY a JSON object with this exact structure:
{
  "questions": [
    {
      "question_text": "the actual question text",
      "estimated_time_minutes": number,
      "key_concepts": ["concept1", "concept2"]
    }
  ]
}

Do not include any text outside the JSON object.
```

### Model Answer Generation Prompt

**Template ID**: `answer_gen_v1`  
**Category**: `answer_gen`

```
You are an expert technical instructor. Generate a comprehensive model answer for the following interview question.

Question: {{question_text}}

Skill: {{skill}}
Topic: {{topic}}
Difficulty: {{difficulty}}
Type: {{type}}

Requirements:
1. Answer should be clear and well-structured
2. Include relevant examples or code snippets for coding questions
3. Explain the reasoning behind the answer
4. Mention common mistakes or misconceptions
5. For conceptual questions, provide both definition and practical application

Return ONLY a JSON object:
{
  "model_answer": "the complete answer text, can be multi-paragraph",
  "key_points": ["point1", "point2", ...],
  "code_example": "optional code snippet if applicable",
  "common_mistakes": ["mistake1", ...]
}

Do not include any text outside the JSON object.
```

### Answer Scoring Prompt

**Template ID**: `scoring_v1`  
**Category**: `scoring`

```
You are an expert technical interviewer evaluating a candidate's answer.

Question: {{question_text}}

Model Answer: {{model_answer}}

Candidate's Answer: {{user_answer}}

Skill: {{skill}}
Topic: {{topic}}
Difficulty: {{difficulty}}

Evaluation Criteria:
1. Accuracy - Is the answer factually correct?
2. Completeness - Does it cover all key aspects?
3. Depth - Is there sufficient explanation and examples?
4. Clarity - Is the answer well-structured and easy to understand?
5. Practical Knowledge - Does it show real-world understanding?

Scoring Guidelines:
- 90-100: Excellent, comprehensive, shows deep understanding
- 80-89: Good, covers most points with minor gaps
- 70-79: Satisfactory, covers basics but lacks depth
- 60-69: Below average, significant gaps or errors
- Below 60: Poor, major errors or completely off-topic

Return ONLY a JSON object:
{
  "score": number between 0-100,
  "strengths": [
    "specific strength 1",
    "specific strength 2"
  ],
  "improvements": [
    "specific improvement area 1",
    "specific improvement area 2"
  ],
  "detailed_feedback": "comprehensive paragraph explaining the evaluation, what was good, what needs work, and suggestions for improvement"
}

Do not include any text outside the JSON object.
```

### Session Summary Prompt

**Template ID**: `summary_v1`  
**Category**: `summary`

```
You are analyzing a candidate's interview practice session to provide a comprehensive summary.

Session Details:
- Skill: {{skill}}
- Topic: {{topic}}
- Number of Questions: {{total_questions}}
- Total Score: {{total_score}}/{{max_score}}
- Average Score: {{avg_score}}%
- Time Spent: {{time_spent_minutes}} minutes

Individual Results:
{{#each questions}}
Question {{@index}}: {{question_text}}
User Answer: {{user_answer}}
Score: {{score}}/100
{{/each}}

Provide a summary analysis that includes:
1. Overall performance assessment
2. Strengths demonstrated across answers
3. Areas that need improvement
4. Recommended next steps for preparation

Return ONLY a JSON object:
{
  "overall_assessment": "Brief 1-2 sentence summary",
  "key_strengths": ["strength1", "strength2", ...],
  "improvement_areas": ["area1", "area2", ...],
  "recommended_focus": ["topic1 to focus on", ...],
  "next_steps": ["actionable step1", "actionable step2", ...],
  "estimated_readiness": "percentage estimation of interview readiness"
}

Do not include any text outside the JSON object.
```

### Prompt Variable Placeholders

| Variable | Description | Example |
|----------|-------------|---------|
| `{{skill}}` | Technology/skill name | JavaScript |
| `{{topic}}` | Specific topic | Closures |
| `{{difficulty}}` | Level name | Medium |
| `{{type}}` | Question type | Conceptual |
| `{{count}}` | Number to generate | 5 |
| `{{question_text}}` | Actual question text | "Explain closures..." |
| `{{model_answer}}` | Expected answer | "A closure is..." |
| `{{user_answer}}` | Candidate's answer | "Closure means..." |

---

## 11. MOCK INTERVIEW LOGIC

### Interview States

```typescript
enum InterviewState {
  NOT_STARTED = 'not_started',      // Before user starts
  IN_PROGRESS = 'in_progress',     // Currently answering
  QUESTION_ACTIVE = 'question_active', // Specific question timer running
  QUESTION_PAUSED = 'question_paused',   // Question paused
  AUTO_SUBMITTED = 'auto_submitted',     // Timer expired, auto-submit
  MANUALLY_SUBMITTED = 'manual_submit',  // User clicked submit
  COMPLETED = 'completed',          // All questions done
  ABANDONED = 'abandoned',          // User left without finishing
  ERROR = 'error'                   // Technical error
}
```

### State Transition Diagram

```
NOT_STARTED
    │
    ▼ (user clicks start)
IN_PROGRESS ───────────┐
    │                   │
    ▼ (show question)   │
QUESTION_ACTIVE         │
    │                   │
    ├─ (timeout) ──> AUTO_SUBMITTED
    │                   │
    ├─ (submit btn) ─> MANUALLY_SUBMITTED
    │                   │
    └─ (pause btn) ─> QUESTION_PAUSED
                        │
                        ▼ (resume)
                    QUESTION_ACTIVE
    
AUTO_SUBMITTED / MANUALLY_SUBMITTED
        │
        ├─ (more questions) ──> QUESTION_ACTIVE
        │
        └─ (last question) ──> COMPLETED

IN_PROGRESS ── (browser close/timeout) ──> ABANDONED
```

### Timer Logic

```typescript
interface TimerConfig {
  mode: 'per_question' | 'total' | 'untimed';
  perQuestionMinutes?: number;
  totalMinutes?: number;
  warningAt: number[]; // [30, 60, 90] percent
  alertAt: number; // 95 percent
}

class InterviewTimer {
  private startTime: Date;
  private duration: number; // seconds
  private remaining: number;
  private intervalId?: number;
  private warningsTriggered: Set<number> = new Set();
  
  constructor(config: TimerConfig, questionIndex?: number) {
    if (config.mode === 'per_question' && questionIndex !== undefined) {
      this.duration = (config.perQuestionMinutes || 10) * 60;
    } else if (config.mode === 'total') {
      this.duration = (config.totalMinutes || 60) * 60;
    } else {
      this.duration = Infinity; // Untimed
    }
    
    this.startTime = new Date();
    this.remaining = this.duration;
  }
  
  start(callbacks: TimerCallbacks): void {
    this.intervalId = setInterval(() => {
      this.remaining--;
      
      const elapsed = this.duration - this.remaining;
      const percentage = (elapsed / this.duration) * 100;
      
      // Check warnings
      callbacks.warningAt?.forEach(threshold => {
        if (percentage >= threshold && !this.warningsTriggered.has(threshold)) {
          this.warningsTriggered.add(threshold);
          callbacks.onWarning(threshold, this.remaining);
        }
      });
      
      // Check alert (final warning)
      if (percentage >= callbacks.alertAt) {
        callbacks.onAlert(this.remaining);
      }
      
      // Update display
      callbacks.onTick(this.remaining);
      
      // Timeout
      if (this.remaining <= 0) {
        this.stop();
        callbacks.onTimeout();
      }
    }, 1000);
  }
  
  pause(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
  
  resume(): void {
    this.start({} as TimerCallbacks);
  }
  
  stop(): void {
    this.pause();
    this.remaining = 0;
  }
  
  getRemaining(): number {
    return Math.max(0, this.remaining);
  }
  
  getFormattedTime(): string {
    const mins = Math.floor(this.remaining / 60);
    const secs = this.remaining % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
```

### Question Navigation

```typescript
class QuestionNavigator {
  private questions: SessionQuestion[];
  private currentIndex: number = 0;
  
  constructor(questions: SessionQuestion[]) {
    this.questions = questions.sort((a, b) => a.order - b.order);
  }
  
  current(): SessionQuestion | null {
    return this.questions[this.currentIndex] || null;
  }
  
  next(): SessionQuestion | null {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      return this.current();
    }
    return null; // End of questions
  }
  
  previous(): SessionQuestion | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.current();
    }
    return null;
  }
  
  goTo(index: number): SessionQuestion | null {
    if (index >= 0 && index < this.questions.length) {
      this.currentIndex = index;
      return this.current();
    }
    return null;
  }
  
  isFirst(): boolean {
    return this.currentIndex === 0;
  }
  
  isLast(): boolean {
    return this.currentIndex === this.questions.length - 1;
  }
  
  getProgress(): { current: number; total: number; percentage: number } {
    return {
      current: this.currentIndex + 1,
      total: this.questions.length,
      percentage: ((this.currentIndex + 1) / this.questions.length) * 100
    };
  }
  
  // Get status of all questions
  getStatus(): QuestionStatus[] {
    return this.questions.map((q, idx) => ({
      index: idx,
      id: q.id,
      answered: q.answer !== null,
      isCurrent: idx === this.currentIndex
    }));
  }
}
```

### Auto-Submit on Timeout

```typescript
async function handleTimeout(
  sessionQuestionId: string,
  answerDraft: string,
  dispatch: Dispatch
): Promise<void> {
  // Mark as auto-submitted
  await dispatch({
    type: 'AUTO_SUBMIT',
    payload: {
      sessionQuestionId,
      answer: answerDraft,
      isAutoSubmitted: true
    }
  });
  
  // Save to database
  await supabase.from('session_questions').update({
    is_auto_submitted: true,
    answered_at: new Date().toISOString()
  }).eq('id', sessionQuestionId);
  
  // Save answer (even if empty)
  await supabase.from('answers').insert({
    session_question_id: sessionQuestionId,
    answer_text: answerDraft || '[No answer provided - timed out]',
    is_draft: false
  });
  
  // Show notification
  toast.warning('Time's up! Your answer has been auto-submitted.');
}
```

### Score After Each Answer

```typescript
// Flow: Submit answer → AI scoring (async) → Show feedback

async function submitAndScore(
  sessionQuestionId: string,
  answerText: string
): Promise<void> {
  // 1. Submit answer
  const { data: answer } = await supabase
    .from('answers')
    .insert({
      session_question_id: sessionQuestionId,
      answer_text: answerText
    })
    .select()
    .single();
  
  // 2. Get question details for scoring
  const { data: question } = await supabase
    .from('session_questions')
    .select('*, questions(*)')
    .eq('id', sessionQuestionId)
    .single();
  
  // 3. Trigger scoring (Edge Function)
  const { data: score } = await supabase.functions.invoke('score-answer', {
    body: {
      answer_id: answer.id,
      question_text: question.questions.question_text,
      model_answer: question.questions.model_answer,
      user_answer: answerText,
      difficulty: question.questions.difficulty_id
    }
  });
  
  // 4. Show immediate feedback
  showFeedbackModal(score);
  
  // 5. Store score
  await supabase.from('scores').insert({
    answer_id: answer.id,
    ...score
  });
}
```

### Final Summary Generation

```typescript
async function generateFinalSummary(sessionId: string): Promise<SessionSummary> {
  // 1. Get all session data
  const { data: session } = await supabase
    .from('practice_sessions')
    .select(`
      *,
      session_questions (
        *,
        questions (*),
        answers (*, scores (*))
      )
    `)
    .eq('id', sessionId)
    .single();
  
  // 2. Calculate aggregates
  const scores = session.session_questions
    .filter(sq => sq.answers?.scores)
    .map(sq => sq.answers.scores.score);
  
  const totalScore = scores.reduce((a, b) => a + b, 0);
  const avgScore = scores.length > 0 ? totalScore / scores.length : 0;
  
  // 3. Update session
  await supabase
    .from('practice_sessions')
    .update({
      status: 'completed',
      ended_at: new Date().toISOString(),
      total_score: totalScore,
      avg_score: avgScore
    })
    .eq('id', sessionId);
  
  // 4. Generate AI summary
  const { data: summary } = await supabase.functions.invoke('generate-summary', {
    body: {
      sessionId,
      total_questions: session.session_questions.length,
      total_score: totalScore,
      avg_score: avgScore,
      questions: session.session_questions.map(sq => ({
        question_text: sq.questions.question_text,
        user_answer: sq.answers?.answer_text || 'Not answered',
        score: sq.answers?.scores?.score || 0
      }))
    }
  });
  
  return summary;
}
```

---

## 12. PDF EXPORT

### PDF Templates

Each template is an HTML structure with CSS that converts to PDF.

#### Template 1: Session Summary PDF

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; padding: 40px; }
    header { border-bottom: 2px solid #0066cc; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #0066cc; }
    .metadata { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
    .metadata grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .score-summary { text-align: center; padding: 20px; background: #e8f4ff; border-radius: 8px; margin-bottom: 30px; }
    .score-value { font-size: 48px; font-weight: bold; color: #0066cc; }
    .question-section { margin-bottom: 40px; page-break-inside: avoid; }
    .question-header { background: #0066cc; color: white; padding: 10px 15px; border-radius: 4px 4px 0 0; }
    .question-body { border: 1px solid #ddd; border-top: none; padding: 15px; }
    .answer-section { background: #f9f9f9; padding: 10px; margin-top: 10px; border-left: 3px solid #0066cc; }
    .model-answer { background: #e8ffe8; border-left-color: #00cc00; }
    .score-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-weight: bold; }
    .score-high { background: #00cc00; color: white; }
    .score-medium { background: #ffaa00; color: white; }
    .score-low { background: #ff4444; color: white; }
    .feedback { font-style: italic; color: #666; margin-top: 10px; }
    footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <header>
    <div class="logo">AI Interview Practice</div>
    <div>Interview Practice Session Report</div>
  </header>

  <section class="metadata">
    <h2>Session Details</h2>
    <div class="grid">
      <div><strong>Date:</strong> {{date}}</div>
      <div><strong>Duration:</strong> {{duration}}</div>
      <div><strong>Skill:</strong> {{skill}}</div>
      <div><strong>Topic:</strong> {{topic}}</div>
      <div><strong>Mode:</strong> {{mode}}</div>
      <div><strong>Questions:</strong> {{total_questions}}</div>
    </div>
  </section>

  <section class="score-summary">
    <div class="score-value">{{total_score}}/{{max_score}}</div>
    <div>Average Score: {{avg_score}}%</div>
    <div>{{overall_assessment}}</div>
  </section>

  {{#each questions}}
  <section class="question-section">
    <div class="question-header">
      <span>Question {{@index}} of {{total}}</span>
      <span class="score-badge {{score_class}}">{{score}}/100</span>
    </div>
    <div class="question-body">
      <p><strong>Question:</strong> {{question_text}}</p>
      
      <div class="answer-section">
        <strong>Your Answer:</strong>
        <p>{{user_answer}}</p>
      </div>
      
      <div class="answer-section model-answer">
        <strong>Model Answer:</strong>
        <p>{{model_answer}}</p>
      </div>
      
      <div class="feedback">
        <strong>Feedback:</strong> {{detailed_feedback}}
      </div>
    </div>
  </section>
  {{/each}}

  <footer>
    Generated by AI Interview Practice | {{generated_date}} | Do not distribute without permission
  </footer>
</body>
</html>
```

#### Template 2: Compact List PDF

```html
<!-- Simplified version with just Q&A pairs, no detailed feedback -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; font-size: 11pt; }
    .qa-item { margin-bottom: 20px; }
    .question { font-weight: bold; }
    .answer { margin-left: 20px; color: #555; }
  </style>
</head>
<body>
  <h1>Interview Questions - {{skill}} / {{topic}}</h1>
  {{#each questions}}
  <div class="qa-item">
    <div class="question">{{@index}}. {{question_text}}</div>
    <div class="answer">{{model_answer}}</div>
  </div>
  {{/each}}
</body>
</html>
```

### Data Included in PDF

| Category | Data Fields |
|----------|-------------|
| **Session Metadata** | Date, duration, skill, topic, mode, total questions |
| **Scores** | Total score, average score, score per question |
| **Questions** | Question text, difficulty, type |
| **User Answers** | Answer text, time spent, word count |
| **Model Answers** | Model answer text for each question |
| **Feedback** | Strengths, improvements, detailed feedback per answer |
| **Summary** | AI-generated overall assessment and recommendations |
| **Footer** | Generation timestamp, app branding |

### Export Flow

```
1. User clicks "Export PDF" on session summary page
        │
        ▼
2. Frontend sends POST to /functions/v1/generate-pdf
   Body: { session_id, template: 'full' | 'compact', user_id }
        │
        ▼
3. Edge Function:
   a. Fetch full session data from database
   b. Load HTML template
   c. Inject data into template (handlebars)
   d. Convert HTML to PDF using a library (e.g., puppeteer/chromium)
   e. Store PDF in Supabase Storage bucket
   f. Create pdf_exports record
   g. Return download URL
        │
        ▼
4. Frontend receives URL, triggers download
        │
        ▼
5. User browser downloads PDF file
```

### Implementation

```typescript
// supabase/functions/generate-pdf/index.ts

import Handlebars from 'npm:handlebars';
import puppeteer from 'npm:puppeteer';

export async function generatePDF(sessionId: string, template: string): Promise<string> {
  // 1. Fetch session data
  const { data: session } = await supabase
    .from('practice_sessions')
    .select(`
      *,
      skills (*),
      session_questions (
        *,
        questions (*),
        answers (*, scores (*))
      )
    `)
    .eq('id', sessionId)
    .single();

  // 2. Load template
  const templateHtml = await loadTemplate(template);
  const compiledTemplate = Handlebars.compile(templateHtml);

  // 3. Prepare data
  const templateData = {
    date: formatDate(session.started_at),
    duration: calculateDuration(session.started_at, session.ended_at),
    skill: session.skills.name,
    topic: session.topic || 'Mixed Topics',
    mode: session.mode,
    total_questions: session.session_questions.length,
    total_score: session.total_score,
    max_score: session.session_questions.length * 100,
    avg_score: session.avg_score,
    questions: session.session_questions.map((sq, idx) => ({
      index: idx + 1,
      total: session.session_questions.length,
      question_text: sq.questions.question_text,
      user_answer: sq.answers?.answer_text || 'No answer provided',
      model_answer: sq.questions.model_answer || 'Not available',
      score: sq.answers?.scores?.score || 0,
      score_class: getScoreClass(sq.answers?.scores?.score),
      detailed_feedback: sq.answers?.scores?.detailed_feedback || ''
    })),
    overall_assessment: session.overall_assessment || 'Session completed',
    generated_date: new Date().toISOString()
  };

  // 4. Render HTML
  const html = compiledTemplate(templateData);

  // 5. Convert to PDF using Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const pdf = await page.pdf({
    format: 'A4',
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm'
    },
    printBackground: true
  });
  
  await browser.close();

  // 6. Store in Supabase Storage
  const fileName = `pdfs/${sessionId}_${Date.now()}.pdf`;
  const { data: uploadData, error } = await supabase.storage
    .from('exports')
    .upload(fileName, pdf, {
      contentType: 'application/pdf',
      cacheControl: '3600'
    });

  if (error) throw error;

  // 7. Get public URL
  const { data: urlData } = supabase.storage
    .from('exports')
    .getPublicUrl(fileName);

  // 8. Create export record
  await supabase.from('pdf_exports').insert({
    session_id: sessionId,
    user_id: session.user_id,
    file_path: fileName,
    file_size_kb: pdf.byteLength / 1024,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  });

  return urlData.publicUrl;
}

function getScoreClass(score: number): string {
  if (score >= 80) return 'score-high';
  if (score >= 60) return 'score-medium';
  return 'score-low';
}
```

### File Storage Approach

| Aspect | Implementation |
|--------|---------------|
| **Storage Bucket** | Supabase Storage - `exports` bucket |
| **File Naming** | `pdfs/{session_id}_{timestamp}.pdf` |
| **Retention** | 30 days default, configurable |
| **Access Control** | Public URLs with expiring tokens |
| **Cleanup** | Cron job to delete expired files |
| **Size Limit** | 10MB per PDF (configurable) |

---

## 13. SECURITY

### Password Hashing

```typescript
// Use Supabase Auth (built-in bcrypt)
// Supabase handles password hashing automatically

// For custom implementation (if needed):
import bcrypt from 'npm:bcryptjs';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Password requirements (validated on frontend and backend):
// - Minimum 8 characters
// - At least 1 uppercase
// - At least 1 lowercase
// - At least 1 number
// - At least 1 special character
```

### JWT Authentication

```
Supabase handles JWT generation and validation automatically.

JWT Structure:
{
  "aud": "authenticated",
  "role": "authenticated",
  "sub": "user-uuid-here",
  "email": "user@example.com",
  "app_metadata": {
    "role": "student"
  },
  "user_metadata": {
    "name": "John Doe"
  },
  "iat": 1234567890,
  "exp": 1234571490
}

Token lifetime: 1 hour (configurable in Supabase)
Refresh token: 7 days (configurable)
```

### Row Level Security (RLS) Policies

#### Users Table
```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update own profile (limited fields)
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND id = OLD.id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
```

#### Practice Sessions Table
```sql
-- Enable RLS
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view own sessions
CREATE POLICY "Users can view own sessions"
  ON practice_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create own sessions
CREATE POLICY "Users can create own sessions"
  ON practice_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update own sessions
CREATE POLICY "Users can update own sessions"
  ON practice_sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

#### Questions Table
```sql
-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view active questions
CREATE POLICY "Users can view active questions"
  ON questions FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Admins can view all questions (including inactive)
CREATE POLICY "Admins can view all questions"
  ON questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Admins can insert questions
CREATE POLICY "Admins can insert questions"
  ON questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Admins can update questions
CREATE POLICY "Admins can update questions"
  ON questions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
```

### API Validation

```typescript
// Using Zod for input validation
import { z } from 'npm:zod';

const GenerateQuestionsSchema = z.object({
  skill_id: z.string().uuid(),
  topic_id: z.string().uuid().optional(),
  difficulty_id: z.string().uuid(),
  type_id: z.string().uuid(),
  count: z.number().int().min(1).max(20),
  mode: z.enum(['static', 'ai', 'mixed'])
});

// In Edge Function
export async function validateRequest(body: unknown): Promise<ValidatedData> {
  const result = GenerateQuestionsSchema.safeParse(body);
  
  if (!result.success) {
    throw new ValidationError(
      'Invalid request parameters',
      result.error.errors
    );
  }
  
  return result.data;
}

// Sanitize inputs for SQL injection (Supabase client handles this)
// Never use string interpolation in queries
// Always use parameterized queries
```

### File Validation

```typescript
// PDF upload validation
const PDF_VALIDATION = {
  maxSizeBytes: 100 * 1024 * 1024, // 100MB
  allowedMimeTypes: ['application/pdf'],
  fileNamePattern: /^[a-zA-Z0-9_-]+\.(pdf)$/
};

// For any file uploads (though PDFs are generated, not uploaded)
function validateFile(file: File): void {
  if (file.size > PDF_VALIDATION.maxSizeBytes) {
    throw new Error('File size exceeds limit');
  }
  
  if (!PDF_VALIDATION.allowedMimeTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  if (!PDF_VALIDATION.fileNamePattern.test(file.name)) {
    throw new Error('Invalid file name');
  }
}
```

### Prompt Injection Protection

```typescript
// Sanitize user inputs before including in prompts
function sanitizeForPrompt(input: string): string {
  // Remove potential prompt injection attempts
  const sanitized = input
    .replace(/\{\{.*?\}\}/g, '[REDACTED]') // Remove template injections
    .replace(/<\|.*?\|>/g, '[REDACTED]')   // Remove special tokens
    .replace(/system:/gi, 'user:')         // Prevent role switching
    .replace(/assistant:/gi, 'user:')
    .replace(/\n\n/g, '\n')                // Collapse multiple newlines
    .trim()
    .slice(0, 5000);                       // Length limit

  return sanitized;
}

// Use structured prompts with clear sections
const safePrompt = `
Context: You are evaluating an interview answer.
Question: ${sanitizeForPrompt(question)}
User's Answer: ${sanitizeForPrompt(userAnswer)}

Instructions: Provide a score and feedback.

Return JSON only.
`;

// Never include user input in prompt instructions
// Always keep user data separate from prompt structure
```

### Secret Management

```bash
# Environment variables (Supabase Dashboard)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  (Admin operations only)

# AI Provider keys
GEMINI_API_KEY=AIza...
OPENAI_API_KEY=sk-...

# Never commit .env files
# Use Supabase Secrets for Edge Functions
# Store in Supabase Dashboard > Settings > Edge Functions > Secrets
```

### Audit Logs

```sql
-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for audited tables
CREATE TRIGGER questions_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON questions
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER practice_sessions_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON practice_sessions
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
```

### Security Headers

```typescript
// In Edge Functions
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// Add to all responses
return new Response(body, {
  headers: { ...corsHeaders, ...securityHeaders }
});
```

---

## 14. ENVIRONMENT VARIABLES

### Backend (Supabase Edge Functions)

```bash
# Supabase Configuration (pre-configured)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_DB_URL=postgresql://...

# AI Provider Configuration
AI_PROVIDER=gemini  # or 'openai'

# Gemini API
GEMINI_API_KEY=your_gemini_api_key
GEMINI_ENDPOINT=https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent

# OpenAI API
OPENAI_API_KEY=your_openai_api_key
OPENAI_ENDPOINT=https://api.openai.com/v1/chat/completions
OPENAI_MODEL=gpt-4

# Rate Limiting
AI_RATE_LIMIT_PER_MINUTE=10
AI_RATE_LIMIT_PER_DAY=100
AI_REQUEST_TIMEOUT_MS=30000

# PDF Generation
PDF_STORAGE_BUCKET=exports
PDF_EXPIRATION_DAYS=30

# Environment
ENVIRONMENT=development  # or 'production', 'staging'
```

### Frontend (Next.js)

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="AI Interview Practice"

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_AI_GENERATION=true
NEXT_PUBLIC_ENABLE_PDF_EXPORT=true
NEXT_PUBLIC_MAX_QUESTIONS_PER_SESSION=20

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=UA-XXXXX-X

# Environment
NEXT_PUBLIC_ENV=development
```

### Database

```bash
# Supabase PostgreSQL (managed by Supabase)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Connection Pooler (for serverless functions)
SUPABASE_DB_URL=postgresql://postgres:password@db.your-project.supabase.co:6543/postgres
```

### AI Providers (Gemini & OpenAI)

```bash
# Gemini
GEMINI_API_KEY=AIza...  # Get from Google AI Studio
GEMINI_MODEL=gemini-pro  # or gemini-pro-vision

# OpenAI
OPENAI_API_KEY=sk-...    # Get from OpenAI Dashboard
OPENAI_MODEL=gpt-4       # or gpt-3.5-turbo
OPENAI_ORG_ID=org-...    # Optional

# Fallback Configuration
AI_FALLBACK_ENABLED=true
```

---

## 15. DEVELOPMENT ROADMAP

### Phase 1: Static Question Generator (Week 1-2)

**Backend Work:**
- [ ] Create Supabase project
- [ ] Design and implement database schema (skills, topics, difficulty, questions)
- [ ] Create migration files
- [ ] Seed initial data (10 skills, 50 topics, 200 questions)
- [ ] Implement RLS policies for questions
- [ ] Create Edge Function for question filtering

**Frontend Work:**
- [ ] Set up Next.js app with Tailwind CSS
- [ ] Configure Supabase client
- [ ] Create main layout with navigation
- [ ] Build question filter component (skill, topic, difficulty selectors)
- [ ] Build question list display component
- [ ] Build question detail view
- [ ] Implement pagination

**Database Work:**
- [ ] Create tables: skills, topics, difficulty_levels, question_types, questions
- [ ] Add indexes on frequently queried columns
- [ ] Create seed data script
- [ ] Test data relationships

**Testing:**
- [ ] Unit tests for filter logic
- [ ] Component tests for question display
- [ ] Integration tests for API calls
- [ ] Manual testing of all filter combinations

**Acceptance Criteria:**
- [ ] User can select skill, topic, difficulty
- [ ] System displays filtered questions
- [ ] User can view question details
- [ ] No authentication required
- [ ] Page loads in < 2 seconds
- [ ] All data stored in PostgreSQL

---

### Phase 2: Authentication + Dashboard (Week 3-4)

**Backend Work:**
- [ ] Configure Supabase Auth
- [ ] Create user roles table and policies
- [ ] Implement JWT validation in Edge Functions
- [ ] Create user profile management API
- [ ] Add audit logging

**Frontend Work:**
- [ ] Build login page
- [ ] Build registration page
- [ ] Implement auth state management (useAuth hook)
- [ ] Create protected route wrapper
- [ ] Build dashboard page with stats
- [ ] Show recent activity
- [ ] Build user settings page

**Database Work:**
- [ ] Create tables: users (extend Supabase auth.users), roles, user_roles
- [ ] Add user_id to questions (created_by)
- [ ] Create audit_logs table
- [ ] Implement audit triggers

**Testing:**
- [ ] Auth flow tests (login, register, logout)
- [ ] Protected route tests
- [ ] Role-based access tests
- [ ] Session persistence tests

**Acceptance Criteria:**
- [ ] User can register with email/password
- [ ] User can login and logout
- [ ] Session persists across refresh
- [ ] Dashboard shows personalized content
- [ ] Unauthenticated users redirected to login
- [ ] User can update profile

---

### Phase 3: AI Question Generation (Week 5-6)

**Backend Work:**
- [ ] Create AI adapter layer (Gemini + OpenAI)
- [ ] Implement `generate-questions` Edge Function
- [ ] Create prompt_templates table
- [ ] Seed initial prompt templates
- [ ] Implement rate limiting
- [ ] Add JSON validation for AI responses
- [ ] Store generated questions temporarily

**Frontend Work:**
- [ ] Add "AI Generate" toggle to filter component
- [ ] Add question count input (1-20)
- [ ] Display loading state during generation
- [ ] Show AI-generated questions badge
- [ ] Handle AI errors gracefully
- [ ] Display generation time

**Database Work:**
- [ ] Create prompt_templates table
- [ ] Add is_static flag to questions
- [ ] Create AI generation logs table (optional)

**Testing:**
- [ ] AI adapter unit tests
- [ ] Mock AI responses for integration tests
- [ ] Rate limit tests
- [ ] Timeout handling tests
- [ ] Invalid response handling tests

**Acceptance Criteria:**
- [ ] User can generate 1-20 AI questions
- [ ] Questions match selected skill/topic/difficulty
- [ ] Generation completes in < 30 seconds
- [ ] Invalid AI responses handled with error message
- [ ] Rate limits enforced (10 requests/minute)
- [ ] Both Gemini and OpenAI work (switchable)

---

### Phase 4: Answers + Scoring (Week 7-8)

**Backend Work:**
- [ ] Implement `generate-answers` Edge Function
- [ ] Implement `score-answer` Edge Function
- [ ] Create answer comparison logic
- [ ] Implement scoring rubric
- [ ] Store scores with feedback
- [ ] Create scoring analytics

**Frontend Work:**
- [ ] Build model answer display component
- [ ] Build scoring result component
- [ ] Show score breakdown (strengths, improvements)
- [ ] Display detailed feedback
- [ ] Compare user answer with model answer
- [ ] Show score history for question

**Database Work:**
- [ ] Add model_answer field to questions (seed for static)
- [ ] Create answers table
- [ ] Create scores table
- [ ] Add average score calculation to questions

**Testing:**
- [ ] Answer generation tests
- [ ] Scoring accuracy tests
- [ ] Edge case tests (empty answer, very short answer)
- [ ] Feedback quality tests
- [ ] Score distribution tests

**Acceptance Criteria:**
- [ ] User can request model answer for any question
- [ ] AI generates contextually relevant answers
- [ ] User can submit own answer for scoring
- [ ] AI provides 0-100 score with justification
- [ ] Feedback includes specific strengths/improvements
- [ ] Score correlates with answer quality

---

### Phase 5: Mock Interview Mode (Week 9-10)

**Backend Work:**
- [ ] Create practice_sessions table
- [ ] Create session_questions table
- [ ] Implement session management API
- [ ] Create timer state sync
- [ ] Implement auto-submit on timeout
- [ ] Create session summary generator

**Frontend Work:**
- [ ] Build interview mode selector (timed / untimed)
- [ ] Create interview interface layout
- [ ] Implement timer component with warnings
- [ ] Build question navigator (prev/next/jump)
- [ ] Implement answer auto-save (every 30s)
- [ ] Create progress tracker
- [ ] Build session summary page

**Database Work:**
- [ ] Create practice_sessions table
- [ ] Create session_questions table with order
- [ ] Add time tracking fields
- [ ] Create indexes for performance

**Testing:**
- [ ] Timer accuracy tests
- [ ] Session persistence tests
- [ ] Auto-save tests
- [ ] Timeout behavior tests
- [ ] Browser refresh recovery tests
- [ ] Multi-question navigation tests

**Acceptance Criteria:**
- [ ] User can start timed/untimed interview
- [ ] Timer shows countdown with warnings
- [ ] Auto-submit on timeout saves answer
- [ ] User can navigate between questions
- [ ] Progress tracked and visible
- [ ] Session persists if browser refreshes
- [ ] Scores shown after each submission

---

### Phase 6: PDF Export (Week 11-12)

**Backend Work:**
- [ ] Configure Supabase Storage bucket
- [ ] Install Puppeteer in Edge Function environment
- [ ] Create PDF templates (full + compact)
- [ ] Implement `generate-pdf` Edge Function
- [ ] Create PDF storage and retrieval
- [ ] Implement cleanup job for old PDFs

**Frontend Work:**
- [ ] Add PDF export button to summary page
- [ ] Show PDF generation progress
- [ ] Implement PDF download trigger
- [ ] Add export history view
- [ ] Show PDF expiration notice

**Database Work:**
- [ ] Create pdf_exports table
- [ ] Add export tracking fields
- [ ] Implement cleanup triggers

**Testing:**
- [ ] PDF generation tests (small/large sessions)
- [ ] Download tests
- [ ] Storage test
- [ ] Content accuracy tests
- [ ] Expiration and cleanup tests

**Acceptance Criteria:**
- [ ] User can export session as PDF
- [ ] PDF includes all questions, answers, scores
- [ ] PDF formatting is professional
- [ ] PDF download starts automatically
- [ ] PDF generated in < 10 seconds
- [ ] Old PDFs cleaned up after 30 days

---

### Phase 7: Admin Panel (Week 13-14)

**Backend Work:**
- [ ] Create admin-specific RLS policies
- [ ] Implement bulk question import
- [ ] Create analytics aggregation queries
- [ ] Add user management endpoints
- [ ] Implement question moderation workflow

**Frontend Work:**
- [ ] Build admin dashboard layout
- [ ] Create question management CRUD interface
- [ ] Build skill/topic/difficulty management
- [ ] Create analytics dashboard with charts
- [ ] Implement prompt template editor
- [ ] Build user management interface
- [ ] Create audit log viewer

**Database Work:**
- [ ] Create question_versions table
- [ ] Enhance audit_logs
- [ ] Add admin-specific indexes
- [ ] Create analytics views

**Testing:**
- [ ] Admin CRUD operations tests
- [ ] Permission escalation prevention tests
- [ ] Bulk import validation tests
- [ ] Analytics accuracy tests

**Acceptance Criteria:**
- [ ] Admin can add/edit/delete questions
- [ ] Admin can manage skills, topics, difficulties
- [ ] Admin can view system analytics
- [ ] Admin can edit prompt templates
- [ ] All admin actions logged
- [ ] Non-admins cannot access admin routes

---

### Phase 8: Voice Mode (Future - Phase 2)

**Note**: This is for future implementation. Architecture is designed to support this but not implemented in Phase 1.

**Backend Work:**
- [ ] Implement speech-to-text API integration
- [ ] Implement text-to-speech API integration
- [ ] Create voice session state management
- [ ] Add audio file storage
- [ ] Implement voice-based scoring

**Frontend Work:**
- [ ] Add voice mode toggle
- [ ] Implement audio recording component
- [ ] Create audio playback for questions
- [ ] Build voice session UI
- [ ] Display transcription in real-time

**Database Work:**
- [ ] Add voice session tables
- [ ] Store audio recordings metadata
- [ ] Track voice-specific metrics

**Testing:**
- [ ] Speech recognition accuracy tests
- [ ] Latency tests
- [ ] Browser compatibility tests
- [ ] Audio quality tests

**Acceptance Criteria:**
- [ ] User can answer questions via voice
- [ ] System reads questions aloud
- [ ] Voice answers transcribed accurately
- [ ] Voice mode works in major browsers
- [ ] Latency < 3 seconds for transcription

---

## 16. CURSOR HANDOFF

### Final Repository Structure

```
ai-interview-generator/
├── app/                              # Next.js app router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/
│   │   ├── dashboard/page.tsx
│   │   ├── generate/page.tsx
│   │   ├── questions/
│   │   │   └── static/page.tsx
│   │   ├── interview/
│   │   │   └── [sessionId]/page.tsx
│   │   ├── session/
│   │   │   └── [sessionId]/page.tsx
│   │   ├── history/
│   │   │   ├── page.tsx
│   │   │   └── [sessionId]/page.tsx
│   │   └── settings/page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── questions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── skills/page.tsx
│   │   ├── topics/page.tsx
│   │   ├── difficulty/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── prompts/page.tsx
│   │   ├── users/page.tsx
│   │   └── logs/page.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/                          # shadcn/ui components
│   └── features/
│       ├── auth/
│       ├── dashboard/
│       ├── questions/
│       ├── interview/
│       ├── history/
│       ├── admin/
│       └── common/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   ├── utils.ts
│   ├── constants.ts
│   ├── validators.ts
│   └── pdf-generator.ts
│
├── services/
│   ├── auth.service.ts
│   ├── questions.service.ts
│   ├── sessions.service.ts
│   ├── scoring.service.ts
│   ├── history.service.ts
│   ├── export.service.ts
│   └── admin.service.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useQuestions.ts
│   ├── useInterview.ts
│   ├── useTimer.ts
│   ├── useAutoSave.ts
│   └── useHistory.ts
│
├── types/
│   ├── auth.types.ts
│   ├── question.types.ts
│   ├── session.types.ts
│   ├── score.types.ts
│   ├── user.types.ts
│   ├── admin.types.ts
│   └── api.types.ts
│
├── supabase/
│   ├── functions/
│   │   ├── generate-questions/
│   │   ├── generate-answers/
│   │   ├── score-answer/
│   │   ├── generate-pdf/
│   │   ├── admin-operations/
│   │   └── _shared/
│   │       ├── ai-adapter.ts
│   │       ├── prompt-templates.ts
│   │       └── validation.ts
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_seed_data.sql
│   │   ├── 003_rls_policies.sql
│   │   └── 004_functions_triggers.sql
│   ├── seed.sql
│   └── config.toml
│
├── public/
│   └── (images, fonts)
│
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── ARCHITECTURE.md (this file)
```

### Build Order

**Week 1: Setup & Foundation**
1. Initialize Next.js project
2. Install dependencies (Supabase client, shadcn/ui, etc.)
3. Configure Tailwind
4. Create Supabase project
5. Run Phase 1 migrations

**Week 2: Static Questions**
6. Build filter components
7. Build question list and detail
8. Test static question flow

**Week 3: Authentication**
9. Configure Supabase Auth
10. Build login/register pages
11. Implement protected routes

**Week 4: Dashboard & User**
12. Build dashboard
13. Implement user settings
14. Add audit logging

**Week 5: AI Integration**
15. Create AI adapter
16. Deploy Edge Functions
17. Build generation UI
18. Implement rate limiting

**Week 6: Question Generation**
19. Complete AI generation flow
20. Add prompt template management
21. Test AI quality

**Week 7: Answer Generation**
22. Build answer generation
23. Create answer compare UI
24. Test answer quality

**Week 8: Scoring**
25. Implement scoring Edge Function
26. Build feedback display
27. Test scoring accuracy

**Week 9: Interview Mode**
28. Create session tables
29. Build interview UI
30. Implement timer

**Week 10: Interview Completion**
31. Add auto-save
32. Build summary page
33. Test interview flow

**Week 11: PDF Export**
34. Configure storage
35. Build PDF templates
36. Implement export

**Week 12: PDF & History**
37. Complete PDF flow
38. Build history pages
39. Add cleanup jobs

**Week 13: Admin Panel**
40. Create admin routes
41. Build CRUD interfaces
42. Add analytics

**Week 14: Polish & Deploy**
43. Implement remaining admin features
44. Comprehensive testing
45. Performance optimization
46. Deploy to production

### First Files to Create

**Priority 1: Database Foundation**
1. `supabase/migrations/001_initial_schema.sql` - Core tables
2. `supabase/migrations/002_seed_data.sql` - Initial data
3. `supabase/migrations/003_rls_policies.sql` - Security policies
4. `supabase/migrations/004_functions_triggers.sql` - Audit triggers

**Priority 2: Frontend Setup**
5. `lib/supabase/client.ts` - Supabase browser client
6. `lib/supabase/server.ts` - Supabase server client
7. `types/question.types.ts` - TypeScript types
8. `lib/constants.ts` - App constants
9. `app/layout.tsx` - Root layout
10. `components/ui/` - Install shadcn/ui components

**Priority 3: Core Features**
11. `services/questions.service.ts` - Question API calls
12. `components/features/questions/QuestionFilters.tsx` - Filter UI
13. `app/(main)/generate/page.tsx` - Main generation page
14. `components/features/questions/QuestionList.tsx` - Display questions

**Priority 4: Auth**
15. `hooks/useAuth.ts` - Auth hook
16. `app/(auth)/login/page.tsx` - Login page
17. `app/(auth)/register/page.tsx` - Register page

### Cursor Prompts to Implement Each Phase

**Phase 1 Prompt:**
```
Implement Phase 1: Static Question Generator

1. Create database migration for core tables:
   - skills (id, name, description, is_active)
   - topics (id, skill_id, name, description)
   - difficulty_levels (id, name, level)
   - question_types (id, name, description)
   - questions (id, skill_id, topic_id, difficulty_id, type_id, question_text, model_answer, is_active)

2. Create seed data file with:
   - 10 skills: JavaScript, Python, React, Node.js, SQL, Java, TypeScript, CSS, DevOps, Algorithms
   - 50 topics distributed across skills
   - 4 difficulty levels: Easy, Medium, Hard, Expert
   - 4 question types: Conceptual, Coding, System Design, Behavioral
   - 200 diverse questions

3. Create frontend:
   - Question filter component with dropdowns for skill, topic, difficulty, type
   - Question list component with pagination
   - Question card component showing question preview
   - Question detail component for full view
   - Generate page at /generate

4. Create services:
   - questions.service.ts with methods: getSkills, getTopics, getDifficultyLevels, getQuestionTypes, getQuestions(filters)

5. Create types:
   - question.types.ts with all interfaces

6. Implement RLS policies allowing all authenticated users to read active questions

Requirements:
- Use Supabase client for data fetching
- Implement client-side filtering with URL query params
- Add loading skeletons
- Handle empty states
- Response time < 500ms

Test:
- Verify all 200 questions load
- Test each filter combination
- Test pagination
- Verify question detail display
```

**Phase 2 Prompt:**
```
Implement Phase 2: Authentication + Dashboard

Prerequisites: Phase 1 complete

1. Configure Supabase Auth:
   - Enable email/password auth
   - Disable email confirmation (set in Supabase dashboard)
   - Configure JWT expiry (1 hour)

2. Create database additions:
   - roles table (id, name, permissions)
   - user_roles table (user_id, role_id)
   - Add audit logging function
   - Create audit_logs table

3. Create frontend:
   - Login page at /login with email/password form
   - Register page at /register with email/password/name form
   - Auth wrapper component for protected routes
   - Dashboard page at /dashboard with:
     - Welcome message
     - Quick action cards (Generate Questions, Start Interview, View History)
     - Recent sessions list (empty state for now)
     - Stats cards (placeholder)
   - Settings page at /settings with profile editing

4. Create services:
   - auth.service.ts with: signUp, signIn, signOut, getCurrentUser, updateProfile
   - sessions.service.ts with: getRecentSessions (placeholder)

5. Create hooks:
   - useAuth.ts with auth state management

6. Implement:
   - Session persistence using Supabase auth
   - Redirect to login for unauthenticated users
   - Logout functionality
   - Profile update

Requirements:
- All auth using Supabase client SDK
- Form validation with Zod
- Error handling with toast notifications
- User role assigned as 'student' on registration

Test:
- Register new user
- Login/logout
- Session persistence
- Profile update
- Protected route redirect
```

**Phase 3 Prompt:**
```
Implement Phase 3: AI Question Generation

Prerequisites: Phase 1 and 2 complete, AI API keys configured

1. Create Edge Functions:
   - supabase/functions/generate-questions/index.ts
   - supabase/functions/_shared/ai-adapter.ts

2. Create database additions:
   - prompt_templates table
   - Seed with question generation prompt

3. Create AI adapter:
   - Abstract class AIProvider
   - GeminiProvider class implementation
   - OpenAIProvider class implementation
   - Factory function getAIProvider()
   - JSON validation with Zod
   - Error handling and retries
   - Rate limiting (10 requests/minute)

4. Update frontend:
   - Add mode selector to Generate page (Static/AI)
   - Add count selector (1-20 questions)
   - Add loading spinner during generation
   - Display AI-generated badge on questions
   - Handle AI errors gracefully

5. Environment variables:
   - Add to Supabase dashboard:
     AI_PROVIDER=gemini
     GEMINI_API_KEY=your_key
     OPENAI_API_KEY=your_key

6. Create prompt template:
   - Create question_gen_v1 template
   - Include placeholders for skill, topic, difficulty, type, count
   - Require JSON output

Requirements:
- AI generation timeout: 30 seconds
- Validate AI response structure before returning
- Log all generation requests
- Implement rate limiting per user
- Support provider switching via env var

Test:
- Generate 1 question
- Generate 20 questions
- Test rate limiting
- Test timeout handling
- Test invalid response handling
- Test both Gemini and OpenAI
```

**[Further phase prompts would follow similar structure]**

### Implementation Notes for Cursor

1. **Always check existing files** before creating new ones - reuse patterns
2. **Follow TypeScript strict mode** - no `any` types without justification
3. **Use React Query or SWR** for server state (optional, Supabase client has built-in)
4. **Implement error boundaries** for each major feature
5. **Add loading states** for all async operations
6. **Use optimistic updates** where appropriate
7. **Test across browsers** - Chrome, Firefox, Safari
8. **Mobile responsiveness** - all pages must work on mobile
9. **Accessibility** - use ARIA labels, keyboard navigation
10. **Performance** - lazy load components, use Next.js Image

---

## APPENDIX: Quick Reference

### API Endpoint Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/v1/*` | Various | Supabase Auth |
| `/rest/v1/skills` | GET | List skills |
| `/rest/v1/topics` | GET | List topics |
| `/rest/v1/questions` | GET | List/filter questions |
| `/functions/v1/generate-questions` | POST | AI question generation |
| `/functions/v1/generate-answers` | POST | AI answer generation |
| `/functions/v1/score-answer` | POST | AI answer scoring |
| `/functions/v1/generate-pdf` | POST | PDF generation |

### Database Table Summary

| Table | Records | Purpose |
|-------|---------|---------|
| users | User accounts | Auth |
| roles | 3 | Roles (student, admin, reviewer) |
| skills | 10+ | Technologies |
| topics | 50+ | Sub-topics per skill |
| difficulty_levels | 4 | Easy, Medium, Hard, Expert |
| question_types | 4 | Conceptual, Coding, System, Behavioral |
| questions | 200+ | Question bank |
| practice_sessions | N | User sessions |
| answers | N | User answers |
| scores | N | AI scores |

### Key Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
AI_PROVIDER
GEMINI_API_KEY
OPENAI_API_KEY
```

---

**End of Architecture Document**

This document provides a complete, implementation-ready architecture for building the AI Interview Question Generator. Follow the phases sequentially, refer to specific sections for details, and adapt as needed during development.
