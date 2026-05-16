<div align="center">
  
# 🎨 AI-Powered Resume Builder Frontend

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![CSS](https://img.shields.io/badge/Vanilla_CSS-Modern-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A stunning, highly-responsive frontend application for the **ResumeAI** platform. Built with modern web technologies, it provides a seamless and interactive user experience for creating pixel-perfect resumes, getting AI feedback, and tracking ATS scores.

[Explore the Backend](https://github.com/Akshat-Jain02/AI-Powered-Resume-Builder-Backend) · [Report Bug](https://github.com/Akshat-Jain02/AI-Powered-Resume-Builder-Frontend/issues) · [Request Feature](https://github.com/Akshat-Jain02/AI-Powered-Resume-Builder-Frontend/issues)

</div>

---

## ✨ Stunning Features

* **📱 Fully Responsive Design:** Fluid layouts that look incredible on desktops, tablets, and mobile devices.
* **⚡ Blazing Fast Performance:** Powered by **Vite**, offering instantaneous hot-module replacement (HMR) and optimized production builds.
* **🤖 AI-Integrated Interface:** Seamless UI components dedicated to interacting with Google Gemini AI for real-time resume analysis.
* **🎨 Glassmorphism & Modern Aesthetics:** Features a premium UI utilizing subtle glassmorphism, dynamic micro-animations, and a highly polished color palette.
* **🔐 Secure Authentication:** Protected routes, role-based rendering (Admin vs User), and robust JWT handling via contexts.
* **📄 Live Preview & Compilation:** Interactive UI for editing resume templates with real-time feedback via the backend LaTeX compiler.

---

## 🛠 Tech Stack

### Framework & Build Tool
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

### Styling & UI
![Vanilla CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
*(We rely on robust Vanilla CSS with modern standard variables to ensure maximum control over the premium design system, avoiding generic utility-class clutter where bespoke design is required).*

### Routing & State
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Context API](https://img.shields.io/badge/Context_API-000000?style=for-the-badge&logo=react)

---

## 🏗 Architecture Map

All frontend API calls are securely routed through the Backend's **API Gateway** (Port 8080) to prevent CORS issues and centralize authentication.

| Target Microservice | Gateway Route | Purpose |
|:---|:---|:---|
| **Auth Service** | `/api/auth/**` | Registration, Login, and Password resets. |
| **Template Service** | `/api/templates/**` | Browsing and managing dynamic PDF templates. |
| **Resume Service** | `/api/resume/**` | Saving user data and initiating PDF compilation. |
| **AI Service** | `/api/ai/**` | Tailored AI resume feedback and ATS scoring. |
| **Job Service** | `/api/job/**` | Finding targeted job matches based on the resume. |
| **Payment Service** | `/api/payment/**`| Purchasing credits via Razorpay integration. |

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js**: Ensure you have Node.js 18.x or higher installed.
2. **Backend Infrastructure**: Ensure the ResumeAI backend infrastructure (Eureka, API Gateway, Auth Service, etc.) is up and running locally.

### ⚙️ Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akshat-Jain02/AI-Powered-Resume-Builder-Frontend.git
   cd AI-Powered-Resume-Builder-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at 👉 **[http://localhost:5173](http://localhost:5173)**.

*(Note: Vite proxy is pre-configured to forward `/api/**` calls directly to `http://localhost:8080` (API Gateway) to avoid cross-origin constraints during development).*

---

## 📂 Project Structure

```text
src/
├── api/                  # Axios service integrations (auth, ai, templates, etc.)
├── components/           # Reusable UI components
│   ├── features/         # Domain-specific components (e.g., admin modals)
│   └── layout/           # Structural components (Navbar, Footer, ProtectedRoutes)
├── constants/            # Application-wide constants and configurations
├── context/              # React Context providers (AuthContext, ThemeContext)
├── pages/                # Top-level route components (Home, AiAnalyzer, Admin, etc.)
├── App.jsx               # Main React Router configuration
├── main.jsx              # Application entry point
└── index.css             # Global design system, CSS variables, and reset
```

---

## 🔐 Security & Auth Flow

1. **Token Storage:** JWT tokens are securely managed and stored in `localStorage` upon successful authentication.
2. **Interceptors:** Axios interceptors automatically attach the `Authorization: Bearer <token>` header to all outgoing requests.
3. **Protected Routes:** `ProtectedRoute.jsx` and `AdminRoute.jsx` ensure users cannot access unauthorized pages.

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

This will generate a `dist/` directory containing minified assets ready to be served by any static host (Nginx, Vercel, Netlify, etc.). Update the `BASE_URL` in `src/api/apiClient.js` if deploying to an environment where the backend is not on `localhost`.

---

## 👨‍💻 Author

**Akshat Jain**  
*Full Stack Developer & Software Engineer*
- GitHub: [@Akshat-Jain02](https://github.com/Akshat-Jain02)

---

<div align="center">
  <i>If you found this frontend beautiful, please consider giving it a ⭐️!</i>
</div>
