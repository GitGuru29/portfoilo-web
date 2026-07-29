import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Check, Trash2, Key, Star, Clock, AlertCircle, Pencil, Save, ArrowLeft, Upload, Loader2, Linkedin, User, Building, RefreshCw } from 'lucide-react';
import { fetchPendingTestimonials, fetchApprovedTestimonials, approveTestimonial, deleteTestimonial, updateTestimonial, compressImageFile } from '../services/githubTestimonialsService';

const ADMIN_SECRET_PIN = 'msfvenom';

export default function AdminModerationModal({ isOpen, onClose, onRefreshPublic }) {
    const [pin, setPin] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState('');
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved'
    const [pendingList, setPendingList] = useState([]);
    const [approvedList, setApprovedList] = useState([]);

    // Edit state
    const [editingItem, setEditingItem] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        role: '',
        company: '',
        relationship: 'Client',
        rating: 5,
        linkedin: '',
        avatar: '',
        text: '',
    });
    const [editCompressing, setEditCompressing] = useState(false);
    const editFileInputRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);

    const loadAdminData = async () => {
        setIsLoading(true);
        try {
            const pending = await fetchPendingTestimonials();
            setPendingList(pending);

            const approved = await fetchApprovedTestimonials();
            setApprovedList(approved);
        } catch (err) {
            console.error('Error loading admin data:', err);
        } finally {
            setIsLoading(false);
        }
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

    const handleApprove = async (id) => {
        await approveTestimonial(id);
        await loadAdminData();
        if (onRefreshPublic) onRefreshPublic();
    };

    const handleDelete = async (id) => {
        await deleteTestimonial(id);
        await loadAdminData();
        if (onRefreshPublic) onRefreshPublic();
    };

    const handleStartEdit = (item) => {
        setEditingItem(item);
        setEditFormData({
            name: item.name || '',
            role: item.role || '',
            company: item.company || '',
            relationship: item.relationship || 'Client',
            rating: item.rating || 5,
            linkedin: item.linkedin || '',
            avatar: item.avatar || '',
            text: item.text || '',
        });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
    };

    const handleEditFileSelected = async (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        try {
            setEditCompressing(true);
            const compressed = await compressImageFile(file);
            setEditFormData((prev) => ({ ...prev, avatar: compressed }));
        } catch (err) {
            console.error('Image compression failed:', err);
        } finally {
            setEditCompressing(false);
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editingItem) return;

        const updated = {
            ...editingItem,
            ...editFormData,
        };

        await updateTestimonial(updated);
        setEditingItem(null);
        await loadAdminData();
        if (onRefreshPublic) onRefreshPublic();
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setEditingItem(null);
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
                                    <h3 className="text-xl md:text-2xl font-space font-bold text-white mt-0.5">
                                        {editingItem ? 'Edit Recommendation' : 'Admin Control Panel'}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {isAuthenticated && (
                                    <button
                                        onClick={loadAdminData}
                                        disabled={isLoading}
                                        title="Sync cloud submissions"
                                        className="p-2 rounded-full text-white/60 hover:text-[#D4AF37] hover:bg-white/10 transition-colors disabled:opacity-50"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#D4AF37]' : ''}`} />
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
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
                        ) : editingItem ? (
                            /* Edit Recommendation Form */
                            <form onSubmit={handleSaveEdit} className="flex flex-col flex-1 min-h-0">
                                <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono rounded-lg flex items-center gap-1 transition-colors"
                                    >
                                        <ArrowLeft className="w-3.5 h-3.5" />
                                        Back to Dashboard
                                    </button>
                                </div>

                                <div className="space-y-4 flex-1 overflow-y-auto pr-2 pb-2">
                                    {/* Avatar Photo Edit */}
                                    <div>
                                        <label className="block text-xs font-space tracking-wider uppercase text-neutral-400 mb-1">
                                            Profile Photo / Avatar
                                        </label>
                                        <input
                                            type="file"
                                            ref={editFileInputRef}
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => e.target.files && handleEditFileSelected(e.target.files[0])}
                                        />
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={editFormData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                                                alt="Avatar"
                                                className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => editFileInputRef.current?.click()}
                                                disabled={editCompressing}
                                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-space rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                                            >
                                                {editCompressing ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Upload className="w-3.5 h-3.5" />
                                                )}
                                                Upload New Photo
                                            </button>
                                            {editFormData.avatar && (
                                                <button
                                                    type="button"
                                                    onClick={() => setEditFormData({ ...editFormData, avatar: '' })}
                                                    className="text-xs text-neutral-400 hover:text-red-400 transition-colors"
                                                >
                                                    Remove photo
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Name & Role */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-space tracking-wider uppercase text-neutral-400 mb-1">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={editFormData.name}
                                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-space tracking-wider uppercase text-neutral-400 mb-1">
                                                Role / Position
                                            </label>
                                            <input
                                                type="text"
                                                value={editFormData.role}
                                                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                                placeholder="e.g. Lead Engineer"
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Company & Relationship */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-space tracking-wider uppercase text-neutral-400 mb-1">
                                                Company / Organization
                                            </label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                                <input
                                                    type="text"
                                                    value={editFormData.company}
                                                    onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                                                    placeholder="e.g. Acme Corp (or leave blank if independent)"
                                                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-space tracking-wider uppercase text-neutral-400 mb-1">
                                                Relationship
                                            </label>
                                            <select
                                                value={editFormData.relationship}
                                                onChange={(e) => setEditFormData({ ...editFormData, relationship: e.target.value })}
                                                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                            >
                                                <option value="Client">Client</option>
                                                <option value="Manager / Supervisor">Manager / Supervisor</option>
                                                <option value="Colleague / Teammate">Colleague / Teammate</option>
                                                <option value="Mentor / Industry Peer">Mentor / Industry Peer</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Rating & LinkedIn */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-space tracking-wider uppercase text-neutral-400 mb-1">
                                                Star Rating
                                            </label>
                                            <div className="flex items-center gap-1 py-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setEditFormData({ ...editFormData, rating: star })}
                                                        className="focus:outline-none transition-transform hover:scale-110"
                                                    >
                                                        <Star
                                                            className={`w-5 h-5 ${
                                                                star <= editFormData.rating
                                                                    ? 'fill-[#D4AF37] text-[#D4AF37]'
                                                                    : 'text-neutral-600'
                                                            }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-space tracking-wider uppercase text-neutral-400 mb-1">
                                                LinkedIn Profile URL (Optional)
                                            </label>
                                            <div className="relative">
                                                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                                <input
                                                    type="url"
                                                    value={editFormData.linkedin}
                                                    onChange={(e) => setEditFormData({ ...editFormData, linkedin: e.target.value })}
                                                    placeholder="https://linkedin.com/in/... (Optional)"
                                                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Testimonial Text */}
                                    <div>
                                        <label className="block text-xs font-space tracking-wider uppercase text-neutral-400 mb-1">
                                            Recommendation Text
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={editFormData.text}
                                            onChange={(e) => setEditFormData({ ...editFormData, text: e.target.value })}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Save / Cancel Footer */}
                                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3 flex-shrink-0 mt-auto bg-neutral-950">
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-space font-semibold text-xs rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-[#D4AF37] hover:bg-[#b8952b] text-neutral-950 font-space font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
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
                                                            onClick={() => handleStartEdit(item)}
                                                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-space font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors"
                                                            title="Edit recommendation"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                            Edit
                                                        </button>
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

                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => handleStartEdit(item)}
                                                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-space font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors"
                                                        title="Edit recommendation"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-space font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Delete
                                                    </button>
                                                </div>
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
