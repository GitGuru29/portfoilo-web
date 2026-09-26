import React from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="proj-search">
            <Search className="proj-search__icon" size={13} aria-hidden="true" />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="proj-search__input"
            />
            <AnimatePresence>
                {searchQuery && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setSearchQuery('')}
                        className="proj-search__clear"
                        aria-label="Clear search"
                    >
                        <X size={12} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
