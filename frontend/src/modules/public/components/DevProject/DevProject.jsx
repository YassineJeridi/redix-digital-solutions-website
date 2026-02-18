// src/components/DevProject/DevProject.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCode, FaFilter, FaStar, FaExternalLinkAlt, FaEye, 
  FaGithub, FaPlay, FaImages, FaRocket, FaAward
} from 'react-icons/fa';
import { websites, categories } from '../../data/websites';
import ProjectModal from './ProjectModal/ProjectModal';
import styles from './DevProject.module.css';

// Animation variants for performance optimization
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const DevProject = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Optimized filtering with useMemo
  const filteredProjects = useMemo(() => {
    return activeFilter === 'All' 
      ? websites 
      : websites.filter(project => project.category === activeFilter);
  }, [activeFilter]);

  // Memoized callbacks for performance
  const handleProjectView = useCallback((project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProject(null);
  }, []);

  const handleFilterChange = useCallback((category) => {
    setActiveFilter(category);
  }, []);

  const renderStatusBadge = useCallback((status) => {
    const statusConfig = {
      'Live': { 
        icon: FaPlay, 
        className: styles.statusLive, 
        text: 'Live Preview' 
      },
      'Screenshots': { 
        icon: FaImages, 
        className: styles.statusScreenshots, 
        text: 'View Screenshots' 
      }
    };

    const config = statusConfig[status] || statusConfig['Screenshots'];
    const IconComponent = config.icon;

    return (
      <div className={`${styles.statusBadge} ${config.className}`}>
        <IconComponent className={styles.statusIcon} />
        <span>{config.text}</span>
      </div>
    );
  }, []);

  return (
    <section className={styles.portfolioSection}>
      {/* Enhanced Background Effects */}
      <div className={styles.backgroundEffects}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
        <div className={styles.gridPattern} />
      </div>

      <div className={styles.container}>
        {/* Modern Header Section */}
        <motion.div 
          className={styles.headerSection}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className={styles.headerBadge}>
            <FaCode />
            <span>Our Portfolio</span>
          </div>
          
          <h1 className={styles.mainTitle}>
            <span className={styles.gradientText}>Crafting Digital
             Experiences</span>
          </h1>
          
          <p className={styles.headerDescription}>
            Explore our collection of cutting-edge web applications and digital solutions, 
            each crafted with precision, creativity, and the latest technologies.
          </p>

          {/* Stats Cards */}

        </motion.div>

        {/* Enhanced Filter Section */}
        <motion.div 
          className={styles.filterSection}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >

        </motion.div>

        {/* Enhanced Projects Grid */}
        <motion.div
          className={styles.projectsGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                className={`${styles.projectCard} ${
                  project.featured ? styles.featured : ''
                }`}
                variants={cardVariants}
                layout
                whileHover={{ 
                  y: -15,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                {/* Featured Badge */}
                {project.featured && (
                  <div className={styles.featuredBadge}>
                    <FaStar />
                    <span>Featured</span>
                  </div>
                )}

                {/* Enhanced Image Container */}
                <div className={styles.imageContainer}>
                  <div className={styles.mainImage}>
                    <img 
                      src={project.images.main} 
                      alt={project.title}
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Screenshots Preview */}
                  <div className={styles.screenshotsPreview}>
                    {project.images.screenshots.slice(0, 3).map((screenshot, index) => (
                      <div key={index} className={styles.screenshotThumb}>
                        <img src={screenshot} alt={`${project.title} screenshot ${index + 1}`} />
                      </div>
                    ))}
                    {project.images.screenshots.length > 3 && (
                      <div className={styles.moreScreenshots}>
                        +{project.images.screenshots.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Overlay with Actions */}
                  <div className={styles.imageOverlay}>
                    <div className={styles.overlayContent}>
                      <button
                        className={styles.primaryAction}
                        onClick={() => handleProjectView(project)}
                      >
                        <FaEye />
                        View Project
                      </button>
                      
                      <div className={styles.secondaryActions}>
                        {project.url && project.status === 'Live' && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.liveLink}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaExternalLinkAlt />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className={styles.githubLink}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaGithub />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Card Content */}
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div className={styles.titleSection}>
                      <h3 className={styles.projectTitle}>{project.title}</h3>
                      <span className={styles.projectSubtitle}>{project.subtitle}</span>
                    </div>
                    {renderStatusBadge(project.status)}
                  </div>

                  <p className={styles.projectDescription}>
                    {project.description}
                  </p>

                  {/* Technology Stack */}
                  <div className={styles.techStack}>
                    {project.technologies.slice(0, 4).map((tech, index) => (
                      <span key={index} className={styles.techTag}>
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className={styles.techMore}>
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Performance Metrics */}
                  <div className={styles.metricsBar}>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Speed</span>
                      <span className={styles.metricValue}>{project.metrics.loadTime}</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Score</span>
                      <span className={styles.metricValue}>{project.metrics.lighthouse}</span>
                    </div>
                    <div className={styles.metricDivider} />
                    <div className={styles.yearBadge}>{project.year}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Enhanced Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default DevProject;
