// src/components/GlobalBackground/GlobalBackground.jsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import styles from './GlobalBackground.module.css';

const GlobalBackground = ({ children }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [documentHeight, setDocumentHeight] = useState(0);
    const containerRef = useRef(null);

    const { scrollY } = useScroll();

    // Parallax transforms for different layers
    const orbsY = useTransform(scrollY, [0, 1000], [0, -200]);
    const shapesY = useTransform(scrollY, [0, 1000], [0, -150]);
    const particlesY = useTransform(scrollY, [0, 1000], [0, -100]);
    const wavesY = useTransform(scrollY, [0, 1000], [0, -300]);
    const ringsRotation = useTransform(scrollY, [0, 1000], [0, 360]);

    useEffect(() => {
        // Calculate document height for background container
        const updateHeight = () => {
            const height = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
                document.documentElement.clientHeight
            );
            setDocumentHeight(height);
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        window.addEventListener('load', updateHeight);

        // Update on content changes
        const observer = new MutationObserver(updateHeight);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        return () => {
            window.removeEventListener('resize', updateHeight);
            window.removeEventListener('load', updateHeight);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className={styles.globalBackground} ref={containerRef}>
            {/* Scrollable Background Layers */}
            <div
                className={styles.backgroundLayers}
                style={{ height: `${documentHeight}px` }}
            >

                {/* Layer 1: Floating Orbs with Parallax */}
                <motion.div
                    className={styles.orbsLayer}
                    style={{ y: orbsY }}
                >
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={`orb-${i}`}
                            className={`${styles.floatingOrb} ${styles[`orb${i + 1}`]}`}
                            animate={{
                                y: [-50, 50, -50],
                                x: [-30, 30, -30],
                                scale: [0.8, 1.4, 0.8],
                                opacity: [0.2, 0.6, 0.2],
                            }}
                            transition={{
                                duration: 8 + (i * 0.5),
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.3
                            }}
                        />
                    ))}
                </motion.div>

                {/* Layer 2: Geometric Shapes with Parallax */}
                <motion.div
                    className={styles.shapesLayer}
                    style={{ y: shapesY }}
                >
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={`shape-${i}`}
                            className={`${styles.geometricShape} ${styles[`shape${i + 1}`]}`}
                            animate={{
                                rotate: [0, 360],
                                scale: [0.5, 1.2, 0.5],
                                opacity: [0.1, 0.4, 0.1]
                            }}
                            transition={{
                                duration: 12 + (i * 2),
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 1.5
                            }}
                        />
                    ))}
                </motion.div>

                {/* Layer 3: Scrolling Particles */}
                <motion.div
                    className={styles.particlesLayer}
                    style={{ y: particlesY }}
                >
                    {[...Array(60)].map((_, i) => (
                        <motion.div
                            key={`particle-${i}`}
                            className={styles.particle}
                            animate={{
                                y: [-100, window.innerHeight + 100],
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0]
                            }}
                            transition={{
                                duration: 10 + Math.random() * 5,
                                repeat: Infinity,
                                delay: Math.random() * 10,
                                ease: "linear"
                            }}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`
                            }}
                        />
                    ))}
                </motion.div>

                {/* Layer 4: Interactive Mouse Follower */}
                <motion.div
                    className={styles.mouseFollower}
                    animate={{
                        x: `${mousePosition.x}%`,
                        y: `${mousePosition.y}%`
                    }}
                    transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 200
                    }}
                />

                {/* Layer 5: Scrolling Animated Grid */}
                <div className={styles.gridLayer}>
                    <div className={styles.animatedGrid}>
                        {[...Array(200)].map((_, i) => (
                            <motion.div
                                key={`grid-${i}`}
                                className={styles.gridDot}
                                animate={{
                                    opacity: [0, 0.8, 0],
                                    scale: [0.5, 1.2, 0.5]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    delay: Math.random() * 4,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    top: `${(i % 20) * 5}%`,
                                    left: `${Math.floor(i / 20) * 10}%`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Layer 6: Flowing Waves with Parallax */}
                <motion.div
                    className={styles.wavesLayer}
                    style={{ y: wavesY }}
                >
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={`wave-${i}`}
                            className={`${styles.wave} ${styles[`wave${i + 1}`]}`}
                            animate={{
                                x: [-200, window.innerWidth + 200],
                                opacity: [0, 0.3, 0]
                            }}
                            transition={{
                                duration: 15 + (i * 3),
                                repeat: Infinity,
                                delay: i * 4,
                                ease: "linear"
                            }}
                            style={{
                                top: `${20 + (i * 25)}%`
                            }}
                        />
                    ))}
                </motion.div>

                {/* Layer 7: Rotating Rings with Scroll Rotation */}
                <motion.div
                    className={styles.ringsLayer}
                    style={{ rotate: ringsRotation }}
                >
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={`ring-${i}`}
                            className={`${styles.rotatingRing} ${styles[`ring${i + 1}`]}`}
                            animate={{
                                rotate: i % 2 === 0 ? [0, 360] : [360, 0]
                            }}
                            transition={{
                                duration: 20 + (i * 5),
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    ))}
                </motion.div>

                {/* Layer 8: Constellation Effect with Scroll */}
                <div className={styles.constellationLayer}>
                    {[...Array(50)].map((_, i) => (
                        <motion.div
                            key={`star-${i}`}
                            className={styles.star}
                            animate={{
                                opacity: [0.2, 1, 0.2],
                                scale: [0.8, 1.2, 0.8]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 3
                            }}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`
                            }}
                        />
                    ))}
                </div>

                {/* Layer 9: Scroll-Based Dynamic Elements */}
                <motion.div className={styles.scrollElements}>
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={`scroll-elem-${i}`}
                            className={styles.scrollElement}
                            style={{
                                y: useTransform(scrollY, [0, 2000], [0, -400 - (i * 50)]),
                                opacity: useTransform(scrollY, [i * 200, (i + 1) * 200], [0, 1])
                            }}
                        />
                    ))}
                </motion.div>

            </div>

            {/* Content Wrapper */}
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default GlobalBackground;
