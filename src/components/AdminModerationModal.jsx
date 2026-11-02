import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Check, Trash2, Key, Star, Clock, AlertCircle, Pencil, Save, ArrowLeft, Upload, Loader2, Linkedin, User, Building, RefreshCw, Radio } from 'lucide-react';
import { fetchPendingTestimonials, fetchApprovedTestimonials, approveTestimonial, deleteTestimonial, updateTestimonial, compressImageFile } from '../services/githubTestimonialsService';
import { getMaintenanceStatus, setMaintenanceStatus, MAINTENANCE_EVENT_NAME } from '../data/maintenanceConfig';

const ADMIN_SECRET_PIN = '22818';

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
    const [maintenanceActive, setMaintenanceActive] = useState(() => getMaintenanceStatus());

    useEffect(() => {
        const handleMaintenanceChange = (e) => {
            if (e.detail && typeof e.detail.active === 'boolean') {
                setMaintenanceActive(e.detail.active);
            } else {
                setMaintenanceActive(getMaintenanceStatus());
            }
        };
        window.addEventListener(MAINTENANCE_EVENT_NAME, handleMaintenanceChange);
        return () => window.removeEventListener(MAINTENANCE_EVENT_NAME, handleMaintenanceChange);
    }, []);

    const handleToggleMaintenance = () => {
        const nextState = !maintenanceActive;
        setMaintenanceActive(nextState);
        setMaintenanceStatus(nextState);
    };

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

    // Handle Escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

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
        window.dispatchEvent(new CustomEvent('testimonials-updated'));
    };

    const handleDelete = async (id) => {
        await deleteTestimonial(id);
        await loadAdminData();
        if (onRefreshPublic) onRefreshPublic();
        window.dispatchEvent(new CustomEvent('testimonials-updated'));
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
        window.dispatchEvent(new CustomEvent('testimonials-updated'));
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
                <div onClick={onClose} className="fixed inset-0 z-[99990] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 w-full max-w-3xl max-h-[85vh] bg-neutral-950 border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8 text-neutral-100 flex flex-col overflow-hidden my-auto"
                    >
                        {/* Background Accent Glow */}
                        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#B91C1C]/15 rounded-full blur-3xl pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-[#B91C1C]/20 border border-[#B91C1C]/40 text-red-400 rounded-xl">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-mono tracking-widest text-red-400 uppercase font-semibold">System Moderation</span>
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
                                        className="p-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-red-400' : ''}`} />
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    aria-label="Close modal"
                                    title="Close (Esc)"
                                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 transition-all cursor-pointer shadow-sm flex items-center justify-center group"
                                >
                                    <X className="w-5 h-5 text-neutral-200 group-hover:text-white group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {!isAuthenticated ? (
                            /* Login Form */
                            <form onSubmit={handleLogin} className="py-10 px-4 max-w-sm mx-auto w-full text-center space-y-5">
                                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-red-400">
                                    <Key className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-space font-bold text-white">Enter Admin Key</h4>
                                    <p className="text-xs text-neutral-400 mt-1">Authenticate to moderate client recommendations &amp; maintenance broadcast</p>
                                </div>

                                <div>
                                    <input
                                        type="password"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        placeholder="Admin Secret Key..."
                                        autoFocus
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-center text-lg font-mono tracking-widest text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                                    />
                                    {authError && (
                                        <p className="text-xs text-red-400 mt-2 flex items-center justify-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {authError}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 pt-1">
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-[#B91C1C] hover:bg-red-600 text-white font-space font-bold rounded-xl transition-all shadow-lg cursor-pointer"
                                    >
                                        Unlock Admin Panel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="w-full py-2 text-xs font-mono text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                                    >
                                        Cancel &amp; Close
                                    </button>
                                </div>
                            </form>
                        ) : editingItem ? (
                            /* Edit Recommendation Form */
                            <form onSubmit={handleSaveEdit} className="flex flex-col flex-1 min-h-0">
                                <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white text-xs font-mono rounded-lg flex items-center gap-1 transition-colors border border-white/10 cursor-pointer"
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
                                                className="w-12 h-12 rounded-full object-cover border border-[#B91C1C]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => editFileInputRef.current?.click()}
                                                disabled={editCompressing}
                                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-space rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer border border-white/10"
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
                                                    className="text-xs text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
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
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={editFormData.name}
                                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-[#B91C1C] transition-colors"
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
                                                className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#B91C1C] transition-colors"
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
                                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                                <input
                                                    type="text"
                                                    value={editFormData.company}
                                                    onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                                                    placeholder="e.g. Acme Corp (or leave blank if independent)"
                                                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/15 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#B91C1C] transition-colors"
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
                                                className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-[#B91C1C] transition-colors"
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
                                                        className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                                                    >
                                                        <Star
                                                            className={`w-5 h-5 ${
                                                                star <= editFormData.rating
                                                                    ? 'fill-[#B91C1C] text-[#B91C1C]'
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
                                                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                                <input
                                                    type="url"
                                                    value={editFormData.linkedin}
                                                    onChange={(e) => setEditFormData({ ...editFormData, linkedin: e.target.value })}
                                                    placeholder="https://linkedin.com/in/... (Optional)"
                                                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/15 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#B91C1C] transition-colors"
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
                                            className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#B91C1C] transition-colors resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Save / Cancel Footer */}
                                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3 flex-shrink-0 mt-auto bg-neutral-950">
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-space font-semibold text-xs rounded-lg transition-colors border border-white/15 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-[#B91C1C] hover:bg-red-600 text-white font-space font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* Authenticated Admin Dashboard */
                            <div className="flex flex-col flex-1 min-h-0">
                                {/* Live Maintenance & Breaking News Broadcast Control */}
                                <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl mb-4 flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full shrink-0 ${maintenanceActive ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                                        <div>
                                            <div className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                                                <span>Breaking News Maintenance:</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] ${maintenanceActive ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}`}>
                                                    {maintenanceActive ? 'ACTIVE (BROADCASTING)' : 'STANDBY (OFF)'}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-neutral-400 mt-0.5 m-0">
                                                {maintenanceActive
                                                    ? 'Live alert is active. Visitors can browse normally while seeing the update notification.'
                                                    : 'Site is operating normally with no maintenance notice.'}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleToggleMaintenance}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer ${
                                            maintenanceActive
                                                ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                        }`}
                                    >
                                        <Radio className="w-3.5 h-3.5" />
                                        {maintenanceActive ? 'Turn Dispatch OFF' : 'Turn Dispatch ON'}
                                    </button>
                                </div>

                                {/* Navigation Tabs */}
                                <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-4 flex-shrink-0">
                                    <button
                                        onClick={() => setActiveTab('pending')}
                                        className={`px-4 py-2 rounded-xl text-xs font-space font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                                            activeTab === 'pending'
                                                ? 'bg-[#B91C1C] text-white shadow-md'
                                                : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
                                        }`}
                                    >
                                        <Clock className="w-3.5 h-3.5" />
                                        Pending Review ({pendingList.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('approved')}
                                        className={`px-4 py-2 rounded-xl text-xs font-space font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                                            activeTab === 'approved'
                                                ? 'bg-[#B91C1C] text-white shadow-md'
                                                : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
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
                                                            className="w-10 h-10 rounded-full object-cover border border-[#B91C1C]/40 flex-shrink-0"
                                                        />
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h5 className="font-space font-bold text-white text-sm">{item.name}</h5>
                                                                <span className="text-[10px] font-mono px-2 py-0.5 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-md uppercase">
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
                                                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 font-space font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                                            title="Edit recommendation"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleApprove(item.id)}
                                                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-space font-bold text-xs rounded-lg flex items-center gap-1 transition-colors shadow-md cursor-pointer"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                            Approve Live
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-space font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
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
                                                            <div className="flex items-center text-[#B91C1C]">
                                                                <Star className="w-3 h-3 fill-[#B91C1C]" />
                                                                <span className="text-xs font-mono ml-1 text-white">{item.rating}</span>
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
                                                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 font-space font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                                        title="Edit recommendation"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-space font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
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
                                    <span className="text-xs text-neutral-400 font-mono">
                                        Admin Key: <code className="text-red-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 font-bold">22818</code>
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 font-space font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                                    >
                                        Lock &amp; Close
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
