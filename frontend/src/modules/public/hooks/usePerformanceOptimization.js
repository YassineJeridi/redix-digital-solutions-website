// src/hooks/usePerformanceOptimization.js
import { useEffect, useState } from 'react';

export const usePerformanceOptimization = () => {
    const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false);
    const [deviceCapability, setDeviceCapability] = useState('high');

    useEffect(() => {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Simple performance test
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        // Device capability detection
        const isLowEnd = navigator.hardwareConcurrency <= 2 ||
            window.innerWidth <= 768 ||
            !gl;

        if (prefersReducedMotion || isLowEnd) {
            setShouldReduceAnimations(true);
            setDeviceCapability('low');
        } else if (navigator.hardwareConcurrency >= 8 && window.innerWidth >= 1920) {
            setDeviceCapability('ultra');
        } else {
            setDeviceCapability('medium');
        }
    }, []);

    return { shouldReduceAnimations, deviceCapability };
};
