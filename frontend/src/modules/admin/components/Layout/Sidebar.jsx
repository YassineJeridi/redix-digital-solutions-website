import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    MdDashboard,
    MdPeople,
    MdWork,
    MdAttachMoney,
    MdSettings,
    MdBuild,
    MdTrendingUp,
    MdAssessment,
    MdGroup,
    MdLogout,
    MdHistory,
    MdAssignment,
    MdBackup,
    MdClose
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const menuSections = [
    {
        label: 'MAIN',
        items: [
            { text: 'Dashboard', icon: <MdDashboard />, path: '/dashboard' },
        ],
    },
    {
        label: 'WORK MANAGEMENT',
        items: [
            { text: 'Projects', icon: <MdWork />, path: '/dashboard/projects' },
            { text: 'Tasks', icon: <MdAssignment />, path: '/dashboard/tasks' },
            { text: 'Clients', icon: <MdPeople />, path: '/dashboard/clients' },
        ],
    },
    {
        label: 'FINANCE & ASSETS',
        items: [
            { text: 'Expenses', icon: <MdAttachMoney />, path: '/dashboard/expenses' },
            { text: 'Investing', icon: <MdTrendingUp />, path: '/dashboard/investing' },
            { text: 'Tools', icon: <MdBuild />, path: '/dashboard/tools' },
        ],
    },
    {
        label: 'TEAM & INSIGHTS',
        items: [
            { text: 'Team', icon: <MdGroup />, path: '/dashboard/team' },
            { text: 'Reports', icon: <MdAssessment />, path: '/dashboard/reports' },
            { text: 'Activity Log', icon: <MdHistory />, path: '/dashboard/activity' },
        ],
    },
    {
        label: 'SYSTEM',
        items: [
            { text: 'Backup', icon: <MdBackup />, path: '/dashboard/backup' },
            { text: 'Settings', icon: <MdSettings />, path: '/dashboard/settings' },
        ],
    },
];

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        sessionStorage.removeItem('canAccessPortal');
        sessionStorage.removeItem('portalAccessToken');
        navigate('/');
    };

    const handleNavClick = () => {
        // Close sidebar on mobile after clicking a link
        if (window.innerWidth <= 768 && onClose) {
            onClose();
        }
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && <div className={styles.overlay} onClick={onClose} />}

            <aside className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`}>
                <div className={styles.logoRow}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>R</div>
                        <h2>Redix Agency</h2>
                    </div>
                    {onClose && (
                        <button className={styles.closeBtn} onClick={onClose}>
                            <MdClose />
                        </button>
                    )}
                </div>

                <nav className={styles.nav}>
                    {menuSections.map((section) => (
                        <div key={section.label} className={styles.section}>
                            <span className={styles.sectionLabel}>{section.label}</span>
                            <div className={styles.sectionItems}>
                                {section.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.path === '/dashboard'}
                                        onClick={handleNavClick}
                                        className={({ isActive }) =>
                                            `${styles.navItem} ${isActive ? styles.active : ''}`
                                        }
                                    >
                                        <span className={styles.icon}>{item.icon}</span>
                                        <span className={styles.text}>{item.text}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    {user && (
                        <div className={styles.userInfo}>
                            <div className={styles.userAvatar}>
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className={styles.userDetails}>
                                <span className={styles.userName}>{user.name || 'User'}</span>
                                <span className={styles.userRole}>{user.role || 'member'}</span>
                            </div>
                        </div>
                    )}
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <MdLogout />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
