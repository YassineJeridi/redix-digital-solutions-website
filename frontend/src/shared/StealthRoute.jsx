// StealthRoute — Guards the /admin/login page.
// Only accessible if the user has entered the correct access key on the 404 page,
// which sets sessionStorage.canAccessPortal = 'true' AND a short-lived JWT.
// Direct URL access without both values redirects to a 404.

import { Navigate } from 'react-router-dom';

const PORTAL_FLAG = 'canAccessPortal';
const PORTAL_TOKEN = 'portalAccessToken';

// Lightweight check — just verify the token exists and hasn't expired.
// The real bcrypt verification already happened server-side.
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    // JWT structure: header.payload.signature
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const StealthRoute = ({ children }) => {
  const hasFlag = sessionStorage.getItem(PORTAL_FLAG) === 'true';
  const token = sessionStorage.getItem(PORTAL_TOKEN);
  const hasValidToken = isTokenValid(token);

  if (!hasFlag || !hasValidToken) {
    // Clean up stale values
    sessionStorage.removeItem(PORTAL_FLAG);
    sessionStorage.removeItem(PORTAL_TOKEN);
    return <Navigate to="/page-not-found" replace />;
  }

  return children;
};

export default StealthRoute;
