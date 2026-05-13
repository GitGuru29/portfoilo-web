import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { projectsData } from '../data/projects';
import useStore, { MOODS } from '../store/useStore';

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
                <h1 className="text-4xl text-white font-bold">Project Not Found</h1>
                <button
                    onClick={() => navigate('/')}
                    className="text-[#a855f7] hover:text-white transition-colors flex items-center gap-2"
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
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors group"
            >
                <div className="p-2 rounded-full border border-white/10 group-hover:border-white/30 group-hover:bg-white/5 transition-all">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </div>
                Return to Portfolio
            </Link>

            {/* Project Header Info */}
            <div className="max-w-4xl mb-16">
                <span className="text-sm font-space tracking-widest text-cyber-cyan mb-6 uppercase flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_10px_#00f3ff]" />
                    {project.role}
                </span>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl pb-2 font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyber-violet tracking-tight drop-shadow-[0_0_10px_rgba(181,55,242,0.3)]">
                        {project.title}
                    </h1>
                    
                    {project.link && (
                        <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyber-violet/10 border border-cyber-violet/40 hover:bg-cyber-violet/20 hover:border-cyber-violet hover:shadow-[0_0_20px_rgba(181,55,242,0.2)] text-cyber-violet transition-all font-space text-sm tracking-widest uppercase flex-shrink-0"
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
                    <div className="mt-12 bg-cyber-dark/60 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-xl transition-all shadow-xl">
                        <article className="prose prose-invert prose-lg max-w-none prose-headings:font-orbitron prose-headings:text-cyber-cyan prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-a:text-cyber-violet hover:prose-a:text-white prose-pre:bg-[#050505] prose-pre:border prose-pre:border-cyber-cyan/20 prose-pre:shadow-[inset_0_0_20px_rgba(0,243,255,0.05)] prose-code:text-cyber-pink">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {project.content}
                            </ReactMarkdown>
                        </article>
                    </div>
                ) : (
                    <p className="text-base md:text-lg lg:text-xl text-gray-400 font-light leading-relaxed max-w-4xl whitespace-pre-line mt-8">
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
                            <div className="w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] bg-[#050505] flex items-center justify-center p-4 md:p-12 transition-transform duration-500 will-change-transform">
                                <img
                                    src={img}
                                    alt={`${project.title} detailed screenshot ${i + 1}`}
                                    className="max-w-full max-h-full object-scale-down transition-transform duration-700 rounded-xl hover:scale-[1.02]"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom Back Button */}
            <div className="mt-32 border-t border-white/10 pt-12 flex justify-center">
                <Link
                    to="/"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-medium text-lg"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Timeline
                </Link>
            </div>
        </div>
    );
}
