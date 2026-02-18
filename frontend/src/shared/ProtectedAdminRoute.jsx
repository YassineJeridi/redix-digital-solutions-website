// ProtectedAdminRoute — Guards ALL /dashboard/* routes.
// Requires:
//   1. Portal access flag + valid portal JWT (sessionStorage) — set by the stealth 404 page
//   2. Valid auth token (from AuthContext) — set by the login form
// If either is missing, the user is redirected appropriately.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../modules/admin/context/AuthContext';

const PORTAL_FLAG = 'canAccessPortal';
const PORTAL_TOKEN = 'portalAccessToken';

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const hasPortalAccess = sessionStorage.getItem(PORTAL_FLAG) === 'true';
  const portalToken = sessionStorage.getItem(PORTAL_TOKEN);

  // Show loading spinner while auth state initializes
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0f0a1a',
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(193,45,224,0.2)',
          borderTopColor: '#c12de0',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // No portal access flag or token → send to 404
  if (!hasPortalAccess || !portalToken) {
    sessionStorage.removeItem(PORTAL_FLAG);
    sessionStorage.removeItem(PORTAL_TOKEN);
    return <Navigate to="/page-not-found" replace />;
  }

  // Not authenticated → send to admin login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
