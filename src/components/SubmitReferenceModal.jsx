import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send, CheckCircle2, User, Building, Linkedin, Upload, Trash2, Loader2 } from 'lucide-react';
import { submitDirectRecommendation, compressImageFile } from '../services/githubTestimonialsService';

export default function SubmitReferenceModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        company: '',
        relationship: 'Client',
        rating: 5,
        linkedin: '',
        avatar: '',
        text: '',
    });
    const [isDragging, setIsDragging] = useState(false);
    const [compressing, setCompressing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelected = async (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        try {
            setCompressing(true);
            const compressed = await compressImageFile(file);
            setFormData((prev) => ({ ...prev, avatar: compressed }));
        } catch (err) {
            console.error('Image compression failed:', err);
        } finally {
            setCompressing(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelected(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.text) return;

        try {
            setIsSubmitting(true);
            await submitDirectRecommendation(formData);
            setSubmitted(true);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setSubmitted(false);
        setFormData({
            name: '',
            role: '',
            company: '',
            relationship: 'Client',
            rating: 5,
            linkedin: '',
            avatar: '',
            text: '',
        });
        onClose();
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div onClick={onClose} className="fixed inset-0 z-[99990] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 w-full max-w-2xl max-h-[85vh] bg-panel border-2 border-ink rounded-none shadow-[8px_8px_0_rgba(13,13,13,0.3)] p-5 md:p-7 text-ink flex flex-col overflow-hidden my-auto"
                    >
                        {/* Header (Fixed at Top) */}
                        <div className="flex items-center justify-between pb-4 border-b-2 border-ink mb-4 flex-shrink-0">
                            <div>
                                <span className="text-[10px] font-mono tracking-[0.22em] text-accent font-bold uppercase">
                                    DISPATCH ENDORSEMENT // LETTERS DESK
                                </span>
                                <h3 className="text-xl md:text-2xl font-display font-bold text-ink mt-0.5">
                                    Submit a Recommendation
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-none border border-ink/25 text-graphite hover:text-ink hover:border-ink transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {submitted ? (
                            <div className="text-center py-10 space-y-4 flex-1 flex flex-col justify-center items-center">
                                <div className="w-16 h-16 bg-accent/10 border-2 border-accent text-accent rounded-none flex items-center justify-center mb-2">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h4 className="text-xl font-display font-bold text-ink">Endorsement Filed!</h4>
                                <p className="text-sm font-serif text-graphite max-w-md mx-auto leading-relaxed">
                                    Thank you for your endorsement. Your recommendation has been recorded and published to the portfolio ledger.
                                </p>
                                <button
                                    onClick={handleReset}
                                    className="mt-6 px-6 py-2.5 bg-ink hover:bg-accent text-void font-mono font-bold text-xs tracking-widest uppercase rounded-none transition-all cursor-pointer"
                                >
                                    Done &amp; Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                                {/* Scrollable Form Body */}
                                <div className="space-y-4 flex-1 overflow-y-auto pr-2 pb-2">
                                    {/* Photo Upload Dropzone */}
                                    <div>
                                        <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-graphite mb-1">
                                            Profile Portrait / Avatar
                                        </label>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => e.target.files && handleFileSelected(e.target.files[0])}
                                        />

                                        {formData.avatar ? (
                                            <div className="flex items-center justify-between p-2.5 bg-panel-deep border border-ink/20 rounded-none">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={formData.avatar}
                                                        alt="Avatar preview"
                                                        className="w-10 h-10 rounded-none object-cover border border-accent"
                                                    />
                                                    <div>
                                                        <p className="text-xs font-mono font-bold text-ink">Portrait Ready</p>
                                                        <p className="text-[10px] font-mono text-graphite">Compressed specimen preview</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, avatar: '' })}
                                                    className="p-1.5 text-graphite hover:text-accent transition-colors cursor-pointer"
                                                    title="Remove photo"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onDrop={handleDrop}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`w-full py-4 px-4 border border-dashed rounded-none flex flex-col items-center justify-center cursor-pointer transition-all ${
                                                    isDragging
                                                        ? 'border-accent bg-accent/10'
                                                        : 'border-ink/30 bg-panel-deep/50 hover:border-accent'
                                                }`}
                                            >
                                                {compressing ? (
                                                    <div className="flex items-center gap-2 text-xs font-mono text-accent">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Processing image...
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className="w-5 h-5 text-graphite mb-1" />
                                                        <p className="text-xs font-mono text-ink">
                                                            Drag &amp; drop photo here, or <span className="text-accent font-bold underline">browse</span>
                                                        </p>
                                                        <p className="text-[10px] font-mono text-graphite mt-0.5">Supports PNG, JPG, WebP</p>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-graphite mb-1">
                                                Your Full Name <span className="text-accent">*</span>
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="e.g. Sarah Jenkins"
                                                    className="w-full pl-9 pr-3 py-2.5 bg-panel-deep border border-ink/25 rounded-none text-xs font-mono text-ink placeholder-graphite/60 focus:outline-none focus:border-accent transition-colors"
                                                />
                                            </div>
                                        </div>

                                        {/* Role & Company */}
                                        <div>
                                            <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-graphite mb-1">
                                                Role / Organization
                                            </label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite" />
                                                <input
                                                    type="text"
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                    placeholder="e.g. Principal Engineer @ Acme"
                                                    className="w-full pl-9 pr-3 py-2.5 bg-panel-deep border border-ink/25 rounded-none text-xs font-mono text-ink placeholder-graphite/60 focus:outline-none focus:border-accent transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Relationship */}
                                        <div>
                                            <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-graphite mb-1">
                                                Working Relationship
                                            </label>
                                            <select
                                                value={formData.relationship}
                                                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                                                className="w-full px-3 py-2.5 bg-panel-deep border border-ink/25 rounded-none text-xs font-mono text-ink focus:outline-none focus:border-accent transition-colors"
                                            >
                                                <option value="Client">Client</option>
                                                <option value="Manager / Supervisor">Manager / Supervisor</option>
                                                <option value="Colleague / Teammate">Colleague / Teammate</option>
                                                <option value="Mentor / Industry Peer">Mentor / Industry Peer</option>
                                            </select>
                                        </div>

                                        {/* Star Rating */}
                                        <div>
                                            <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-graphite mb-1">
                                                Rating
                                            </label>
                                            <div className="flex items-center gap-1.5 py-1.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, rating: star })}
                                                        className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                                                    >
                                                        <Star
                                                            className={`w-5 h-5 ${
                                                                star <= formData.rating
                                                                    ? 'fill-accent text-accent'
                                                                    : 'text-ink/25'
                                                            }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* LinkedIn */}
                                    <div>
                                        <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-graphite mb-1">
                                            LinkedIn Profile URL (Optional)
                                        </label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite" />
                                            <input
                                                type="url"
                                                value={formData.linkedin}
                                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                                placeholder="https://linkedin.com/in/..."
                                                className="w-full pl-9 pr-3 py-2.5 bg-panel-deep border border-ink/25 rounded-none text-xs font-mono text-ink placeholder-graphite/60 focus:outline-none focus:border-accent transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Recommendation Text */}
                                    <div>
                                        <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-graphite mb-1">
                                            Your Endorsement / Letter <span className="text-accent">*</span>
                                        </label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={formData.text}
                                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                            placeholder="Write your reference, experience working together, or technical feedback..."
                                            className="w-full px-3 py-2.5 bg-panel-deep border border-ink/25 rounded-none text-xs font-mono text-ink placeholder-graphite/60 focus:outline-none focus:border-accent transition-colors resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Submit Footer */}
                                <div className="pt-3 border-t border-ink/20 flex items-center justify-between flex-shrink-0 mt-auto bg-panel">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-graphite">
                                        Direct Ledger Dispatch
                                    </span>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 bg-ink hover:bg-accent text-void font-mono font-bold text-xs uppercase tracking-widest rounded-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-3.5 h-3.5" />
                                        )}
                                        {isSubmitting ? 'Transmitting...' : 'Publish Endorsement'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}

