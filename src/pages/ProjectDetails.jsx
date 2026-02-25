import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
            setMood(project.mood);
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
                <span className="text-sm font-mono tracking-widest text-[#a855f7] mb-6 uppercase flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#a855f7] animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                    {project.role}
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-white tracking-tight">
                    {project.title}
                </h1>
                {/* Project Description or Report Array */}
                {project.report ? (
                    <div className="flex flex-col gap-8 md:gap-12 mt-12 max-w-4xl">
                        {project.report.map((section, idx) => (
                            <div key={idx} className="bg-black/40 border border-white/5 rounded-3xl p-8 md:p-10 backdrop-blur-md transition-all hover:bg-black/60 hover:border-white/10">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="text-[#a855f7]">/</span> {section.title}
                                </h3>

                                {section.type === 'text' && (
                                    <p className="text-base md:text-lg text-gray-400 font-light leading-relaxed whitespace-pre-line">
                                        {section.content}
                                    </p>
                                )}

                                {section.type === 'code' && (
                                    <div className="bg-[#050505] rounded-xl p-6 md:p-8 border border-white/5 overflow-x-auto custom-scrollbar shadow-inner mt-4">
                                        <pre className="text-sm md:text-base text-[#a855f7] font-mono whitespace-pre leading-relaxed">
                                            {section.content}
                                        </pre>
                                    </div>
                                )}

                                {section.type === 'list' && (
                                    <ul className="flex flex-col gap-4">
                                        {section.content.map((item, i) => (
                                            <li key={i} className="flex items-start gap-4 text-base md:text-lg text-gray-400 font-light leading-relaxed">
                                                <div className="mt-2 min-w-[8px] h-2 rounded-full bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-base md:text-lg lg:text-xl text-gray-400 font-light leading-relaxed max-w-4xl whitespace-pre-line">
                        {project.longDescription || project.description}
                    </p>
                )}
            </div>

            {/* Immersive Full-Screen Image Gallery - Stacked Cards Effect */}
            {project.images && project.images.length > 0 && (
                <div className="flex flex-col w-full mt-24 mb-32 relative">
                    {project.images.map((img, i) => (
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
                                    className="w-full h-full object-contain md:object-cover md:hover:object-contain transition-all duration-700 rounded-xl"
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
