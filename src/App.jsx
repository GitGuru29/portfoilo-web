import React, { useState, useEffect, useRef, memo } from 'react';
import emailjs from '@emailjs/browser'; // UNCOMMENT FOR LOCAL USE AFTER INSTALLING PACKAGE
import {
  Code2,
  Cpu,
  Mail,
  Send,
  Sparkles,
  ChevronDown,
  CheckCircle,
  Loader2,
  Github,
  Linkedin,
  Facebook,
  Zap,
  ZapOff,
  Download,
  Terminal,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { Loader } from '@react-three/drei';
import ThreeCanvas from './components/ThreeCanvas'; // [NEW] 3D Background

/**
 * CUSTOM ICONS (SVG)
 * Defined locally to ensure stability and prevent import errors.
 */
const DiscordIcon = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="12" r="1" />
    <circle cx="15" cy="12" r="1" />
    <path d="M7.5 7.5c3.5-1 5.5-1 9 0 1.5.43 2.5 1.7 2.5 3.3v4.2c0 2.3-2.2 4.1-4.7 3.5-1.5-.35-2.5-1.5-3.8-1.5s-2.3 1.15-3.8 1.5c-2.5.6-4.7-1.2-4.7-3.5V10.8c0-1.6 1-2.87 2.5-3.3z" />
  </svg>
);

const WhatsappIcon = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a2 2 0 0 0 2 2h1" />
  </svg>
);

const GithubIcon = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

/**
 * SHADOW CHARACTER COMPONENT
 */
const ShadowCharacter = memo(({ isMoving, charRef, visitingSide }) => {

  const getVisitStyle = () => {
    switch (visitingSide) {
      case 'left':
        return { transform: `translateX(150px) rotate(-90deg) scale(1.5)` };
      case 'right':
        return { transform: `translateX(-150px) rotate(90deg) scale(1.5)` };
      case 'center':
        return { transform: 'translateY(-140px) scale(1.5)' };
      default:
        return { transform: 'translate(0,0) scale(1)' };
    }
  };

  return (
    <div
      ref={charRef}
      className="absolute top-0 left-0 z-30 pointer-events-none will-change-transform"
      style={{ width: '40px', height: '40px', marginTop: '-20px', marginLeft: '-20px' }}
    >
      <div
        className={`relative w-full h-full flex items-center justify-center ease-in-out transition-all duration-1000 ${visitingSide ? 'opacity-0 delay-[800ms]' : 'opacity-100 delay-0'}`}
        style={getVisitStyle()}
      >
        <div className={`relative w-8 h-8 bg-slate-900 rounded-full border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] ${isMoving || visitingSide ? 'animate-bounce-slight' : ''}`}>
          <div className="absolute top-2 left-1 w-6 h-2 bg-cyan-400/30 rounded-full"></div>
          <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-cyan-200 rounded-full animate-pulse"></div>
        </div>

        {(isMoving || visitingSide) && (
          <div className="absolute -bottom-3 w-full flex justify-center gap-2">
            <div className="w-1.5 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-[leg-move_0.2s_infinite_alternate]"></div>
            <div className="w-1.5 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-[leg-move_0.2s_infinite_alternate-reverse]"></div>
          </div>
        )}
      </div>
    </div>
  );
});

/**
 * SECTION MARKER
 */
const MapNode = ({ title, icon: Icon, isActive, align = 'left', subtitle, children, isVisited }) => (
  <div className={`absolute transform -translate-y-1/2 flex items-center gap-6 w-[90%] md:w-[35%] ${align === 'right' ? 'flex-row-reverse text-right' : 'flex-row'}`}
    style={{ left: align === 'left' ? '5%' : 'auto', right: align === 'right' ? '5%' : 'auto', zIndex: 40 }}>

    <div className={`relative flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 bg-slate-900/80 backdrop-blur-md ${isActive ? 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)] rotate-3' : 'border-white/10 rotate-0'}`}>
      <Icon size={32} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />
      {isActive && !isVisited && <div className="absolute -inset-2 border border-cyan-500/30 rounded-2xl animate-ping"></div>}
    </div>

    <div className={`transition-all duration-500 pb-6 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-40'}`}>
      <h3 className="text-4xl font-bold text-white tracking-tight whitespace-nowrap">{title}</h3>
      <p className="text-cyan-400 font-mono text-sm mt-1 tracking-widest uppercase">{subtitle}</p>
    </div>

    <div className={`absolute top-28 ${align === 'right' ? 'right-0' : 'left-0'} w-[300px] md:w-[450px] transition-all duration-500 ease-out transform origin-top ${isVisited ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-95 pointer-events-none'}`}>
      {children}
    </div>
  </div>
);

/**
 * PROJECT MODAL COMPONENT
 */
const ProjectModal = ({ project, onClose }) => {
  const [currentImg, setCurrentImg] = useState(0);

  if (!project) return null;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-7xl h-[90vh] bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>

        {/* CLOSE BUTTON (Absolute top-right) */}
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full hover:bg-white/20 transition-colors border border-white/10">
          <X size={20} className="text-white" />
        </button>

        {/* LEFT SIDE: SLIDESHOW (70%) */}
        <div className="w-full md:w-[70%] h-[40vh] md:h-full relative bg-black flex flex-col group">

          {/* Main Image Container */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
            <img
              key={currentImg}
              src={project.images[currentImg].url}
              alt={project.images[currentImg].caption}
              className="max-w-full max-h-full object-contain shadow-2xl animate-fade-in"
            />

            {/* Navigation Arrows */}
            {project.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 p-3 bg-black/50 border border-white/10 rounded-full text-white hover:bg-cyan-500 hover:text-black hover:scale-110 transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 p-3 bg-black/50 border border-white/10 rounded-full text-white hover:bg-cyan-500 hover:text-black hover:scale-110 transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Indicators (Bottom of Left Side) */}
          <div className="h-1 bg-white/10 w-full flex">
            {project.images.map((_, idx) => (
              <div
                key={idx}
                className={`h-full transition-all duration-300 ${idx === currentImg ? 'bg-cyan-400 flex-[2]' : 'bg-transparent flex-1 hover:bg-white/20'}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: DETAILS SIDEBAR (30%) */}
        <div className="w-full md:w-[30%] h-full bg-slate-900/95 border-l border-white/5 flex flex-col overflow-y-auto custom-scrollbar p-6 md:p-8">

          {/* Header Info */}
          <div className="flex items-center gap-3 mb-4 text-cyan-400">
            <project.icon size={28} />
            <h3 className="text-2xl font-bold text-white tracking-tight">{project.title}</h3>
          </div>

          <p className="text-slate-300 leading-relaxed text-sm md:text-base mb-8 border-b border-white/5 pb-8">
            {project.description}
          </p>

          {/* Current Image Caption */}
          <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-8">
            <div className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Image Analysis
            </div>
            <p className="text-white font-medium animate-fade-in">
              {project.images[currentImg].caption}
            </p>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            {project.repoUrl && (
              <button
                onClick={() => window.open(project.repoUrl, '_blank')}
                className="w-full py-4 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold rounded-xl hover:bg-cyan-500 hover:text-black transition-all flex items-center justify-center gap-2 group"
              >
                <Github size={18} className="group-hover:scale-110 transition-transform" />
                View Source Code
              </button>
            )}
            <button
              onClick={() => project.demoUrl ? window.open(project.demoUrl, '_blank') : alert("Live demo coming soon! Check back later.")}
              className={`w-full py-4 border font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${project.demoUrl ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-transparent border-white/5 text-slate-600 cursor-not-allowed'}`}
            >
              {project.demoUrl ? 'Launch Live Demo' : 'Demo Unavailable'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

// PROJECT DATA
const PROJECT_DATA = {
  linuxTask: {
    title: "Linux Task Manager",
    icon: Terminal,
    repoUrl: "https://github.com/GitGuru29/NeoMonitor", // Placeholder
    demoUrl: null, // Set to a URL string if a live demo exists
    description: "A high-performance system monitor built for Linux (NeonMonitor). It provides real-time visualization of system resources including CPU, RAM, Network, and active processes with 'shatter' kill animations.",
    images: [
      { url: '/projects/glass-monitor/1-full.png', caption: "Full Dashboard View: CPU, GPU, RAM & Process List" },
      { url: '/projects/glass-monitor/2-options.png', caption: "Context Menu: Terminate / Kill / Shatter processes" },
      { url: '/projects/glass-monitor/3-shattered.png', caption: "Shatter Effect: Unique physics-based process termination animation" },
      { url: '/projects/glass-monitor/4-no-net.png', caption: "Offline State: Network indicators dim when disconnected" },
      { url: '/projects/glass-monitor/5-net.png', caption: "Online State: Live up/down speed monitoring" },
    ]
  },
  aerolang: {
    title: "AeroLang",
    icon: Cpu,
    repoUrl: "https://github.com/GitGuru29/AeroLang",
    demoUrl: null,
    description: "A specialized programming language designed for modern android development. Features a custom compiler, JNI bridge for C++/Java integration, and a dedicated VS Code extension for a seamless workflow.",
    images: [
      { url: '/projects/aerolang/1-logo.png', caption: "AeroLang Identity: Modern, Fast, and Android-Optimized" },
      { url: '/projects/aerolang/2-features-clean.png', caption: "Key Features: Custom Compiler, JNI Bridge, and Data Persistence" },
      { url: '/projects/aerolang/3-workflow.jpg', caption: "Development Workflow: From Code to APK Generation" },
      { url: '/projects/aerolang/4-code.jpg', caption: "IDE Integration: VS Code Support with Syntax Highlighting" },
    ]
  }
};

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [visitingZone, setVisitingZone] = useState(null);
  const [visitState, setVisitState] = useState('idle');
  const [isMoving, setIsMoving] = useState(false);
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false); // [NEW] Performance Mode
  const [selectedProject, setSelectedProject] = useState(null); // [NEW] Modal State

  // REFS
  const containerRef = useRef(null);
  const charRef = useRef(null);
  const pathRef = useRef(null);
  const leftPathRef = useRef(null);
  const rightPathRef = useRef(null);

  // STATE REFS
  const lastScrollY = useRef(0);
  const isMovingRef = useRef(false);
  const moveTimeoutRef = useRef(null);
  const velocityRef = useRef(0);
  const prevPos = useRef({ x: 0, y: 0 });
  const pendingVisitRef = useRef(null);
  const visitProgressRef = useRef(0);

  const [pathD, setPathD] = useState('');
  const [branchPaths, setBranchPaths] = useState({ left: '', right: '' });

  // INCREASED TOTAL HEIGHT TO 5000px TO FIX FOOTER OVERLAP ON MOBILE
  const SECTION_Y = { skills: 1400, work: 2600, contact: 4100 };
  const ZONES = {
    skills: { start: 0.28, end: 0.36, side: 'left', y: SECTION_Y.skills },
    work: { start: 0.54, end: 0.62, side: 'right', y: SECTION_Y.work },
    contact: { start: 0.82, end: 1.0, side: 'center', y: SECTION_Y.contact }
  };

  const navLinks = [
    { name: 'Start', href: '#home' },
    { name: 'Skills', href: '#skills' },
    { name: 'Work', href: '#work' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    // --- EMAILJS INTEGRATION ---
    // Uncomment the try/catch block below for local use after installing @emailjs/browser
    // and replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', 'YOUR_PUBLIC_KEY' with your actual keys.

    try {
      await emailjs.send(
        'service_m74mwq9',
        'template_ktwyjpk',
        {
          from_email: formData.email,
          message: formData.message,
          date: new Date().toLocaleString()
        },
        'kohy1zbTWHPEUKXq-'
      );

      setIsSending(false);
      setIsSent(true);
      setFormData({ email: '', message: '' });
      setTimeout(() => setIsSent(false), 5000);

    } catch (error) {
      console.error('Failed:', error);
      alert("Failed to send message. Please try again.");
      setIsSending(false);
    }


    // --- SIMULATION FOR PREVIEW ---
    // Remove this setTimeout block when using real EmailJS
    setTimeout(() => {
      console.log("Simulating send:", formData);
      setIsSending(false);
      setIsSent(true);
      setFormData({ email: '', message: '' });
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  const calculatePath = () => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const center = width / 2;
    const curveSize = Math.min(width * 0.40, 350);

    // EXTENDED PATH TO 4350px - Fully Organic S-Wave (No straight lines)
    const d = `M ${center} 50 
               C ${center} 300, ${center - curveSize} 400, ${center - curveSize} 800 
               S ${center} 1200, ${center} 1400 
               S ${center + curveSize} 1800, ${center + curveSize} 2000 
               S ${center} 2400, ${center} 2600 
               S ${center - curveSize} 3000, ${center - curveSize} 3200 
               S ${center} 3900, ${center} 4150`;
    setPathD(d);

    // Branch paths with organic S-curves instead of straight lines
    // [FIX] Offset start points by +/- 12px to avoid visual overlap with the main 16px wide stroke
    const leftStart = `${center - 12} 1400`;
    const leftEnd = `${width * 0.05 + 40} 1400`;
    // Control points offset in Y to create a wave/S-shape
    const leftBranch = `M ${leftStart} C ${center - 100} 1500, ${width * 0.15 + 50} 1300, ${leftEnd}`;

    const rightStart = `${center + 12} 2600`;
    const rightEnd = `${width * 0.95 - 40} 2600`;
    // Control points offset in Y to create a wave/S-shape
    const rightBranch = `M ${rightStart} C ${center + 100} 2500, ${width * 0.85 - 50} 2700, ${rightEnd}`;

    setBranchPaths({ left: leftBranch, right: rightBranch });
  };

  useEffect(() => {
    calculatePath();
    window.addEventListener('resize', calculatePath);
    return () => window.removeEventListener('resize', calculatePath);
  }, []);

  // Main Animation Loop
  useEffect(() => {
    if (!pathD) return;

    let animationFrameId;

    const animate = () => {
      if (!pathRef.current || !charRef.current || !containerRef.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      try {
        if (pathRef.current.getTotalLength() === 0) {
          animationFrameId = requestAnimationFrame(animate);
          return;
        }
      } catch (e) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // --- 1. GLOBAL STATE UPDATES ---
      const currentScrollY = containerRef.current.scrollTop;
      const totalHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      const progress = Math.min(Math.max(currentScrollY / totalHeight, 0), 1);

      const diff = currentScrollY - lastScrollY.current;
      velocityRef.current = velocityRef.current * 0.8 + Math.abs(diff) * 0.2;

      const isNowMoving = velocityRef.current > 0.5;

      // --- 2. RESET LOGIC ---
      if (isNowMoving) {
        if (!isMovingRef.current) {
          setIsMoving(true);
          isMovingRef.current = true;
          if (visitingZone || visitState !== 'idle') {
            setVisitingZone(null);
            setVisitState('idle');
            visitProgressRef.current = 0;
          }
        }
        if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);

        moveTimeoutRef.current = setTimeout(() => {
          setIsMoving(false);
          isMovingRef.current = false;

          if (activeZone && branchProgress > 0.7) {
            setVisitingZone(activeZone);
            setVisitState('walking');
            pendingVisitRef.current = null;
          } else if (pendingVisitRef.current && activeZone === pendingVisitRef.current) {
            setVisitingZone(activeZone);
            setVisitState('walking');
            pendingVisitRef.current = null;
          }
        }, 100);
      }

      // --- 3. PATH CALCULATION ---
      const pathLength = pathRef.current.getTotalLength();
      const mainPoint = pathRef.current.getPointAtLength(progress * pathLength);

      let targetPoint = { x: mainPoint.x, y: mainPoint.y };
      let rotation = 90;

      let activeZone = null;
      let branchProgress = 0;

      Object.entries(ZONES).forEach(([zoneName, coords]) => {
        const approachBuffer = 0.05;
        if (progress >= coords.start - approachBuffer && progress <= coords.end + approachBuffer) {
          activeZone = zoneName;
          const zoneCenter = (coords.start + coords.end) / 2;
          const distFromCenter = Math.abs(progress - zoneCenter);
          const maxDist = (coords.end - coords.start) / 2 + approachBuffer;
          branchProgress = Math.max(0, 1 - (distFromCenter / maxDist));
          branchProgress = branchProgress < 0.5 ? 2 * branchProgress * branchProgress : -1 + (4 - 2 * branchProgress) * branchProgress;
        }
      });

      // --- 4. RENDER LOGIC ---
      if (!visitingZone) {
        const speedFactor = Math.max(0, 1 - (velocityRef.current / 15));
        const mixFactor = branchProgress * speedFactor;

        if (activeZone && mixFactor > 0.01) {
          // DISABLED: The linear interpolation caused the character to float off the visible path.
          // We now keep the character strictly on the main spine until the 'visiting' state triggers.

          /* ORIGINAL CLIPPED LOGIC for reference:
          let branchPath = null;
          if (activeZone === 'skills') branchPath = leftPathRef.current;
          if (activeZone === 'work') branchPath = rightPathRef.current;

          if (branchPath) {
             const bLen = branchPath.getTotalLength();
             const peekDist = Math.min(branchProgress * 0.3, 0.3);
             const branchPoint = branchPath.getPointAtLength(peekDist * bLen);
             
             if (branchPoint) {
               targetPoint.x = mainPoint.x + (branchPoint.x - mainPoint.x) * mixFactor;
               targetPoint.y = mainPoint.y + (branchPoint.y - mainPoint.y) * mixFactor;
               visitProgressRef.current = peekDist; 
             }
          }
          */
        }

        const dx = targetPoint.x - prevPos.current.x;
        const dy = targetPoint.y - prevPos.current.y;
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
          rotation = Math.atan2(dy, dx) * (180 / Math.PI);
        }

        charRef.current.style.transform = `translate(${targetPoint.x}px, ${targetPoint.y}px) rotate(${rotation + 90}deg) scale(1)`;

      } else {
        // VISITING
        let branchPath = null;
        if (visitingZone === 'skills') branchPath = leftPathRef.current;
        if (visitingZone === 'work') branchPath = rightPathRef.current;

        if (branchPath) {
          visitProgressRef.current = Math.min(visitProgressRef.current + 0.015, 1);
          const bLen = branchPath.getTotalLength();
          targetPoint = branchPath.getPointAtLength(visitProgressRef.current * bLen);

          const lookAhead = Math.min((visitProgressRef.current * bLen) + 5, bLen);
          const nextP = branchPath.getPointAtLength(lookAhead);
          rotation = Math.atan2(nextP.y - targetPoint.y, nextP.x - targetPoint.x) * (180 / Math.PI);

          charRef.current.style.transform = `translate(${targetPoint.x}px, ${targetPoint.y}px) rotate(${rotation + 90}deg) scale(1.2)`;

          if (visitProgressRef.current >= 0.99 && visitState !== 'arrived') {
            setVisitState('arrived');
          }
        } else if (visitingZone === 'contact') {
          const contactY = SECTION_Y.contact;
          const lerp = 0.1;
          // FORCE CENTER: Ignore mainPoint.x drift and use exact container center
          const centerX = containerRef.current ? containerRef.current.clientWidth / 2 : mainPoint.x;

          targetPoint.x = prevPos.current.x + (centerX - prevPos.current.x) * lerp;
          targetPoint.y = prevPos.current.y + (contactY + 100 - prevPos.current.y) * lerp;

          charRef.current.style.transform = `translate(${targetPoint.x}px, ${targetPoint.y}px) rotate(0deg) scale(1.2)`;

          if (Math.abs(targetPoint.y - (contactY + 100)) < 5 && visitState !== 'arrived') {
            setVisitState('arrived');
          }
        }
      }

      prevPos.current = targetPoint;
      lastScrollY.current = currentScrollY;

      if (progress < 0.2) setActiveSection('home');
      else if (progress < 0.45) setActiveSection('skills');
      else if (progress < 0.75) setActiveSection('work');
      else setActiveSection('contact');

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    };
  }, [pathD, visitingZone, visitState]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const zoneKey = id.replace('#', '');
    const zone = ZONES[zoneKey];

    if (containerRef.current) {
      if (zone) {
        pendingVisitRef.current = zoneKey;
        setVisitingZone(null);
        setVisitState('idle');
        visitProgressRef.current = 0;

        if (zoneKey === 'contact') {
          containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
        } else {
          const totalScrollable = containerRef.current.scrollHeight - containerRef.current.clientHeight;
          const centerProgress = (zone.start + zone.end) / 2;
          containerRef.current.scrollTo({ top: centerProgress * totalScrollable, behavior: 'smooth' });
        }
      } else if (id === '#home') {
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const getVisitingSide = () => {
    if (visitState === 'arrived') return 'arrived';
    if (visitState === 'walking') return 'walking';
    return null;
  };

  return (
    <div className="fixed inset-0 bg-[#02040a] flex items-center justify-center font-sans overflow-hidden">

      <style>{`
        @keyframes leg-move {
          from { transform: translateY(0px); }
          to { transform: translateY(-4px); }
        }
        .animate-bounce-slight { animation: bounce-slight 0.5s infinite; }
        @keyframes bounce-slight {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .glass-scroll::-webkit-scrollbar { display: none; }
        .glass-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 10s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        /* Hide scrollbar for nav items */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* AMBIENT BACKGROUND (Fallback / Low Power) */}
      <div id="ambient-background" className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${isLowPower ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950/0 to-slate-950/0"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950/0 to-slate-950/0"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[150px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="absolute w-full max-w-[1600px] h-[95vh] md:h-[92vh] rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-0">
        {!isLowPower && <ThreeCanvas scrollContainer={containerRef} />}
      </div>

      {/* PERFORMANCE TOGGLE */}
      <button
        onClick={() => setIsLowPower(!isLowPower)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all shadow-lg group"
        title={isLowPower ? "Enable High Quality (3D)" : "Enable Low Power Mode (2D)"}
      >
        {isLowPower ? <ZapOff size={20} /> : <Zap size={20} className="fill-current" />}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {isLowPower ? "Enable 3D Effects" : "Low Power Mode"}
        </span>
      </button>

      <Loader />

      {/* 3D GLASS CONTAINER */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[1600px] h-[95vh] md:h-[92vh] rounded-[40px] 
                   bg-slate-950/40 backdrop-blur-2xl border border-white/10 
                   shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)]
                   overflow-y-auto overflow-x-hidden glass-scroll z-10"
      >

        {/* INNER CONTENT WRAPPER - INCREASED HEIGHT TO 5000px */}
        <div className="relative w-full h-[5000px]">

          {/* SVG PATHS */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path d={pathD} fill="none" stroke="rgba(34,211,238,0.15)" strokeWidth="16" strokeLinecap="round" filter="url(#glow)" />
            <path ref={pathRef} d={pathD} fill="none" stroke="rgba(71,85,105,0.4)" strokeWidth="2" strokeDasharray="8 8" strokeLinecap="round" />
            <path ref={leftPathRef} d={branchPaths.left} fill="none" stroke="rgba(34,211,238,0.2)" strokeWidth="6" strokeLinecap="round" strokeDasharray="4 4" />
            <path ref={rightPathRef} d={branchPaths.right} fill="none" stroke="rgba(34,211,238,0.2)" strokeWidth="6" strokeLinecap="round" strokeDasharray="4 4" />
          </svg>

          {/* CHARACTER */}
          <ShadowCharacter charRef={charRef} isMoving={isMoving} visitingSide={getVisitingSide()} />

          {/* STICKY NAV */}
          <nav className="sticky top-0 w-full z-50 py-4 md:py-6 px-4 md:px-8 transition-all duration-300">
            <div className="bg-black/20 backdrop-blur-xl border border-white/5 rounded-full px-4 py-3 md:px-6 md:py-3 flex justify-between items-center shadow-lg">
              <div className="font-bold text-lg md:text-xl tracking-wider text-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_cyan]"></div>
                <span className="hidden md:inline">Siluna <span className="text-cyan-400">Nusal</span></span>
                <span className="md:hidden">SN<span className="text-cyan-400">.</span></span>
              </div>

              {/* Responsive Nav Links */}
              <div className="flex gap-1 md:gap-2 overflow-x-auto no-scrollbar">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`
                      px-3 py-1 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap
                      ${activeSection === link.href.substring(1)
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* HOME SECTION */}
          <div id="home" className="absolute w-full top-[200px] flex justify-center z-20 pointer-events-none">
            <div className="text-center pointer-events-auto px-4 animate-fade-in-up">
              <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6 backdrop-blur-sm">Available for Hire</div>
              <h1 className="text-4xl md:text-8xl font-bold mb-6 tracking-tight drop-shadow-2xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Building the Future
                </span>
              </h1>
              <p className="text-base md:text-xl text-slate-400 mb-8 max-w-xl md:max-w-2xl mx-auto leading-relaxed">
                I'm a Full Stack Developer specializing in building exceptional digital experiences.
              </p>
              <div className="flex justify-center gap-4">
                <button onClick={(e) => scrollToSection(e, '#work')} className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]">View Projects</button>
                <button onClick={() => alert("Resume download simulation")} className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 hover:scale-105 transition-all flex items-center gap-2 group">
                  <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                  <span>Resume</span>
                </button>
              </div>
            </div>
          </div>

          {/* SKILLS SECTION */}
          <div id="skills" className="absolute w-full top-[1400px] z-20 pointer-events-none">
            <MapNode title="Expertise" subtitle="Tech Stack" icon={Cpu} isActive={activeSection === 'skills'} isVisited={visitState === 'arrived'} align="left">
              <div className="bg-black/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl pointer-events-auto">
                <div className="flex items-center gap-3 mb-6 text-cyan-400"><Sparkles size={20} /><span className="font-bold tracking-widest">CORE COMPETENCIES</span></div>
                <div className="space-y-6">
                  <div><h4 className="text-white font-bold mb-2 text-sm uppercase text-slate-500">Frontend</h4><div className="flex flex-wrap gap-2">{['React', 'Three.js', 'Tailwind', 'Next.js'].map(s => <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">{s}</span>)}</div></div>
                  <div><h4 className="text-white font-bold mb-2 text-sm uppercase text-slate-500">Backend</h4><div className="flex flex-wrap gap-2">{['Node.js', 'PostgreSQL', 'Docker', 'AWS'].map(s => <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">{s}</span>)}</div></div>
                  <div><h4 className="text-white font-bold mb-2 text-sm uppercase text-slate-500">Systems & Mobile</h4><div className="flex flex-wrap gap-2">{['Android', 'C++', 'Compiler Design', 'JNI'].map(s => <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">{s}</span>)}</div></div>
                </div>
              </div>
            </MapNode>
          </div>

          {/* WORK SECTION */}
          <div id="work" className="absolute w-full top-[2600px] z-20 pointer-events-none">
            <MapNode title="Selected Work" subtitle="Featured Projects" icon={Code2} isActive={activeSection === 'work'} isVisited={visitState === 'arrived'} align="right">
              <div className="bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl pointer-events-auto space-y-4">
                <div onClick={() => setSelectedProject(PROJECT_DATA.linuxTask)} className="group bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-cyan-500/50 transition-all hover:bg-white/10 cursor-pointer relative overflow-hidden">
                  {/* HOVER GLOW EFFECT */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                  <div className="flex items-center gap-3 mb-2">
                    <Terminal size={20} className="text-cyan-400" />
                    <h4 className="text-lg font-bold text-white">Linux Task Manager</h4>
                    <Maximize2 size={14} className="ml-auto text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-slate-400">A fully functional CLI process manager implementation. Handles process creation, monitoring, and termination in real-time.</p>
                </div>

                <div onClick={() => setSelectedProject(PROJECT_DATA.aerolang)} className="group bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-cyan-500/50 transition-all hover:bg-white/10 cursor-pointer relative overflow-hidden">
                  {/* HOVER GLOW EFFECT */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                  <div className="flex items-center gap-3 mb-2">
                    <Cpu size={20} className="text-cyan-400" />
                    <h4 className="text-lg font-bold text-white">AeroLang</h4>
                    <Maximize2 size={14} className="ml-auto text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-slate-400">A custom programming language for Android with JNI integration and VS Code support.</p>
                </div>
                <div className="group bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-purple-500/50 transition-all hover:bg-white/10 cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <Code2 size={20} className="text-purple-400" />
                    <h4 className="text-lg font-bold text-white">Social API Service</h4>
                  </div>
                  <p className="text-sm text-slate-400">Microservices backend handling 1M+ req/day.</p>
                </div>
              </div>
            </MapNode>
          </div>

          {/* CONTACT SECTION (Moved Down to 4100px) */}
          <div id="contact" className="absolute w-full top-[4100px] flex justify-center z-20 pointer-events-none">
            <div className="relative text-center w-full max-w-xl mx-4">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${visitState === 'arrived' ? 'bg-cyan-500/20 scale-110 shadow-[0_0_50px_cyan]' : 'bg-slate-900 border border-slate-800'}`}>
                <Mail size={32} className={visitState === 'arrived' ? 'text-cyan-400' : 'text-slate-600'} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 pointer-events-auto drop-shadow-lg text-cyan-400">Let's Work Together</h2>

              {/* FIX: Ensure visibility logic includes activeSection OR visitState */}
              <div className={`mt-8 bg-black/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl text-left transition-all duration-700 pointer-events-auto ${activeSection === 'contact' || visitState === 'arrived' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                {isSent ? (
                  <div className="text-center py-12"><CheckCircle className="text-green-500 mx-auto mb-4" size={48} /><h3 className="text-xl font-bold text-white">Message Sent!</h3></div>
                ) : (
                  <>
                    <form className="space-y-4" onSubmit={handleContactSubmit}>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-500 focus:bg-white/10 focus:outline-none text-white transition-all placeholder:text-slate-600" placeholder="Email Address" />
                      <textarea rows="3" required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-500 focus:bg-white/10 focus:outline-none text-white transition-all placeholder:text-slate-600" placeholder="Message"></textarea>
                      <button disabled={isSending} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex justify-center items-center gap-2">{isSending ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Message</>}</button>
                    </form>

                    {/* Social Links Row */}
                    <div className="flex justify-center flex-wrap gap-4 md:gap-6 mt-8 pt-6 border-t border-white/10">
                      <a href="https://github.com/GitGuru29" className="text-slate-400 hover:text-white hover:scale-110 transition-all"><GithubIcon size={24} /></a>
                      <a href="https://linkedin.com/in/siluna-dangalla-0744a02b1/" className="text-slate-400 hover:text-blue-400 hover:scale-110 transition-all"><LinkedinIcon size={24} /></a>
                      <a href="https://web.facebook.com/siluna.dangalla/" className="text-slate-400 hover:text-blue-600 hover:scale-110 transition-all"><FacebookIcon size={24} /></a>
                      <a href="https://discord.com/users/1094631093757558834" className="text-slate-400 hover:text-indigo-400 hover:scale-110 transition-all"><DiscordIcon size={24} /></a>
                      <a href="https://wa.me/94740478458" className="text-slate-400 hover:text-green-400 hover:scale-110 transition-all"><WhatsappIcon size={24} /></a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER - BOTTOM OF 5000px CONTAINER */}
          <div className="absolute bottom-10 w-full text-center z-20">
            <p className="text-slate-500 text-xs tracking-widest uppercase">
              © {new Date().getFullYear()} Siluna Nusal. All Rights Reserved.
            </p>
          </div>

        </div>
      </div>

      {/* MODAL LAYER - Moved outside to fix positioning context */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}