import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdDashboard,
  MdDesignServices,
  MdChecklist,
  MdPeople,
  MdMoneyOff,
  MdTrendingUp,
  MdBuild,
  MdGroup,
  MdBarChart,
  MdHistory,
  MdBackup,
  MdSettings,
  MdLogout,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdExpandMore,
  MdClose,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

/* ──────────────────────────────────────────────────────────────────────
   Navigation config
   ────────────────────────────────────────────────────────────────────── */
const MENU_SECTIONS = [
  {
    label: 'MAIN',
    items: [
      { text: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
    ],
  },
  {
    label: 'WORK MANAGEMENT',
    items: [
      { text: 'Services', icon: MdDesignServices, path: '/dashboard/services' },
      { text: 'Tasks',    icon: MdChecklist,      path: '/dashboard/tasks' },
      { text: 'Clients',  icon: MdPeople,         path: '/dashboard/clients' },
    ],
  },
  {
    label: 'FINANCE & ASSETS',
    items: [
      { text: 'Expenses',  icon: MdMoneyOff,   path: '/dashboard/expenses' },
      { text: 'Investing', icon: MdTrendingUp,  path: '/dashboard/investing' },
      { text: 'Tools',     icon: MdBuild,       path: '/dashboard/tools' },
    ],
  },
  {
    label: 'TEAM & INSIGHTS',
    items: [
      { text: 'Team',         icon: MdGroup,   path: '/dashboard/team' },
      { text: 'Reports',      icon: MdBarChart, path: '/dashboard/reports' },
      { text: 'Activity Log', icon: MdHistory,  path: '/dashboard/activity' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { text: 'Backup',   icon: MdBackup,  path: '/dashboard/backup' },
      { text: 'Settings', icon: MdSettings, path: '/dashboard/settings' },
    ],
  },
];

/** Return section label whose items match the current pathname */
const getActiveSectionLabel = (pathname) => {
  for (const section of MENU_SECTIONS) {
    if (
      section.items.some(
        (item) =>
          pathname === item.path ||
          (item.path !== '/dashboard' && pathname.startsWith(item.path)),
      )
    )
      return section.label;
  }
  return null;
};

/* ──────────────────────────────────────────────────────────────────────
   Framer‑motion variants
   ────────────────────────────────────────────────────────────────────── */
const EASE = [0.4, 0, 0.2, 1];

const sidebarVariants = {
  expanded:  { width: 260, transition: { duration: 0.3, ease: EASE } },
  collapsed: { width: 72,  transition: { duration: 0.3, ease: EASE } },
};

const groupVariants = {
  open: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.25, ease: EASE, staggerChildren: 0.04 },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: EASE },
  },
};

const itemVariant = {
  open:   { opacity: 1, x: 0, transition: { duration: 0.2 } },
  closed: { opacity: 0, x: -8 },
};

/* ──────────────────────────────────────────────────────────────────────
   Sidebar component
   ────────────────────────────────────────────────────────────────────── */
const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /* internal collapse (icon‑only 72 px on desktop) */
  const [collapsed, setCollapsed] = useState(false);

  /* expanded nav groups */
  const [expandedGroups, setExpandedGroups] = useState(() => {
    const active = getActiveSectionLabel(location.pathname);
    return active ? [active] : [];
  });

  /* auto-expand group when route changes */
  useEffect(() => {
    const active = getActiveSectionLabel(location.pathname);
    if (active) {
      setExpandedGroups((prev) => (prev.includes(active) ? prev : [...prev, active]));
    }
  }, [location.pathname]);

  /* Sync --sidebar-width CSS custom property so Layout.module.css adapts margin */
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) {
      document.documentElement.style.setProperty(
        '--sidebar-width',
        collapsed ? '72px' : '260px',
      );
    }
    return () => {
      document.documentElement.style.setProperty('--sidebar-width', '260px');
    };
  }, [collapsed]);

  /* ── handlers ── */
  const toggleGroup = useCallback((label) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  }, []);

  const isGroupOpen = (label) => expandedGroups.includes(label);

  const isGroupActive = (section) =>
    section.items.some(
      (item) =>
        location.pathname === item.path ||
        (item.path !== '/dashboard' && location.pathname.startsWith(item.path)),
    );

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem('canAccessPortal');
    sessionStorage.removeItem('portalAccessToken');
    navigate('/');
  };

  const handleNavClick = () => {
    if (window.innerWidth <= 768 && onClose) onClose();
  };

  /* running index for stagger delay */
  let staggerIdx = 0;

  /* ── render ── */
  return (
    <>
      {/* ── mobile overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* ── sidebar rail ── */}
      <motion.aside
        className={[
          styles.sidebar,
          !isOpen && styles.hidden,
          collapsed && styles.collapsed,
        ]
          .filter(Boolean)
          .join(' ')}
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
      >
        {/* ── top header ── */}
        <div className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.logoIcon}>R</div>
            <AnimatePresence>
              {!collapsed && (
                <motion.h2
                  className={styles.logoText}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Redix
                </motion.h2>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.headerBtns}>
            <button
              type="button"
              className={styles.collapseBtn}
              onClick={() => setCollapsed((c) => !c)}
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              {collapsed ? (
                <MdKeyboardDoubleArrowRight />
              ) : (
                <MdKeyboardDoubleArrowLeft />
              )}
            </button>

            <button
              type="button"
              className={styles.mobileClose}
              onClick={onClose}
            >
              <MdClose />
            </button>
          </div>
        </div>

        {/* ── nav groups ── */}
        <nav className={styles.nav}>
          {MENU_SECTIONS.map((section) => {
            const open = isGroupOpen(section.label);
            const active = isGroupActive(section);

            return (
              <div key={section.label} className={styles.group}>
                {/* section label (hidden when collapsed) */}
                {!collapsed && (
                  <button
                    type="button"
                    className={[styles.groupLabel, active && styles.groupLabelActive]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => toggleGroup(section.label)}
                    aria-expanded={open}
                  >
                    <span>{section.label}</span>
                    <motion.span
                      className={styles.chevron}
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <MdExpandMore />
                    </motion.span>
                  </button>
                )}

                {/* group items */}
                <AnimatePresence initial={false}>
                  {(open || collapsed) && (
                    <motion.div
                      key={`items-${section.label}`}
                      className={styles.groupItems}
                      variants={collapsed ? undefined : groupVariants}
                      initial={collapsed ? undefined : 'closed'}
                      animate={collapsed ? undefined : 'open'}
                      exit={collapsed ? undefined : 'closed'}
                      style={collapsed ? undefined : { overflow: 'hidden' }}
                    >
                      {section.items.map((item) => {
                        const idx = staggerIdx++;
                        const Icon = item.icon;

                        return (
                          <motion.div
                            key={item.path}
                            variants={collapsed ? undefined : itemVariant}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.15 }}
                            className={styles.navItemWrap}
                            style={{ animationDelay: `${idx * 40}ms` }}
                          >
                            <NavLink
                              to={item.path}
                              end={item.path === '/dashboard'}
                              onClick={handleNavClick}
                              className={({ isActive }) =>
                                [styles.navItem, isActive && styles.active]
                                  .filter(Boolean)
                                  .join(' ')
                              }
                              title={collapsed ? item.text : undefined}
                            >
                              <span className={styles.navIcon}>
                                <Icon />
                              </span>
                              {!collapsed && (
                                <span className={styles.navLabel}>{item.text}</span>
                              )}
                            </NavLink>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* ── footer ── */}
        <div className={styles.footer}>
          {user && (
            <div
              className={[styles.userCard, collapsed && styles.userCardSmall]
                .filter(Boolean)
                .join(' ')}
            >
              <div className={styles.avatar}>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    className={styles.userMeta}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className={styles.userName}>
                      {user.name || 'User'}
                    </span>
                    <span className={styles.userRole}>
                      {user.role || 'member'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            className={[styles.logoutBtn, collapsed && styles.logoutSmall]
              .filter(Boolean)
              .join(' ')}
            onClick={handleLogout}
            title="Logout"
          >
            <MdLogout />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
