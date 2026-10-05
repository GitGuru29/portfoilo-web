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

        // ESC key to return home
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                navigate('/');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [project, setMood, navigate]);

    // If a user manually types a bad URL, show a 404 or redirect
    if (!project) {
        return (
            <div className="relative z-10 w-full min-h-screen flex items-center justify-center flex-col gap-6 bg-panel p-6 text-center">
                <h1 className="text-4xl text-ink font-display font-bold">Dispatch Not Found</h1>
                <p className="text-graphite font-sans text-sm max-w-md">The project article you are looking for may have been archived or moved.</p>
                <button
                    onClick={() => navigate('/')}
                    className="text-accent hover:text-accent-hot transition-colors flex items-center gap-2 font-mono text-xs tracking-widest uppercase cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" /> Return to Front Page [ESC]
                </button>
            </div>
        );
    }

    const allImages = [...(project.images || []), ...(project.linuxImages || []), ...(project.androidImages || [])];

    return (
        <div className="relative z-10 w-full min-h-screen pt-28 md:pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-void">
            {/* Back Button */}
            <Link
                to="/"
                className="inline-flex items-center gap-3 text-graphite hover:text-ink mb-10 transition-colors group font-mono text-xs tracking-widest uppercase"
            >
                <div className="p-2 border border-ink/20 group-hover:border-accent group-hover:bg-accent/10 transition-all">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-accent" />
                </div>
                <span>Return to Folio <span className="text-graphite/60 text-[10px]">[ESC]</span></span>
            </Link>

            {/* Project Header Info */}
            <div className="max-w-4xl mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 bg-accent inline-block" />
                    <span className="text-xs font-mono tracking-[0.25em] text-accent uppercase font-bold">
                        {project.role}
                    </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-ink tracking-tight leading-tight">
                        {project.title}
                    </h1>
                    
                    {project.link && (
                        <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-ink/30 bg-panel hover:bg-accent hover:text-[#fdfbf6] text-ink transition-all font-mono text-xs tracking-widest uppercase flex-shrink-0 shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Live System ↗
                        </a>
                    )}
                </div>

                {/* Project Description or Markdown Content */}
                {project.content ? (
                    <div className="mt-8 bg-panel p-6 md:p-10 border border-ink/15 shadow-[0_4px_20px_rgba(23,19,15,0.06)] transition-all">
                        <article className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-ink prose-p:text-graphite prose-p:font-sans prose-p:leading-relaxed prose-a:text-accent hover:prose-a:underline prose-pre:bg-panel-deep prose-pre:border prose-pre:border-ink/15 prose-code:text-ink font-sans">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {project.content}
                            </ReactMarkdown>
                        </article>
                    </div>
                ) : (
                    <div className="mt-6 bg-panel p-6 md:p-8 border border-ink/15 shadow-[0_4px_20px_rgba(23,19,15,0.06)]">
                        <p className="text-base md:text-lg text-graphite font-sans leading-relaxed whitespace-pre-line">
                            {project.description}
                        </p>
                    </div>
                )}
            </div>

            {/* Responsive Image Gallery */}
            {allImages.length > 0 && (
                <div className="flex flex-col w-full max-w-5xl mt-16 mb-24 space-y-12">
                    <div className="flex items-center gap-3 border-b border-ink/20 pb-3">
                        <span className="font-mono text-xs tracking-widest uppercase font-bold text-ink">System Schematics &amp; Interface Shots</span>
                        <span className="text-accent font-mono text-xs">[{allImages.length} PLATES]</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {allImages.map((img, i) => (
                            <div
                                key={i}
                                className="group border border-ink/20 bg-panel p-3 shadow-md hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-full bg-[#0d1117] flex items-center justify-center p-2 overflow-hidden border border-ink/10">
                                    <img
                                        src={img}
                                        alt={`${project.title} screenshot ${i + 1}`}
                                        className="max-w-full max-h-[420px] object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="mt-2 text-[11px] font-mono text-graphite flex items-center justify-between px-1">
                                    <span>PLATE 0{i + 1}</span>
                                    <span className="uppercase text-accent font-bold">FIG. {i + 1}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom Back Button */}
            <div className="mt-20 border-t border-ink/15 pt-10 mb-16 flex justify-center">
                <Link
                    to="/"
                    className="inline-flex items-center gap-3 px-8 py-4 border border-ink/30 bg-panel hover:bg-accent hover:text-[#fdfbf6] text-ink transition-all font-mono text-xs tracking-widest uppercase shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Return to Selected Work
                </Link>
            </div>

            {/* Global Footer */}
            <Footer />
        </div>
    );
}
