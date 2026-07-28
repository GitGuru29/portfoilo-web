import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Check, Trash2, Key, Star, Clock, AlertCircle } from 'lucide-react';
import { fetchPendingTestimonials, fetchApprovedTestimonials, approveTestimonial, deleteTestimonial } from '../services/githubTestimonialsService';

const ADMIN_SECRET_PIN = 'msfvenom';

export default function AdminModerationModal({ isOpen, onClose, onRefreshPublic }) {
    const [pin, setPin] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState('');
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved'
    const [pendingList, setPendingList] = useState([]);
    const [approvedList, setApprovedList] = useState([]);

    const loadAdminData = async () => {
        const pending = fetchPendingTestimonials();
        setPendingList(pending);

        const approved = await fetchApprovedTestimonials();
        setApprovedList(approved);
    };

    useEffect(() => {
        if (isOpen && isAuthenticated) {
            loadAdminData();
        }
    }, [isOpen, isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (pin.trim() === ADMIN_SECRET_PIN) {
            setIsAuthenticated(true);
            setAuthError('');
            loadAdminData();
        } else {
            setAuthError('Invalid Admin Key. Access Denied.');
        }
    };

    const handleApprove = (id) => {
        approveTestimonial(id);
        loadAdminData();
        if (onRefreshPublic) onRefreshPublic();
    };

    const handleDelete = (id) => {
        deleteTestimonial(id);
        loadAdminData();
        if (onRefreshPublic) onRefreshPublic();
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPin('');
        setAuthError('');
        onClose();
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div onClick={onClose} className="fixed inset-0 z-[99990] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 w-full max-w-3xl max-h-[85vh] bg-neutral-950 border border-white/15 rounded-2xl shadow-2xl p-6 md:p-8 text-white flex flex-col overflow-hidden my-auto"
                    >
                        {/* Background Accent Glow */}
                        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] rounded-xl">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-mono tracking-widest text-[#D4AF37] uppercase">System Moderation</span>
                                    <h3 className="text-xl md:text-2xl font-space font-bold text-white mt-0.5">Admin Control Panel</h3>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {!isAuthenticated ? (
                            /* Login Form */
                            <form onSubmit={handleLogin} className="py-12 px-4 max-w-sm mx-auto w-full text-center space-y-5">
                                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-[#D4AF37]">
                                    <Key className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-space font-bold text-white">Enter Admin Key</h4>
                                    <p className="text-xs text-neutral-400 mt-1">Authenticate to moderate client recommendations</p>
                                </div>

                                <div>
                                    <input
                                        type="password"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        placeholder="Admin Secret Key..."
                                        autoFocus
                                        className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-center text-lg font-mono tracking-widest text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    />
                                    {authError && (
                                        <p className="text-xs text-red-400 mt-2 flex items-center justify-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {authError}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-[#D4AF37] hover:bg-[#b8952b] text-neutral-950 font-space font-bold rounded-xl transition-all shadow-lg"
                                >
                                    Unlock Admin Panel
                                </button>
                            </form>
                        ) : (
                            /* Authenticated Admin Dashboard */
                            <div className="flex flex-col flex-1 min-h-0">
                                {/* Navigation Tabs */}
                                <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-4 flex-shrink-0">
                                    <button
                                        onClick={() => setActiveTab('pending')}
                                        className={`px-4 py-2 rounded-xl text-xs font-space font-semibold transition-all flex items-center gap-2 ${
                                            activeTab === 'pending'
                                                ? 'bg-[#D4AF37] text-neutral-950 shadow-md'
                                                : 'bg-white/5 text-neutral-400 hover:text-white'
                                        }`}
                                    >
                                        <Clock className="w-3.5 h-3.5" />
                                        Pending Review ({pendingList.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('approved')}
                                        className={`px-4 py-2 rounded-xl text-xs font-space font-semibold transition-all flex items-center gap-2 ${
                                            activeTab === 'approved'
                                                ? 'bg-[#D4AF37] text-neutral-950 shadow-md'
                                                : 'bg-white/5 text-neutral-400 hover:text-white'
                                        }`}
                                    >
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Published Live ({approvedList.length})
                                    </button>
                                </div>

                                {/* Content Body */}
                                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                                    {activeTab === 'pending' ? (
                                        pendingList.length === 0 ? (
                                            <div className="py-16 text-center text-neutral-500 font-mono text-sm">
                                                No pending submissions. All clear!
                                            </div>
                                        ) : (
                                            pendingList.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <img
                                                            src={item.avatar}
                                                            alt={item.name}
                                                            className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/40 flex-shrink-0"
                                                        />
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h5 className="font-space font-bold text-white text-sm">{item.name}</h5>
                                                                <span className="text-[10px] font-mono px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-md uppercase">
                                                                    Pending
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-neutral-400 font-mono mt-0.5">
                                                                {item.role} {item.company ? `@ ${item.company}` : ''} • {item.relationship}
                                                            </p>
                                                            <p className="text-xs text-neutral-200 mt-2 italic">"{item.text}"</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        <button
                                                            onClick={() => handleApprove(item.id)}
                                                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-space font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors shadow-md"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                            Approve Live
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-space font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            Reject / Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )
                                    ) : (
                                        approvedList.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <img
                                                        src={item.avatar}
                                                        alt={item.name}
                                                        className="w-10 h-10 rounded-full object-cover border border-emerald-500/40 flex-shrink-0"
                                                    />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h5 className="font-space font-bold text-white text-sm">{item.name}</h5>
                                                            <div className="flex items-center text-[#D4AF37]">
                                                                <Star className="w-3 h-3 fill-[#D4AF37]" />
                                                                <span className="text-xs font-mono ml-1">{item.rating}</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-neutral-400 font-mono mt-0.5">
                                                            {item.role} {item.company ? `@ ${item.company}` : ''}
                                                        </p>
                                                        <p className="text-xs text-neutral-300 mt-1 italic">"{item.text}"</p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-space font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors flex-shrink-0"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Delete
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="pt-3 border-t border-white/10 flex items-center justify-between flex-shrink-0 mt-auto bg-neutral-950">
                                    <span className="text-xs text-neutral-500 font-mono">
                                        Admin Key: <code className="text-[#D4AF37]">msfvenom</code>
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-space font-semibold text-xs rounded-lg transition-colors"
                                    >
                                        Lock & Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
