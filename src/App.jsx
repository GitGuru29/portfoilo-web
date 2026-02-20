import React, { useEffect } from 'react';
import LenisWrapper from './components/LenisWrapper';
import CanvasScene from './components/canvas/CanvasScene';
import Navigation from './components/Navigation';
import HeroOverlay from './components/HeroOverlay';
import AboutOverlay from './components/AboutOverlay';
import ProjectsOverlay from './components/ProjectsOverlay';
import Contact from './components/Contact';
import NightCodingScene from './components/NightCodingScene';

function App() {
    return (
        <LenisWrapper>
            <div className="relative text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
                <Navigation />

                {/* The permanent WebGL Background */}
                <CanvasScene />
                <NightCodingScene />

                {/* The Scrollable DOM Content Overlay */}
                <div className="relative z-10 w-full">
                    <HeroOverlay />
                    <AboutOverlay />
                    <ProjectsOverlay />
                    <div id="contact">
                        <Contact />
                    </div>
                </div>
            </div>
        </LenisWrapper>
    );
}

export default App;
