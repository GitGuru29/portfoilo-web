import React, { useState, useMemo } from 'react';
import HeroOverlay from '../components/HeroOverlay';
import SkillsOverlay from '../components/SkillsOverlay';
import GitHubActivitySection from '../components/GitHubActivitySection';
import ProjectsOverlay from '../components/ProjectsOverlay';
import ActiveResearchOverlay from '../components/ActiveResearchOverlay';
import TestimonialsOverlay from '../components/TestimonialsOverlay';
import CertificatesOverlay from '../components/CertificatesOverlay';
import BadgesOverlay from '../components/BadgesOverlay';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import StatsTicker from '../components/StatsTicker';
import TimelineSection from '../components/TimelineSection';
import TerminalSection from '../components/TerminalSection';
import SectionDotsNav from '../components/SectionDotsNav';
import SectionBanner from '../components/SectionBanner';
import KineticScene from '../components/KineticScene';
import { projectsData } from '../data/projects';
import { CATEGORIES } from '../data/categories';

/**
 * Home — single-page route.
 *
 *   00 — HERO          | intro + stats ticker
 *   01 — PROJECTS      | selected work
 *   02 — EXPERIENCE    | timeline
 *   03 — SKILLS        | capabilities
 *   04 — GITHUB        | open-source activity
 *   05 — RESEARCH      | work in progress
 *   06 — CREDENTIALS   | certificates & badges
 *   07 — TESTIMONIALS  | collaborator feedback
 *   08 — CONTACT       | contact + footer
 */
export default function Home() {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES.ALL.id);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProjects = useMemo(() => {
        return projectsData.filter(project => {
            const matchesCategory = activeCategory === CATEGORIES.ALL.id || project.categoryId === activeCategory;
            const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  project.role.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    const isFiltered = activeCategory !== CATEGORIES.ALL.id || searchQuery.trim() !== '';

    return (
        <div className="relative z-10 w-full bg-[var(--color-quantum-dark)]">
            {/* Chapter rail — fixed right-edge navigation */}
            <SectionDotsNav />

            {/* ── CHAPTER 00 · PROLOGUE ── */}
            <section id="hero" className="snap-section">
                <HeroOverlay />
                <StatsTicker />
            </section>

            {/* ── INTERLUDE · SHIP IT ── */}
            <KineticScene word="SHIP IT" note="Selected Work · Press Run 01" variant="sky" />

            {/* ── 01 · SELECTED WORK ── */}
            <SectionBanner
                id="projects"
                chapter="01"
                kicker="Selected Work"
                title="Projects"
                lede="Systems I've built and shipped — daemons, compilers, and native tooling, engineered for determinism and speed."
            />
            <section id="projects" className="snap-section story-section">
                <ProjectsOverlay projects={filteredProjects} isFiltered={isFiltered}>
                    <div className="w-full max-w-6xl mx-auto px-6 mb-16 md:mb-24 bg-transparent" id="portfolio-filters">
                        <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>
                </ProjectsOverlay>
            </section>

            {/* ── INTERLUDE · ITERATE ── */}
            <KineticScene word="ITERATE" note="Experience · Press Run 02" variant="vrm" />

            {/* ── 02 · EXPERIENCE ── */}
            <SectionBanner
                id="timeline"
                chapter="02"
                kicker="Experience"
                title="Timeline"
                lede="A build log of the journey so far — milestones, contributions, and the skills accumulated along the way."
            />
            <section id="timeline" className="snap-section story-section">
                <TimelineSection />
            </section>

            {/* ── 03 · SKILLS ── */}
            <SectionBanner
                id="skills"
                chapter="03"
                kicker="Skills"
                title="Capabilities"
                lede="C++, Kotlin, kernel internals, and LLVM — the disciplines I reach for when something needs to be built fast, small, and correct."
            />
            <section id="skills" className="snap-section story-section">
                <SkillsOverlay />
            </section>

            {/* ── 04 · GITHUB ── */}
            <SectionBanner
                id="github"
                chapter="04"
                kicker="GitHub"
                title="Open Source"
                lede="A year of building in public — drag the skyline to orbit the contribution history below."
            />
            <section id="github" className="snap-section story-section">
                <GitHubActivitySection />
            </section>

            {/* ── 05 · RESEARCH ── */}
            <SectionBanner
                id="research"
                chapter="05"
                kicker="Research"
                title="Currently Exploring"
                lede="The problems on my workbench right now, and where the work is heading next."
            />
            <section id="research" className="snap-section story-section">
                <ActiveResearchOverlay />
            </section>

            {/* ── INTERLUDE · REVIEW ── */}
            <KineticScene word="REVIEW" note="Credentials · Press Run 06" variant="ink" />

            {/* ── 06 · CREDENTIALS ── */}
            <SectionBanner
                id="recognition"
                chapter="06"
                kicker="Credentials"
                title="Certificates & Badges"
                lede="Credentialed milestones — certifications, awards, and achievements."
            />
            <div id="recognition" className="snap-section story-section">
                <CertificatesOverlay />
                <BadgesOverlay />
            </div>

            {/* ── 07 · TESTIMONIALS ── */}
            <SectionBanner
                id="testimonials"
                chapter="07"
                kicker="Testimonials"
                title="Collaborator Voices"
                lede="What collaborators, leaders, and clients say about working together."
            />
            <section id="testimonials" className="snap-section story-section">
                <TestimonialsOverlay />
            </section>

            {/* ── INTERLUDE · OPEN CHANNEL ── */}
            <KineticScene word="EMAIL ME" note="Open Channel · Press Run 08" variant="sky" />

            {/* ── 08 · CONTACT ── */}
            <SectionBanner
                id="contact"
                chapter="08"
                kicker="Contact"
                title="Get in Touch"
                lede="Building something on systems, Android, or the edges of performance? Let's talk."
            />
            <section id="contact" className="snap-section story-section">
                <Contact />
                <Footer />
            </section>

            {/* ── Floating Terminal overlay ── */}
            <TerminalSection />
        </div>
    );
}