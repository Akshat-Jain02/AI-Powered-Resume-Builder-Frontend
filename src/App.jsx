import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Templates from './pages/Templates';
import AiAnalyzer from './pages/AiAnalyzer';
import JobMatch from './pages/JobMatch';
import SavedResumes from './pages/SavedResumes';
import Payment from './pages/Payment';
import Admin from './pages/Admin';
import Compiler from './pages/Compiler';

function AppContent() {
  const location = useLocation();
  // Hide navbar and footer on compiler page (it has its own header)
  const isCompiler = location.pathname === '/compiler';
  const isAdmin = location.pathname === '/admin';

  return (
    <>
      {!isCompiler && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected user routes */}
        <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
        <Route path="/compiler" element={<ProtectedRoute><Compiler /></ProtectedRoute>} />
        <Route path="/ai-analyzer" element={<ProtectedRoute><AiAnalyzer /></ProtectedRoute>} />
        <Route path="/job-match" element={<ProtectedRoute><JobMatch /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><SavedResumes /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />

        {/* Admin route — ADMIN role required */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:'16px', color:'var(--text-secondary)', paddingTop: 'var(--navbar-height)' }}>
            <div style={{ fontSize:'64px', color:'var(--text-muted)' }}>◈</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'28px', color:'var(--text-primary)' }}>Page not found</h2>
            <a href="/" style={{ color:'var(--accent-primary)' }}>← Go home</a>
          </div>
        } />
      </Routes>
      {!isCompiler && !isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
