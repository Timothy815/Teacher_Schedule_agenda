
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ScheduleItem, SubjectType } from '../types';
import { SUBJECT_CONFIGS, getIcon } from '../constants';
import { GripVertical, Trash2, Lock, Clock } from 'lucide-react';

interface AgendaItemProps {
  item: ScheduleItem;
  displayTitle: string; 
  displayIcon: string;
  startTime: string;
  onUpdate: (id: string, updates: Partial<ScheduleItem>) => void;
  onUpdateSubjectName: (type: SubjectType, newName: string) => void;
  onRemove: (id: string) => void;
}

export const AgendaItem: React.FC<AgendaItemProps> = ({ 
  item, 
  displayTitle,
  displayIcon,
  startTime, 
  onUpdate, 
  onUpdateSubjectName,
  onRemove 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  const config = SUBJECT_CONFIGS[item.type] || SUBJECT_CONFIGS[SubjectType.ASSEMBLY];
  const [isEditing, setIsEditing] = useState(false);

  const getEndTime = (start: string, minutes: number) => {
    const [h, m] = start.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m + minutes);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const displayEndTime = getEndTime(startTime, item.durationMinutes);
  
  const formatTime = (timeStr: string) => {
      if(!timeStr) return "--:--";
      const [h, m] = timeStr.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m);
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group mb-3 rounded-xl border-l-8 shadow-sm hover:shadow-md transition-all duration-200 bg-white ${config.color.replace('bg-', 'border-')}`}
    >
      <div className="flex items-stretch p-1">
        <div {...attributes} {...listeners} className="flex items-center justify-center w-8 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
          <GripVertical size={20} />
        </div>

        <div className="flex-1 p-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-3 min-w-[220px]">
            <div className={`p-2 rounded-lg ${config.color.split(' ')[0]}`}>
              {/* Fix: removed title property which is not supported by Lucide icon props directly */}
              {getIcon(displayIcon, { size: 28, className: config.color.split(' ')[2] })}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                {item.manualStartTime && <Lock size={8} className="text-amber-500" title="Fixed Start Time" />}
                {formatTime(startTime)} - {displayEndTime}
              </div>
              <input
                value={displayTitle}
                onChange={(e) => onUpdateSubjectName(item.type, e.target.value)}
                className="font-comic font-bold text-xl leading-tight text-slate-800 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-400 outline-none w-full transition-colors"
                placeholder={item.type}
                title="Renaming this updates ALL cards of this type"
              />
            </div>
          </div>

          <div className="flex-1 w-full">
             {isEditing ? (
               <div className="flex flex-col gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 shadow-inner animate-in fade-in zoom-in-95 duration-150">
                 <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1"><Clock size={10}/> Duration (min)</label>
                        <input 
                            type="number" 
                            className="border border-slate-300 rounded-md px-2 py-1 w-24 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                            value={item.durationMinutes}
                            onChange={(e) => onUpdate(item.id, { durationMinutes: Number(e.target.value) })}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1"><Lock size={10}/> Manual Start</label>
                        <input 
                            type="time" 
                            className="border border-slate-300 rounded-md px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                            value={item.manualStartTime || ''}
                            onChange={(e) => onUpdate(item.id, { manualStartTime: e.target.value })}
                        />
                    </div>
                 </div>
                 <textarea
                    className="w-full border border-slate-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                    rows={2}
                    value={item.notes}
                    onChange={(e) => onUpdate(item.id, { notes: e.target.value })}
                    placeholder="Specific details for this session..."
                 />
                 <button onClick={() => setIsEditing(false)} className="self-end text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg shadow-sm transition-colors">Done</button>
               </div>
             ) : (
               <div onClick={() => setIsEditing(true)} className="cursor-pointer min-h-[44px] flex items-center p-2 rounded-lg border border-transparent hover:border-slate-100 hover:bg-slate-50 text-slate-600 text-sm transition-all group-hover:text-slate-900">
                 {item.notes ? <span className="line-clamp-2">{item.notes}</span> : <span className="text-slate-300 italic text-xs">Click to add session notes...</span>}
               </div>
             )}
          </div>
        </div>

        <div className="flex items-center px-2">
           <button onClick={() => onRemove(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors" title="Remove Activity"><Trash2 size={18} /></button>
        </div>
      </div>
    </div>
  );
};
