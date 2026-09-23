import React from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="w-full flex justify-start pb-8 z-10 relative">
            <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-titanium group-focus-within:text-accent transition-colors" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='Search systems...'
                    className="block w-full pl-8 pr-10 py-3 bg-transparent border-b border-geyser/10 text-geyser font-inter text-sm md:text-base font-light placeholder-titanium focus:outline-none focus:border-accent transition-colors duration-300 rounded-none"
                />
                <AnimatePresence>
                    {searchQuery && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 flex items-center text-titanium hover:text-accent transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SearchBar;
