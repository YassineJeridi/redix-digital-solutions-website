import React, { useState, useEffect } from 'react';
import {
    MdAdd, MdEdit, MdDelete, MdSearch, MdPerson, MdPayment,
    MdAccountBalanceWallet, MdClose, MdFilterList
} from 'react-icons/md';
import * as SettingsService from '../services/SettingsServices';
import styles from './TeamMembers.module.css';

const TeamMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(null);
    const [paymentData, setPaymentData] = useState({ amount: '', description: '', type: 'payment' });
    const [expandedMember, setExpandedMember] = useState(null);

    const [formData, setFormData] = useState({
        name: '', role: '', email: '', status: 'active', sharePercentage: 100, password: ''
    });

    useEffect(() => { fetchMembers(); }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const data = await SettingsService.getTeamMembers();
            setMembers(data);
        } catch (error) {
            console.error('Error fetching team members:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = { ...formData };
            // Don't send empty password on edit
            if (editingMember && !dataToSend.password) {
                delete dataToSend.password;
            }
            if (editingMember) {
                await SettingsService.updateTeamMember(editingMember._id, dataToSend);
            } else {
                await SettingsService.createTeamMember(dataToSend);
            }
            fetchMembers();
            resetForm();
        } catch (error) {
            console.error('Error saving member:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this team member?')) {
            try {
                await SettingsService.deleteTeamMember(id);
                fetchMembers();
            } catch (error) {
                console.error('Error deleting member:', error);
            }
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            const data = { amount: Number(paymentData.amount), description: paymentData.description };
            if (paymentData.type === 'payment') {
                await SettingsService.addPaymentToMember(showPaymentModal._id, data);
            } else {
                await SettingsService.addAdvanceToMember(showPaymentModal._id, data);
            }
            fetchMembers();
            setShowPaymentModal(null);
            setPaymentData({ amount: '', description: '', type: 'payment' });
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        setFormData({
            name: member.name, role: member.role, email: member.email,
            status: member.status, sharePercentage: member.sharePercentage || 100, password: ''
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingMember(null);
        setFormData({ name: '', role: '', email: '', status: 'active', sharePercentage: 100, password: '' });
    };

    const filteredMembers = members.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalReceived = members.reduce((sum, m) => sum + (m.totalReceived || 0), 0);
    const totalWithdrawn = members.reduce((sum, m) => sum + (m.totalWithdrawn || 0), 0);
    const totalCurrentBalance = members.reduce((sum, m) => sum + ((m.totalReceived || 0) - (m.totalWithdrawn || 0)), 0);
    const totalPending = members.reduce((sum, m) => sum + (m.pendingEarnings || 0), 0);

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading team...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <h1 className={styles.title}>Team Members</h1>
                <button className={styles.addBtn} onClick={() => setShowForm(true)}>
                    <MdAdd /> Add Member
                </button>
            </div>

            {/* Summary Cards */}
            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <MdPerson className={styles.summaryIcon} />
                    <div>
                        <span className={styles.summaryLabel}>Total Members</span>
                        <span className={styles.summaryValue}>{members.length}</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <MdAccountBalanceWallet className={styles.summaryIcon} style={{ color: 'var(--success)' }} />
                    <div>
                        <span className={styles.summaryLabel}>Total Received</span>
                        <span className={styles.summaryValue}>{totalReceived.toLocaleString()} TND</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <MdPayment className={styles.summaryIcon} style={{ color: 'var(--warning)' }} />
                    <div>
                        <span className={styles.summaryLabel}>Total Withdrawn</span>
                        <span className={styles.summaryValue}>{totalWithdrawn.toLocaleString()} TND</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <MdAccountBalanceWallet className={styles.summaryIcon} style={{ color: 'var(--info)' }} />
                    <div>
                        <span className={styles.summaryLabel}>Current Balance</span>
                        <span className={styles.summaryValue}>{totalCurrentBalance.toLocaleString()} TND</span>
                    </div>
                </div>
                {totalPending > 0 && (
                    <div className={styles.summaryCard}>
                        <MdAccountBalanceWallet className={styles.summaryIcon} style={{ color: 'var(--accent)' }} />
                        <div>
                            <span className={styles.summaryLabel}>Total Pending</span>
                            <span className={styles.summaryValue}>{totalPending.toLocaleString()} TND</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <div className={styles.searchBox}>
                    <MdSearch />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.filterGroup}>
                    <MdFilterList />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Members Grid */}
            <div className={styles.membersGrid}>
                {filteredMembers.length === 0 ? (
                    <div className={styles.emptyState}>
                        <MdPerson size={48} />
                        <p>No team members found</p>
                    </div>
                ) : (
                    filteredMembers.map((member) => (
                        <div key={member._id} className={styles.memberCard}>
                            <div className={styles.memberHeader}>
                                <div className={styles.memberAvatar}>
                                    {member.profileImage ? (
                                        <img src={member.profileImage} alt={member.name} />
                                    ) : (
                                        <span>{member.name.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className={styles.memberInfo}>
                                    <h3>{member.name}</h3>
                                    <span className={styles.role}>{member.role}</span>
                                    <span className={styles.email}>{member.email}</span>
                                </div>
                                <span className={`${styles.statusBadge} ${styles[`status_${member.status}`]}`}>
                                    {member.status}
                                </span>
                            </div>

                            <div className={styles.financials}>
                                <div className={styles.finItem}>
                                    <span className={styles.finLabel}>Received</span>
                                    <span className={styles.finValue} style={{ color: 'var(--success)' }}>
                                        {(member.totalReceived || 0).toLocaleString()} TND
                                    </span>
                                </div>
                                <div className={styles.finItem}>
                                    <span className={styles.finLabel}>Withdrawn</span>
                                    <span className={styles.finValue} style={{ color: 'var(--warning)' }}>
                                        {(member.totalWithdrawn || 0).toLocaleString()} TND
                                    </span>
                                </div>
                                <div className={styles.finItem}>
                                    <span className={styles.finLabel}>Balance</span>
                                    <span className={styles.finValue} style={{ color: ((member.totalReceived || 0) - (member.totalWithdrawn || 0)) > 0 ? 'var(--info)' : 'var(--danger)' }}>
                                        {((member.totalReceived || 0) - (member.totalWithdrawn || 0)).toLocaleString()} TND
                                    </span>
                                </div>
                                {(member.pendingEarnings || 0) > 0 && (
                                    <div className={styles.finItem}>
                                        <span className={styles.finLabel}>Pending</span>
                                        <span className={styles.finValue} style={{ color: 'var(--accent)' }}>
                                            {(member.pendingEarnings || 0).toLocaleString()} TND
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.shareBar}>
                                <span>Share: {member.sharePercentage || 100}%</span>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: `${member.sharePercentage || 100}%` }} />
                                </div>
                            </div>

                            <div className={styles.memberActions}>
                                <button className={styles.payBtn} onClick={() => setShowPaymentModal(member)}>
                                    <MdPayment /> Commission
                                </button>
                                <button className={styles.editBtn} onClick={() => handleEdit(member)}>
                                    <MdEdit />
                                </button>
                                <button className={styles.deleteBtn} onClick={() => handleDelete(member._id)}>
                                    <MdDelete />
                                </button>
                                <button
                                    className={styles.expandBtn}
                                    onClick={() => setExpandedMember(expandedMember === member._id ? null : member._id)}
                                >
                                    {expandedMember === member._id ? 'Hide' : 'History'}
                                </button>
                            </div>

                            {expandedMember === member._id && (
                                <div className={styles.transactions}>
                                    <h4>Transaction History</h4>
                                    {member.transactions && member.transactions.length > 0 ? (
                                        <div className={styles.txList}>
                                            {member.transactions.slice(-10).reverse().map((tx, idx) => (
                                                <div key={idx} className={styles.txItem}>
                                                    <span className={`${styles.txType} ${styles[`tx_${tx.type}`]}`}>
                                                        {tx.type}
                                                    </span>
                                                    <span className={styles.txDesc}>{tx.description}</span>
                                                    <span className={styles.txAmount}>
                                                        {tx.type === 'earning' ? '+' : '-'}{tx.amount} TND
                                                    </span>
                                                    <span className={styles.txDate}>
                                                        {new Date(tx.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className={styles.noTx}>No transactions yet</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Form Modal */}
            {showForm && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>{editingMember ? 'Edit Member' : 'Add Team Member'}</h2>
                            <button className={styles.closeBtn} onClick={resetForm}><MdClose /></button>
                        </div>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Full Name *</label>
                                <input type="text" value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Role *</label>
                                    <input type="text" value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })} required
                                        placeholder="e.g., Designer, Developer" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email *</label>
                                    <input type="email" value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Status</label>
                                    <select value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Share Percentage</label>
                                    <input type="number" value={formData.sharePercentage} min="0" max="100"
                                        onChange={(e) => setFormData({ ...formData, sharePercentage: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>{editingMember ? 'New Password (leave empty to keep current)' : 'Login Password *'}</label>
                                <input type="password" value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={editingMember ? 'Leave empty to keep current password' : 'Min 6 characters'}
                                    minLength="6"
                                    required={!editingMember} />
                            </div>
                            <div className={styles.formActions}>
                                <button type="button" className={styles.cancelBtn} onClick={resetForm}>Cancel</button>
                                <button type="submit" className={styles.submitBtn}>
                                    {editingMember ? 'Update' : 'Add Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Commission — {showPaymentModal.name}</h2>
                            <button className={styles.closeBtn} onClick={() => setShowPaymentModal(null)}><MdClose /></button>
                        </div>
                        <form onSubmit={handlePayment} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Type</label>
                                <select value={paymentData.type}
                                    onChange={(e) => setPaymentData({ ...paymentData, type: e.target.value })}>
                                    <option value="payment">Payment</option>
                                    <option value="advance">Advance</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Amount (TND) *</label>
                                <input type="number" value={paymentData.amount} min="0" step="0.01"
                                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Description</label>
                                <input type="text" value={paymentData.description}
                                    onChange={(e) => setPaymentData({ ...paymentData, description: e.target.value })}
                                    placeholder="e.g., Monthly salary" />
                            </div>
                            <div className={styles.paymentInfo}>
                                <p>Balance: <strong>{(showPaymentModal.balance || 0).toLocaleString()} TND</strong></p>
                            </div>
                            <div className={styles.formActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setShowPaymentModal(null)}>Cancel</button>
                                <button type="submit" className={styles.submitBtn}>Process Commission</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamMembers;
