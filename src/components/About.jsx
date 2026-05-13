import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Terminal, Code, Cpu, Database } from 'lucide-react';

const skills = [
    { name: 'React & Vite', icon: <Code className="w-6 h-6" /> },
    { name: 'Tailwind CSS', icon: <Terminal className="w-6 h-6" /> },
    { name: 'JavaScript / TS', icon: <Cpu className="w-6 h-6" /> },
    { name: 'Node.js', icon: <Database className="w-6 h-6" /> },
];

export default function About() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={ref} className="min-h-screen py-24 px-6 relative flex flex-col items-center justify-center bg-[#050505]">
            <motion.div style={{ y, opacity }} className="max-w-4xl mx-auto z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
                    About <span className="text-blue-500">Me</span>
                </h2>

                <p className="text-xl text-gray-400 font-light text-center mb-16 max-w-2xl mx-auto leading-relaxed">
                    I'm a passionate developer focused on creating interactive, aesthetic, and highly performant web applications.
                    I love blending design with engineering to build premium digital experiences.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.05 }}
                            className="glass p-6 rounded-2xl flex flex-col items-center gap-4 cursor-pointer transition-all border border-white/5 hover:border-white/20 hover:bg-white/5"
                        >
                            <div className="p-3 bg-white/5 rounded-full text-blue-400">
                                {skill.icon}
                            </div>
                            <h3 className="font-medium text-lg text-gray-200">{skill.name}</h3>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
