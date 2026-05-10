export const PHOTO_TEMPLATES = new Set([1, 3, 4]);

export const emptyExp = () => ({
  position: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: ''
});

export const emptyEdu = () => ({
  degree: '',
  field: '',
  institution: '',
  startDate: '',
  endDate: '',
  grade: ''
});

export const emptyProj = () => ({
  name: '',
  techStack: '',
  description: ''
});

export const emptyCert = () => ({
  name: '',
  issuer: '',
  date: ''
});

export const defaultForm = {
  fullName: '',
  targetJobTitle: '',
  email: '',
  phone: '',
  address: '',
  linkedinUrl: '',
  githubUrl: '',
  summary: '',
  photoBase64: '',
  experience: [emptyExp()],
  education: [emptyEdu()],
  skills: [''],
  projects: [emptyProj()],
  certifications: [emptyCert()],
  resumeLanguages: [],
};

export const THEMES = {
  1: { name: 'Classic Blue', headerBg: '#1a3a5c', accent: '#1a3a5c', preview: 'Two-column with sidebar' },
  2: { name: 'Editorial Serif', headerBg: '#1a1a1a', accent: '#1a1a1a', preview: 'Elegant serif design' },
  3: { name: 'Dark Sidebar', headerBg: '#1e2d3d', accent: '#2ecc71', preview: 'Dark panel with green' },
  4: { name: 'Purple Executive', headerBg: '#7c3aed', accent: '#7c3aed', preview: 'Bold purple header' },
  5: { name: 'Bold Red', headerBg: '#e63946', accent: '#e63946', preview: 'High-contrast red' },
  6: { name: 'ATS Clean Blue', headerBg: '#0070f3', accent: '#0070f3', preview: 'Clean ATS-friendly' },
};

export const STEPS = [
  { id: 'template', label: 'Template', icon: '🎨' },
  { id: 'personal', label: 'Personal', icon: '👤' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
  { id: 'extras', label: 'Extras', icon: '✨' },
];

export const SF = 'Helvetica Neue, Arial, sans-serif';
