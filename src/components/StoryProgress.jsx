import React from 'react';
import { motion, useScroll } from 'framer-motion';

export default function StoryProgress() {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            aria-hidden
            className="story-progress"
            style={{ scaleX: scrollYProgress, transformOrigin: '0% 50%', willChange: 'transform' }}
        />
    );
}