export enum SubjectType {
  MATH = 'Math',
  READING = 'Reading',
  WRITING = 'Writing',
  SCIENCE = 'Science',
  SOCIAL_STUDIES = 'Social Studies',
  ART = 'Art',
  MUSIC = 'Music',
  PE = 'PE',
  LUNCH = 'Lunch',
  RECESS = 'Recess',
  ASSEMBLY = 'Assembly',
  MORNING_MEETING = 'Morning Meeting',
  PACK_UP = 'Pack Up',
  PLANNING = 'Planning Period'
}

export interface ActivityConfig {
  type: SubjectType;
  color: string;
  icon: string; // Identifier for the icon component
  defaultDuration: number;
}

export interface ScheduleItem {
  id: string;
  type: SubjectType;
  customTitle?: string; // New field for user-defined activity names
  startTime: string; // Calculated HH:MM format (display only)
  manualStartTime?: string; // Optional user-defined HH:MM override
  durationMinutes: number;
  notes: string;
}

export type DayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Special';

export interface WeekSchedule {
  [key: string]: ScheduleItem[]; // key is DayName
}