import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
    {
        title: 'AeroLang Compiler',
        description: 'A custom programming language and compiler built from scratch, targeting Android development with seamless JNI bridge integration.',
        tech: ['Java', 'C++', 'JNI', 'Android Base'],
        link: '#',
        github: '#'
    },
    {
        title: 'InkFlow Platform',
        description: 'Production-ready content platform featuring robust authentication, rich text editing, and an optimized PostgreSQL database layer.',
        tech: ['Next.js', 'Prisma', 'Auth.js', 'Tailwind'],
        link: '#',
        github: '#'
    },
    {
        title: 'Crypto Intel Engine',
        description: 'AI-powered market analysis engine analyzing real-time data to generate technical indicators and trade setups.',
        tech: ['Python', 'CCXT', 'SQLite', 'Telegram API'],
        link: '#',
        github: '#'
    }
];

export default function Projects() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <section ref={containerRef} className="py-32 px-6 relative bg-black">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold mb-20 text-center"
                >
                    Featured <span className="text-purple-500">Projects</span>
                </motion.h2>

                <div className="flex flex-col gap-24">
                    {projects.map((project, i) => {
                        const isEven = i % 2 === 0;
                        return (
                            <ProjectCard
                                key={project.title}
                                project={project}
                                index={i}
                                isEven={isEven}
                                progress={scrollYProgress}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ProjectCard({ project, index, isEven, progress }) {
    // Staggered parallax based on index
    const y = useTransform(progress, [0, 1], [100 * (index + 1), -100 * (index + 1)]);

    return (
        <motion.div
            style={{ y }}
            className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
        >
            <div className="w-full lg:w-1/2 group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative aspect-video rounded-2xl glass overflow-hidden flex items-center justify-center p-8 bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                    {/* Abstract visualizer since we don't have images */}
                    <div className={`w-32 h-32 rounded-full blur-3xl ${isEven ? 'bg-purple-500/50' : 'bg-blue-500/50'}`} />
                    <h3 className="absolute text-2xl font-bold text-white/50 tracking-widest uppercase">{project.title.split(' ')[0]}</h3>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <h3 className="text-3xl font-bold">{project.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-3 mt-2">
                    {project.tech.map(tech => (
                        <span key={tech} className="px-4 py-1.5 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-gray-300">
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-4 mt-4">
                    <a href={project.github} className="flex items-center gap-2 hover:text-white text-gray-400 transition-colors">
                        <Github className="w-5 h-5" /> Code
                    </a>
                    <a href={project.link} className="flex items-center gap-2 hover:text-blue-400 text-blue-500 transition-colors">
                        <ExternalLink className="w-5 h-5" /> Live Demo
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
