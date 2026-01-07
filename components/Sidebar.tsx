import React from 'react';
import { SUBJECT_CONFIGS } from '../constants';
import { SubjectType } from '../types';
import { getIcon } from '../constants';
import { Plus } from 'lucide-react';

interface SidebarProps {
  onAdd: (type: SubjectType) => void;
  subjectNames: Record<SubjectType, string>;
  subjectIcons: Record<SubjectType, string>;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAdd, subjectNames, subjectIcons }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200 h-fit sticky top-24">
      <h2 className="font-comic font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-indigo-600" />
        Quick Add
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
        {(Object.keys(SUBJECT_CONFIGS) as SubjectType[]).map((type) => {
          const config = SUBJECT_CONFIGS[type];
          return (
            <button
              key={type}
              onClick={() => onAdd(type)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200
                hover:scale-105 active:scale-95 text-center gap-2
                bg-white border-slate-50 hover:border-indigo-200 shadow-sm
              `}
            >
              <div className={`p-2 rounded-full bg-opacity-10 ${config.color.split(' ')[0]}`}>
                {getIcon(subjectIcons[type], { size: 20, className: config.color.split(' ')[2] })}
              </div>
              <span className="text-[10px] font-bold text-slate-600 line-clamp-1 uppercase tracking-tight">
                {subjectNames[type] || type}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};