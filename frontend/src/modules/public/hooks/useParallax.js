// src/hooks/useParallax.js
import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const useParallax = (offset = 100) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

    return { ref, y };
};

// Usage in components:
// const { ref, y } = useParallax(200);
// <motion.div ref={ref} style={{ y }}>Content</motion.div>
