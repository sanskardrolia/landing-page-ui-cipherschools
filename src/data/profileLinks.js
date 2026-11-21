import { Code2, FileText, ScanSearch } from 'lucide-react';

/* Tools in the profile menu (navbar) and the phone menu. Dashboard and Pricing are top-level navbar links. */
export const PROFILE_LINKS = [
  { to: '/resume', label: 'Resume Builder', hint: 'ATS-ready tech resumes', Icon: FileText },
  { to: '/online-compiler', label: 'Compiler', hint: 'Run code in the browser', Icon: Code2 },
  { to: '/resume/ats-checker', label: 'ATS Checker', hint: 'Score your resume', Icon: ScanSearch }
];
