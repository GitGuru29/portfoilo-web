import React from 'react';
import { categoriesArray } from '../data/categories';
import useStore from '../store/useStore';

const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
    const setMood = useStore((state) => state.setMood);

    const handleCategoryClick = (category) => {
        setActiveCategory(category.id);
        setMood(category.mood);
    };

    return (
        <div className="w-full flex justify-start py-8 z-10 relative border-t border-[var(--color-geyser)]/10 mt-4 pt-8">
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
                {categoriesArray.map((category) => {
                    const isActive = activeCategory === category.id;
                    return (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            className={`text-[10px] md:text-xs tracking-[0.2em] font-space uppercase transition-all duration-300 pb-1 ${
                                isActive
                                    ? 'text-accent border-b border-accent'
                                    : 'text-titanium hover:text-geyser/80 border-b border-transparent'
                            }`}
                        >
                            {category.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryFilter;
