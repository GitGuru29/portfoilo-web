import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function StoryProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <motion.div
            aria-hidden
            className="story-progress"
            style={{ scaleX }}
        />
    );
}