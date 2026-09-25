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
import PaperDeck, { PaperPage } from '../components/PaperDeck';
import { projectsData } from '../data/projects';
import { CATEGORIES } from '../data/categories';

/**
 * Home — single-page route as a paper pad.
 *
 * Every chapter is one full-screen sheet of the same ream of paper; swiping /
 * scrolling peels the current sheet forward to reveal the next.
 *
 *   00 — HERO          | front page
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

            {/* ── THE PAD ── */}
            <PaperDeck>
                {/* 00 · FRONT PAGE */}
                <PaperPage
                    id="hero"
                    chapter="00"
                    watermark="MASTHEAD"
                    bare
                >
                    <HeroOverlay />
                    <StatsTicker />
                </PaperPage>

                {/* 01 · SELECTED WORK */}
                <PaperPage
                    id="projects"
                    chapter="01"
                    kicker="Selected Work"
                    title="Projects"
                    watermark="SHIP"
                    lede="Systems I've built and shipped — daemons, compilers, and native tooling, engineered for determinism and speed."
                >
                    <ProjectsOverlay projects={filteredProjects} isFiltered={isFiltered}>
                        <div className="w-full" id="portfolio-filters">
                            <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                        </div>
                    </ProjectsOverlay>
                </PaperPage>

                {/* 02 · EXPERIENCE */}
                <PaperPage
                    id="timeline"
                    chapter="02"
                    kicker="Experience"
                    title="Timeline"
                    watermark="ITERATE"
                    lede="A build log of the journey so far — milestones, contributions, and the skills accumulated along the way."
                >
                    <TimelineSection />
                </PaperPage>

                {/* 03 · SKILLS */}
                <PaperPage
                    id="skills"
                    chapter="03"
                    kicker="Skills"
                    title="Capabilities"
                    watermark="BUILD"
                    lede="C++, Kotlin, kernel internals, and LLVM — the disciplines I reach for when something needs to be built fast, small, and correct."
                >
                    <SkillsOverlay />
                </PaperPage>

                {/* 04 · GITHUB */}
                <PaperPage
                    id="github"
                    chapter="04"
                    kicker="GitHub"
                    title="Open Source"
                    watermark="OPEN"
                    lede="A year of building in public — drag the skyline to orbit the contribution history below."
                >
                    <GitHubActivitySection />
                </PaperPage>

                {/* 05 · RESEARCH */}
                <PaperPage
                    id="research"
                    chapter="05"
                    kicker="Research"
                    title="Currently Exploring"
                    watermark="ERA"
                    lede="The problems on my workbench right now, and where the work is heading next."
                >
                    <ActiveResearchOverlay />
                </PaperPage>

                {/* 06 · CREDENTIALS */}
                <PaperPage
                    id="recognition"
                    chapter="06"
                    kicker="Credentials"
                    title="Certificates & Badges"
                    watermark="REVIEW"
                    lede="Credentialed milestones — certifications, awards, and achievements."
                >
                    <div className="paper-page__block">
                        <span className="paper-page__block-label">Industry Certificates</span>
                        <CertificatesOverlay />
                    </div>

                    <div className="paper-page__block">
                        <span className="paper-page__block-label">Community Badges</span>
                        <BadgesOverlay />
                    </div>
                </PaperPage>

                {/* 07 · TESTIMONIALS */}
                <PaperPage
                    id="testimonials"
                    chapter="07"
                    kicker="Testimonials"
                    title="Collaborator Voices"
                    watermark="VOICES"
                    lede="What collaborators, leaders, and clients say about working together."
                >
                    <TestimonialsOverlay />
                </PaperPage>

                {/* 08 · CONTACT */}
                <PaperPage
                    id="contact"
                    chapter="08"
                    kicker="Contact"
                    title="Get in Touch"
                    watermark="EMAIL"
                    lede="Building something on systems, Android, or the edges of performance? Let's talk."
                >
                    <Contact />
                    <Footer compact />
                </PaperPage>
            </PaperDeck>

            {/* ── Floating Terminal overlay ── */}
            <TerminalSection />
        </div>
    );
}