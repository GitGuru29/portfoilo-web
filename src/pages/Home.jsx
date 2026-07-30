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
import { projectsData } from '../data/projects';
import { CATEGORIES } from '../data/categories';

/**
 * Re-organized Home Page Layout
 * 
 * Optimized Section Flow:
 *  1. Hero & Metrics
 *  2. Featured Projects (Primary Showcase)
 *  3. Experience & Build Log (Work History)
 *  4. Skills & Competencies (Technical Stack)
 *  5. GitHub Activity (Open Source Contributions)
 *  6. Active Research (Systems & Android Papers)
 *  7. Certificates & Accreditations (Formal Qualifications)
 *  8. Badges & Recognition (Community Credentials)
 *  9. Recommendations & References (Testimonials)
 * 10. Contact & Footer (Call to Action & Booking)
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
        <div className="relative z-10 w-full">
            {/* Floating side dot indicator navigation */}
            <SectionDotsNav />

            {/* 1. ── Hero Section ── */}
            <section id="hero" className="snap-section">
                <HeroOverlay />
                <StatsTicker />
            </section>

            {/* 2. ── Featured Projects (Top Showcase) ── */}
            <SectionBanner id="projects-banner" title="FEATURED PROJECTS" />
            <section id="projects" className="snap-section">
                <ProjectsOverlay projects={filteredProjects} isFiltered={isFiltered}>
                    <div className="w-full max-w-6xl mx-auto px-6 mb-16 md:mb-24 bg-transparent" id="portfolio-filters">
                        <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>
                </ProjectsOverlay>
            </section>

            {/* 3. ── Experience & Build Log ── */}
            <SectionBanner id="timeline-banner" title="EXPERIENCE & BUILD LOG" />
            <section id="timeline" className="snap-section">
                <TimelineSection />
            </section>

            {/* 4. ── Skills & Competencies ── */}
            <SectionBanner id="skills-banner" title="SKILLS & COMPETENCIES" />
            <section id="skills" className="snap-section">
                <SkillsOverlay />
            </section>

            {/* 5. ── GitHub Activity & Codebase ── */}
            <SectionBanner id="github-banner" title="GITHUB ACTIVITY & CODEBASE" />
            <section id="github" className="snap-section">
                <GitHubActivitySection />
            </section>

            {/* 6. ── Active Research ── */}
            <SectionBanner id="research-banner" title="ACTIVE RESEARCH" />
            <section id="research" className="snap-section">
                <ActiveResearchOverlay />
            </section>

            {/* 7. ── Certificates & Accreditations ── */}
            <SectionBanner id="certificates-banner" title="CERTIFICATES & ACCREDITATIONS" />
            <section id="certificates" className="snap-section">
                <CertificatesOverlay />
            </section>

            {/* 8. ── Badges & Recognition ── */}
            <SectionBanner id="badges-banner" title="BADGES & RECOGNITION" />
            <section id="badges" className="snap-section">
                <BadgesOverlay />
            </section>

            {/* 9. ── References & Recommendations ── */}
            <SectionBanner id="testimonials-banner" title="RECOMMENDATIONS & REFERENCES" />
            <section id="testimonials" className="snap-section">
                <TestimonialsOverlay />
            </section>

            {/* 10. ── Contact & Footer ── */}
            <SectionBanner id="contact-banner" title="CONTACT & COLLABORATION" />
            <section id="contact" className="snap-section">
                <Contact />
                <Footer />
            </section>

            {/* ── Floating Terminal overlay ── */}
            <TerminalSection />
        </div>
    );
}
