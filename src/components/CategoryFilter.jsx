import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categoriesArray } from '../data/categories';
import useStore from '../store/useStore';

const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
    const setMood = useStore((state) => state.setMood);

    const handleCategoryClick = (category) => {
        setActiveCategory(category.id);
        setMood(category.mood);
    };

    return (
        <div className="proj-filters">
            <div className="proj-filters__row">
                {categoriesArray.map((category) => {
                    const isActive = activeCategory === category.id;
                    const Icon = category.icon;
                    return (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            className={`proj-filter-btn${isActive ? ' proj-filter-btn--active' : ''}`}
                        >
                            {Icon && <Icon size={11} aria-hidden="true" />}
                            <span>{category.label}</span>
                            <AnimatePresence>
                                {isActive && (
                                    <motion.span
                                        layoutId="filter-underline"
                                        className="proj-filter-btn__bar"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        exit={{ scaleX: 0 }}
                                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                )}
                            </AnimatePresence>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryFilter;
