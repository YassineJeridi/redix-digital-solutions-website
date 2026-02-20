// src/components/VideoShowcase/VideoShowcase.jsx
// Interactive Video Slider — Inline playback (no modal)
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { videoProjects } from '../../data/videoShowcase';
import styles from './VideoShowcase.module.css';

const VideoShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [playing, setPlaying] = useState(false);
  const inlineVideoRef = useRef(null);
  const { t } = useTranslation();

  const total = videoProjects.length;
  const current = videoProjects[currentIndex];

  const stopVideo = useCallback(() => {
    if (inlineVideoRef.current) {
      inlineVideoRef.current.pause();
      inlineVideoRef.current.currentTime = 0;
    }
    setPlaying(false);
  }, []);

  const go = useCallback((dir) => {
    stopVideo();
    setDirection(dir);
    setCurrentIndex((prev) => (prev + dir + total) % total);
  }, [total, stopVideo]);

  const togglePlay = () => {
    if (playing) {
      if (inlineVideoRef.current) inlineVideoRef.current.pause();
      setPlaying(false);
    } else {
      setPlaying(true);
    }
  };

  const handleVideoReady = (el) => {
    if (el) {
      inlineVideoRef.current = el;
      el.play().catch(() => {});
    }
  };

  // Slide animation variants
  const slideVariants = {
    enter: (d) => ({
      x: d > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
    },
    exit: (d) => ({
      x: d > 0 ? -400 : 400,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    }),
  };

  const isReel = current.type === 'reel';

  return (
    <section className={styles.showcase} id="video-showcase">
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className={styles.badge}>
            <FaPlay /> {t('videoShowcase.badge')}
          </span>
          <h2 className={styles.title}>{t('videoShowcase.title')}</h2>
          <p className={styles.subtitle}>
            {t('videoShowcase.subtitle')}
          </p>
        </motion.div>

        {/* Slider */}
        <div className={styles.slider}>
          {/* Left Arrow */}
          <button
            className={`${styles.navArrow} ${styles.navLeft}`}
            onClick={() => go(-1)}
            aria-label={t('videoShowcase.prevVideo')}
          >
            <FaChevronLeft />
          </button>

          {/* Main Video Card — Inline Playback */}
          <div className={`${styles.stage} ${isReel ? styles.stageReel : styles.stageLandscape}`}>
            <AnimatePresence initial={false} custom={direction} mode="wait" onExitComplete={stopVideo}>
              <motion.div
                key={current.id}
                className={`${styles.videoCard} ${isReel ? styles.reelCard : styles.landscapeCard}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {playing ? (
                  <>
                    {/* Inline Video */}
                    <video
                      ref={handleVideoReady}
                      src={current.videoUrl}
                      controls
                      autoPlay
                      playsInline
                      className={styles.inlineVideo}
                      onEnded={() => setPlaying(false)}
                    />
                    {/* Play/Pause Toggle Overlay */}
                    <button
                      className={styles.inlineToggle}
                      onClick={togglePlay}
                      aria-label={t('videoShowcase.pauseVideo')}
                    >
                      <FaPause />
                    </button>
                  </>
                ) : (
                  <>
                    {/* Thumbnail */}
                    <img
                      src={current.thumbnailUrl}
                      alt={current.title}
                      className={styles.thumb}
                      draggable={false}
                    />

                    {/* Play overlay — click to play inline */}
                    <div className={styles.playOverlay} onClick={togglePlay}>
                      <div className={styles.playCircle}>
                        <FaPlay />
                      </div>
                    </div>

                    {/* Info bar */}
                    <div className={styles.cardInfo}>
                      <span className={styles.category}>{current.category}</span>
                      <h3 className={styles.cardTitle}>{current.title}</h3>
                      <p className={styles.cardClient}>{current.client} &middot; {current.duration}</p>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow */}
          <button
            className={`${styles.navArrow} ${styles.navRight}`}
            onClick={() => go(1)}
            aria-label={t('videoShowcase.nextVideo')}
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Dot indicators */}
        <div className={styles.dots}>
          {videoProjects.map((v, i) => (
            <button
              key={v.id}
              className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
              onClick={() => {
                stopVideo();
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              aria-label={`Go to ${v.title}`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className={styles.counter}>
          <span className={styles.counterCur}>{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className={styles.counterSep}>/</span>
          <span className={styles.counterTotal}>{String(total).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
