export type DayOfWeek = 'All' | 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type Category = 'Business' | 'CSE' | 'EEE' | 'Law' | 'English' | 'Chemistry' | 'Islamic' | 'Soil' | 'Civil' | 'PublicHealth' | 'General' | 'Textile' | 'Architecture';

export interface Department {
  id: string;
  name: string;
}

export interface Program {
  id: string;
  title: string;
  departmentId: string;
}

export interface Holiday {
  id: string;
  title: string;
  date: string;
  description?: string;
  imageUrl?: string;
}

export interface Teacher {
  id: string;
  name: string;
  designation: string;
  email: string;
  department: string; // Linked to Department name or ID
  whatsapp?: string;
  deptWhatsapp?: string;
  photo?: string; // Base64 string
  avatarId?: string; // ID for pre-designed avatars (1-20)
}

export interface Subject {
  id: string;
  title: string;
  code: string;
  department: string;
  program: string;
  credit: string;
  category: Category;
  whatsapp?: string; // Course specific whatsapp group
}

export interface SemesterOption {
  id: string;
  label: string; 
  isActive: boolean;
}

export type ClassStatus = 'scheduled' | 'rescheduled' | 'postponed';

export interface ScheduleEntry {
  id: string;
  day: Exclude<DayOfWeek, 'All'>;
  startTime: string; 
  endTime: string;   
  teacherId: string;
  subjectId: string;
  room: string;
  section?: string;
  subjectCodeOverride?: string;
  creditOverride?: string;
  status?: ClassStatus;
  rescheduledNote?: string;
}

export interface ClassEntry extends Omit<ScheduleEntry, 'teacherId' | 'subjectId'> {
  teacher: Teacher;
  subject: Subject;
}

export interface FilterState {
  search: string;
  department: string;
  subject: string;
}