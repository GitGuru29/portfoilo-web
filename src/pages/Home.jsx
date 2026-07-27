import React, { useState, useMemo } from 'react';
import HeroOverlay from '../components/HeroOverlay';
import SkillsOverlay from '../components/SkillsOverlay';
import GitHubActivitySection from '../components/GitHubActivitySection';
import ProjectsOverlay from '../components/ProjectsOverlay';
import ActiveResearchOverlay from '../components/ActiveResearchOverlay';
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
import { projectsData } from '../data/projects';
import { CATEGORIES } from '../data/categories';

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

            {/* ── Hero ── */}
            <section id="hero" className="snap-section">
                <HeroOverlay />
                <StatsTicker />
            </section>

            {/* ── Skills ── */}
            <section id="skills" className="snap-section">
                <SkillsOverlay />
            </section>

            {/* ── GitHub 3D Graph ── */}
            <section id="github" className="snap-section">
                <GitHubActivitySection />
            </section>

            {/* ── Projects ── */}
            <section id="projects" className="snap-section">
                <ProjectsOverlay projects={filteredProjects} isFiltered={isFiltered}>
                    <div className="w-full max-w-6xl mx-auto px-6 mb-16 md:mb-24 bg-transparent" id="portfolio-filters">
                        <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>
                </ProjectsOverlay>
            </section>

            {/* ── Timeline / Build Log ── */}
            <section id="timeline" className="snap-section">
                <TimelineSection />
            </section>

            {/* ── Active Research ── */}
            <section id="research" className="snap-section">
                <ActiveResearchOverlay />
            </section>

            {/* ── Certificates ── */}
            <section id="certificates" className="snap-section">
                <CertificatesOverlay />
            </section>

            {/* ── Badges ── */}
            <section id="badges" className="snap-section">
                <BadgesOverlay />
            </section>

            {/* ── Contact + Footer ── */}
            <section id="contact" className="snap-section">
                <Contact />
                <Footer />
            </section>

            {/* ── Floating Terminal overlay ── */}
            <TerminalSection />
        </div>
    );
}

