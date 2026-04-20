import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;
  
  if (!user || !user.roles?.includes('ADMIN')) {
    return <Navigate to="/" replace />;
  }

  return children;
}
