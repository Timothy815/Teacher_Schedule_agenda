import { ScheduleItem } from './types';

export const calculateItemTimes = (items: ScheduleItem[], baseStartTime: string): Record<string, string> => {
    let currentTime = new Date();
    const [startH, startM] = baseStartTime.split(':').map(Number);
    currentTime.setHours(startH, startM, 0, 0);

    const times: Record<string, string> = {};
    
    items.forEach(item => {
        // Check for manual override
        if (item.manualStartTime) {
            const [manH, manM] = item.manualStartTime.split(':').map(Number);
            // Update current cursor to the manual time
            currentTime.setHours(manH, manM, 0, 0);
        }

        const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        times[item.id] = timeString;
        
        // Advance time by duration
        currentTime.setMinutes(currentTime.getMinutes() + item.durationMinutes);
    });
    
    return times;
};

export const formatTimeDisplay = (timeStr: string) => {
    if(!timeStr) return "--:--";
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};