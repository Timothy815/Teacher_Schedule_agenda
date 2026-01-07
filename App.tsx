import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  ScheduleItem,
  SubjectType,
  WeekSchedule,
  DayName
} from './types';
import { SUBJECT_CONFIGS, DEFAULT_WEEK_SCHEDULE, DAYS, ICON_CATEGORIES, getIcon } from './constants';
import { Sidebar } from './components/Sidebar';
import { AgendaItem } from './components/AgendaItem';
import { PrintableReport } from './components/PrintableReport';
import { IconPicker } from './components/SubjectManager';
import { calculateItemTimes } from './utils';
import { Save, Calendar, Clock, Printer, Download, Upload, Check, ShieldCheck, Settings, Search, X, Pencil } from 'lucide-react';

const STORAGE_KEY = 'classroom_flow_week_data_v2';

export default function App() {
  const [subjectNames, setSubjectNames] = useState<Record<SubjectType, string>>(() => {
    const names = {} as Record<SubjectType, string>;
    Object.values(SubjectType).forEach(type => {
      names[type] = type;
    });
    return names;
  });

  const [subjectIcons, setSubjectIcons] = useState<Record<SubjectType, string>>(() => {
    const icons = {} as Record<SubjectType, string>;
    Object.values(SubjectType).forEach(type => {
      icons[type] = SUBJECT_CONFIGS[type].icon;
    });
    return icons;
  });

  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>(() => {
    const initialSchedule: WeekSchedule = {};
    Object.keys(DEFAULT_WEEK_SCHEDULE).forEach(day => {
        initialSchedule[day] = (DEFAULT_WEEK_SCHEDULE as any)[day].map((item: any) => ({...item, id: uuidv4()}));
    });
    return initialSchedule;
  });
  
  const [currentDay, setCurrentDay] = useState<DayName>('Monday');
  const [startTime, setStartTime] = useState('08:00');
  const [classroomName, setClassroomName] = useState('Classroom Schedule');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const items = weekSchedule[currentDay] || [];

  const setItems = (newItems: ScheduleItem[] | ((prev: ScheduleItem[]) => ScheduleItem[])) => {
    setWeekSchedule(prev => {
      const updatedDayItems = typeof newItems === 'function' ? newItems(prev[currentDay]) : newItems;
      return { ...prev, [currentDay]: updatedDayItems };
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.weekSchedule) setWeekSchedule(parsed.weekSchedule);
        if (parsed.startTime) setStartTime(parsed.startTime);
        if (parsed.classroomName) setClassroomName(parsed.classroomName);
        if (parsed.subjectNames) setSubjectNames(parsed.subjectNames);
        if (parsed.subjectIcons) setSubjectIcons(parsed.subjectIcons);
      } catch (e) {
        console.error("Failed to load schedule", e);
      }
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addItem = (type: SubjectType) => {
    const config = SUBJECT_CONFIGS[type];
    const newItem: ScheduleItem = {
      id: uuidv4(),
      type,
      startTime: '', 
      durationMinutes: config.defaultDuration,
      notes: ''
    };
    setItems((prev) => [...prev, newItem]);
  };

  const updateItem = (id: string, updates: Partial<ScheduleItem>) => {
    setItems((prev) => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const updateSubjectName = (type: SubjectType, newName: string) => {
    setSubjectNames(prev => ({ ...prev, [type]: newName }));
  };

  const updateSubjectIcon = (type: SubjectType, newIcon: string) => {
    setSubjectIcons(prev => ({ ...prev, [type]: newIcon }));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  };

  const saveSchedule = () => {
    const data = { weekSchedule, startTime, classroomName, subjectNames, subjectIcons, lastSaved: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.weekSchedule) setWeekSchedule(parsed.weekSchedule);
        if (parsed.startTime) setStartTime(parsed.startTime);
        if (parsed.classroomName) setClassroomName(parsed.classroomName);
        if (parsed.subjectNames) setSubjectNames(parsed.subjectNames);
        if (parsed.subjectIcons) setSubjectIcons(parsed.subjectIcons);
        alert("Schedule imported successfully!");
      } catch (err) {
        console.error("Import failed", err);
        alert("Failed to import schedule. Please check the file format.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExport = () => {
    const data = { weekSchedule, startTime, classroomName, subjectNames, subjectIcons, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${classroomName.replace(/\s+/g, '_')}_Schedule.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const itemStartTimes = calculateItemTimes(items, startTime);

  const SettingsModal = () => {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState(Object.keys(ICON_CATEGORIES)[0]);
    const [editingIconType, setEditingIconType] = useState<SubjectType | null>(null);

    return (
      <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Activity Customization</h2>
              <p className="text-sm text-slate-500">Global settings for names and symbols</p>
            </div>
            <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} /></button>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-slate-100 space-y-4">
               <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest mb-4">Activity Definitions</h3>
               {Object.values(SubjectType).map((type) => (
                 <div key={type} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
                   <div className="relative">
                      <div className={`p-2.5 rounded-lg ${SUBJECT_CONFIGS[type].color.split(' ')[0]}`}>
                        {getIcon(subjectIcons[type], { size: 24, className: SUBJECT_CONFIGS[type].color.split(' ')[2] })}
                      </div>
                      <button 
                        onClick={() => setEditingIconType(type)}
                        className="absolute -top-1 -right-1 bg-white border border-slate-200 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Change icon"
                      >
                        <Pencil size={10} className="text-indigo-600" />
                      </button>
                   </div>
                   <div className="flex-1">
                     <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">{type}</label>
                     <input 
                       value={subjectNames[type]} 
                       onChange={(e) => updateSubjectName(type, e.target.value)}
                       className="w-full bg-transparent border-none font-bold text-slate-700 outline-none focus:text-indigo-600 transition-colors"
                     />
                   </div>
                 </div>
               ))}
               
               <div className="pt-6 border-t border-slate-100">
                  <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest mb-4">Data Management</h3>
                  <div className="flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all shadow-sm">
                      <Upload size={14} /> Import Data
                    </button>
                    <button onClick={handleExport} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all shadow-sm">
                      <Download size={14} /> Export Data
                    </button>
                  </div>
               </div>
            </div>

            <div className="w-full md:w-1/2 p-6 overflow-y-auto bg-slate-50/30 flex flex-col">
               {editingIconType ? (
                 <div className="flex flex-col h-full animate-in slide-in-from-right-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800">Select symbol for {subjectNames[editingIconType]}</h3>
                        <button onClick={() => setEditingIconType(null)} className="text-xs font-bold text-indigo-600 hover:underline">Back to list</button>
                    </div>
                    <IconPicker 
                        currentIcon={subjectIcons[editingIconType]} 
                        onSelect={(newIcon) => {
                            updateSubjectIcon(editingIconType, newIcon);
                            setEditingIconType(null);
                        }} 
                    />
                 </div>
               ) : (
                 <>
                    <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest mb-4 flex justify-between">
                      <span>Quick Symbol Lookup</span>
                      <span className="text-indigo-500 font-mono">{Object.values(ICON_CATEGORIES).flat().length} Available</span>
                    </h3>
                    
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 mb-4">
                      <Search size={16} className="text-slate-400" />
                      <input 
                        placeholder="Search symbols..." 
                        className="flex-1 bg-transparent border-none outline-none text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-1 overflow-x-auto no-scrollbar pb-3 mb-4">
                      {Object.keys(ICON_CATEGORIES).map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setActiveTab(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === cat && !search ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                      {(search 
                        ? Object.values(ICON_CATEGORIES).flat().filter(i => i.toLowerCase().includes(search.toLowerCase()))
                        : ICON_CATEGORIES[activeTab as keyof typeof ICON_CATEGORIES]
                      ).map(icon => (
                        <div key={icon} className="aspect-square bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center p-2 hover:border-indigo-200 transition-all hover:scale-105 group relative">
                          {getIcon(icon, { size: 24, className: "text-slate-600 group-hover:text-indigo-500" })}
                          <span className="absolute -bottom-6 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap shadow-lg">{icon}</span>
                        </div>
                      ))}
                    </div>
                 </>
               )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen pb-10 ${isPrintModalOpen || isSettingsOpen ? 'overflow-hidden h-screen' : ''}`}>
      <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
      
      {isSettingsOpen && <SettingsModal />}

      <PrintableReport 
        isOpen={isPrintModalOpen} 
        onClose={() => setIsPrintModalOpen(false)}
        currentDay={currentDay}
        weekSchedule={weekSchedule}
        startTime={startTime}
        classroomName={classroomName}
        subjectNames={subjectNames}
        subjectIcons={subjectIcons}
      />

      <div className={isPrintModalOpen ? 'hidden' : ''}>
        <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
                        <Calendar size={24} />
                    </div>
                    <div className="flex-1">
                        <input
                            value={classroomName}
                            onChange={(e) => setClassroomName(e.target.value)}
                            className="font-comic font-bold text-2xl text-slate-800 leading-none tracking-tight bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none transition-all w-full sm:w-auto p-0"
                            placeholder="My Schedule"
                        />
                        <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Teacher Planner</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                    <div className="flex gap-2">
                        <button 
                          onClick={() => fileInputRef.current?.click()} 
                          title="Load Backup"
                          className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all"
                        >
                          <Upload size={16} /> <span className="hidden lg:inline">Import</span>
                        </button>
                        <button 
                          onClick={handleExport} 
                          title="Save Backup"
                          className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all"
                        >
                          <Download size={16} /> <span className="hidden lg:inline">Export</span>
                        </button>
                    </div>
                    <div className="w-px h-8 bg-slate-200 mx-1 hidden sm:block"></div>
                    <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all"><Settings size={16} /> <span className="hidden md:inline">Customize</span></button>
                    <button onClick={() => setIsPrintModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all"><Printer size={16} /> <span className="hidden md:inline">Print</span></button>
                    <button onClick={saveSchedule} className={`flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl shadow-md transition-all ${saveStatus === 'saved' ? 'bg-green-600' : 'bg-slate-900 hover:bg-slate-800'}`}>
                        {saveStatus === 'saved' ? <Check size={16} /> : <Save size={16} />} {saveStatus === 'saved' ? 'Saved!' : 'Save'}
                    </button>
                </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-4 mt-2">
                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-2">
                    {DAYS.map((day) => (
                        <button key={day} onClick={() => setCurrentDay(day as DayName)} className={`px-6 py-2 rounded-t-xl text-sm font-bold transition-all relative top-0.5 whitespace-nowrap ${currentDay === day ? 'bg-indigo-50/50 text-indigo-700 border-b-2 border-indigo-400/50' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}>{day}</button>
                    ))}
                </div>
            </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-6">
                <div className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3"><div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><Clock size={20} /></div><div><span className="block font-bold text-slate-700">Daily Start Time</span><span className="text-xs text-slate-500">First activity starts at {startTime} on {currentDay}</span></div></div>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm" />
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4 min-h-[400px]">
                            {items.length === 0 && <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 bg-white/50 animate-pulse">Drag activities from the sidebar or click "Quick Add" to begin.</div>}
                            {items.map((item) => (
                                <AgendaItem 
                                    key={item.id} 
                                    item={item} 
                                    displayTitle={subjectNames[item.type]}
                                    displayIcon={subjectIcons[item.type]}
                                    startTime={itemStartTimes[item.id] || '00:00'}
                                    onUpdate={updateItem}
                                    onUpdateSubjectName={updateSubjectName}
                                    onRemove={removeItem}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
            <div className="lg:col-span-1">
                <Sidebar onAdd={addItem} subjectNames={subjectNames} subjectIcons={subjectIcons} />
            </div>
        </main>

        <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-slate-400 text-xs border-t border-slate-200 mt-8">
            <div className="flex items-center justify-center gap-2 mb-2 text-slate-500"><ShieldCheck size={14} /><span className="font-bold uppercase tracking-wider">Secure Storage</span></div>
            <p>Your agenda is saved exclusively in your browser's local storage. Your data never leaves your computer.</p>
        </footer>
      </div>
    </div>
  );
}
