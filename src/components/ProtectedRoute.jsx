import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// UX-only guard. Real authorization must be enforced by the backend.
export default function ProtectedRoute({ role, children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return children;
}
