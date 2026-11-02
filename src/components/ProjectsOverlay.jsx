import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink, Cpu, Terminal, Shield, Smartphone, Activity } from 'lucide-react';
import usePageReveal from '../utils/usePageReveal';

const CATEGORY_LABELS = {
    'android-sys': 'Android Internals',
    'linux-sys':   'Linux Systems',
    'os-dev':      'OS & Compilers',
    'ai':          'AI & Quantitative',
    'cyber-sec':   'Cyber Security',
    'web':         'Web Architecture',
};

const CATEGORY_DOTS = {
    'android-sys': '#10b981',
    'linux-sys':   '#38bdf8',
    'os-dev':      '#a855f7',
    'ai':          '#f59e0b',
    'cyber-sec':   '#ef4444',
    'web':         '#06b6d4',
};

const pad        = (n) => String(n).padStart(2, '0');
const categoryOf = (p) => CATEGORY_LABELS[p.categoryId] || p.role;
const dotColor   = (p) => CATEGORY_DOTS[p.categoryId] || 'var(--color-accent)';
const tagsOf     = (p) => p.stack && p.stack.length ? p.stack : p.role.split(' / ').slice(0, 4).map((t) => t.trim());
const coverImage = (p) => (p.images && p.images[0]) || (p.androidImages && p.androidImages[0]) || (p.linuxImages && p.linuxImages[0]) || null;

/** Lead Flagship Feature — Interactive Architecture & Workbench Spread */
function LeadFeatureCard({ project, num }) {
    const isArchTitan = project.id === 'archtitan';
    const img = coverImage(project);
    const tags = tagsOf(project);
    const metrics = project.metrics || [];
    const [viewMode, setViewMode] = useState(isArchTitan ? 'gallery' : 'specimen');

    return (
        <div className="proj-feature-lead py-4 md:py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch p-6 sm:p-8 rounded-2xl bg-panel border border-bordertech shadow-xl shadow-black/5 hover:border-accent/40 transition-all duration-300">

                {/* Left Column: Project Details & Context */}
                <div className="lg:col-span-7 flex flex-col justify-between gap-6">
                    <div className="flex flex-col gap-4">
                        {/* Top Category Strip */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-bordertech">
                            <div className="flex items-center gap-2.5">
                                <span className="font-mono font-bold text-sm text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 rounded-md">
                                    FLAGSHIP #{num}
                                </span>
                                <span
                                    className="w-2 h-2 rounded-full shrink-0 animate-pulse"
                                    style={{ background: dotColor(project) }}
                                />
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-semibold text-graphite">
                                    {categoryOf(project)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase">
                                {project.year && (
                                    <span className="text-graphite tracking-widest">{project.year}</span>
                                )}
                                {project.status && (
                                    <span className="px-2.5 py-0.5 border border-accent/40 bg-accent/15 text-accent rounded-full font-bold tracking-widest text-[9px]">
                                        ● {project.status}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Title & Subtitle */}
                        <div>
                            <Link
                                to={`/project/${project.id}`}
                                data-cursor="Open Monograph"
                                className="group inline-block no-underline"
                            >
                                <h3 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-ink group-hover:text-accent transition-colors leading-[1.05] tracking-tight">
                                    {project.title}
                                </h3>
                            </Link>
                            {project.subtitle && (
                                <p className="mt-2 font-mono text-xs sm:text-sm tracking-wider text-accent font-semibold">
                                    {project.subtitle}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <p className="font-sans text-sm sm:text-base leading-relaxed text-graphite m-0">
                            {project.description}
                        </p>

                        {/* Metrics Grid */}
                        {metrics.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-panel-deep/60 rounded-xl border border-bordertech mt-1">
                                {metrics.map((m, idx) => (
                                    <div key={idx} className="flex flex-col gap-1 border-r last:border-r-0 border-bordertech pr-2">
                                        <span className="font-mono text-[9px] tracking-wider uppercase text-graphite">
                                            {m.label}
                                        </span>
                                        <span className="font-mono text-xs sm:text-sm font-bold text-ink truncate">
                                            {m.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom Tags + CTAs */}
                    <div className="pt-4 border-t border-bordertech flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-1.5">
                            {tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-2.5 py-1 rounded-full bg-panel-deep border border-bordertech font-mono text-[10px] text-graphite"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-2.5">
                            {project.github && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 border border-bordertech bg-panel-deep/70 hover:border-accent hover:text-accent font-mono text-[11px] tracking-wider uppercase font-semibold inline-flex items-center gap-1.5 rounded-full transition-all text-ink no-underline"
                                >
                                    <span>Source Git</span>
                                    <ExternalLink size={12} />
                                </a>
                            )}
                            <Link
                                to={`/project/${project.id}`}
                                data-cursor="Open Monograph"
                                className="px-5 py-2.5 bg-accent hover:bg-accent-hot text-slate-950 font-mono text-[11px] tracking-wider uppercase font-bold inline-flex items-center gap-2 rounded-full transition-all shadow-[0_0_20px_-3px_var(--color-accent)] no-underline"
                            >
                                <span>Inspect Monograph</span>
                                <ArrowUpRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column: Modern Interactive Window Showcase */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                    <div className="relative rounded-xl border border-white/15 bg-slate-950/90 overflow-hidden shadow-2xl flex flex-col">
                        {/* macOS Window Title Bar */}
                        <div className="px-3.5 py-2.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 inline-block shrink-0" />
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 inline-block shrink-0" />
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 inline-block shrink-0" />
                                <span className="ml-2 font-mono text-[10px] text-slate-300 font-semibold truncate">
                                    {isArchTitan ? 'archtitan // hyprland.wayland.session' : `${project.id}-core // workbench`}
                                </span>
                            </div>

                            {/* View Switcher Tabs */}
                            <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-md border border-white/10 shrink-0">
                                {isArchTitan ? (
                                    <>
                                        <button
                                            onClick={() => setViewMode('gallery')}
                                            className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                                                viewMode === 'gallery'
                                                    ? 'bg-accent text-slate-950 font-bold'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            TDL UI
                                        </button>
                                        <button
                                            onClick={() => setViewMode('telemetry')}
                                            className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                                                viewMode === 'telemetry'
                                                    ? 'bg-accent text-slate-950 font-bold'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            titanfetch
                                        </button>
                                        <button
                                            onClick={() => setViewMode('cgroups')}
                                            className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                                                viewMode === 'cgroups'
                                                    ? 'bg-accent text-slate-950 font-bold'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            Slices
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setViewMode('specimen')}
                                            className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                                                viewMode === 'specimen'
                                                    ? 'bg-accent text-slate-950 font-bold'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            Plate
                                        </button>
                                        <button
                                            onClick={() => setViewMode('ir')}
                                            className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                                                viewMode === 'ir'
                                                    ? 'bg-accent text-slate-950 font-bold'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            LLVM IR
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Interactive Window Viewport */}
                        <div className="relative min-h-[270px] sm:min-h-[300px] flex items-center justify-center p-4 sm:p-5 bg-gradient-to-b from-[#090d16] via-[#06080e] to-[#030408]">
                            {/* Ambient Cyber Backlight */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.18)_0%,transparent_70%)] pointer-events-none" />

                            {isArchTitan ? (
                                viewMode === 'gallery' ? (
                                    <Link
                                        to={`/project/${project.id}`}
                                        className="group relative flex flex-col items-center justify-center w-full no-underline"
                                    >
                                        <div className="relative p-2 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md shadow-2xl group-hover:border-accent/60 transition-all duration-300">
                                            <img
                                                src="/archtitan/gallery.png"
                                                alt="ArchTitan OS Hyprland UI"
                                                loading="lazy"
                                                decoding="async"
                                                className="max-h-[165px] sm:max-h-[185px] w-auto object-contain rounded-lg transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_0_30px_rgba(56,189,248,0.35)]"
                                            />
                                        </div>
                                        <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[10px] font-mono text-slate-300">
                                            <Terminal size={12} className="text-accent" />
                                            <span>Titan Design Language (Qt6/QML) on Hyprland ↗</span>
                                        </div>
                                    </Link>
                                ) : viewMode === 'telemetry' ? (
                                    <div className="w-full font-mono text-[9px] sm:text-[10.5px] text-slate-300 leading-snug p-1 overflow-x-auto select-text">
                                        <div className="flex gap-3 items-center">
                                            <pre className="text-cyan-400 font-bold select-none shrink-0 hidden sm:block m-0 leading-tight">
{`      +      
     +++     
    +++++    
   +++++++   
  +++++ #####
 *++++ ######
+++++   ###  `}
                                            </pre>
                                            <div className="space-y-0.5">
                                                <div className="text-emerald-400 font-bold">siluna@archtitan-os</div>
                                                <div className="text-slate-600">─────────────────────────</div>
                                                <div><span className="text-cyan-400 font-semibold">OS:</span> ArchTitan OS v3.1 x86_64</div>
                                                <div><span className="text-cyan-400 font-semibold">Kernel:</span> 6.12.1-arch-zen (cgroups v2)</div>
                                                <div><span className="text-cyan-400 font-semibold">Uptime:</span> 23d 04h 12m</div>
                                                <div><span className="text-cyan-400 font-semibold">WM:</span> Hyprland (Wayland Native)</div>
                                                <div><span className="text-cyan-400 font-semibold">Theme:</span> Catppuccin Mocha (TDL Qt6)</div>
                                                <div><span className="text-cyan-400 font-semibold">Memory:</span> 178 MiB / 32140 MiB (Idle)</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full font-mono text-[10px] sm:text-[11px] text-slate-300 space-y-1.5 leading-relaxed p-2 select-text">
                                        <div className="text-cyan-400 font-semibold">// Hierarchical Workload Slicing via titan-hwm v3.1</div>
                                        <div className="text-emerald-400">● archtitan.slice - Root Slice [OOMScoreAdjust=-1000]</div>
                                        <div className="pl-3 text-slate-400">├── archtitan-active.slice      <span className="text-emerald-300">[CPU: 95% focus-pinned]</span></div>
                                        <div className="pl-3 text-slate-400">├── archtitan-background.slice  <span className="text-cyan-300">[LLVM / build pool]</span></div>
                                        <div className="pl-3 text-slate-400">├── archtitan-idle.slice        <span className="text-amber-300">[Capped I/O indexers]</span></div>
                                        <div className="pl-3 text-slate-400">└── archtitan-reclaimable.slice <span className="text-purple-300">[pidfd atomic reclaim]</span></div>
                                        <div className="text-[10px] text-slate-500 pt-2 border-t border-white/10 flex items-center justify-between">
                                            <span className="text-emerald-400">● BTRFS Pre-Update Hook: ACTIVE</span>
                                            <span className="text-cyan-400">titan-hwm.service</span>
                                        </div>
                                    </div>
                                )
                            ) : viewMode === 'specimen' ? (
                                <Link
                                    to={`/project/${project.id}`}
                                    className="group relative flex flex-col items-center justify-center w-full no-underline"
                                >
                                    <div className="relative p-4 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md shadow-2xl group-hover:border-accent/60 transition-all duration-300">
                                        <img
                                            src={img || '/aerolang/aero-1.png'}
                                            alt={project.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="max-h-[170px] w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_0_30px_rgba(0,240,255,0.35)]"
                                        />
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[10px] font-mono text-slate-300">
                                        <Cpu size={12} className="text-accent" />
                                        <span>Click to Inspect Architecture Schematics ↗</span>
                                    </div>
                                </Link>
                            ) : (
                                <div className="w-full font-mono text-xs text-slate-300 space-y-1.5 leading-relaxed p-2 select-text">
                                    <div className="text-accent font-semibold">// Lowering Aero AST into LLVM SSA Form</div>
                                    <div className="text-emerald-400">define i32 @aero_runtime_entry() #0 &#123;</div>
                                    <div className="pl-4 text-slate-400">%1 = alloca i32, align 4</div>
                                    <div className="pl-4 text-cyan-300">%res = call fastcc i32 @evaluate_ast(%AST* %root)</div>
                                    <div className="pl-4 text-slate-400">store i32 %res, i32* %1, align 4</div>
                                    <div className="pl-4 text-purple-300">ret i32 %res</div>
                                    <div className="text-emerald-400">&#125;</div>
                                    <div className="text-[10px] text-slate-500 pt-2 border-t border-white/10 flex items-center justify-between">
                                        <span>OPT PASSES: DcePass, LoopUnroll</span>
                                        <span className="text-accent">AArch64 / x86_64</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Status Ribbon */}
                        <div className="px-4 py-2 bg-slate-900/90 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-slate-400">
                            <span className="flex items-center gap-1.5 text-accent font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                                {isArchTitan ? 'CGROUPS V2 / THM v3.1 ACTIVE' : 'JIT PIPELINE NOMINAL'}
                            </span>
                            <span className="uppercase text-slate-500">
                                {isArchTitan ? 'Linux 6.12-zen · Hyprland 120Hz' : 'LLVM 18 · AArch64 / x86_64'}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

/** Secondary Feature Card (#02 & #03) — Modern Device & Terminal HUD Mockups */
function SecondaryFeatureCard({ project, num }) {
    const img = coverImage(project);
    const tags = tagsOf(project);
    const metrics = project.metrics || [];
    const isBybridge = project.id === 'bybridge';
    const isAegisLayer = project.id === 'aegislayer';
    const isAeroLang = project.id === 'aerolang';

    return (
        <div className="proj-secondary group p-6 rounded-2xl border border-bordertech bg-panel hover:border-accent/50 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/5">
            <div>
                {/* Meta header */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-bordertech">
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 rounded-md">
                            #{num}
                        </span>
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: dotColor(project) }}
                        />
                        <span className="font-mono text-[10px] tracking-wider uppercase text-graphite font-semibold">
                            {categoryOf(project)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {project.year && (
                            <span className="font-mono text-[9px] text-graphite uppercase tracking-wider">
                                {project.year}
                            </span>
                        )}
                        <Link
                            to={`/project/${project.id}`}
                            className="p-1 rounded-full text-graphite hover:text-accent hover:bg-white/5 transition-colors"
                        >
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* ── Modern Showcase Visual Area ── */}
                {isBybridge ? (
                    /* Bybridge: Authentic Modern Smartphone & Terminal Bridge Mockup */
                    <Link
                        to={`/project/${project.id}`}
                        className="mb-5 block relative rounded-xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4 overflow-hidden group/box shadow-lg no-underline"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15)_0%,transparent_70%)] pointer-events-none" />

                        <div className="flex items-center justify-between gap-4">
                            {/* Smartphone Chassis Frame */}
                            <div className="relative w-28 sm:w-32 h-44 sm:h-48 rounded-[1.6rem] border-[3px] border-slate-700 bg-slate-950 shadow-2xl overflow-hidden p-1 shrink-0 flex flex-col items-center">
                                {/* Camera Notch */}
                                <div className="w-8 h-2 bg-black rounded-full absolute top-1.5 z-20" />
                                {/* Full Phone Screen Display */}
                                <img
                                    src="/bybridge/android-1.png"
                                    alt="Bybridge Android UI"
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover rounded-[1.3rem] transition-transform duration-500 group-hover/box:scale-105"
                                />
                            </div>

                            {/* Accompanying Linux Bridge Terminal HUD */}
                            <div className="flex-1 font-mono text-[10px] text-slate-300 space-y-2 py-1">
                                <div className="flex items-center gap-1.5 text-accent font-bold">
                                    <Activity size={12} />
                                    <span>BRIDGE ACTIVE</span>
                                </div>
                                <div className="p-2 rounded-lg bg-black/50 border border-white/10 text-[9px] text-slate-400 space-y-1">
                                    <div className="text-emerald-400">$ bybridge --stream</div>
                                    <div>Arch Linux &lt;=&gt; Android</div>
                                    <div className="text-cyan-300">H.264 RTP 120 FPS</div>
                                    <div className="text-amber-400">Latency: &lt; 8ms LAN</div>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[9px] text-slate-400 group-hover/box:text-accent transition-colors font-semibold">
                                    Inspect Full System ↗
                                </span>
                            </div>
                        </div>
                    </Link>
                ) : isAegisLayer ? (
                    /* AegisLayer: Modern Cyber Defense Shield HUD */
                    <Link
                        to={`/project/${project.id}`}
                        className="mb-5 block relative rounded-xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4 overflow-hidden group/box shadow-lg no-underline"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.2)_0%,transparent_70%)] pointer-events-none" />

                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 font-mono text-[9px] text-slate-400">
                            <span className="flex items-center gap-1.5 text-accent font-semibold">
                                <Shield size={12} />
                                <span>AEGIS-DAEMON // SECURITY HUD</span>
                            </span>
                            <span className="text-emerald-400">● 0-DEP ML ACTIVE</span>
                        </div>

                        {/* Centered Graphic Preview Without Awkward Cropping */}
                        <div className="h-36 sm:h-40 flex items-center justify-center p-2">
                            <img
                                src="/assets/aegislayer_dashboard.png"
                                alt="AegisLayer Dashboard"
                                loading="lazy"
                                decoding="async"
                                className="max-h-full max-w-full object-contain drop-shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-transform duration-500 group-hover/box:scale-105"
                            />
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-slate-400">
                            <span>eBPF Hooks: Nominal</span>
                            <span className="text-accent group-hover/box:translate-x-0.5 transition-transform font-bold">
                                View Monograph ↗
                            </span>
                        </div>
                    </Link>
                ) : isAeroLang ? (
                    /* AeroLang: Compiler & LLVM IR Specimen */
                    <Link
                        to={`/project/${project.id}`}
                        className="mb-5 block relative rounded-xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4 overflow-hidden group/box shadow-lg no-underline"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.18)_0%,transparent_70%)] pointer-events-none" />
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 font-mono text-[9px] text-slate-400">
                            <span className="flex items-center gap-1.5 text-accent font-semibold">
                                <Cpu size={12} />
                                <span>AEROLANG // LLVM IR CODEGEN</span>
                            </span>
                            <span className="text-cyan-400">● NATIVE AARCH64 / X86</span>
                        </div>
                        <div className="font-mono text-[10px] text-slate-300 space-y-1 py-1">
                            <div className="text-emerald-400">define i32 @aero_entry() &#123;</div>
                            <div className="pl-3 text-slate-400">%res = call fastcc i32 @evaluate_ast()</div>
                            <div className="pl-3 text-purple-300">ret i32 %res</div>
                            <div className="text-emerald-400">&#125;</div>
                        </div>
                        <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-slate-400">
                            <span>Zero-GC Deterministic</span>
                            <span className="text-accent group-hover/box:translate-x-0.5 transition-transform font-bold">
                                View Compiler Spec ↗
                            </span>
                        </div>
                    </Link>
                ) : img ? (
                    /* Generic Feature Image with Modern Glass Frame */
                    <Link
                        to={`/project/${project.id}`}
                        className="mb-5 block relative rounded-xl border border-white/10 bg-slate-950 h-36 overflow-hidden group/box"
                    >
                        <img
                            src={img}
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain p-2 opacity-90 group-hover/box:opacity-100 group-hover/box:scale-105 transition-all duration-500"
                        />
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded border border-white/15 font-mono text-[8px] text-white">
                            PLATE #{num}
                        </span>
                    </Link>
                ) : null}

                {/* Title & Subtitle */}
                <Link to={`/project/${project.id}`} className="no-underline group/t inline-block">
                    <h3 className="font-display font-bold text-2xl text-ink group-hover/t:text-accent transition-colors leading-tight">
                        {project.title}
                    </h3>
                </Link>
                {project.subtitle && (
                    <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                        {project.subtitle}
                    </div>
                )}

                {/* Description */}
                <p className="mt-3 font-sans text-sm text-graphite leading-relaxed line-clamp-3">
                    {project.description}
                </p>
            </div>

            <div className="mt-5 pt-4 border-t border-bordertech space-y-3">
                {metrics.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-panel-deep/60 border border-bordertech">
                        {metrics.slice(0, 3).map((m, idx) => (
                            <div key={idx} className="flex flex-col min-w-0">
                                <span className="font-mono text-[8px] tracking-wider uppercase text-graphite truncate">
                                    {m.label}
                                </span>
                                <span className="font-mono text-[10px] font-bold text-ink truncate">
                                    {m.value}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                    {tags.slice(0, 4).map((tag, i) => (
                        <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-panel-deep border border-bordertech font-mono text-[9px] text-graphite"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/** Regular Project Row (#04+) — Modern Frosted Row Item */
function ProjectRow({ project, num }) {
    const tags = tagsOf(project);
    const primaryMetric = project.metrics && project.metrics[0];

    return (
        <Link
            to={`/project/${project.id}`}
            data-cursor="Open Dossier"
            className="block group no-underline"
        >
            <article className="p-4 rounded-xl border border-bordertech bg-panel hover:bg-panel-deep hover:border-accent/40 transition-all duration-300 flex items-center justify-between gap-4 shadow-sm">
                <span className="font-mono text-sm font-bold text-accent w-6 shrink-0">{num}</span>

                <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: dotColor(project) }}
                    title={categoryOf(project)}
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                        <span className="font-display font-bold text-base text-ink group-hover:text-accent transition-colors">
                            {project.title}
                        </span>
                        {project.subtitle && (
                            <span className="hidden md:inline font-mono text-[10px] text-graphite truncate">
                                — {project.subtitle}
                            </span>
                        )}
                        {project.year && (
                            <span className="font-mono text-[9px] text-graphite/80 ml-auto sm:ml-0">
                                [{project.year}]
                            </span>
                        )}
                    </div>
                    <p className="font-sans text-xs text-graphite truncate mt-0.5 m-0">
                        {project.description}
                    </p>
                </div>

                <div className="hidden lg:flex items-center gap-1.5 shrink-0">
                    {primaryMetric && (
                        <span className="px-2.5 py-0.5 rounded-full font-mono text-[9px] bg-accent/10 border border-accent/30 text-accent font-semibold mr-1">
                            {primaryMetric.value}
                        </span>
                    )}
                    {tags.slice(0, 3).map((tag, i) => (
                        <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-panel-deep border border-bordertech font-mono text-[9px] text-graphite"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <ArrowUpRight
                    size={16}
                    className="text-graphite group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
                />
            </article>
        </Link>
    );
}

export default function ProjectsOverlay({ projects = [], isFiltered = false, children }) {
    const containerRef = usePageReveal({
        selector: '.proj-feature-lead, .proj-secondary',
        y: 16,
        scale: 1,
        stagger: 0.08,
    });

    const [showAll, setShowAll] = useState(false);
    const DISPLAY_LIMIT = 9;
    const shouldLimit = !isFiltered && projects.length > DISPLAY_LIMIT;
    const shown       = shouldLimit && !showAll ? projects.slice(0, DISPLAY_LIMIT) : projects;

    if (!shown.length) {
        return (
            <section className="py-12">
                {children}
                <div className="text-center py-16 p-6 rounded-2xl border border-bordertech bg-panel">
                    <span className="font-mono text-xs uppercase tracking-widest text-graphite">
                        — No projects match your selected filter —
                    </span>
                </div>
            </section>
        );
    }

    const featured = shown[0];
    const secondary = !isFiltered && shown.length >= 3 ? shown.slice(1, 3) : [];
    const rest = !isFiltered && shown.length >= 3 ? shown.slice(3) : shown.slice(1);
    const restStartIndex = !isFiltered && shown.length >= 3 ? 4 : 2;

    return (
        <section ref={containerRef} className="w-full flex flex-col gap-8 py-6">
            {children}

            {/* Lead Flagship Feature (#01) */}
            {featured && (
                <LeadFeatureCard project={featured} num="01" />
            )}

            {/* Secondary Features (#02 & #03) */}
            {secondary.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {secondary.map((proj, i) => (
                        <SecondaryFeatureCard
                            key={proj.id}
                            project={proj}
                            num={pad(i + 2)}
                        />
                    ))}
                </div>
            )}

            {/* Ledger Rows (#04+) */}
            {rest.length > 0 && (
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center justify-between pb-2 mb-1 border-b border-bordertech font-mono text-[10px] uppercase tracking-wider text-graphite">
                        <span>Systems Engineering Catalog &amp; Utilities</span>
                        <span>{rest.length} Repositories</span>
                    </div>

                    {rest.map((proj, i) => (
                        <ProjectRow
                            key={proj.id}
                            project={proj}
                            num={pad(restStartIndex + i)}
                        />
                    ))}
                </div>
            )}

            {/* Expand / Collapse Button */}
            {shouldLimit && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-6 py-3 rounded-full border border-bordertech bg-panel hover:border-accent hover:text-accent font-mono text-xs tracking-wider uppercase font-semibold transition-all shadow-md cursor-pointer"
                    >
                        {showAll ? 'Show Fewer Projects' : `View All ${projects.length} Engineering Projects`}
                    </button>
                </div>
            )}
        </section>
    );
}
