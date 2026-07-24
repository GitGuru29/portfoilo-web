import re

with open('/Users/siluna/Desktop/portfoilo-web-main/src/components/HeroOverlay.jsx', 'r') as f:
    content = f.read()

# 1. Swap the GSAP animation
old_gsap = """            // Fade in about panel smoothly without ASCII
            scrub.fromTo(aboutRef.current,
                { autoAlpha: 0, x: 40 },
                { autoAlpha: 1, x: 0, duration: 1.6, ease: 'power2.out' },
                0.9
            );

            // Fade in the new headset portrait on the left side
            scrub.fromTo(aboutPhotoRef.current,
                { autoAlpha: 0, scale: 0.95, y: 30 },
                { autoAlpha: 1, scale: 1, y: 0, duration: 1.6, ease: 'power2.out' },
                0.9
            );"""
new_gsap = """            // Fade in about panel on the left side
            scrub.fromTo(aboutRef.current,
                { autoAlpha: 0, y: 30 },
                { autoAlpha: 1, y: 0, duration: 1.6, ease: 'power2.out' },
                0.9
            );

            // Fade in the new headset portrait on the right side
            scrub.fromTo(aboutPhotoRef.current,
                { autoAlpha: 0, scale: 0.95, x: 40 },
                { autoAlpha: 1, scale: 1, x: 0, duration: 1.6, ease: 'power2.out' },
                0.9
            );"""
content = content.replace(old_gsap, new_gsap)

# 2. Extract aboutPhotoRef block
old_photo = """                {/* New dramatic headset portrait (fades in on scroll) */}
                    <img
                        ref={aboutPhotoRef}
                        src="/assets/headset-profile.png"
                        alt="Siluna RGB Headset"
                        style={{
                            position: 'absolute',
                            bottom: 'clamp(20px, 4vh, 60px)',
                            left: 'clamp(28px, 4vw, 52px)',
                            width: '80%', maxWidth: 450,
                            objectFit: 'contain',
                            visibility: 'hidden', opacity: 0,
                            zIndex: 1, // behind the text
                            pointerEvents: 'none',
                            filter: 'drop-shadow(0 0 50px rgba(0,0,0,0.9))'
                        }}
                    />"""

new_photo = """                    {/* New dramatic headset portrait (fades in on scroll on Right side) */}
                    <img
                        ref={aboutPhotoRef}
                        src="/assets/headset-profile.png"
                        alt="Siluna RGB Headset"
                        style={{
                            position: 'absolute',
                            top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%', maxWidth: 700,
                            objectFit: 'contain',
                            visibility: 'hidden', opacity: 0,
                            zIndex: 10,
                            pointerEvents: 'none',
                            filter: 'drop-shadow(0 0 60px rgba(0,0,0,0.9))'
                        }}
                    />"""

old_about = """                    {/* ── About panel — Clean, unboxed text layout ── */}
                    <div
                        ref={aboutRef}
                        id="about"
                        style={{
                            position: 'absolute',
                            top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '85%', maxWidth: 440,
                            visibility: 'hidden', opacity: 0,
                            zIndex: 20,
                            padding: '0 20px',
                        }}
                    >
                        {/* Gold accent line & Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                            <span style={{
                                display: 'block', width: 40, height: 1,
                                background: 'linear-gradient(to right, rgba(212,175,55,0.6), transparent)',
                            }} />
                            <h2 style={{
                                fontFamily: 'Space Grotesk, sans-serif',
                                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                                fontWeight: 700,
                                color: '#FAFAFA',
                                margin: 0,
                                textTransform: 'uppercase',
                                letterSpacing: '-0.02em',
                            }}>
                                About <span style={{ color: '#D4AF37' }}>Me</span>
                            </h2>
                        </div>

                        {/* Clean typography content (no background box) */}
                        <div style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
                            lineHeight: 1.8,
                            color: 'rgba(255,255,255,0.65)',
                            display: 'flex', flexDirection: 'column', gap: 16,
                        }}>
                            <p style={{ margin: 0 }}>
                                I am a final-year Software Engineering undergraduate with a deep focus on building 
                                high-performance, system-level software.
                            </p>
                            <p style={{ margin: 0 }}>
                                My work spans native Android development, Linux-based tooling, and low-level system 
                                behaviour. I prioritize efficiency, fine-grained control, and absolute reliability.
                            </p>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)' }}>
                                From writing custom Android launchers to engineering Linux utilities — I build software 
                                that performs predictably and scales effortlessly under pressure.
                            </p>
                        </div>

                        {/* Link row */}
                        <div style={{
                            display: 'flex', gap: 24,
                            marginTop: 32,
                        }}>
                            <a
                                href="#projects"
                                className="lux-about-link lux-about-link--gold"
                                onClick={e => {
                                    e.preventDefault();
                                    const el = document.getElementById('portfolio-filters');
                                    if (el && window.lenis) window.lenis.scrollTo(el, { offset: -50, duration: 1.2 });
                                }}
                            >
                                View Projects →
                            </a>
                            <a
                                href="/Siluna_Nusal_CV.pdf"
                                target="_blank" rel="noopener noreferrer"
                                className="lux-about-link"
                            >
                                Download CV ↗
                            </a>
                        </div>
                    </div>"""

new_about = """                {/* ── About panel — Clean, unboxed text layout (Left side) ── */}
                    <div
                        ref={aboutRef}
                        id="about"
                        style={{
                            position: 'absolute',
                            top: '55%', left: 'clamp(28px, 4vw, 52px)',
                            transform: 'translateY(-50%)',
                            width: '85%', maxWidth: 460,
                            visibility: 'hidden', opacity: 0,
                            zIndex: 20,
                            padding: 0,
                        }}
                    >
                        {/* Gold accent line & Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                            <span style={{
                                display: 'block', width: 40, height: 1,
                                background: 'linear-gradient(to right, rgba(212,175,55,0.6), transparent)',
                            }} />
                            <h2 style={{
                                fontFamily: 'Space Grotesk, sans-serif',
                                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                                fontWeight: 700,
                                color: '#FAFAFA',
                                margin: 0,
                                textTransform: 'uppercase',
                                letterSpacing: '-0.02em',
                            }}>
                                About <span style={{ color: '#D4AF37' }}>Me</span>
                            </h2>
                        </div>

                        {/* Clean typography content (no background box) */}
                        <div style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
                            lineHeight: 1.8,
                            color: 'rgba(255,255,255,0.65)',
                            display: 'flex', flexDirection: 'column', gap: 16,
                        }}>
                            <p style={{ margin: 0 }}>
                                I am a final-year Software Engineering undergraduate with a deep focus on building 
                                high-performance, system-level software.
                            </p>
                            <p style={{ margin: 0 }}>
                                My work spans native Android development, Linux-based tooling, and low-level system 
                                behaviour. I prioritize efficiency, fine-grained control, and absolute reliability.
                            </p>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)' }}>
                                From writing custom Android launchers to engineering Linux utilities — I build software 
                                that performs predictably and scales effortlessly under pressure.
                            </p>
                        </div>

                        {/* Link row */}
                        <div style={{
                            display: 'flex', gap: 24,
                            marginTop: 32,
                        }}>
                            <a
                                href="#projects"
                                className="lux-about-link lux-about-link--gold"
                                onClick={e => {
                                    e.preventDefault();
                                    const el = document.getElementById('portfolio-filters');
                                    if (el && window.lenis) window.lenis.scrollTo(el, { offset: -50, duration: 1.2 });
                                }}
                            >
                                View Projects →
                            </a>
                            <a
                                href="/Siluna_Nusal_CV.pdf"
                                target="_blank" rel="noopener noreferrer"
                                className="lux-about-link"
                            >
                                Download CV ↗
                            </a>
                        </div>
                    </div>"""

if old_gsap in content:
    content = content.replace(old_gsap, new_gsap)
    print("GSAP replaced")
else:
    print("GSAP failed")

if old_photo in content:
    content = content.replace(old_photo, new_about)
    print("Photo replaced")
else:
    print("Photo failed")

if old_about in content:
    content = content.replace(old_about, new_photo)
    print("About replaced")
else:
    print("About failed")

with open('/Users/siluna/Desktop/portfoilo-web-main/src/components/HeroOverlay.jsx', 'w') as f:
    f.write(content)
