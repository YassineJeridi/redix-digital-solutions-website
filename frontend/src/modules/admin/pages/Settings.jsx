import React, { useState, useEffect } from 'react';
import api from '../services/api';
import styles from './Settings.module.css';

const Settings = () => {
    const [companyName, setCompanyName] = useState('Redix Digital Solutions');
    const [currency, setCurrency] = useState('TND');
    const [language, setLanguage] = useState('fr');
    const [saved, setSaved] = useState(false);

    // ── Master Key Management ──
    const [currentKey, setCurrentKey] = useState('');
    const [newKey, setNewKey] = useState('');
    const [confirmKey, setConfirmKey] = useState('');
    const [keyStatus, setKeyStatus] = useState(''); // '' | 'saving' | 'success' | 'error'
    const [keyError, setKeyError] = useState('');
    const [keyInfo, setKeyInfo] = useState(null);

    useEffect(() => {
        // Fetch master key metadata
        api.get('/api/config/master-key-info')
            .then((res) => setKeyInfo(res.data))
            .catch(() => {}); // silently fail if not admin
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleUpdateMasterKey = async (e) => {
        e.preventDefault();
        setKeyError('');

        if (newKey !== confirmKey) {
            setKeyError('New key and confirmation do not match.');
            return;
        }
        if (newKey.length < 8) {
            setKeyError('New key must be at least 8 characters.');
            return;
        }

        setKeyStatus('saving');
        try {
            const res = await api.put('/api/config/master-key', { currentKey, newKey });
            setKeyStatus('success');
            setKeyInfo({ lastKeyUpdate: res.data.lastKeyUpdate, updatedBy: 'you' });
            setCurrentKey('');
            setNewKey('');
            setConfirmKey('');
            setTimeout(() => setKeyStatus(''), 3000);
        } catch (err) {
            setKeyStatus('error');
            setKeyError(err.response?.data?.message || 'Failed to update key.');
            setTimeout(() => setKeyStatus(''), 3000);
        }
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.pageTitle}>Settings</h1>

            <div className={styles.settingsGrid}>
                {/* General Settings */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>⚙️ General</h2>
                    <form onSubmit={handleSave} className={styles.form}>
                        <div className={styles.field}>
                            <label>Company Name</label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Currency</label>
                            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                <option value="TND">TND - Tunisian Dinar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="USD">USD - US Dollar</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Language</label>
                            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                                <option value="fr">Français</option>
                                <option value="en">English</option>
                                <option value="ar">العربية</option>
                            </select>
                        </div>
                        <button type="submit" className={styles.saveBtn}>
                            {saved ? '✓ Saved' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Security — Master Key Management */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>🔐 Security</h2>
                    <form onSubmit={handleUpdateMasterKey} className={styles.form}>
                        <p className={styles.desc} style={{ marginBottom: '1rem', fontSize: '0.85rem', opacity: 0.7 }}>
                            Change the master access key used for the stealth portal.
                            {keyInfo?.lastKeyUpdate && (
                                <> Last updated: {new Date(keyInfo.lastKeyUpdate).toLocaleDateString()} by {keyInfo.updatedBy}</>
                            )}
                        </p>
                        <div className={styles.field}>
                            <label>Current Key</label>
                            <input
                                type="password"
                                value={currentKey}
                                onChange={(e) => setCurrentKey(e.target.value)}
                                placeholder="Enter current master key"
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>New Key</label>
                            <input
                                type="password"
                                value={newKey}
                                onChange={(e) => setNewKey(e.target.value)}
                                placeholder="Enter new master key (min 8 chars)"
                                required
                                minLength={8}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Confirm New Key</label>
                            <input
                                type="password"
                                value={confirmKey}
                                onChange={(e) => setConfirmKey(e.target.value)}
                                placeholder="Confirm new master key"
                                required
                            />
                        </div>
                        {keyError && (
                            <p style={{ color: 'var(--danger-color)', fontSize: '0.85rem', margin: '0.5rem 0' }}>
                                {keyError}
                            </p>
                        )}
                        <button type="submit" className={styles.saveBtn} disabled={keyStatus === 'saving'}>
                            {keyStatus === 'saving' ? 'Updating...' : keyStatus === 'success' ? '✓ Updated' : 'Update Master Key'}
                        </button>
                    </form>
                </div>

                {/* About */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>💡 About</h2>
                    <div className={styles.aboutContent}>
                        <p className={styles.appName}>Redix Digital Solutions</p>
                        <p className={styles.version}>v2.0.0</p>
                        <p className={styles.desc}>
                            Internal billing & project management platform for Redix Digital Solutions agency.
                        </p>
                        <div className={styles.links}>
                            <span className={styles.link}>📊 Dashboard</span>
                            <span className={styles.link}>👥 Team Members</span>
                            <span className={styles.link}>📈 Reports</span>
                            <span className={styles.link}>💼 Investing</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
