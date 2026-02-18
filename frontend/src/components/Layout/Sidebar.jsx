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
            { text: 'Dashboard', icon: <MdDashboard />, path: '/' },
        ],
    },
    {
        label: 'WORK MANAGEMENT',
        items: [
            { text: 'Projects', icon: <MdWork />, path: '/projects' },
            { text: 'Tasks', icon: <MdAssignment />, path: '/tasks' },
            { text: 'Clients', icon: <MdPeople />, path: '/clients' },
        ],
    },
    {
        label: 'FINANCE & ASSETS',
        items: [
            { text: 'Expenses', icon: <MdAttachMoney />, path: '/expenses' },
            { text: 'Investing', icon: <MdTrendingUp />, path: '/investing' },
            { text: 'Tools', icon: <MdBuild />, path: '/tools' },
        ],
    },
    {
        label: 'TEAM & INSIGHTS',
        items: [
            { text: 'Team', icon: <MdGroup />, path: '/team' },
            { text: 'Reports', icon: <MdAssessment />, path: '/reports' },
            { text: 'Activity Log', icon: <MdHistory />, path: '/activity' },
        ],
    },
    {
        label: 'SYSTEM',
        items: [
            { text: 'Backup', icon: <MdBackup />, path: '/backup' },
            { text: 'Settings', icon: <MdSettings />, path: '/settings' },
        ],
    },
];

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
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
                                        end={item.path === '/'}
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
