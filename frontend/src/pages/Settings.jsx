import React, { useState } from 'react';
import styles from './Settings.module.css';

const Settings = () => {
    const [companyName, setCompanyName] = useState('Redix Digital Solutions');
    const [currency, setCurrency] = useState('TND');
    const [language, setLanguage] = useState('fr');
    const [saved, setSaved] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
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
