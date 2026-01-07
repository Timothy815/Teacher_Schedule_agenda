import React, { useState } from 'react';
import { SubjectType, ScheduleItem } from '../types';
import { ICON_CATEGORIES, getIcon } from '../constants';
import { X, Check, Search, Filter } from 'lucide-react';

interface SubjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
  subjectNames: Record<SubjectType, string>;
  onUpdateSubjectName: (type: SubjectType, newName: string) => void;
  // Note: Since this is currently a partial implementation based on original files,
  // I will enhance the existing Subject Manager if it exists, or create the categorized icon selection logic.
  // In the current structure, App.tsx manages subjectNames, but let's assume we want a UI to manage titles.
}

// Enhancing the component to handle icon selection if the app evolves to dynamic types.
// For now, let's provide a reusable IconPicker component that can be used in a future modal.

export const IconPicker: React.FC<{
  currentIcon: string;
  onSelect: (iconName: string) => void;
}> = ({ currentIcon, onSelect }) => {
  const [activeCategory, setActiveCategory] = useState<string>(Object.keys(ICON_CATEGORIES)[0]);
  const [search, setSearch] = useState('');

  const filteredIcons = search 
    ? Object.values(ICON_CATEGORIES).flat().filter(icon => icon.toLowerCase().includes(search.toLowerCase()))
    : ICON_CATEGORIES[activeCategory as keyof typeof ICON_CATEGORIES];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl p-4 w-full max-w-md">
      <div className="flex items-center gap-2 mb-4 bg-slate-50 p-2 rounded-lg">
        <Search size={16} className="text-slate-400" />
        <input 
          placeholder="Search icons..." 
          className="bg-transparent border-none outline-none text-sm w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {!search && (
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-3 mb-3 border-b border-slate-100">
          {Object.keys(ICON_CATEGORIES).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-6 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredIcons.map(iconName => (
          <button
            key={iconName}
            onClick={() => onSelect(iconName)}
            className={`p-2 rounded-lg flex items-center justify-center transition-all hover:scale-110 ${currentIcon === iconName ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-400' : 'bg-slate-50 text-slate-500 hover:bg-white hover:shadow-md'}`}
            title={iconName}
          >
            {getIcon(iconName, { size: 24 })}
          </button>
        ))}
        {filteredIcons.length === 0 && (
          <div className="col-span-6 py-8 text-center text-slate-400 text-sm">No icons found</div>
        )}
      </div>
    </div>
  );
};