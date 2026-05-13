import React from 'react';
import { motion } from 'framer-motion';
import { categoriesArray } from '../data/categories';
import useStore from '../store/useStore';

const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
    const setMood = useStore((state) => state.setMood);

    const handleCategoryClick = (category) => {
        setActiveCategory(category.id);
        setMood(category.mood);
    };

    return (
        <div className="w-full flex justify-center py-8 z-10 relative">
            <div className="flex flex-wrap justify-center gap-3 px-4 max-w-5xl">
                {categoriesArray.map((category) => {
                    const isActive = activeCategory === category.id;
                    const Icon = category.icon;

                    return (
                        <motion.button
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md border ${
                                isActive
                                    ? 'bg-blue-500/20 border-blue-400/50 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {Icon && <Icon size={16} className={isActive ? 'text-blue-400' : 'text-gray-500'} />}
                            {category.label}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryFilter;
