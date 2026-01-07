import React, { useState } from 'react';
import { generateActivitySuggestion } from '../services/geminiService';
import { ScheduleItem, SubjectType } from '../types';
import { X, Sparkles, Loader2, KeyRound, ShieldCheck } from 'lucide-react';

interface GeminiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem: ScheduleItem | null;
  onApply: (id: string, notes: string) => void;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ isOpen, onClose, targetItem, onApply }) => {
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [suggestion, setSuggestion] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !targetItem) return null;

  const handleGenerate = async () => {
    if (!apiKey) {
      setError("Please provide a generic Gemini API key.");
      return;
    }
    
    // Save key for future
    localStorage.setItem('gemini_api_key', apiKey);
    
    setLoading(true);
    setError('');
    setSuggestion('');
    
    try {
      const result = await generateActivitySuggestion(
        apiKey, 
        targetItem.type, 
        targetItem.durationMinutes, 
        targetItem.notes
      );
      setSuggestion(result);
    } catch (err) {
      setError("Failed to generate. Check your key and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-300" />
            <h3 className="font-bold text-lg">Teacher's Assistant</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          <div className="text-sm text-slate-600">
            Need an idea for <strong>{targetItem.type}</strong> ({targetItem.durationMinutes} min)?
          </div>

          {!localStorage.getItem('gemini_api_key') && !apiKey && (
             <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                To use the AI planner, you need a free Google Gemini API Key. 
                This runs locally in your browser.
             </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 flex gap-2 items-start">
             <ShieldCheck size={14} className="mt-0.5 shrink-0" />
             <div>
                <strong>Privacy Reminder:</strong> When using AI features, do not include student names or PII (Personally Identifiable Information) in the context field.
             </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Gemini API Key</label>
            <div className="relative">
                <input 
                    type="password" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter API Key..."
                    className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <KeyRound size={16} className="absolute left-3 top-2.5 text-slate-400" />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          {suggestion && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 italic">
              "{suggestion}"
            </div>
          )}

          <div className="flex gap-3 pt-2">
             <button 
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium text-sm flex justify-center items-center gap-2 transition"
             >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                {suggestion ? "Try Another" : "Generate Idea"}
             </button>
             
             {suggestion && (
                 <button 
                    onClick={() => {
                        onApply(targetItem.id, suggestion);
                        onClose();
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium text-sm transition"
                 >
                    Use This
                 </button>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};