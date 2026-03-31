import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/admin-login" />;
  if (user.role !== 'Admin' && user.role !== 'Staff') return <Navigate to="/" />;
  return children;
};

export default PrivateRoute;  