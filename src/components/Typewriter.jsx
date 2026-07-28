import React, { useState, useEffect, useRef, useMemo } from 'react';

/**
 * Ultra-performance, zero-layout-shift Typewriter component.
 * Ensures container dimensions remain 100% stable while typing to prevent page scroll jitter.
 * 
 * @param {string|string[]} text - Text or array of strings to type/cycle
 * @param {number} typingSpeed - Delay in ms per character typed
 * @param {number} deletingSpeed - Delay in ms per character deleted
 * @param {number} pauseDuration - Delay in ms when a word is fully typed before deleting
 * @param {boolean} loop - Whether to loop through array of strings continuously
 * @param {boolean} triggerOnScroll - If true, typing only starts when scrolled into view
 * @param {boolean} reserveSpace - Reserve container width/height of longest phrase to avoid layout shift
 * @param {string} cursorChar - Cursor symbol (default: '_')
 * @param {string} className - Additional CSS class name
 * @param {object} style - Custom inline styles
 */
export default function Typewriter({
    text = [],
    typingSpeed = 60,
    deletingSpeed = 30,
    pauseDuration = 2400,
    loop = true,
    triggerOnScroll = true,
    reserveSpace = true,
    cursorChar = '_',
    className = '',
    style = {},
}) {
    const phrases = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
    
    // Find longest phrase for layout space reservation
    const longestPhrase = useMemo(() => {
        if (!phrases.length) return '';
        return phrases.reduce((longest, current) => 
            current.length > longest.length ? current : longest, phrases[0]
        );
    }, [phrases]);

    const [displayedText, setDisplayedText] = useState('');
    const [isInView, setIsInView] = useState(!triggerOnScroll);
    const containerRef = useRef(null);

    const stateRef = useRef({
        phraseIdx: 0,
        charIdx: 0,
        isDeleting: false,
    });

    // Intersection Observer for scroll activation
    useEffect(() => {
        if (!triggerOnScroll) {
            setIsInView(true);
            return;
        }

        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [triggerOnScroll]);

    // Typing animation loop
    useEffect(() => {
        if (!isInView || !phrases.length) return;

        let timer;

        const tick = () => {
            const { phraseIdx, charIdx, isDeleting } = stateRef.current;
            const currentPhrase = phrases[phraseIdx] || '';

            if (!isDeleting) {
                const nextCharIdx = charIdx + 1;
                setDisplayedText(currentPhrase.slice(0, nextCharIdx));
                stateRef.current.charIdx = nextCharIdx;

                if (nextCharIdx === currentPhrase.length) {
                    if (!loop && phraseIdx === phrases.length - 1) {
                        return; // Stop at end if not looping
                    }

                    timer = setTimeout(() => {
                        stateRef.current.isDeleting = true;
                        tick();
                    }, pauseDuration);
                    return;
                }

                timer = setTimeout(tick, typingSpeed);

            } else {
                const nextCharIdx = charIdx - 1;
                setDisplayedText(currentPhrase.slice(0, nextCharIdx));
                stateRef.current.charIdx = nextCharIdx;

                if (nextCharIdx === 0) {
                    stateRef.current.isDeleting = false;
                    stateRef.current.phraseIdx = (phraseIdx + 1) % phrases.length;
                    
                    timer = setTimeout(tick, 200);
                    return;
                }

                timer = setTimeout(tick, deletingSpeed);
            }
        };

        timer = setTimeout(tick, typingSpeed);

        return () => clearTimeout(timer);
    }, [isInView, phrases, typingSpeed, deletingSpeed, pauseDuration, loop]);

    return (
        <span
            ref={containerRef}
            className={`typewriter-container ${className}`}
            style={{
                position: 'relative',
                display: 'inline-block',
                verticalAlign: 'top',
                lineHeight: 'inherit',
                ...style,
            }}
        >
            {/* Space Reservation Layer — Keeps exact box height/width constant to prevent layout shifts */}
            {reserveSpace && (
                <span
                    aria-hidden="true"
                    style={{
                        opacity: 0,
                        visibility: 'hidden',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        display: 'inline-block',
                    }}
                >
                    {longestPhrase}
                    <span style={{ marginLeft: '2px' }}>{cursorChar}</span>
                </span>
            )}

            {/* Active Typing Text Layer */}
            <span
                style={reserveSpace ? {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                } : {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <span>{displayedText}</span>
                <span
                    className="lux-blink"
                    style={{
                        color: 'rgba(212,175,55,0.95)',
                        marginLeft: '2px',
                        fontWeight: 'bold',
                        textShadow: '0 0 8px rgba(212,175,55,0.6)',
                    }}
                >
                    {cursorChar}
                </span>
            </span>
        </span>
    );
}
