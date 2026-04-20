# ResumeAI Frontend

A Vite + React frontend for the ResumeAI microservices platform.

## Architecture

All API calls go through the **API Gateway on port 8080**.

| Service | Gateway Route | Description |
|---|---|---|
| Auth Service | `/api/auth/**` | Register, login, password reset |
| Template Service | `/api/templates/**` | Browse resume templates |
| Resume Service | `/api/resume/**` | Build, save, generate PDF |
| AI Service | `/api/ai/**` | Analyze resume, ATS score |
| Job Service | `/api/job/**` | Match jobs from resume |

## Quick Start

### Prerequisites

Make sure all backend services are running:
- API Gateway → `http://localhost:8080`
- Auth Service → `http://localhost:8089`
- Eureka Server → `http://localhost:8761`
- All other services registered via Eureka

### Install & Run

```bash
npm install
npm run dev
```

The app runs at **http://localhost:5173**.

Vite proxies `/api/**` and `/login/**` to `http://localhost:8080` automatically — no CORS issues in development.

## Pages

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public | Sign in |
| `/register` | Public | Create account |
| `/forgot-password` | Public | Password reset |
| `/templates` | Auth required | Browse templates |
| `/builder` | Auth required | Build resume & download PDF |
| `/ai-analyzer` | Auth required | AI analysis + ATS score |
| `/job-match` | Auth required | Upload resume → find matching jobs |
| `/saved` | Auth required | View / download / delete saved resumes |

## Project Structure

```
src/
├── context/
│   └── AuthContext.jsx       # JWT auth state, login/logout
├── services/
│   └── api.js                # All API calls (authApi, templateApi, resumeApi, aiApi, jobApi)
├── components/
│   ├── Navbar.jsx / .css
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Home.jsx / .css
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   ├── Auth.css              # Shared auth styles
│   ├── Templates.jsx / .css
│   ├── Builder.jsx / .css
│   ├── AiAnalyzer.jsx / .css
│   ├── JobMatch.jsx / .css
│   └── SavedResumes.jsx / .css
├── App.jsx                   # Router
├── main.jsx
└── index.css                 # Design system & CSS variables
```

## Token Storage

JWT tokens are stored in `localStorage` under the key `token`. The `Authorization: Bearer <token>` header is automatically attached to all authenticated requests.

## Build for Production

```bash
npm run build
```

Update `BASE_URL` in `src/services/api.js` if your gateway is on a different host/port in production.
