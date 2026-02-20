import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className={styles.layout}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onToggleCollapse={() => setSidebarOpen(!sidebarOpen)} />
            <div className={`${styles.main} ${!sidebarOpen ? styles.expanded : ''}`}>
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};

export default Layout;
