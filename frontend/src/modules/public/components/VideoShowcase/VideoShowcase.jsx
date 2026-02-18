// src/components/VideoShowcase/VideoShowcase.jsx
// Interactive Video Slider — Single active video with directional navigation
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { videoProjects } from '../../data/videoShowcase';
import styles from './VideoShowcase.module.css';

const VideoShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [playing, setPlaying] = useState(false);
  const modalVideoRef = useRef(null);

  const total = videoProjects.length;
  const current = videoProjects[currentIndex];

  const go = useCallback((dir) => {
    setDirection(dir);
    setCurrentIndex((prev) => (prev + dir + total) % total);
  }, [total]);

  const openPlayer = () => setPlaying(true);

  const closePlayer = () => {
    if (modalVideoRef.current) modalVideoRef.current.pause();
    setPlaying(false);
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
            <FaPlay /> Portfolio
          </span>
          <h2 className={styles.title}>Our Creative Work</h2>
          <p className={styles.subtitle}>
            Stunning video content that captivates audiences and elevates brands
          </p>
        </motion.div>

        {/* Slider */}
        <div className={styles.slider}>
          {/* Left Arrow */}
          <button
            className={`${styles.navArrow} ${styles.navLeft}`}
            onClick={() => go(-1)}
            aria-label="Previous video"
          >
            <FaChevronLeft />
          </button>

          {/* Main Video Card */}
          <div className={`${styles.stage} ${isReel ? styles.stageReel : styles.stageLandscape}`}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current.id}
                className={`${styles.videoCard} ${isReel ? styles.reelCard : styles.landscapeCard}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                onClick={openPlayer}
              >
                {/* Thumbnail */}
                <img
                  src={current.thumbnailUrl}
                  alt={current.title}
                  className={styles.thumb}
                  draggable={false}
                />

                {/* Play overlay */}
                <div className={styles.playOverlay}>
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
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow */}
          <button
            className={`${styles.navArrow} ${styles.navRight}`}
            onClick={() => go(1)}
            aria-label="Next video"
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
              onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
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

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {playing && (
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePlayer}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeBtn} onClick={closePlayer}>
                <FaTimes />
              </button>

              <div className={`${styles.modalVideoWrap} ${isReel ? styles.modalReel : ''}`}>
                <video
                  ref={modalVideoRef}
                  src={current.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className={styles.modalVideo}
                />
              </div>

              <div className={styles.modalInfo}>
                <span className={styles.modalCategory}>{current.category}</span>
                <h3 className={styles.modalTitle}>{current.title}</h3>
                <p className={styles.modalDesc}>{current.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoShowcase;
