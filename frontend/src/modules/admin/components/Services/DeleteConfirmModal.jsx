import React, { useState } from 'react';
import { MdClose, MdWarning } from 'react-icons/md';
import styles from './DeleteConfirmModal.module.css';

const DeleteConfirmModal = ({ service, onConfirm, onCancel }) => {
    const [confirmName, setConfirmName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (confirmName !== service.projectName) {
            setError('Service name does not match');
            return;
        }

        setLoading(true);
        try {
            await onConfirm(confirmName);
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting service');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.iconWarning}>
                        <MdWarning />
                    </div>
                    <h2>Delete Service</h2>
                    <button className={styles.closeBtn} onClick={onCancel}>
                        <MdClose />
                    </button>
                </div>

                <div className={styles.content}>
                    <p className={styles.warning}>
                        <strong>Warning:</strong> This action cannot be undone. This will permanently delete the service
                        and all associated data including notes, attachments, and audit logs.
                    </p>

                    <div className={styles.serviceInfo}>
                        <p><strong>Service:</strong> {service.projectName}</p>
                        <p><strong>Client:</strong> {service.client?.businessName || 'N/A'}</p>
                        <p><strong>Total Price:</strong> {service.totalPrice?.toLocaleString()} TND</p>
                    </div>

                    <div className={styles.confirmSection}>
                        <label htmlFor="confirmName">
                            To confirm deletion, type the service name exactly as shown below:
                        </label>
                        <div className={styles.serviceNameDisplay}>
                            {service.projectName}
                        </div>
                        <input
                            id="confirmName"
                            type="text"
                            value={confirmName}
                            onChange={(e) => {
                                setConfirmName(e.target.value);
                                setError('');
                            }}
                            placeholder="Type service name here"
                            className={styles.input}
                            autoFocus
                        />
                        {error && <p className={styles.error}>{error}</p>}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        className={styles.deleteBtn}
                        onClick={handleConfirm}
                        disabled={loading || confirmName !== service.projectName}
                    >
                        {loading ? 'Deleting...' : 'Delete Service'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
