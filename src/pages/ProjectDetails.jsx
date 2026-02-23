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
                <p className="text-xl md:text-3xl text-gray-400 font-light leading-relaxed max-w-3xl">
                    {project.description}
                </p>
            </div>

            {/* Immersive Full-Screen Image Gallery */}
            {project.images && project.images.length > 0 && (
                <div className="flex flex-col gap-16 md:gap-24 w-full mt-24">
                    {project.images.map((img, i) => (
                        <div
                            key={i}
                            className="w-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-black/50"
                        >
                            <img
                                src={img}
                                alt={`${project.title} detailed screenshot ${i + 1}`}
                                className="w-full h-auto object-contain"
                                loading="lazy"
                            />
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
