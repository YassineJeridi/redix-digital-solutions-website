// src/components/BookingModal/BookingModal.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes, FaUser, FaEnvelope, FaPhone, FaFileAlt,
  FaPaperPlane, FaCheckCircle, FaSpinner, FaExclamationCircle
} from 'react-icons/fa';
import { sendBookingMessage } from '../../services/telegramService';
import styles from './BookingModal.module.css';

const BookingModal = ({ service, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', project: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[\d\s+\-()]{7,}$/.test(form.phone)) e.phone = 'Invalid phone';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      await sendBookingMessage({ ...form, serviceName: service.title });
      setStatus('success');
      setTimeout(onClose, 2500);
    } catch {
      setStatus('error');
    }
  };

  const set = (field, val) => {
    setForm(p => ({ ...p, [field]: val }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 30 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        {/* Close */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>

        {/* Success State */}
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              className={styles.successState}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <FaCheckCircle className={styles.successIcon} />
              <h3>Booking Sent!</h3>
              <p>We'll get back to you shortly.</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Header */}
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Book a Service</h3>
                <p className={styles.serviceName}>{service.title}</p>
              </div>

              {/* Form */}
              <form className={styles.form} onSubmit={handleSubmit}>
                {/* Name */}
                <div className={styles.field}>
                  <div className={`${styles.inputWrap} ${errors.name ? styles.inputError : ''}`}>
                    <FaUser className={styles.inputIcon} />
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  {errors.name && <span className={styles.error}>{errors.name}</span>}
                </div>

                {/* Email */}
                <div className={styles.field}>
                  <div className={`${styles.inputWrap} ${errors.email ? styles.inputError : ''}`}>
                    <FaEnvelope className={styles.inputIcon} />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  {errors.email && <span className={styles.error}>{errors.email}</span>}
                </div>

                {/* Phone */}
                <div className={styles.field}>
                  <div className={`${styles.inputWrap} ${errors.phone ? styles.inputError : ''}`}>
                    <FaPhone className={styles.inputIcon} />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                </div>

                {/* Project Details */}
                <div className={styles.field}>
                  <div className={styles.inputWrap}>
                    <FaFileAlt className={styles.inputIcon} style={{ alignSelf: 'flex-start', marginTop: '0.85rem' }} />
                    <textarea
                      placeholder="Project Details (optional)"
                      value={form.project}
                      onChange={(e) => set('project', e.target.value)}
                      className={`${styles.input} ${styles.textarea}`}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Error message */}
                {status === 'error' && (
                  <div className={styles.errorBanner}>
                    <FaExclamationCircle /> Failed to send — please try again.
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <><FaSpinner className={styles.spin} /> Sending...</>
                  ) : (
                    <><FaPaperPlane /> Book Now</>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default BookingModal;
