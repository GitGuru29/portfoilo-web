import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LenisWrapper from './components/LenisWrapper';
import CanvasScene from './components/canvas/CanvasScene';
import Navigation from './components/Navigation';
import NightCodingScene from './components/NightCodingScene';

import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';

function App() {
    return (
        <HashRouter>
            <LenisWrapper>
                <div className="relative text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
                    <Navigation />

                    {/* The permanent WebGL Background */}
                    <CanvasScene />
                    <NightCodingScene />

                    {/* The Scrollable DOM Content Overlay */}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/project/:id" element={<ProjectDetails />} />
                    </Routes>
                </div>
            </LenisWrapper>
        </HashRouter>
    );
}

export default App;
