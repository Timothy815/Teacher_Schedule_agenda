import React from 'react';
import { 
  Puzzle, BookHeart, Pencil, Rocket, Globe, Palette, Music, 
  Footprints, Apple, Sun, Users, Sunrise, Backpack, 
  Calculator, BookOpen, FlaskConical, Activity, Utensils, 
  ClipboardList, School, Heart, Star, Coffee, Brain, 
  Languages, Microscope, Library, Dumbbell, Paintbrush, 
  AlarmClock, GraduationCap, LucideProps,
  Baby, Bath, Bed, Beer, Bell, Binary, Blocks, Brush, 
  Camera, Candy, Circle, Cloud, CloudRain, Construction, 
  Cookie, Crown, Dog, Drum, Eye, Fan, Feather, Fish, 
  Flower, Ghost, Gift, Glasses, Hand, IceCream, Key, 
  Leaf, Lightbulb, Lollipop, Map, Moon, Mountain, 
  PawPrint, Pizza, Plane, Play, Rainbow, Scissors, 
  Shapes, Shell, Ship, Shirt, Smile, Snowflake, 
  Sprout, Telescope, Tent, Train, Truck, Umbrella
} from 'lucide-react';
import { SubjectType, ActivityConfig } from './types';

// Grouped for the UI
export const ICON_CATEGORIES = {
  Academic: ['Calculator', 'BookOpen', 'Pencil', 'Globe', 'Microscope', 'Brain', 'Languages', 'Shapes', 'Telescope', 'Binary'],
  Creative: ['Palette', 'Music', 'Paintbrush', 'Blocks', 'Brush', 'Camera', 'Drum', 'Scissors', 'Lightbulb'],
  Physical: ['Footprints', 'Dumbbell', 'Play', 'Construction', 'Tent', 'Train', 'Truck', 'Plane', 'Ship'],
  Life: ['Apple', 'Sun', 'Sunrise', 'Backpack', 'Utensils', 'Coffee', 'AlarmClock', 'GraduationCap', 'Bath', 'Bed', 'Hand', 'Shirt'],
  Nature: ['Rocket', 'FlaskConical', 'Cloud', 'CloudRain', 'Flower', 'Leaf', 'Moon', 'Mountain', 'Rainbow', 'Snowflake', 'Sprout', 'Umbrella'],
  Fun: ['Puzzle', 'BookHeart', 'Users', 'School', 'Heart', 'Star', 'Baby', 'Candy', 'Cookie', 'Crown', 'Dog', 'Fish', 'Ghost', 'Gift', 'IceCream', 'Lollipop', 'PawPrint', 'Pizza', 'Smile', 'Shell']
};

export const ICON_OPTIONS = Object.values(ICON_CATEGORIES).flat();

export const getIcon = (name: string, props: LucideProps) => {
  const icons: Record<string, React.ReactNode> = {
    'Sunrise': <Sunrise {...props} />,
    'Puzzle': <Puzzle {...props} />,
    'Calculator': <Calculator {...props} />,
    'BookHeart': <BookHeart {...props} />,
    'BookOpen': <BookOpen {...props} />,
    'Pencil': <Pencil {...props} />,
    'Rocket': <Rocket {...props} />,
    'FlaskConical': <FlaskConical {...props} />,
    'Globe': <Globe {...props} />,
    'Palette': <Palette {...props} />,
    'Music': <Music {...props} />,
    'Footprints': <Footprints {...props} />,
    'Apple': <Apple {...props} />,
    'Sun': <Sun {...props} />,
    'Users': <Users {...props} />,
    'Backpack': <Backpack {...props} />,
    'ClipboardList': <ClipboardList {...props} />,
    'School': <School {...props} />,
    'Heart': <Heart {...props} />,
    'Star': <Star {...props} />,
    'Coffee': <Coffee {...props} />,
    'Brain': <Brain {...props} />,
    'Languages': <Languages {...props} />,
    'Microscope': <Microscope {...props} />,
    'Library': <Library {...props} />,
    'Dumbbell': <Dumbbell {...props} />,
    'Paintbrush': <Paintbrush {...props} />,
    'AlarmClock': <AlarmClock {...props} />,
    'GraduationCap': <GraduationCap {...props} />,
    'Baby': <Baby {...props} />,
    'Bath': <Bath {...props} />,
    'Bed': <Bed {...props} />,
    'Beer': <Beer {...props} />,
    'Bell': <Bell {...props} />,
    'Binary': <Binary {...props} />,
    'Blocks': <Blocks {...props} />,
    'Brush': <Brush {...props} />,
    'Camera': <Camera {...props} />,
    'Candy': <Candy {...props} />,
    'Circle': <Circle {...props} />,
    'Cloud': <Cloud {...props} />,
    'CloudRain': <CloudRain {...props} />,
    'Construction': <Construction {...props} />,
    'Cookie': <Cookie {...props} />,
    'Crown': <Crown {...props} />,
    'Dog': <Dog {...props} />,
    'Drum': <Drum {...props} />,
    'Eye': <Eye {...props} />,
    'Fan': <Fan {...props} />,
    'Feather': <Feather {...props} />,
    'Fish': <Fish {...props} />,
    'Flower': <Flower {...props} />,
    'Ghost': <Ghost {...props} />,
    'Gift': <Gift {...props} />,
    'Glasses': <Glasses {...props} />,
    'Hand': <Hand {...props} />,
    'IceCream': <IceCream {...props} />,
    'Key': <Key {...props} />,
    'Leaf': <Leaf {...props} />,
    'Lightbulb': <Lightbulb {...props} />,
    'Lollipop': <Lollipop {...props} />,
    'Map': <Map {...props} />,
    'Moon': <Moon {...props} />,
    'Mountain': <Mountain {...props} />,
    'PawPrint': <PawPrint {...props} />,
    'Pizza': <Pizza {...props} />,
    'Plane': <Plane {...props} />,
    'Play': <Play {...props} />,
    'Rainbow': <Rainbow {...props} />,
    'Scissors': <Scissors {...props} />,
    'Shapes': <Shapes {...props} />,
    'Shell': <Shell {...props} />,
    'Ship': <Ship {...props} />,
    'Shirt': <Shirt {...props} />,
    'Smile': <Smile {...props} />,
    'Snowflake': <Snowflake {...props} />,
    'Sprout': <Sprout {...props} />,
    'Telescope': <Telescope {...props} />,
    'Tent': <Tent {...props} />,
    'Train': <Train {...props} />,
    'Truck': <Truck {...props} />,
    'Umbrella': <Umbrella {...props} />
  };
  return icons[name] || <Activity {...props} />;
};

export const SUBJECT_CONFIGS: Record<SubjectType, ActivityConfig> = {
  [SubjectType.MATH]: { type: SubjectType.MATH, color: 'bg-blue-100 border-blue-400 text-blue-900', icon: 'Calculator', defaultDuration: 60 },
  [SubjectType.READING]: { type: SubjectType.READING, color: 'bg-red-100 border-red-400 text-red-900', icon: 'BookOpen', defaultDuration: 45 },
  [SubjectType.WRITING]: { type: SubjectType.WRITING, color: 'bg-yellow-100 border-yellow-400 text-yellow-900', icon: 'Pencil', defaultDuration: 40 },
  [SubjectType.SCIENCE]: { type: SubjectType.SCIENCE, color: 'bg-green-100 border-green-400 text-green-900', icon: 'FlaskConical', defaultDuration: 45 },
  [SubjectType.SOCIAL_STUDIES]: { type: SubjectType.SOCIAL_STUDIES, color: 'bg-orange-100 border-orange-400 text-orange-900', icon: 'Globe', defaultDuration: 45 },
  [SubjectType.ART]: { type: SubjectType.ART, color: 'bg-purple-100 border-purple-400 text-purple-900', icon: 'Palette', defaultDuration: 50 },
  [SubjectType.MUSIC]: { type: SubjectType.MUSIC, color: 'bg-pink-100 border-pink-400 text-pink-900', icon: 'Music', defaultDuration: 40 },
  [SubjectType.PE]: { type: SubjectType.PE, color: 'bg-emerald-100 border-emerald-400 text-emerald-900', icon: 'Footprints', defaultDuration: 40 },
  [SubjectType.LUNCH]: { type: SubjectType.LUNCH, color: 'bg-slate-200 border-slate-400 text-slate-900', icon: 'Apple', defaultDuration: 30 },
  [SubjectType.RECESS]: { type: SubjectType.RECESS, color: 'bg-amber-100 border-amber-400 text-amber-900', icon: 'Sun', defaultDuration: 20 },
  [SubjectType.ASSEMBLY]: { type: SubjectType.ASSEMBLY, color: 'bg-indigo-100 border-indigo-400 text-indigo-900', icon: 'Users', defaultDuration: 60 },
  [SubjectType.MORNING_MEETING]: { type: SubjectType.MORNING_MEETING, color: 'bg-teal-100 border-teal-400 text-teal-900', icon: 'Sunrise', defaultDuration: 20 },
  [SubjectType.PACK_UP]: { type: SubjectType.PACK_UP, color: 'bg-gray-100 border-gray-400 text-gray-900', icon: 'Backpack', defaultDuration: 15 },
  [SubjectType.PLANNING]: { type: SubjectType.PLANNING, color: 'bg-stone-100 border-stone-400 text-stone-900', icon: 'ClipboardList', defaultDuration: 45 },
};

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Special'];

export const DEFAULT_WEEK_SCHEDULE = {
  'Monday': [
    { type: SubjectType.MORNING_MEETING, durationMinutes: 20, notes: 'Welcome back!' },
    { type: SubjectType.MATH, durationMinutes: 60, notes: '' },
    { type: SubjectType.RECESS, durationMinutes: 15, notes: '' },
  ],
  'Tuesday': [
    { type: SubjectType.MORNING_MEETING, durationMinutes: 20, notes: '' },
    { type: SubjectType.READING, durationMinutes: 60, notes: '' },
  ],
  'Wednesday': [
    { type: SubjectType.MORNING_MEETING, durationMinutes: 20, notes: '' },
    { type: SubjectType.SCIENCE, durationMinutes: 60, notes: '' },
  ],
  'Thursday': [
    { type: SubjectType.MORNING_MEETING, durationMinutes: 20, notes: '' },
    { type: SubjectType.SOCIAL_STUDIES, durationMinutes: 60, notes: '' },
  ],
  'Friday': [
    { type: SubjectType.MORNING_MEETING, durationMinutes: 20, notes: 'Fun Friday!' },
    { type: SubjectType.ART, durationMinutes: 60, notes: '' },
  ],
  'Special': [
      { type: SubjectType.MORNING_MEETING, durationMinutes: 15, notes: 'Early Release Day' },
      { type: SubjectType.READING, durationMinutes: 30, notes: '' },
      { type: SubjectType.MATH, durationMinutes: 30, notes: '' },
      { type: SubjectType.RECESS, durationMinutes: 15, notes: '' },
      { type: SubjectType.WRITING, durationMinutes: 30, notes: '' },
      { type: SubjectType.LUNCH, durationMinutes: 30, notes: '' },
      { type: SubjectType.PACK_UP, durationMinutes: 15, notes: 'Dismissal at 12:45' },
  ]
};