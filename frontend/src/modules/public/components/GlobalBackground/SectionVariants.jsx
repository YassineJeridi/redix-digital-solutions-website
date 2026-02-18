// src/components/GlobalBackground/SectionVariants.jsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const useSectionBackground = () => {
    const [currentSection, setCurrentSection] = useState('banner');

    useEffect(() => {
        const sections = document.querySelectorAll('section[id]');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        setCurrentSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return currentSection;
};

// Background variants for different sections
export const backgroundVariants = {
    banner: {
        orbs: { intensity: 0.6, speed: 1, blur: 60 },
        particles: { density: 0.8, speed: 1.2 },
        colors: ['#c12de0', '#e856ff', '#8b5cf6']
    },
    services: {
        orbs: { intensity: 0.4, speed: 0.8, blur: 40 },
        particles: { density: 0.6, speed: 1 },
        colors: ['#06ffa5', '#4facfe', '#43e97b']
    },
    portfolio: {
        orbs: { intensity: 0.8, speed: 1.5, blur: 80 },
        particles: { density: 1, speed: 1.5 },
        colors: ['#ff6b9d', '#fa709a', '#f093fb']
    },
    testimonials: {
        orbs: { intensity: 0.3, speed: 0.6, blur: 50 },
        particles: { density: 0.4, speed: 0.8 },
        colors: ['#667eea', '#764ba2', '#89f7fe']
    }
};
