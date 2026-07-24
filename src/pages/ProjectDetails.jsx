import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { projectsData } from '../data/projects';
import useStore, { MOODS } from '../store/useStore';
import Footer from '../components/Footer';

export default function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const setMood = useStore((state) => state.setMood);

    // Find the current project based on the URL parameter
    const project = projectsData.find(p => p.id === id);

    useEffect(() => {
        // Scroll to top when loading the new page
        window.scrollTo(0, 0);

        // Update the 3D background mood
        if (project) {
            setMood(project.mood || MOODS.OWL_MODE);
        } else {
            setMood(MOODS.OWL_MODE);
        }
    }, [project, setMood]);

    // If a user manually types a bad URL, show a 404 or redirect
    if (!project) {
        return (
            <div className="relative z-10 w-full min-h-screen flex items-center justify-center flex-col gap-6">
                <h1 className="text-4xl text-[var(--color-geyser)] font-space font-light">Project Not Found</h1>
                <button
                    onClick={() => navigate('/')}
                    className="text-[var(--color-geyser)]/60 hover:text-[var(--color-geyser)] transition-colors flex items-center gap-2 font-space text-sm tracking-widest uppercase"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Home
                </button>
            </div>
        );
    }

    const allImages = [...(project.images || []), ...(project.linuxImages || []), ...(project.androidImages || [])];

    return (
        <div className="relative z-10 w-full min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24">
            {/* Back Button */}
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-[var(--color-geyser)]/60 hover:text-[var(--color-geyser)] mb-12 transition-colors group font-space text-xs tracking-widest uppercase"
            >
                <div className="p-2 rounded-full border border-[var(--color-geyser)]/10 group-hover:border-[var(--color-geyser)]/30 group-hover:bg-[var(--color-geyser)]/5 transition-all">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
                Return to Portfolio
            </Link>

            {/* Project Header Info */}
            <div className="max-w-4xl mb-16">
                <span className="text-[10px] md:text-xs font-space tracking-[0.3em] text-[var(--color-geyser)]/50 mb-6 uppercase flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-geyser)] animate-pulse" />
                    {project.role}
                </span>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl pb-2 font-space font-light text-[var(--color-geyser)] tracking-tight">
                        {project.title}
                    </h1>
                    
                    {project.link && (
                        <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--color-geyser)]/20 hover:bg-[var(--color-geyser)]/5 hover:border-[var(--color-geyser)]/40 text-[var(--color-geyser)] transition-all font-space text-[10px] md:text-xs tracking-widest uppercase flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Visit Website
                        </a>
                    )}
                </div>

                {/* Project Description or Markdown Content */}
                {project.content ? (
                    <div className="mt-12 bg-transparent border-t border-[var(--color-geyser)]/10 pt-8 transition-all">
                        <article className="prose prose-lg max-w-none prose-headings:font-space prose-headings:font-light prose-headings:text-[var(--color-geyser)] prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-[var(--color-geyser)]/70 prose-p:font-inter prose-a:text-[var(--color-geyser)] hover:prose-a:opacity-70 prose-pre:bg-[var(--color-quantum-black)] prose-pre:border prose-pre:border-[var(--color-geyser)]/10 prose-code:text-[var(--color-geyser)]">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {project.content}
                            </ReactMarkdown>
                        </article>
                    </div>
                ) : (
                    <p className="text-base md:text-lg lg:text-xl text-[var(--color-geyser)]/60 font-inter font-light leading-relaxed max-w-4xl whitespace-pre-line mt-8 border-t border-[var(--color-geyser)]/10 pt-8">
                        {project.description}
                    </p>
                )}
            </div>

            {/* Immersive Full-Screen Image Gallery - Stacked Cards Effect */}
            {allImages.length > 0 && (
                <div className="flex flex-col w-full mt-24 mb-32 relative">
                    {allImages.map((img, i) => (
                        <div
                            key={i}
                            className="sticky w-full h-[70vh] md:h-[85vh] flex items-center justify-center mb-16 md:mb-32 last:mb-0"
                            style={{
                                top: `calc(6rem + ${i * 1.5}rem)`, // Offset each card progressively lower down
                                zIndex: i + 10,
                            }}
                        >
                            <div className="w-full h-full border border-[var(--color-geyser)]/10 bg-[var(--color-quantum-black)] flex items-center justify-center p-4 md:p-12 transition-transform duration-500 will-change-transform shadow-2xl shadow-black/5">
                                <img
                                    src={img}
                                    alt={`${project.title} detailed screenshot ${i + 1}`}
                                    className="max-w-full max-h-full object-scale-down transition-transform duration-700 hover:scale-[1.02]"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom Back Button */}
            <div className="mt-32 border-t border-[var(--color-geyser)]/10 pt-12 mb-16 flex justify-center">
                <Link
                    to="/"
                    className="inline-flex items-center gap-3 px-8 py-4 border border-[var(--color-geyser)]/20 hover:bg-[var(--color-geyser)] hover:text-[var(--color-quantum-black)] text-[var(--color-geyser)] transition-all font-space text-xs tracking-widest uppercase"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Timeline
                </Link>
            </div>

            {/* Global Footer */}
            <Footer />
        </div>
    );
}
