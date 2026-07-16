import React, { useState, useMemo } from 'react';
import HeroOverlay from '../components/HeroOverlay';
import SkillsOverlay from '../components/SkillsOverlay';
import GitHubActivitySection from '../components/GitHubActivitySection';
import ProjectsOverlay from '../components/ProjectsOverlay';
import ActiveResearchOverlay from '../components/ActiveResearchOverlay';
import CertificatesOverlay from '../components/CertificatesOverlay';
import BadgesOverlay from '../components/BadgesOverlay';
import Contact from '../components/Contact';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import StatsTicker from '../components/StatsTicker';
import TimelineSection from '../components/TimelineSection';
import TerminalSection from '../components/TerminalSection';
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

            {/* ── Hero ── */}
            <HeroOverlay />

            {/* ── Tech ticker strip ── */}
            <StatsTicker />

            {/* ── Skills ── */}
            <SkillsOverlay />

            {/* ── GitHub 3D Graph ── */}
            <GitHubActivitySection />

            {/* ── Projects ── */}
            <ProjectsOverlay projects={filteredProjects} isFiltered={isFiltered}>
                <div className="w-full max-w-6xl mx-auto px-6 mb-16 md:mb-24 bg-transparent" id="portfolio-filters">
                    <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>
            </ProjectsOverlay>

            {/* ── Timeline / Build Log ── */}
            <TimelineSection />

            {/* ── Active Research ── */}
            <ActiveResearchOverlay />

            {/* ── Certificates ── */}
            <CertificatesOverlay />

            {/* ── Badges ── */}
            <BadgesOverlay />

            {/* ── Contact + Footer ── */}
            <div id="contact">
                <Contact />
            </div>

            {/* ── Floating Terminal overlay ── */}
            <TerminalSection />
        </div>
    );
}
