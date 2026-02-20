import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { verifyMasterKey } from '../../../services/configService';
import { useScrollLock } from '../../../hooks/useScrollLock';
import styles from './NotFound.module.css';

const PORTAL_FLAG = 'canAccessPortal';
const PORTAL_TOKEN = 'portalAccessToken';

const NotFound = () => {
  const [showTerminal, setShowTerminal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('idle'); // idle | error | success | denied
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useScrollLock(showTerminal);

  // Focus terminal input when opened
  useEffect(() => {
    if (showTerminal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showTerminal]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && showTerminal) {
        setShowTerminal(false);
        setInputValue('');
        setStatus('idle');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showTerminal]);

  const handleTriggerClick = useCallback(() => {
    setShowTerminal(true);
    setInputValue('');
    setStatus('idle');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || status === 'success') return;

    try {
      const data = await verifyMasterKey(inputValue.trim());

      if (data.success && data.accessToken) {
        setStatus('success');
        // Store both the flag and the short-lived JWT
        sessionStorage.setItem(PORTAL_FLAG, 'true');
        sessionStorage.setItem(PORTAL_TOKEN, data.accessToken);
        // Redirect after success animation
        setTimeout(() => {
          navigate('/admin/login', { replace: true });
        }, 1200);
      }
    } catch (err) {
      setStatus('error');
      setAttempts((prev) => prev + 1);

      // After 3 failed attempts, show Access Denied flash
      if (attempts >= 2) {
        setShowTerminal(false);
        setStatus('denied');
        setAttempts(0);
        setTimeout(() => setStatus('idle'), 2000);
      }

      // Reset error state after shake
      setTimeout(() => {
        setInputValue('');
        if (attempts < 2) setStatus('idle');
      }, 800);
    }
  }, [inputValue, attempts, navigate, status]);

  return (
    <div className={styles.notFoundPage}>
      {/* Background effects */}
      <div className={styles.scanlines} />
      <div className={styles.gridBg} />
      <div className={styles.orb + ' ' + styles.orb1} />
      <div className={styles.orb + ' ' + styles.orb2} />
      <div className={styles.orb + ' ' + styles.orb3} />

      {/* Floating particles */}
      <div className={styles.particles}>
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className={styles.content}>
        <div className={styles.glitchWrapper}>
          <div className={styles.errorCode} data-text="404.">
            404
            {/* The hidden trigger — the period */}
            <span
              className={styles.hiddenTrigger}
              onClick={handleTriggerClick}
              role="button"
              tabIndex={-1}
            >
              .
            </span>
          </div>
        </div>

        <h2 className={styles.subtitle}>Signal Lost</h2>
        <p className={styles.description}>
          The page you're looking for has drifted into the void. 
          It may have been moved, deleted, or never existed in this dimension.
        </p>

        <Link to="/" className={styles.homeBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Return Home
        </Link>
      </div>

      {/* Terminal Modal */}
      {showTerminal && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTerminal(false);
              setInputValue('');
              setStatus('idle');
            }
          }}
        >
          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              <span className={`${styles.terminalDot} ${styles.dotRed}`} />
              <span className={`${styles.terminalDot} ${styles.dotYellow}`} />
              <span className={`${styles.terminalDot} ${styles.dotGreen}`} />
              <span className={styles.terminalTitle}>redix@secure ~ access-control</span>
            </div>

            <div className={styles.terminalBody}>
              <div className={styles.terminalLine}>
                <span className={styles.prompt}>▸</span>
                <span className={styles.lineText}>Establishing secure connection...</span>
              </div>
              <div className={styles.terminalLine}>
                <span className={styles.prompt}>▸</span>
                <span className={styles.lineText}>Connection established. Authentication required.</span>
              </div>
              <div className={styles.terminalLine}>
                <span className={styles.prompt}>▸</span>
                <span className={styles.lineText}>Enter access key to proceed:</span>
              </div>

              <form onSubmit={handleSubmit} className={styles.inputLine}>
                <span className={styles.prompt}>$</span>
                <input
                  ref={inputRef}
                  type="password"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={`${styles.terminalInput} ${status === 'error' ? styles.inputError : ''}`}
                  placeholder="Enter access key..."
                  autoComplete="off"
                  spellCheck="false"
                  disabled={status === 'success'}
                />
              </form>

              {status === 'error' && (
                <div className={styles.errorLine}>
                  <span>✗</span>
                  <span>Access denied. Invalid key. ({3 - attempts} attempt{3 - attempts !== 1 ? 's' : ''} remaining)</span>
                </div>
              )}

              {status === 'success' && (
                <div className={styles.successLine}>
                  <span>✓</span>
                  <span>Access granted. Redirecting<span className={styles.loadingDots} /></span>
                </div>
              )}

              <div className={styles.closeHint}>
                Press <kbd>ESC</kbd> to close
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Access Denied full-screen flash */}
      {status === 'denied' && (
        <div className={styles.accessDenied}>
          <span className={styles.deniedText}>⚠ ACCESS DENIED ⚠</span>
        </div>
      )}
    </div>
  );
};

export default NotFound;
