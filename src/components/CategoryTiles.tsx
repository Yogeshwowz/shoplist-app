import React from 'react';

interface CategoryTilesProps {
  categories: string[];
  onSelect: (category: string) => void;
}

const CategoryTiles: React.FC<CategoryTilesProps> = ({ categories, onSelect }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
    {categories.map((cat) => (
      <button
        key={cat}
        className="bg-white border border-blue-300 rounded-lg shadow hover:bg-blue-100 p-6 text-lg font-semibold text-blue-900 transition"
        onClick={() => onSelect(cat)}
      >
        {cat}
      </button>
    ))}
  </div>
);

export default CategoryTiles;