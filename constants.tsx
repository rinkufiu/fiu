import { Teacher, Subject, ScheduleEntry, Department, Holiday, Program } from './types';

export const UNIVERSITY_LOGO = "https://raw.githubusercontent.com/rinkufiu/images/main/IMG_6019.png";
export const API_BASE_URL = "/api"; 

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'CSE' },
  { id: 'd2', name: 'Law' },
  { id: 'd3', name: 'EEE' },
  { id: 'd4', name: 'Business' },
  { id: 'd5', name: 'Islamic' }
];

export const INITIAL_PROGRAMS: Program[] = [
  { id: 'p1', title: 'B.Sc. in CSE', departmentId: 'd1' },
  { id: 'p2', title: 'M.Sc. in CSE', departmentId: 'd1' },
  { id: 'p3', title: 'LL.B (Honours)', departmentId: 'd2' },
  { id: 'p4', title: 'LL.M (Masters)', departmentId: 'd2' },
  { id: 'p5', title: 'B.Sc. in EEE', departmentId: 'd3' },
  { id: 'p6', title: 'BBA', departmentId: 'd4' },
  { id: 'p7', title: 'M.A in Islamic Studies', departmentId: 'd5' }
];

export const INITIAL_HOLIDAYS: Holiday[] = [
  { 
    id: 'h1', 
    title: 'Language Martyrs Day', 
    date: '21 Feb 2026',
    description: 'International Mother Language Day to honor the martyrs of the Language Movement.',
    imageUrl: 'https://images.unsplash.com/photo-1582260656094-1a2eb8729589?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    id: 'h2', 
    title: 'Independence Day', 
    date: '26 Mar 2026',
    description: 'National holiday in Bangladesh commemorating the country\'s declaration of independence.',
    imageUrl: 'https://images.unsplash.com/photo-1627409241943-4e3650c38481?q=80&w=1000&auto=format&fit=crop'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  { 
    id: 't1', 
    name: "Ms. Anika Tasnim Islam", 
    designation: "Lecturer", 
    email: "anika.islam@fiu.edu.bd", 
    department: "CSE",
    whatsapp: "8801234567890",
    deptWhatsapp: "https://chat.whatsapp.com/deptGroup",
    avatarId: "avatar-3"
  },
  { 
    id: 't2', 
    name: "Prof. Md. Abdul Kuddus Miah", 
    designation: "Professor",
    email: "kuddus.miah@fiu.edu.bd", 
    department: "Law",
    whatsapp: "8801700000000",
    avatarId: "avatar-8"
  },
  {
    id: 't3',
    name: "Dr. Muhammad Abdur Rahim",
    designation: "Associate Professor",
    email: "m.rahim@fiu.edu.bd",
    department: "Islamic",
    whatsapp: "8801811111111",
    avatarId: "avatar-12"
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 's1', title: "Artificial Intelligence -(AI Lab)", code: "CSE 3115", department: "CSE", program: "B.Sc. in CSE", credit: "1.5", category: "CSE" },
  { id: 's2', title: "Constitutional Law of Bangladesh", code: "LAW 1206", department: "Law", program: "LL.B (Honours)", credit: "3.0", category: "Law" },
  { id: 's3', title: "Test Verification Class", code: "TEST 101", department: "CSE", program: "B.Sc. in CSE", credit: "1.0", category: "CSE" },
  { id: 's4', title: "Advanced Quranic Sciences & Tafsir", code: "ISL 501", department: "Islamic", program: "M.A in Islamic Studies", credit: "3.0", category: "Islamic" }
];

export const INITIAL_SCHEDULE: ScheduleEntry[] = [
  { 
    id: '1', 
    day: "Saturday", 
    startTime: "08:30 am", 
    endTime: "10:00 am", 
    teacherId: "t1", 
    subjectId: "s1", 
    room: "Computer Lab (AI)"
  },
  { id: '2', day: "Saturday", startTime: "08:30 am", endTime: "10:00 am", teacherId: "t2", subjectId: "s2", room: "203" },
  { 
    id: 'tuesday-demo', 
    day: "Tuesday", 
    startTime: "12:20 am", 
    endTime: "12:30 am", 
    teacherId: "t1", 
    subjectId: "s3", 
    room: "Demo Room 101" 
  },
  {
    id: 'islamic-demo',
    day: "Monday",
    startTime: "10:00 am",
    endTime: "11:30 am",
    teacherId: "t3",
    subjectId: "s4",
    room: "305 (Islamic Wing)"
  }
];