export interface WorkExperience {
  company: string;
  roleName: string;
}

export interface Education {
  highest_level: string;
  degrees: {
    degree: string;
    subject: string;
    school: string;
    gpa: string;
    startDate: string;
    endDate: string;
    originalSchool: string;
    isTop50: boolean;
    isTop25?: boolean;
    institution?: string; // for backwards compatibility
  }[];
}

export interface Candidate {
  name: string;
  email: string;
  phone: string;
  location: string;
  submitted_at: string;
  work_availability: string[];
  annual_salary_expectation: {
    "full-time"?: string;
    "part-time"?: string;
  };
  work_experiences: WorkExperience[];
  education: Education;
  skills?: string[];
  languages?: string[];
  linkedinUrl?: string; // Add LinkedIn URL field
  portfolioUrl?: string; // Add portfolio URL field
  githubUrl?: string; // Add GitHub URL field
  id?: string;
  score?: number;
  selected?: boolean;
  notes?: string;
}

export interface CandidateFilters {
  location: string;
  education: string;
  experience: string;
  availability: string;
  search: string;
  salaryMin: number;
  salaryMax: number;
}