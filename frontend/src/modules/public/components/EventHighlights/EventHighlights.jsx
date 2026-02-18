// src/components/EventHighlights/EventHighlights.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  FaPlay, 
  FaTimes, 
  FaChevronLeft, 
  FaChevronRight, 
  FaClock, 
  FaTag,
  FaExpand,
  FaVolumeMute,
  FaVolumeUp
} from 'react-icons/fa';
import { events } from '../../data/events';
import styles from './EventHighlights.module.css';

const EventHighlights = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [videoThumbnails, setVideoThumbnails] = useState({});
  const [activeFilter, setActiveFilter] = useState('All');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Scroll animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  // Filter categories
  const categories = ['All', 'Corporate', 'Education', 'Technology', 'Fashion', 'Food & Beverage', 'Hospitality'];
  
  // Filter events based on active filter
  const filteredEvents = activeFilter === 'All' 
    ? events 
    : events.filter(event => event.category === activeFilter);

  // Generate video thumbnails with better error handling
  const generateThumbnail = async (videoUrl, eventIndex) => {
    if (videoThumbnails[eventIndex]) return;

    try {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.currentTime = 2;
      video.muted = true;
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        canvas.width = 400;
        canvas.height = 300;
      };

      video.onloadeddata = () => {
        video.currentTime = 2;
      };

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        
        setVideoThumbnails(prev => ({
          ...prev,
          [eventIndex]: thumbnail
        }));
      };

      video.onerror = () => {
        console.warn(`Could not generate thumbnail for ${videoUrl}`);
        // Set a placeholder or default thumbnail
        setVideoThumbnails(prev => ({
          ...prev,
          [eventIndex]: '/assets/placeholder-thumbnail.jpg'
        }));
      };

      video.src = videoUrl;
      video.load();
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  };

  useEffect(() => {
    if (isInView) {
      filteredEvents.forEach((event, index) => {
        setTimeout(() => generateThumbnail(event.url, index), index * 200);
      });
    }
  }, [isInView, filteredEvents]);

  // Scroll handling with smoother updates
  const updateScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 10);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollPosition);
      updateScrollPosition();
      return () => container.removeEventListener('scroll', updateScrollPosition);
    }
  }, [filteredEvents]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -400 : 400,
        behavior: 'smooth'
      });
    }
  };

  const openModal = (video, index) => {
    setSelectedVideo({ ...video, index });
    setCurrentVideoIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setIsVideoPlaying(false);
    document.body.style.overflow = 'unset';
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const navigateVideo = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentVideoIndex + 1) % filteredEvents.length
      : (currentVideoIndex - 1 + filteredEvents.length) % filteredEvents.length;
    
    setSelectedVideo({ ...filteredEvents[newIndex], index: newIndex });
    setCurrentVideoIndex(newIndex);
    setIsVideoPlaying(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 80,
      scale: 0.8,
      rotateX: 15
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay: i * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }),
    hover: {
      y: -20,
      scale: 1.05,
      rotateX: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const filterVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <section className={styles.eventHighlights} ref={sectionRef} id="portfolio">
      {/* Advanced Animated Background */}
      <div className={styles.backgroundAnimations}>
        {/* Floating Video Icons */}
        <div className={styles.floatingIcons}>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`${styles.floatingIcon} ${styles[`icon${i + 1}`]}`}
              animate={{
                y: [-30, 30, -30],
                x: [-20, 20, -20],
                rotate: [0, 360, 0],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: 8 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            >
              <FaPlay />
            </motion.div>
          ))}
        </div>

        {/* Animated Gradient Orbs */}
        <motion.div
          className={styles.gradientOrb1}
          style={{ y: backgroundY, opacity: backgroundOpacity }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className={styles.gradientOrb2}
          style={{ y: backgroundY, opacity: backgroundOpacity }}
          animate={{
            scale: [1.2, 0.8, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Particle System */}
        <div className={styles.particles}>
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.particle}
              animate={{
                y: [-100, -800],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: Math.random() * 6,
                ease: "easeOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%'
              }}
            />
          ))}
        </div>
      </div>

      <motion.div 
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Enhanced Header */}
        <motion.div 
          className={styles.header}
          variants={headerVariants}
        >
          <motion.span 
            className={styles.sectionTag}
            whileHover={{ scale: 1.05, rotate: 1 }}
          >
            Creative Portfolio
          </motion.span>
          
          <motion.h2 className={styles.title}>
            Our Video <span className={styles.highlight}>Showcase</span>
          </motion.h2>
          
          <motion.p className={styles.subtitle}>
            Discover our creative portfolio of innovative video projects and successful brand collaborations
          </motion.p>

          {/* Category Filters */}
          <motion.div 
            className={styles.categoryFilters}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                className={`${styles.filterBtn} ${activeFilter === category ? styles.active : ''}`}
                variants={filterVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(category)}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Scrolling Section */}
        <motion.div 
          className={styles.scrollSection}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {/* Enhanced Navigation Arrows */}
          <motion.button
            className={`${styles.navBtn} ${styles.navLeft}`}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              opacity: canScrollLeft ? 1 : 0.3,
              x: canScrollLeft ? 0 : -10
            }}
          >
            <FaChevronLeft />
          </motion.button>

          <motion.button
            className={`${styles.navBtn} ${styles.navRight}`}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              opacity: canScrollRight ? 1 : 0.3,
              x: canScrollRight ? 0 : 10
            }}
          >
            <FaChevronRight />
          </motion.button>

          {/* Enhanced Scroll Container */}
          <div 
            className={styles.scrollContainer} 
            ref={scrollContainerRef}
          >
            <motion.div className={styles.videoGrid}>
              <AnimatePresence mode="wait">
                {filteredEvents.map((event, index) => (
                  <motion.article
                    key={`${activeFilter}-${event.id}`}
                    className={styles.videoCard}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    whileHover="hover"
                    onClick={() => openModal(event, index)}
                    layout
                  >
                    {/* Enhanced Thumbnail Container */}
                    <div className={styles.thumbnailContainer}>
                      {videoThumbnails[index] ? (
                        <motion.img
                          src={videoThumbnails[index]}
                          alt={event.title}
                          className={styles.thumbnail}
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6 }}
                        />
                      ) : (
                        <div className={styles.thumbnailPlaceholder}>
                          <motion.div
                            className={styles.loader}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                      )}
                      
                      {/* Enhanced Play Button */}
                      <motion.div
                        className={styles.playButton}
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: "0 0 30px rgba(193, 45, 224, 0.6)"
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaPlay />
                        <motion.div
                          className={styles.playRipple}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.6, 0, 0.6]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* Enhanced Content Overlay */}
                    <div className={styles.contentOverlay}>
                      <div className={styles.videoMeta}>
                        <motion.span 
                          className={styles.eventType}
                          whileHover={{ scale: 1.05 }}
                        >
                          <FaTag />
                          {event.type}
                        </motion.span>
                        
                        <div className={styles.metaInfo}>
                          <span className={styles.eventDate}>{event.date}</span>
                          <span className={styles.duration}>
                            <FaClock />
                            {event.duration}
                          </span>
                        </div>
                      </div>

                      <motion.h3 
                        className={styles.videoTitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {event.title}
                      </motion.h3>
                      
                      <motion.p 
                        className={styles.videoDescription}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        {event.description}
                      </motion.p>
                    </div>

                    {/* Enhanced Gradient Overlay */}
                    <div className={styles.gradientOverlay} />
                    
                    {/* Hover Effects */}
                    <motion.div
                      className={styles.hoverEffect}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div 
          className={styles.stats}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <div className={styles.statItem}>
            <motion.span 
              className={styles.statNumber}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              10+
            </motion.span>
            <span className={styles.statLabel}>Video Projects</span>
          </div>
          
          <div className={styles.statItem}>
            <motion.span 
              className={styles.statNumber}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 2.0 }}
            >
              6
            </motion.span>
            <span className={styles.statLabel}>Categories</span>
          </div>
          
          <div className={styles.statItem}>
            <motion.span 
              className={styles.statNumber}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 2.2 }}
            >
              2024
            </motion.span>
            <span className={styles.statLabel}>Latest Work</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Enhanced Modal Controls */}
              <div className={styles.modalControls}>
                <motion.button
                  className={styles.closeBtn}
                  onClick={closeModal}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes />
                </motion.button>

                <motion.button
                  className={styles.expandBtn}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaExpand />
                </motion.button>

                <motion.button
                  className={styles.muteBtn}
                  onClick={toggleMute}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </motion.button>
              </div>

              {/* Video Navigation */}
              <div className={styles.videoNavigation}>
                <motion.button
                  className={styles.navPrev}
                  onClick={() => navigateVideo('prev')}
                  whileHover={{ scale: 1.1, x: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronLeft />
                </motion.button>

                <motion.button
                  className={styles.navNext}
                  onClick={() => navigateVideo('next')}
                  whileHover={{ scale: 1.1, x: 3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronRight />
                </motion.button>
              </div>

              {/* Enhanced Video Player */}
              <div className={styles.videoContainer}>
                <video 
                  ref={videoRef}
                  className={styles.modalVideo}
                  controls
                  muted={isMuted}
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                >
                  <source src={selectedVideo.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Enhanced Modal Info */}
              <motion.div 
                className={styles.modalInfo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className={styles.modalMeta}>
                  <span className={styles.modalType}>{selectedVideo.type}</span>
                  <span className={styles.modalDate}>{selectedVideo.date}</span>
                  <span className={styles.modalDuration}>
                    <FaClock />
                    {selectedVideo.duration}
                  </span>
                </div>
                
                <h3>{selectedVideo.title}</h3>
                <p>{selectedVideo.description}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EventHighlights;
