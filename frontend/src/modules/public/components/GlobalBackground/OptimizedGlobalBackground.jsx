// src/components/GlobalBackground/OptimizedGlobalBackground.jsx
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';
import styles from './GlobalBackground.module.css';

const OptimizedGlobalBackground = ({ children }) => {
    const { shouldReduceAnimations, deviceCapability } = usePerformanceOptimization();
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

    // Adjust animation complexity based on device capability
    const animationConfig = useMemo(() => {
        switch (deviceCapability) {
            case 'ultra':
                return { orbs: 15, particles: 60, gridDots: 400, shapes: 8 };
            case 'high':
                return { orbs: 12, particles: 40, gridDots: 300, shapes: 6 };
            case 'medium':
                return { orbs: 8, particles: 25, gridDots: 200, shapes: 4 };
            case 'low':
                return { orbs: 4, particles: 10, gridDots: 100, shapes: 2 };
            default:
                return { orbs: 8, particles: 25, gridDots: 200, shapes: 4 };
        }
    }, [deviceCapability]);

    useEffect(() => {
        if (shouldReduceAnimations) return;

        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [shouldReduceAnimations]);

    if (shouldReduceAnimations) {
        return (
            <div className={styles.globalBackground}>
                <div className={styles.staticBackground} />
                <div className={styles.content}>{children}</div>
            </div>
        );
    }

    return (
        <div className={styles.globalBackground}>
            <div className={styles.backgroundLayers}>

                {/* Optimized Orbs Layer */}
                <div className={styles.orbsLayer}>
                    {[...Array(animationConfig.orbs)].map((_, i) => (
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
                </div>

                {/* Interactive Mouse Follower */}
                {deviceCapability !== 'low' && (
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
                )}

                {/* Other optimized layers... */}

            </div>

            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default OptimizedGlobalBackground;
