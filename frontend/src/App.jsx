import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PublicPage from './pages/PublicPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return<Navigate to="/admin/giris" replace />
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicPage />} />
      <Route path="/admin/giris" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
