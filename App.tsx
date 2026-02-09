import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search as SearchIcon, User, MapPin, Clock, Code, Gavel, TrendingUp, 
  BookOpen, FlaskConical, Zap, HardHat, Stethoscope, Leaf, GraduationCap, 
  RotateCcw, Calendar, Mail, X, Lock, Smartphone, Home, ShieldCheck, 
  MessageCircle, Bus, Trash2, Plus, ArrowLeft, Menu, Settings, Edit2, CheckCircle2,
  AlertCircle, BarChart3, Activity, Ban, Save, Layers, Building2, Library,
  ImageIcon, LinkIcon, Smile, Filter, ChevronDown, CheckSquare, Square
} from 'lucide-react';
import { DayOfWeek, ClassEntry, FilterState, Teacher, Subject, ScheduleEntry, Category, SemesterOption, Department, Holiday, ClassStatus, Program } from './types';
import { UNIVERSITY_LOGO, INITIAL_TEACHERS, INITIAL_SUBJECTS, INITIAL_SCHEDULE, INITIAL_DEPARTMENTS, INITIAL_HOLIDAYS, INITIAL_PROGRAMS } from './constants';

const DAYS: DayOfWeek[] = ['All', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const ADMIN_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'routine', label: 'Routine', icon: Clock },
  { id: 'departments', label: 'Dept. & Programs', icon: GraduationCap },
  { id: 'faculty', label: 'Faculty', icon: User },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'semester', label: 'Semester', icon: Layers },
  { id: 'holidays', label: 'Holidays', icon: Calendar },
  { id: 'livebus', label: 'Live BUS', icon: Bus },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ADMIN_CARD_STYLE = {
  borderRadius: '50px',
  background: '#e0e0e0',
  boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
  border: 'none'
};

const ADMIN_INPUT_STYLE = {
  background: '#e0e0e0',
  boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
  border: 'none',
  borderRadius: '20px'
};

const parseTimeToMinutes = (timeStr: string) => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier?.toLowerCase() === 'pm' && hours < 12) hours += 12;
  if (modifier?.toLowerCase() === 'am' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const CategoryIcon = ({ category }: { category: Category }) => {
  const iconProps = { size: 16, strokeWidth: 2.5, className: "text-blue-600" };
  switch (category) {
    case 'CSE': return <Code {...iconProps} />;
    case 'Law': return <Gavel {...iconProps} />;
    case 'Business': return <TrendingUp {...iconProps} />;
    case 'English': return <BookOpen {...iconProps} />;
    case 'Chemistry': return <FlaskConical {...iconProps} />;
    case 'EEE': return <Zap {...iconProps} />;
    case 'Civil': return <HardHat {...iconProps} />;
    case 'PublicHealth': return <Stethoscope {...iconProps} />;
    case 'Soil': return <Leaf {...iconProps} />;
    default: return <GraduationCap {...iconProps} />;
  }
};

const AvatarFace = ({ id }: { id: string }) => {
  const index = parseInt(id.replace('avatar-', '')) || 1;
  const colors = ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-orange-100'];
  const textColors = ['text-red-600', 'text-blue-600', 'text-green-600', 'text-yellow-600', 'text-purple-600', 'text-pink-600', 'text-indigo-600', 'text-orange-600'];
  const bg = colors[index % colors.length];
  const txt = textColors[index % textColors.length];

  return (
    <div className={`w-full h-full rounded-full ${bg} flex items-center justify-center border-2 border-white shadow-sm overflow-hidden`}>
      <motion.div 
        animate={{ y: [0, -2, 0], rotate: [0, index % 2 === 0 ? 5 : -5, 0] }} 
        transition={{ repeat: Infinity, duration: 2 + (index * 0.1), ease: "easeInOut" }}
        className={txt}
      >
        <Smile size={24} strokeWidth={2.5} />
      </motion.div>
    </div>
  );
};

const ImpactDust = () => (
  <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-16 h-2 pointer-events-none flex items-center justify-center z-20">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          x: i < 3 ? [-2, -35 - (i * 10)] : [2, 35 + (i * 10)],
          y: [0, -12],
          scale: [0, 1.8, 0],
          opacity: [0, 0.8, 0],
        }}
        transition={{ repeat: Infinity, duration: 1.2, times: [0, 0.1, 0.5], ease: "easeOut" }}
        className="absolute w-3 h-3 bg-white/90 rounded-full blur-[4px]"
      />
    ))}
  </div>
);

const TimePicker = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [time, modifier] = value ? value.split(' ') : ['08:00', 'am'];
  const [hour, minute] = time.split(':');

  const updateTime = (h: string, m: string, mod: string) => {
    onChange(`${h}:${m} ${mod}`);
  };

  return (
    <div className="flex space-x-2">
      <select 
        style={ADMIN_INPUT_STYLE}
        className="h-12 px-2 font-bold text-xs outline-none text-slate-700 bg-transparent"
        value={hour}
        onChange={(e) => updateTime(e.target.value, minute, modifier)}
      >
        {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <span className="flex items-center text-slate-400 font-black">:</span>
      <select 
        style={ADMIN_INPUT_STYLE}
        className="h-12 px-2 font-bold text-xs outline-none text-slate-700 bg-transparent"
        value={minute}
        onChange={(e) => updateTime(hour, e.target.value, modifier)}
      >
        {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <select 
        style={ADMIN_INPUT_STYLE}
        className="h-12 px-2 font-bold text-xs outline-none text-slate-700 uppercase bg-transparent"
        value={modifier}
        onChange={(e) => updateTime(hour, minute, e.target.value)}
      >
        <option value="am">AM</option>
        <option value="pm">PM</option>
      </select>
    </div>
  );
};

export const App: React.FC = () => {
  // Global App State
  const [view, setView] = useState<'public' | 'admin' | 'bus-track'>('public');
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [now, setNow] = useState(new Date());
  
  // Simulated Analytics State
  const [stats, setStats] = useState({
    dailyLiveUsers: 142,
    totalDailyViews: 1284,
    weeklyGrowth: '+12%'
  });

  // Data Silos
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [programs, setPrograms] = useState<Program[]>(INITIAL_PROGRAMS);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(INITIAL_SCHEDULE);
  const [holidays, setHolidays] = useState<Holiday[]>(INITIAL_HOLIDAYS);
  const [semesterTitle, setSemesterTitle] = useState("🌱 Spring Semester 2026 🌸");

  // Admin UI State
  const [adminTab, setAdminTab] = useState('dashboard');
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Advanced Filter States
  const [facultyDeptFilter, setFacultyDeptFilter] = useState('All');
  const [subjectProgFilter, setSubjectProgFilter] = useState('All');
  const [routineDayFilter, setRoutineDayFilter] = useState('All');

  // Bulk Selection States
  const [selectedRoutineIds, setSelectedRoutineIds] = useState<Set<string>>(new Set());
  const [selectedFacultyIds, setSelectedFacultyIds] = useState<Set<string>>(new Set());
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<Set<string>>(new Set());

  // Keyword Suggestions Logic
  const [routineSuggestions, setRoutineSuggestions] = useState<string[]>([]);
  const routineSearchOptions = useMemo(() => {
    const opts = new Set<string>();
    DAYS.forEach(d => opts.add(d));
    teachers.forEach(t => opts.add(t.name));
    subjects.forEach(s => { opts.add(s.code); opts.add(s.title); });
    return Array.from(opts);
  }, [teachers, subjects]);

  const handleRoutineSearchChange = (val: string) => {
    setAdminSearch(val);
    if (val.length > 1) {
      const filtered = routineSearchOptions.filter(opt => 
        opt.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);
      setRoutineSuggestions(filtered);
    } else {
      setRoutineSuggestions([]);
    }
  };

  // Validation States
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Modal States
  const [isRoutineFormOpen, setIsRoutineFormOpen] = useState(false);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // Form Data States
  const [facultyFormData, setFacultyFormData] = useState<Partial<Teacher>>({
    name: '', department: '', email: '', whatsapp: '', deptWhatsapp: '', avatarId: 'avatar-1'
  });
  
  const [subjectFormData, setSubjectFormData] = useState<Partial<Subject>>({
    title: '', code: '', department: '', program: '', credit: '', category: 'General', whatsapp: ''
  });

  const [routineFormData, setRoutineFormData] = useState<Partial<ScheduleEntry>>({
    day: 'Saturday',
    startTime: '08:30 am',
    endTime: '10:00 am',
    teacherId: '',
    subjectId: '',
    room: '',
    status: 'scheduled'
  });

  // Time Sync & Analytics Sim
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
      setStats(prev => ({
        ...prev,
        dailyLiveUsers: Math.max(10, prev.dailyLiveUsers + (Math.random() > 0.5 ? 1 : -1)),
        totalDailyViews: prev.totalDailyViews + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Bulk Delete Handlers
  const handleBulkDeleteRoutine = () => {
    if (confirm(`Delete ${selectedRoutineIds.size} scheduled slots?`)) {
      setSchedule(prev => prev.filter(s => !selectedRoutineIds.has(s.id)));
      setSelectedRoutineIds(new Set());
    }
  };

  const handleBulkDeleteFaculty = () => {
    if (confirm(`Remove ${selectedFacultyIds.size} faculty members?`)) {
      setTeachers(prev => prev.filter(t => !selectedFacultyIds.has(t.id)));
      setSelectedFacultyIds(new Set());
    }
  };

  const handleBulkDeleteSubjects = () => {
    if (confirm(`Delete ${selectedSubjectIds.size} courses?`)) {
      setSubjects(prev => prev.filter(s => !selectedSubjectIds.has(s.id)));
      setSelectedSubjectIds(new Set());
    }
  };

  const toggleSelection = (id: string, set: Set<string>, setter: (s: Set<string>) => void) => {
    const newSet = new Set(set);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setter(newSet);
  };

  // Stable Current Day Name
  const currentDayName: DayOfWeek = useMemo(() => {
    const dayNames: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[now.getDay()] as DayOfWeek;
  }, [now.toDateString()]);

  // Public Routine Logic
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('All');
  const [filters, setFilters] = useState<FilterState>({ search: '', department: 'All', subject: 'All' });
  const [activeContactModal, setActiveContactModal] = useState<ClassEntry | null>(null);
  const [showHolidays, setShowHolidays] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const dayButtonsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Desktop Scroll Drag Logic
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftVal = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    if (scrollRef.current) {
      scrollRef.current.classList.add('cursor-grabbing');
      startX.current = e.pageX - scrollRef.current.offsetLeft;
      scrollLeftVal.current = scrollRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    if (scrollRef.current) scrollRef.current.classList.remove('cursor-grabbing');
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (scrollRef.current) scrollRef.current.classList.remove('cursor-grabbing');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeftVal.current - walk;
  };

  // Restore current day scroll & selection logic
  useEffect(() => {
    if (view === 'public' && !showHolidays) {
      setSelectedDay(currentDayName);
      const timer = setTimeout(() => {
        const activeBtn = dayButtonsRef.current[currentDayName];
        const container = scrollRef.current;
        if (activeBtn && container) {
          const wrapper = activeBtn.parentElement;
          if (wrapper) {
            const scrollPos = wrapper.offsetLeft - (container.clientWidth / 2) + (wrapper.clientWidth / 2);
            container.scrollTo({ left: scrollPos, behavior: 'smooth' });
          }
        }
      }, 300); 
      return () => clearTimeout(timer);
    }
  }, [view, currentDayName, showHolidays]);

  // Public Filtered Schedule
  const filteredSchedule = useMemo(() => {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return schedule.map(entry => {
      const teacher = teachers.find(t => t.id === entry.teacherId);
      const subject = subjects.find(s => s.id === entry.subjectId);
      if (!teacher || !subject) return null;
      const startMin = parseTimeToMinutes(entry.startTime);
      const endMin = parseTimeToMinutes(entry.endTime);
      const isInProgress = entry.day === currentDayName && currentMinutes >= startMin && currentMinutes < endMin && entry.status !== 'postponed';
      return { ...entry, teacher, subject, isInProgress } as (ClassEntry & { isInProgress: boolean });
    }).filter((item): item is (ClassEntry & { isInProgress: boolean }) => {
      if (!item) return false;
      const matchDay = selectedDay === 'All' || item.day === selectedDay;
      const matchDept = filters.department === 'All' || item.subject.department === filters.department;
      const matchSearch = !filters.search || 
                          item.subject.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                          item.teacher.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          item.subject.code.toLowerCase().includes(filters.search.toLowerCase());
      return matchDay && matchDept && matchSearch;
    }).sort((a, b) => {
      if (a.isInProgress && !b.isInProgress) return -1;
      if (!a.isInProgress && b.isInProgress) return 1;
      return parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime);
    });
  }, [schedule, teachers, subjects, selectedDay, filters, currentDayName, now]);

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password === 'admin123') { setIsAuth(true); setAdminTab('dashboard'); } 
    else { alert('Invalid Access Passcode'); }
  };

  // Form Validation Utilities
  const validateRoutine = () => {
    const errs: Record<string, string> = {};
    if (!routineFormData.teacherId) errs.teacherId = "Selection required";
    if (!routineFormData.subjectId) errs.subjectId = "Selection required";
    if (!routineFormData.room) errs.room = "Room is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateFaculty = () => {
    const errs: Record<string, string> = {};
    if (!facultyFormData.name) errs.name = "Name is required";
    if (!facultyFormData.department) errs.department = "Department required";
    if (!facultyFormData.email) errs.email = "Email is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateSubject = () => {
    const errs: Record<string, string> = {};
    if (!subjectFormData.title) errs.title = "Title is required";
    if (!subjectFormData.code) errs.code = "Code is required";
    if (!subjectFormData.department) errs.department = "Department required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // CRUD Handlers
  const handleRoutineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRoutine()) return;
    if (editingId) {
      setSchedule(prev => prev.map(s => s.id === editingId ? { ...s, ...routineFormData } as ScheduleEntry : s));
    } else {
      const newSlot: ScheduleEntry = { ...routineFormData as ScheduleEntry, id: `slot-${Date.now()}` };
      setSchedule(prev => [...prev, newSlot]);
    }
    setIsRoutineFormOpen(false);
    setEditingId(null);
    setFormErrors({});
  };

  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFaculty()) return;
    if (editingId) {
      setTeachers(prev => prev.map(t => t.id === editingId ? { ...t, ...facultyFormData } as Teacher : t));
    } else {
      setTeachers([...teachers, { ...facultyFormData as Teacher, id: `t-${Date.now()}`, designation: 'Course Instructor' }]);
    }
    setFacultyFormData({ name: '', department: '', email: '', whatsapp: '', deptWhatsapp: '', avatarId: 'avatar-1' });
    setIsFacultyModalOpen(false);
    setEditingId(null);
    setFormErrors({});
  };

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSubject()) return;
    if (editingId) {
      setSubjects(prev => prev.map(s => s.id === editingId ? { ...s, ...subjectFormData } as Subject : s));
    } else {
      setSubjects([...subjects, { ...subjectFormData as Subject, id: `s-${Date.now()}` }]);
    }
    setSubjectFormData({ title: '', code: '', department: '', program: '', credit: '', category: 'General', whatsapp: '' });
    setIsSubjectModalOpen(false);
    setEditingId(null);
    setFormErrors({});
  };

  // Bus Track View
  if (view === 'bus-track') {
    return (
      <div className="max-w-xl mx-auto px-6 py-12 md:py-20 min-h-screen flex flex-col">
        <button onClick={() => setView('public')} className="flex items-center space-x-3 mb-12 text-slate-400 font-black uppercase tracking-widest text-[10px] active:scale-95 transition-transform">
          <ArrowLeft size={16} /><span>Back to Routine</span>
        </button>
        <div className="flex-1 bg-white rounded-[3rem] fiu-card-shadow border border-white flex flex-col items-center justify-center text-center p-12">
          <div className="relative mb-8">
             <motion.div animate={{ x: [-40, 40, -40] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}><Bus size={64} className="text-blue-600" /></motion.div>
             <div className="absolute -bottom-2 w-full h-1 bg-slate-100 rounded-full" />
          </div>
          <h2 className="text-2xl font-black text-[#0f172a] mb-4">Live Bus Tracking</h2>
          <p className="text-slate-400 font-bold max-w-xs">Connecting to University GPS system. Please wait for the real-time map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12 md:py-20">
      <header className="flex items-center justify-between mb-12 px-2">
        <div className="flex items-center space-x-6 md:space-x-10">
          <img src={UNIVERSITY_LOGO} alt="FIU" className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] object-contain drop-shadow-sm" />
          <div className="pt-1">
            <h1 className="text-[14.7px] md:text-[21px] font-black text-[#0f172a] leading-[1.2] uppercase tracking-tight">
              Fareast <br/> International <br/> University
            </h1>
          </div>
        </div>
        
        <div className="flex flex-col items-center translate-x-3 md:translate-x-6">
          <label className="origami-toggle scale-[0.55] md:scale-[0.7] origin-center">
            <input type="checkbox" className="origami-input" checked={view === 'admin'} onChange={(e) => setView(e.target.checked ? 'admin' : 'public')} />
            <div className="origami-paper"><div className="origami-fold"></div><div className="origami-knob"><div className="origami-texture"></div></div></div>
          </label>
          <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-slate-300 mt-2 pointer-events-none text-center leading-tight">
            {view === 'admin' ? <>FACULTY<br/>ADMIN</> : <>SCHEDULE<br/>ROUTINE</>}
          </p>
        </div>
      </header>

      {view === 'public' ? (
        <main className="space-y-4">
          <div className="grid grid-cols-2 gap-4 px-1">
            <button onClick={() => setShowHolidays(true)} style={{ borderRadius: '32px', background: 'linear-gradient(145deg, #cacaca, #f0f0f0)', boxShadow: '21px 21px 42px #a6a6a6, -21px -21px 42px #ffffff' }} className="group relative flex flex-col items-center justify-center py-4 px-3 transition-all duration-300 active:scale-[0.98] border-none">
              <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-500 shadow-lg p-2.5 rounded-xl text-white mb-2 group-hover:scale-110 transition-transform">
                <motion.div animate={{ rotateY: [0, 180, 360], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}><Calendar size={18} strokeWidth={2.5} /></motion.div>
              </div>
              <div className="text-center">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0">Academic</p>
                <p className="text-[10px] font-black text-[#090909] leading-tight">Calendar &<br/>Holidays</p>
              </div>
            </button>
            <button onClick={() => setView('bus-track')} style={{ borderRadius: '32px', background: 'linear-gradient(145deg, #cacaca, #f0f0f0)', boxShadow: '21px 21px 42px #a6a6a6, -21px -21px 42px #ffffff' }} className="group relative flex flex-col items-center justify-center py-4 px-3 transition-all duration-300 active:scale-[0.98] border-none">
              <div className="relative flex items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-400 shadow-lg p-2.5 rounded-xl text-white mb-2 group-hover:scale-110 transition-transform">
                <motion.div animate={{ x: [-3, 3, -3], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}><Bus size={18} strokeWidth={2.5} /></motion.div>
              </div>
              <div className="text-center">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0">Live Map</p>
                <p className="text-[10px] font-black text-[#090909] leading-tight">Real-time<br/>Bus Tracking</p>
              </div>
            </button>
          </div>

          <div style={{ borderRadius: '32px', background: '#e8e8e8', boxShadow: '6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff', border: '1px solid #e8e8e8' }} className="px-4 py-8 flex items-center justify-center text-center overflow-hidden">
            <p className="text-[13px] font-black text-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2 animate-zoom-pulse whitespace-nowrap w-full">
              <span>{semesterTitle}</span>
            </p>
          </div>

          <div 
            ref={scrollRef} 
            className="overflow-x-auto no-scrollbar pt-8 pb-4 cursor-grab"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <div className="flex space-x-4 min-w-max px-8">
              {DAYS.map((day) => (
                <div key={day} className="relative flex flex-col items-center flex-shrink-0">
                  {day === currentDayName && (
                    <div className="absolute bottom-full inset-x-0 flex justify-center z-30 pointer-events-none">
                      <ImpactDust /><motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="px-2.5 py-1 bg-[#10b981] text-white text-[7px] font-black rounded-full shadow-2xl tracking-widest uppercase border-[3px] border-white flex items-center justify-center origin-bottom">TODAY</motion.div>
                    </div>
                  )}
                  <button 
                    ref={el => dayButtonsRef.current[day] = el}
                    onClick={() => setSelectedDay(day)} 
                    className={`px-7 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedDay === day ? 'neumorphic-day-btn-selected' : 'neumorphic-day-btn'}`}
                  >
                    {day.toUpperCase()}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="neumorphic-search-container p-8 rounded-[32px] space-y-4">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-6 text-slate-300" size={20} />
              <input type="text" placeholder="Search faculty, course or subject..." className="w-full h-16 pl-16 pr-6 bg-white/50 rounded-[2rem] font-bold text-sm outline-none border border-transparent focus:bg-white focus:border-blue-100 transition-all shadow-inner" value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} />
            </div>
            <select className="custom-select w-full h-16 px-8 bg-white/50 rounded-[2rem] font-black text-[10px] uppercase tracking-widest border border-transparent text-slate-500 outline-none hover:bg-white transition-all shadow-inner" value={filters.department} onChange={e => setFilters(p => ({ ...p, department: e.target.value }))}>
              <option value="All">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
            <button className="w-full h-16 bg-blue-600 rounded-[2rem] text-white font-black text-[11px] uppercase tracking-widest flex items-center justify-center shadow-lg active:scale-95 transition-all">
              <SearchIcon size={20} className="mr-2" />
              <span>Search</span>
            </button>
          </div>

          <div className="space-y-6 pb-32 pt-2">
            <AnimatePresence mode="popLayout">
              {filteredSchedule.map((item) => (
                <motion.div layout key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`routine-card px-8 py-6 relative overflow-hidden ${item.isInProgress ? 'routine-card-active' : ''}`}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 w-full">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-50 flex-shrink-0"><CategoryIcon category={item.subject.category} /></div>
                      <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm flex-shrink-0">{item.subjectCodeOverride || item.subject.code}</div>
                      {item.isInProgress && (
                        <div className="flex items-center space-x-2 bg-white border-2 border-[#16a34a] px-3 py-1.5 rounded-full animate-tilt-shaking shadow-sm z-10">
                          <div className="w-2.5 h-2.5 bg-[#16a34a] rounded-full animate-rapid-blink shadow-[0_0_10px_#16a34a]" /><span className="text-[8px] font-black text-[#16a34a] uppercase tracking-widest whitespace-nowrap">CLASS IN PROGRESS</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-[22px] font-black text-[#0f172a] leading-[1.2] tracking-tight pr-12">{item.subject.title}</h3>
                    <div className="flex items-center space-x-3">
                      <span className="pill-badge bg-white border border-slate-100 text-slate-400 shadow-sm">{item.subject.program}</span>
                      <span className={`pill-badge ${item.isInProgress ? 'bg-[#16a34a]' : 'bg-blue-600'} text-white shadow-lg`}>{item.creditOverride || item.subject.credit} Credits</span>
                    </div>
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
                      <div className="flex items-center text-[#1e293b]"><User size={18} className={`mr-4 ${item.isInProgress ? 'text-[#16a34a]' : 'text-emerald-500'}`} /><span className="text-lg font-black">{item.teacher.name}</span></div>
                      <div className="flex items-center text-[#1e293b]"><MapPin size={18} className="mr-4 text-rose-500" /><span className="text-sm font-bold text-slate-400">Room: <span className={`${item.isInProgress ? 'text-[#16a34a]' : 'text-blue-600'} font-black ml-1 uppercase`}>{item.room.toUpperCase()}</span></span></div>
                      <div className={`flex items-center ${item.isInProgress ? 'text-[#16a34a]' : 'text-blue-600'} cursor-pointer pt-0.5`} onClick={() => setActiveContactModal(item)}><MessageCircle size={18} className="mr-4" /><span className="text-[11px] font-black uppercase tracking-[0.2em] border-b border-dashed border-slate-300 leading-relaxed">CONTACT FACULTY</span></div>
                    </div>
                    <div className="pt-1">
                      <div className={`time-capsule w-full py-3.5 flex items-center justify-center space-x-4 ${item.isInProgress ? 'bg-green-50/50 border border-green-100' : ''}`}>
                        <Clock size={16} className={item.isInProgress ? 'text-[#16a34a]' : 'text-slate-300'} /><span className={`text-sm font-black uppercase tracking-wider ${item.isInProgress ? 'text-[#16a34a]' : 'text-[#0f172a]'}`}>{item.startTime} - {item.endTime}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>
      ) : (
        <div className="relative min-h-[60vh]">
          {!isAuth ? (
            <div className="flex items-center justify-center py-12">
              <motion.form initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="login-form" onSubmit={handleLoginSubmit}>
                <div className="bg-stars">{[...Array(4)].map((_, i) => <div key={i} className="portal-star"></div>)}</div>
                <p className="form-title"><span>PORTAL</span> ACCESS</p><p className="title-2"><span></span>ADMIN<span></span></p>
                <div className="input-container mt-6"><input type="password" placeholder="Enter Passcode" autoFocus className="input-pwd" value={password} onChange={e => setPassword(e.target.value)} /></div>
                <button type="submit" className="submit mt-6">Unlock Dashboard</button>
                <div className="signup-link mt-6">Restricted for <a href="#" onClick={(e) => e.preventDefault()}>Fareast Faculty</a></div>
              </motion.form>
            </div>
          ) : (
            <div className="space-y-6 bg-[#e0e0e0] p-6 rounded-[50px] min-h-screen">
              {/* Admin Panel Header */}
              <div style={ADMIN_CARD_STYLE} className="flex items-center justify-between p-6">
                <button onClick={() => setIsAdminMenuOpen(true)} className="p-4 bg-[#e0e0e0] rounded-2xl text-slate-500 active:scale-95 transition-all shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] group hover:text-blue-600">
                   <Menu size={24} className="transition-colors" />
                </button>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Console</p>
                  <h2 className="text-sm font-black text-blue-600 uppercase tracking-tight">{adminTab} Manager</h2>
                </div>
              </div>

              {/* Advanced Filtering & Keyword Suggestions */}
              {adminTab !== 'dashboard' && adminTab !== 'settings' && adminTab !== 'semester' && (
                <div className="space-y-4 px-2">
                  <div className="relative">
                    <div className="relative flex items-center">
                      <SearchIcon className="absolute left-6 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder={`Search ${adminTab === 'departments' ? 'Departments' : adminTab}...`} 
                        style={ADMIN_INPUT_STYLE}
                        className="w-full h-14 pl-14 pr-6 font-bold text-xs outline-none text-slate-700 focus:text-blue-700 transition-all"
                        value={adminSearch}
                        onChange={e => adminTab === 'routine' ? handleRoutineSearchChange(e.target.value) : setAdminSearch(e.target.value)}
                      />
                    </div>
                    {adminTab === 'routine' && routineSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                        {routineSuggestions.map((s, idx) => (
                          <button key={idx} onClick={() => { setAdminSearch(s); setRoutineSuggestions([]); }} className="w-full p-4 text-left text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0">{s}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
                    {adminTab === 'faculty' && (
                      <select style={ADMIN_INPUT_STYLE} className="h-10 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-transparent flex-shrink-0" value={facultyDeptFilter} onChange={e => setFacultyDeptFilter(e.target.value)}>
                        <option value="All">All Departments</option>
                        {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                      </select>
                    )}
                    {adminTab === 'subjects' && (
                      <select style={ADMIN_INPUT_STYLE} className="h-10 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-transparent flex-shrink-0" value={subjectProgFilter} onChange={e => setSubjectProgFilter(e.target.value)}>
                        <option value="All">All Programs</option>
                        {programs.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
                      </select>
                    )}
                    {adminTab === 'routine' && (
                      <select style={ADMIN_INPUT_STYLE} className="h-10 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-transparent flex-shrink-0" value={routineDayFilter} onChange={e => setRoutineDayFilter(e.target.value)}>
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {((adminTab === 'routine' && selectedRoutineIds.size > 0) || 
                      (adminTab === 'faculty' && selectedFacultyIds.size > 0) || 
                      (adminTab === 'subjects' && selectedSubjectIds.size > 0)) && (
                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-2xl shadow-lg">
                         <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
                           {adminTab === 'routine' ? selectedRoutineIds.size : adminTab === 'faculty' ? selectedFacultyIds.size : selectedSubjectIds.size} Items Selected
                         </p>
                         <button 
                           onClick={adminTab === 'routine' ? handleBulkDeleteRoutine : adminTab === 'faculty' ? handleBulkDeleteFaculty : handleBulkDeleteSubjects}
                           className="px-6 py-2 bg-rose-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                         >
                           Bulk Delete
                         </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Admin Dashboard: Live Reports */}
              {adminTab === 'dashboard' && (
                <div className="space-y-6 px-1">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div style={ADMIN_CARD_STYLE} className="p-6 flex flex-col items-center text-center">
                        <Activity className="text-blue-600 mb-3" size={24} />
                        <p className="text-[24px] font-black text-[#0f172a]">{stats.dailyLiveUsers}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Active Now</p>
                      </div>
                      <div style={ADMIN_CARD_STYLE} className="p-6 flex flex-col items-center text-center">
                        <BarChart3 className="text-emerald-600 mb-3" size={24} />
                        <p className="text-[24px] font-black text-[#0f172a]">{stats.totalDailyViews}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Today's Visits</p>
                      </div>
                    </div>
                    
                    <div style={ADMIN_CARD_STYLE} className="p-8">
                       <div className="flex items-center justify-between mb-8">
                          <div>
                            <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-tight">Weekly Engagement</h3>
                            <p className="text-[9px] font-bold text-emerald-600 uppercase">{stats.weeklyGrowth} Higher vs last week</p>
                          </div>
                          <TrendingUp className="text-emerald-500" size={20} />
                       </div>
                       <div className="flex items-end justify-between h-32 space-x-2">
                          {[65, 80, 45, 90, 70, 85, 95].map((h, i) => (
                            <div key={i} className="flex flex-col items-center flex-1">
                               <div className="w-full bg-slate-200 rounded-t-lg relative group overflow-hidden" style={{ height: `${h}%` }}>
                                  <div className="absolute inset-0 bg-blue-500 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                               </div>
                               <span className="text-[7px] font-black text-slate-400 mt-2">{'SMTWTFS'[i]}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Management Lists */}
              <div className="space-y-4 px-1 pb-32">
                {adminTab === 'routine' && (
                  <div className="space-y-3">
                    <button onClick={() => setIsRoutineFormOpen(true)} style={ADMIN_CARD_STYLE} className="w-full h-14 text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center justify-center active:scale-95 transition-all mb-4"><Plus size={18} className="mr-2" /> Add Schedule Entry</button>
                    {schedule.filter(s => 
                      (routineDayFilter === 'All' || s.day === routineDayFilter) &&
                      (s.day.toLowerCase().includes(adminSearch.toLowerCase()) || subjects.find(sub => sub.id === s.subjectId)?.title.toLowerCase().includes(adminSearch.toLowerCase()))
                    ).map(slot => {
                      const subj = subjects.find(sub => sub.id === slot.subjectId);
                      const isSelected = selectedRoutineIds.has(slot.id);
                      return (
                        <motion.div layout key={slot.id} style={ADMIN_CARD_STYLE} className={`p-6 flex items-center space-x-4 border-2 transition-all ${isSelected ? 'border-blue-500' : 'border-transparent'}`}>
                          <button onClick={() => toggleSelection(slot.id, selectedRoutineIds, setSelectedRoutineIds)} className="flex-shrink-0 text-slate-400 hover:text-blue-500">
                             {isSelected ? <CheckSquare size={20} className="text-blue-500" /> : <Square size={20} />}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div><p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{slot.day} | {slot.startTime}</p><p className="text-sm font-black text-[#0f172a]">{subj?.title}</p></div>
                              <div className="flex space-x-1">
                                <button onClick={() => { setEditingId(slot.id); setRoutineFormData(slot); setIsRoutineFormOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Edit2 size={16} /></button>
                                <button onClick={() => setSchedule(prev => prev.filter(s => s.id !== slot.id))} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {adminTab === 'faculty' && (
                  <div className="space-y-3">
                    <button onClick={() => setIsFacultyModalOpen(true)} style={ADMIN_CARD_STYLE} className="w-full h-14 text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center justify-center active:scale-95 transition-all mb-4"><Plus size={18} className="mr-2" /> Add Faculty</button>
                    {teachers.filter(t => 
                      (facultyDeptFilter === 'All' || t.department === facultyDeptFilter) &&
                      t.name.toLowerCase().includes(adminSearch.toLowerCase())
                    ).map(teacher => {
                      const isSelected = selectedFacultyIds.has(teacher.id);
                      return (
                        <motion.div layout key={teacher.id} style={ADMIN_CARD_STYLE} className={`p-6 flex items-center space-x-4 border-2 transition-all ${isSelected ? 'border-blue-500' : 'border-transparent'}`}>
                          <button onClick={() => toggleSelection(teacher.id, selectedFacultyIds, setSelectedFacultyIds)} className="flex-shrink-0 text-slate-400 hover:text-blue-500">
                             {isSelected ? <CheckSquare size={20} className="text-blue-500" /> : <Square size={20} />}
                          </button>
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg"><AvatarFace id={teacher.avatarId || 'avatar-1'} /></div>
                          <div className="flex-1">
                             <p className="text-sm font-black text-[#0f172a]">{teacher.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{teacher.department}</p>
                          </div>
                          <div className="flex space-x-1">
                             <button onClick={() => { setEditingId(teacher.id); setFacultyFormData(teacher); setIsFacultyModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 size={16} /></button>
                             <button onClick={() => setTeachers(prev => prev.filter(t => t.id !== teacher.id))} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {adminTab === 'subjects' && (
                  <div className="space-y-3">
                    <button onClick={() => setIsSubjectModalOpen(true)} style={ADMIN_CARD_STYLE} className="w-full h-14 text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center justify-center active:scale-95 transition-all mb-4"><Plus size={18} className="mr-2" /> New Course</button>
                    {subjects.filter(s => 
                      (subjectProgFilter === 'All' || s.program === subjectProgFilter) &&
                      (s.title.toLowerCase().includes(adminSearch.toLowerCase()) || s.code.toLowerCase().includes(adminSearch.toLowerCase()))
                    ).map(subject => {
                      const isSelected = selectedSubjectIds.has(subject.id);
                      return (
                        <motion.div layout key={subject.id} style={ADMIN_CARD_STYLE} className={`p-6 flex items-center space-x-4 border-2 transition-all ${isSelected ? 'border-blue-500' : 'border-transparent'}`}>
                          <button onClick={() => toggleSelection(subject.id, selectedSubjectIds, setSelectedSubjectIds)} className="flex-shrink-0 text-slate-400 hover:text-blue-500">
                             {isSelected ? <CheckSquare size={20} className="text-blue-500" /> : <Square size={20} />}
                          </button>
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><BookOpen size={20} /></div>
                          <div className="flex-1">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{subject.code}</p>
                             <p className="text-sm font-black text-[#0f172a] leading-tight">{subject.title}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                             <button onClick={() => { setEditingId(subject.id); setSubjectFormData(subject); setIsSubjectModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 size={16} /></button>
                             <button onClick={() => setSubjects(prev => prev.filter(s => s.id !== subject.id))} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Responsive Admin Hamburger Menu */}
              <AnimatePresence>
                {isAdminMenuOpen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] flex items-center justify-center p-6 md:p-12 bg-slate-900/80 backdrop-blur-2xl" onClick={() => setIsAdminMenuOpen(false)}>
                    {/* Fixed High-Contrast Close Button for Mobile */}
                    <button 
                      onClick={() => setIsAdminMenuOpen(false)} 
                      className="fixed top-8 right-8 z-[810] p-4 bg-white rounded-full text-rose-600 shadow-[0_20px_50px_rgba(0,0,0,0.3)] active:scale-90 transition-transform"
                      aria-label="Close Menu"
                    >
                       <X size={28} strokeWidth={3} />
                    </button>

                    <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} style={ADMIN_CARD_STYLE} className="w-full max-w-sm overflow-hidden p-10 relative" onClick={e => e.stopPropagation()}>
                       <div className="flex items-center space-x-4 mb-12">
                          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Settings size={24}/></div>
                          <h3 className="text-xl font-black text-[#0f172a] uppercase tracking-tight">Admin Console</h3>
                       </div>
                       
                       <div className="space-y-4">
                          {ADMIN_TABS.map(tab => (
                            <button 
                              key={tab.id} 
                              onClick={() => { setAdminTab(tab.id); setIsAdminMenuOpen(false); }}
                              className={`w-full p-6 rounded-[2.5rem] flex items-center justify-between transition-all ${adminTab === tab.id ? 'text-blue-600 shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff]' : 'text-slate-400 hover:text-slate-600 shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff]'}`}
                            >
                              <span className="font-black text-[11px] uppercase tracking-widest">{tab.label}</span>
                              <tab.icon size={20} />
                            </button>
                          ))}
                       </div>
                       <button onClick={() => {setIsAuth(false); setView('public');}} className="mt-12 w-full text-center text-slate-400 font-black uppercase tracking-[0.4em] text-[8px] hover:text-rose-500 transition-colors">Terminate Session</button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Modals with Validation */}
              <AnimatePresence>
                {isRoutineFormOpen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[900] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsRoutineFormOpen(false)}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={ADMIN_CARD_STYLE} className="w-full max-w-md p-10" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center space-x-3"><Clock className="text-blue-600" size={20}/><h3 className="text-lg font-black text-[#0f172a] uppercase tracking-tight">{editingId ? 'Edit' : 'Add'} Entry</h3></div>
                         <button onClick={() => { setIsRoutineFormOpen(false); setFormErrors({}); }} className="text-slate-400 p-2"><X size={20}/></button>
                      </div>
                      <form onSubmit={handleRoutineSubmit} className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1"><label className="text-[8px] font-black text-slate-400 uppercase ml-4">Start Time</label><TimePicker value={routineFormData.startTime || '08:00 am'} onChange={(v) => setRoutineFormData(p => ({ ...p, startTime: v }))} /></div>
                            <div className="space-y-1"><label className="text-[8px] font-black text-slate-400 uppercase ml-4">End Time</label><TimePicker value={routineFormData.endTime || '09:30 am'} onChange={(v) => setRoutineFormData(p => ({ ...p, endTime: v }))} /></div>
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between px-4"><label className="text-[8px] font-black text-slate-400 uppercase">Room</label>{formErrors.room && <span className="text-[7px] text-rose-500 font-black uppercase">{formErrors.room}</span>}</div>
                             <input type="text" style={ADMIN_INPUT_STYLE} className={`w-full h-12 px-5 font-bold text-xs outline-none border-2 ${formErrors.room ? 'border-rose-300' : 'border-transparent'}`} value={routineFormData.room} onChange={e => {setRoutineFormData(p => ({ ...p, room: e.target.value })); if(e.target.value) setFormErrors(prev => ({...prev, room: ''})); }} />
                         </div>
                         <div className="space-y-1">
                            <div className="flex justify-between px-4"><label className="text-[8px] font-black text-slate-400 uppercase">Subject</label>{formErrors.subjectId && <span className="text-[7px] text-rose-500 font-black uppercase">{formErrors.subjectId}</span>}</div>
                            <select style={ADMIN_INPUT_STYLE} className={`w-full h-12 px-5 font-bold text-xs outline-none border-2 ${formErrors.subjectId ? 'border-rose-300' : 'border-transparent'}`} value={routineFormData.subjectId} onChange={e => {setRoutineFormData(p => ({ ...p, subjectId: e.target.value })); if(e.target.value) setFormErrors(prev => ({...prev, subjectId: ''})); }}>
                               <option value="">Select Subject</option>
                               {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.title}</option>)}
                            </select>
                         </div>
                         <div className="space-y-1">
                            <div className="flex justify-between px-4"><label className="text-[8px] font-black text-slate-400 uppercase">Faculty</label>{formErrors.teacherId && <span className="text-[7px] text-rose-500 font-black uppercase">{formErrors.teacherId}</span>}</div>
                            <select style={ADMIN_INPUT_STYLE} className={`w-full h-12 px-5 font-bold text-xs outline-none border-2 ${formErrors.teacherId ? 'border-rose-300' : 'border-transparent'}`} value={routineFormData.teacherId} onChange={e => {setRoutineFormData(p => ({ ...p, teacherId: e.target.value })); if(e.target.value) setFormErrors(prev => ({...prev, teacherId: ''})); }}>
                               <option value="">Select Faculty</option>
                               {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                         </div>
                         <button type="submit" style={ADMIN_CARD_STYLE} className="w-full h-14 text-blue-600 font-black text-[11px] uppercase tracking-widest mt-4 active:scale-95 transition-all"><Save size={18} className="mr-2" /> Save Entry</button>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      <footer className="text-center text-slate-300 text-[9px] font-black uppercase tracking-[0.6em] py-20 mt-10 opacity-50">Fareast International University</footer>
    </div>
  );
};