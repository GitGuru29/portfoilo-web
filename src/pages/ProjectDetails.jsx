import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { projectsData } from '../data/projects';
import useStore, { MOODS } from '../store/useStore';

export default function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const setMood = useStore((state) => state.setMood);
    const [activePlatform, setActivePlatform] = useState('linux');

    // Find the current project based on the URL parameter
    const project = projectsData.find(p => p.id === id);

    // Determine what to show based on multi-platform data
    const hasPlatforms = project && (project.linuxReport || project.androidReport);
    const activeReport = hasPlatforms
        ? (activePlatform === 'linux' ? project.linuxReport : project.androidReport)
        : project.report;
    const activeImages = hasPlatforms
        ? (activePlatform === 'linux' ? project.linuxImages : project.androidImages)
        : project.images;

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
                <span className="text-sm font-space tracking-widest text-cyber-cyan mb-6 uppercase flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_10px_#00f3ff]" />
                    {project.role}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl pb-2 font-orbitron font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyber-violet tracking-tight drop-shadow-[0_0_10px_rgba(181,55,242,0.3)]">
                    {project.title}
                </h1>

                {/* Platform Toggle (if applicable) */}
                {hasPlatforms && (
                    <div className="flex items-center gap-2 mb-12 p-1.5 bg-cyber-dark/80 border border-white/10 rounded-full w-max backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        <button
                            onClick={() => setActivePlatform('linux')}
                            className={`px-8 py-3 rounded-full font-space font-medium transition-all ${activePlatform === 'linux'
                                ? 'bg-cyber-violet/20 border border-cyber-violet/50 text-white shadow-[0_0_15px_rgba(181,55,242,0.4)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            Linux System
                        </button>
                        <button
                            onClick={() => setActivePlatform('android')}
                            className={`px-8 py-3 rounded-full font-space font-medium transition-all ${activePlatform === 'android'
                                ? 'bg-cyber-cyan/20 border border-cyber-cyan/50 text-white shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            Android Client
                        </button>
                    </div>
                )}
                {/* Project Description or Report Array */}
                {activeReport ? (
                    <div className="flex flex-col gap-8 md:gap-12 mt-12 max-w-4xl">
                        {activeReport.map((section, idx) => (
                            <div key={idx} className="bg-cyber-dark/60 border border-white/5 rounded-3xl p-8 md:p-10 backdrop-blur-xl transition-all hover:bg-cyber-dark hover:border-cyber-violet/30 hover:shadow-[0_0_20px_rgba(181,55,242,0.15)] group">
                                <h3 className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="text-cyber-cyan group-hover:text-cyber-violet transition-colors duration-300">/</span> {section.title}
                                </h3>

                                {section.type === 'text' && (
                                    <p className="text-base md:text-lg text-gray-300 font-inter font-light leading-relaxed whitespace-pre-line">
                                        {section.content}
                                    </p>
                                )}

                                {section.type === 'code' && (
                                    <div className="bg-[#050505] rounded-xl p-6 md:p-8 border border-cyber-cyan/20 overflow-x-auto custom-scrollbar shadow-[inset_0_0_20px_rgba(0,243,255,0.05)] mt-4">
                                        <pre className="text-sm md:text-base text-cyber-cyan font-mono whitespace-pre leading-relaxed">
                                            {section.content}
                                        </pre>
                                    </div>
                                )}

                                {section.type === 'list' && (
                                    <ul className="flex flex-col gap-4">
                                        {section.content.map((item, i) => (
                                            <li key={i} className="flex items-start gap-4 text-base md:text-lg text-gray-300 font-inter font-light leading-relaxed">
                                                <div className="mt-2 min-w-[8px] h-2 rounded-full bg-cyber-pink shadow-[0_0_8px_rgba(255,0,255,0.6)]" />
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
            {activeImages?.length > 0 && (
                <div className="flex flex-col w-full mt-24 mb-32 relative">
                    {activeImages.map((img, i) => (
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
