import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// ─── Theme ───
import { ThemeProvider } from './context/ThemeContext';

// ─── Admin module imports ───
import { AppProvider } from './modules/admin/context/AppContext';
import { AuthProvider, useAuth } from './modules/admin/context/AuthContext';
import Layout from './modules/admin/components/Layout/Layout';
import Dashboard from './modules/admin/pages/Dashboard';
import Clients from './modules/admin/pages/Clients';
import Services from './modules/admin/pages/Services';
import Tools from './modules/admin/pages/Tools';
import Settings from './modules/admin/pages/Settings';
import Expenses from './modules/admin/pages/Expenses';
import TeamMembers from './modules/admin/pages/TeamMembers';
import Reports from './modules/admin/pages/Reports';
import Investing from './modules/admin/pages/Investing';
import Login from './modules/admin/pages/Login';
import Profile from './modules/admin/pages/Profile';
import ActivityLog from './modules/admin/pages/ActivityLog';
import KanbanBoard from './modules/admin/pages/KanbanBoard';
import Backup from './modules/admin/pages/Backup';

// ─── Public module imports ───
import PublicLayout from './modules/public/PublicLayout';
import Home from './modules/public/pages/Home';
import Furniture from './modules/public/pages/Furniture';
import Travel from './modules/public/pages/Travel';
import Fashion from './modules/public/pages/Fashion';
import Chef from './modules/public/pages/Chef';
import NotFound from './modules/public/pages/NotFound';

// ─── Shared guards ───
import StealthRoute from './shared/StealthRoute';
import ProtectedAdminRoute from './shared/ProtectedAdminRoute';

// ═══════════════════════════════════════════════════
//  App Routes — Unified Public + Admin routing
// ═══════════════════════════════════════════════════
const AppRoutes = () => {
    const { isAuthenticated, loading } = useAuth();

    return (
        <Routes>
            {/* ──────── PUBLIC WEBSITE ROUTES ──────── */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/furniture" element={<Furniture />} />
                <Route path="/travel" element={<Travel />} />
                <Route path="/fashion" element={<Fashion />} />
                <Route path="/chef" element={<Chef />} />
            </Route>

            {/* ──────── STEALTH ADMIN LOGIN ──────── */}
            {/* Only accessible after entering the access key on the 404 page */}
            <Route
                path="/admin/login"
                element={
                    <StealthRoute>
                        {isAuthenticated && !loading
                            ? <Navigate to="/dashboard" replace />
                            : <Login />
                        }
                    </StealthRoute>
                }
            />

            {/* ──────── PROTECTED ADMIN DASHBOARD ──────── */}
            <Route
                path="/dashboard/*"
                element={
                    <ProtectedAdminRoute>
                        <Layout>
                            <Routes>
                                <Route index element={<Dashboard />} />
                                <Route path="clients" element={<Clients />} />
                                <Route path="services" element={<Services />} />
                                <Route path="tasks" element={<KanbanBoard />} />
                                <Route path="tools" element={<Tools />} />
                                <Route path="expenses" element={<Expenses />} />
                                <Route path="team" element={<TeamMembers />} />
                                <Route path="reports" element={<Reports />} />
                                <Route path="investing" element={<Investing />} />
                                <Route path="settings" element={<Settings />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="activity" element={<ActivityLog />} />
                                <Route path="backup" element={<Backup />} />
                            </Routes>
                        </Layout>
                    </ProtectedAdminRoute>
                }
            />

            {/* ──────── TRAP: /login → 404 (no direct access) ──────── */}
            <Route path="/login" element={<NotFound />} />

            {/* ──────── CATCH-ALL 404 (with hidden stealth trigger) ──────── */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppProvider>
                    <Router
                        future={{
                            v7_startTransition: true,
                            v7_relativeSplatPath: true,
                        }}
                    >
                        <AppRoutes />
                    </Router>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            style: {
                                background: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                boxShadow: 'var(--shadow)',
                            },
                        }}
                    />
                </AppProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
