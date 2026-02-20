import React, { useState, useEffect } from 'react';
import {
    MdHistory, MdSearch, MdFilterList, MdRefresh,
    MdCreate, MdEdit, MdDelete, MdSwapHoriz,
    MdPayment, MdPersonAdd, MdNoteAdd, MdAttachFile
} from 'react-icons/md';
import * as AuditServices from '../services/AuditServices';
import styles from './ActivityLog.module.css';

const ActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        entityType: '',
        action: '',
        search: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchLogs();
        fetchStats();
    }, [page, filters.entityType, filters.action]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await AuditServices.getAuditLogs({
                page,
                limit: 30,
                entityType: filters.entityType,
                action: filters.action,
                search: filters.search,
                startDate: filters.startDate,
                endDate: filters.endDate
            });
            setLogs(data.logs || []);
            setPagination(data.pagination || {});
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await AuditServices.getAuditStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchLogs();
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'create': return <MdCreate />;
            case 'update': return <MdEdit />;
            case 'delete': return <MdDelete />;
            case 'status_change':
            case 'payment_status_change': return <MdSwapHoriz />;
            case 'commission':
            case 'withdrawal': return <MdPayment />;
            case 'team_assignment': return <MdPersonAdd />;
            case 'note_added': return <MdNoteAdd />;
            case 'attachment_added': return <MdAttachFile />;
            default: return <MdHistory />;
        }
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'create': return '#10b981';
            case 'update': return '#3b82f6';
            case 'delete': return '#ef4444';
            case 'status_change':
            case 'payment_status_change': return '#f59e0b';
            case 'commission':
            case 'withdrawal': return '#c12de0';
            default: return '#6b7280';
        }
    };

    const getEntityColor = (type) => {
        switch (type) {
            case 'Service': return '#8b5cf6';
            case 'Client': return '#06b6d4';
            case 'Tool': return '#f59e0b';
            case 'TeamMember': return '#10b981';
            case 'Expense': return '#ef4444';
            case 'Charge': return '#ec4899';
            default: return '#6b7280';
        }
    };

    const formatDetails = (log) => {
        if (!log.details) return '';
        const d = log.details;
        const parts = [];
        if (d.projectName) parts.push(d.projectName);
        if (d.businessName) parts.push(d.businessName);
        if (d.name) parts.push(d.name);
        if (d.description) parts.push(d.description);
        if (d.amount) parts.push(`${d.amount} TND`);
        if (d.changes) {
            Object.entries(d.changes).forEach(([key, val]) => {
                if (val && val.from) {
                    parts.push(`${key}: ${val.from} → ${val.to}`);
                }
            });
        }
        return parts.join(' • ');
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days}d ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}><MdHistory /> Activity Log</h1>
                    <p className={styles.subtitle}>Track all changes across the system</p>
                </div>
                <button className={styles.refreshBtn} onClick={() => { fetchLogs(); fetchStats(); }}>
                    <MdRefresh /> Refresh
                </button>
            </div>

            {/* Stats */}
            {stats && (
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{stats.totalLogs}</span>
                        <span className={styles.statLabel}>Total Events</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{stats.recentCount}</span>
                        <span className={styles.statLabel}>Last 24h</span>
                    </div>
                    {stats.byEntityType?.slice(0, 3).map((item, idx) => (
                        <div key={idx} className={styles.statCard}>
                            <span className={styles.statValue}>{item.count}</span>
                            <span className={styles.statLabel}>{item._id}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className={styles.filters}>
                <form onSubmit={handleSearch} className={styles.searchBox}>
                    <MdSearch />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </form>
                <div className={styles.filterGroup}>
                    <MdFilterList />
                    <select value={filters.entityType} onChange={(e) => { setFilters({ ...filters, entityType: e.target.value }); setPage(1); }}>
                        <option value="">All Types</option>
                        <option value="Project">Service</option>
                        <option value="Client">Client</option>
                        <option value="Tool">Tool</option>
                        <option value="TeamMember">Team Member</option>
                        <option value="Expense">Expense</option>
                        <option value="Charge">Charge</option>
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <select value={filters.action} onChange={(e) => { setFilters({ ...filters, action: e.target.value }); setPage(1); }}>
                        <option value="">All Actions</option>
                        <option value="create">Create</option>
                        <option value="update">Update</option>
                        <option value="delete">Delete</option>
                        <option value="commission">Commission</option>
                        <option value="withdrawal">Withdrawal</option>
                        <option value="status_change">Status Change</option>
                    </select>
                </div>
            </div>

            {/* Logs Timeline */}
            <div className={styles.timeline}>
                {loading ? (
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Loading activity...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className={styles.emptyState}>
                        <MdHistory size={48} />
                        <p>No activity logs found</p>
                    </div>
                ) : (
                    logs.map((log) => (
                        <div key={log._id} className={styles.logItem}>
                            <div className={styles.logIcon} style={{ background: `${getActionColor(log.action)}15`, color: getActionColor(log.action) }}>
                                {getActionIcon(log.action)}
                            </div>
                            <div className={styles.logUserAvatar}>
                                <div className={styles.userAvatarCircle}>
                                    {(log.userName || log.performedBy?.name || '?').charAt(0).toUpperCase()}
                                </div>
                                <span className={styles.userAvatarName}>{log.userName || log.performedBy?.name || 'System'}</span>
                            </div>
                            <div className={styles.logContent}>
                                <div className={styles.logHeader}>
                                    <span className={styles.logAction} style={{ color: getActionColor(log.action) }}>
                                        {log.action.replace(/_/g, ' ').toUpperCase()}
                                    </span>
                                    <span className={styles.entityBadge} style={{ background: `${getEntityColor(log.entityType)}15`, color: getEntityColor(log.entityType) }}>
                                        {log.entityType}
                                    </span>
                                    <span className={styles.logTime}>{timeAgo(log.createdAt)}</span>
                                </div>
                                <p className={styles.logDetails}>{formatDetails(log)}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className={styles.pagination}>
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                    <span>Page {page} of {pagination.pages}</span>
                    <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            )}
        </div>
    );
};

export default ActivityLog;
