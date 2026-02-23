import React from 'react';
import HeroOverlay from '../components/HeroOverlay';
import AboutOverlay from '../components/AboutOverlay';
import ProjectsOverlay from '../components/ProjectsOverlay';
import Contact from '../components/Contact';

export default function Home() {
    return (
        <div className="relative z-10 w-full">
            <HeroOverlay />
            <AboutOverlay />
            <ProjectsOverlay />
            <div id="contact">
                <Contact />
            </div>
        </div>
    );
}
