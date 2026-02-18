// src/components/VideoShowcase/VideoCard.jsx
import { useState, useEffect, useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand } from 'react-icons/fa';
import styles from './VideoCard.module.css';

const cardVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  },
  exit: (direction) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.4 }
  })
};

const VideoCard = memo(({ video, direction }) => {
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const progressRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(0.5);
  
  const isInView = useInView(cardRef, { 
    threshold: 0.5,
    margin: "-50px"
  });

  // Auto-play when in view
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isInView) {
      videoEl.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        console.log('Autoplay prevented');
        setIsPlaying(false);
      });
    } else {
      videoEl.pause();
      setIsPlaying(false);
    }
  }, [isInView]);

  // Initialize video settings
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.currentTime = 0;
    videoEl.volume = 0.5; // Start at 50% volume
    setVolume(0.5);
    setProgress(0);

    return () => {
      if (videoEl && !videoEl.paused) {
        videoEl.pause();
      }
    };
  }, [video.id]);

  // Update progress bar
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const updateProgress = () => {
      const percent = (videoEl.currentTime / videoEl.duration) * 100;
      setProgress(percent || 0);
    };

    videoEl.addEventListener('timeupdate', updateProgress);
    return () => videoEl.removeEventListener('timeupdate', updateProgress);
  }, []);

  const togglePlay = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isPlaying) {
      videoEl.pause();
      setIsPlaying(false);
    } else {
      videoEl.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.muted = !videoEl.muted;
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e) => {
    const videoEl = videoRef.current;
    const progressBar = progressRef.current;
    if (!videoEl || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoEl.currentTime = percent * videoEl.duration;
  };

  const handleFullscreen = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.requestFullscreen) {
      videoEl.requestFullscreen();
    } else if (videoEl.webkitRequestFullscreen) {
      videoEl.webkitRequestFullscreen();
    }
  };

  const isReel = video.type === 'reel';

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.card} ${isReel ? styles.reel : styles.landscape}`}
      custom={direction}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(isPlaying ? false : true)}
    >
      <div className={styles.videoWrap}>
        <video
          ref={videoRef}
          src={video.videoUrl}
          loop
          playsInline
          className={styles.video}
          onClick={togglePlay}
        />

        {/* Play/Pause Overlay */}
        <div 
          className={`${styles.playOverlay} ${isPlaying && !showControls ? styles.hidden : ''}`}
          onClick={togglePlay}
        >
          <motion.button 
            className={styles.playBtn}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </motion.button>
        </div>

        {/* Custom Controls */}
        <div className={`${styles.controls} ${showControls ? styles.visible : ''}`}>
          <div 
            ref={progressRef}
            className={styles.progressBar}
            onClick={handleProgressClick}
          >
            <div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className={styles.controlsRow}>
            <div className={styles.leftControls}>
              <button className={styles.controlBtn} onClick={togglePlay}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button className={styles.controlBtn} onClick={toggleMute}>
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
            </div>
            
            <div className={styles.rightControls}>
              <button className={styles.controlBtn} onClick={handleFullscreen}>
                <FaExpand />
              </button>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className={styles.typeBadge}>
          {video.type}
        </div>

        <div className={styles.categoryBadge}>
          {video.category}
        </div>
      </div>
    </motion.div>
  );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;
