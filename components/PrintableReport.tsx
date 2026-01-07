import React, { useState } from 'react';
import { WeekSchedule, DayName, ScheduleItem, SubjectType } from '../types';
import { DAYS, SUBJECT_CONFIGS, getIcon } from '../constants';
import { calculateItemTimes, formatTimeDisplay } from '../utils';
import { Printer, FilePenLine } from 'lucide-react';

interface PrintableReportProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: DayName;
  weekSchedule: WeekSchedule;
  startTime: string;
  classroomName: string;
  subjectNames: Record<SubjectType, string>;
  subjectIcons: Record<SubjectType, string>;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ 
  isOpen, 
  onClose, 
  currentDay, 
  weekSchedule, 
  startTime,
  classroomName,
  subjectNames,
  subjectIcons
}) => {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  if (!isOpen) return null;

  const DayTemplate: React.FC<{ day: string, items: ScheduleItem[] }> = ({ day, items }) => {
    const times = calculateItemTimes(items, startTime);
    return (
      <div className="bg-white p-12 max-w-[210mm] mx-auto min-h-[297mm] relative print:m-0 print:p-8 mb-8 shadow-xl print:shadow-none rounded-lg">
        <div className="border-b-4 border-slate-800 pb-4 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 font-comic uppercase tracking-tight">Daily Agenda</h1>
            <div className="text-2xl font-bold text-slate-500 mt-1">{day}</div>
          </div>
          <div className="text-right text-sm text-slate-400 font-bold uppercase tracking-widest">{classroomName}</div>
        </div>
        
        <div className="space-y-0 border-t-2 border-slate-100">
            {items.map((item) => {
                const config = SUBJECT_CONFIGS[item.type];
                const start = times[item.id];
                const [h, m] = start.split(':').map(Number);
                const endDate = new Date();
                endDate.setHours(h, m + item.durationMinutes);
                const end = endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                return (
                    <div key={item.id} className="flex border-b-2 border-slate-50 py-5 items-start break-inside-avoid">
                        <div className="w-40 pt-1">
                            <div className="text-xl font-bold text-slate-900 leading-none">{formatTimeDisplay(start)}</div>
                            <div className="text-xs text-slate-400 font-bold mt-2 tracking-wider">{item.durationMinutes} MIN SESSION</div>
                        </div>
                        <div className="w-16 pt-1 text-slate-800">
                          {getIcon(subjectIcons[item.type], { size: 32 })}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-2xl text-slate-900 uppercase tracking-tight">
                                {subjectNames[item.type] || item.type}
                            </div>
                            {item.notes && <div className="text-slate-500 text-lg mt-2 italic font-serif leading-tight">{item.notes}</div>}
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="mt-auto pt-10">
          <div className="border-2 border-slate-200 rounded-3xl p-8 bg-slate-50/50 break-inside-avoid">
              <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest">
                <FilePenLine size={24} /> Para Notes & Feedback
              </h3>
              <div className="space-y-10">
                  {[1, 2, 3, 4].map(i => <div key={i} className="border-b-2 border-slate-200 border-dashed h-4"></div>)}
              </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md overflow-y-auto print:bg-white print:p-0">
      <div className="sticky top-0 z-[110] bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between print:hidden">
        <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
             <button onClick={() => setViewMode('day')} className={`px-6 py-2 text-sm font-bold rounded-xl transition-all ${viewMode === 'day' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Daily View</button>
             <button onClick={() => setViewMode('week')} className={`px-6 py-2 text-sm font-bold rounded-xl transition-all ${viewMode === 'week' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Full Week</button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="px-6 py-2 font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
          <button onClick={() => window.print()} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-2 active:scale-95 transition-all"><Printer size={20} /> Print Agenda</button>
        </div>
      </div>
      <div className="py-12 print:py-0">
        {viewMode === 'day' ? <DayTemplate day={currentDay} items={weekSchedule[currentDay] || []} /> : DAYS.map(day => <DayTemplate key={day} day={day as string} items={weekSchedule[day as DayName] || []} />)}
      </div>
    </div>
  );
};