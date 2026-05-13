import React from 'react';
import { TerminalSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="w-full flex justify-center pb-8 z-10 relative">
            <div className="relative w-full max-w-xl mx-4 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <TerminalSquare className="h-5 w-5 text-cyber-cyan opacity-80 group-focus-within:opacity-100 transition-opacity" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='grep -i "query" ./projects'
                    className="block w-full pl-12 pr-10 py-4 bg-[#050505]/90 border border-cyber-cyan/30 rounded-lg text-white font-mono placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyber-cyan focus:border-cyber-cyan transition-all duration-300 backdrop-blur-md shadow-[0_0_15px_rgba(0,243,255,0.1)] focus:shadow-[0_0_25px_rgba(0,243,255,0.2)]"
                />
                <AnimatePresence>
                    {searchQuery && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SearchBar;
