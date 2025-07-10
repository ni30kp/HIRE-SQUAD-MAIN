import { useState, useEffect } from 'react';
import { Candidate, CandidateFilters } from '@/types/candidate';
// Helper functions to generate realistic profile URLs
const generateLinkedInUrl = (name: string): string => {
  const cleanName = name.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
  return `https://linkedin.com/in/${cleanName}`;
};

const generateGitHubUrl = (name: string): string => {
  const cleanName = name.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, '')
    .trim();
  return `https://github.com/${cleanName}`;
};

const generatePortfolioUrl = (name: string): string => {
  const cleanName = name.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, '')
    .trim();
  return `https://${cleanName}.dev`;
};

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CandidateFilters>({
    location: 'all',
    education: 'all',
    experience: 'all',
    availability: 'all',
    search: '',
    salaryMin: 0,
    salaryMax: 500000,
  });

  console.log('useCandidates - filters initialized:', filters);

  useEffect(() => {
    // Comment out auto-loading to test upload functionality
    // loadCandidates();
    setLoading(false); // Set loading to false immediately since we're not auto-loading
  }, []);

  useEffect(() => {
    applyFilters();
  }, [candidates, filters]);

  const loadCandidates = async () => {
    try {
      const response = await fetch('/data/candidates.json');
      const data = await response.json();
      
      // Validate and clean candidate data before processing
      const validatedData = data.filter(candidate => {
        // Filter out candidates with critical missing data
        if (!candidate.name || candidate.name.trim() === '') {
          console.warn('Candidate missing name, skipping:', candidate);
          return false;
        }
        if (!candidate.email || candidate.email.trim() === '') {
          console.warn('Candidate missing email, skipping:', candidate);
          return false;
        }
        return true;
      });

      // Add IDs and calculate scores for each candidate
      const enrichedCandidates = validatedData.map((candidate: Candidate, index: number) => ({
        ...candidate,
        id: `candidate-${index}`,
        score: calculateCandidateScore(candidate),
        selected: false,
        notes: '',
        // Generate realistic LinkedIn and social profiles (handle empty names gracefully)
        linkedinUrl: generateLinkedInUrl(candidate.name || 'anonymous'),
        githubUrl: generateGitHubUrl(candidate.name || 'anonymous'),
        portfolioUrl: generatePortfolioUrl(candidate.name || 'anonymous'),
      }));
      
      setCandidates(enrichedCandidates);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load candidates:', error);
      setLoading(false);
    }
  };

  const calculateCandidateScore = (candidate: Candidate): number => {
    let score = 0;
    
    // Experience diversity (more diverse roles = higher score)
    const uniqueRoles = new Set(candidate.work_experiences?.map(exp => exp.roleName.toLowerCase()) || []);
    score += uniqueRoles.size * 10;
    
    // Education level with enhanced scoring
    const educationLevel = candidate.education?.highest_level || '';
    if (educationLevel.includes("PhD")) score += 25;
    else if (educationLevel.includes("Master's") || educationLevel.includes("Juris Doctor")) score += 20;
    else if (educationLevel.includes("Bachelor's")) score += 15;
    else score += 10;
    
    // Top school bonus
    const hasTopSchool = candidate.education?.degrees?.some(d => d.isTop25 || d.isTop50);
    if (hasTopSchool) score += 15;
    
    // GPA bonus
    const hasHighGPA = candidate.education?.degrees?.some(d => 
      d.gpa && (d.gpa.includes('3.9') || d.gpa.includes('4.0'))
    );
    if (hasHighGPA) score += 10;
    
    // Skills count bonus
    const skillsCount = candidate.skills?.length || 0;
    score += Math.min(skillsCount * 2, 10);
    
    // Work availability flexibility
    if (candidate.work_availability?.includes('full-time') && 
        candidate.work_availability?.includes('part-time')) {
      score += 5;
    }
    
    // Location diversity (international = bonus)
    const internationalLocations = ['São Paulo', 'Rio de Janeiro', 'London', 'Berlin', 'Tokyo', 'Sydney', 'Vancouver', 'Toronto'];
    if (internationalLocations.some(loc => candidate.location?.includes(loc))) score += 10;
    
    return Math.min(score, 100); // Cap at 100
  };

  const applyFilters = () => {
    let filtered = [...candidates];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchLower) ||
        candidate.email.toLowerCase().includes(searchLower) ||
        candidate.location.toLowerCase().includes(searchLower) ||
        candidate.work_experiences?.some(exp => 
          exp.company.toLowerCase().includes(searchLower) ||
          exp.roleName.toLowerCase().includes(searchLower)
        )
      );
    }

    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter(candidate =>
        candidate.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.education && filters.education !== 'all') {
      filtered = filtered.filter(candidate =>
        candidate.education?.highest_level.includes(filters.education)
      );
    }

    if (filters.availability && filters.availability !== 'all') {
      filtered = filtered.filter(candidate =>
        candidate.work_availability?.includes(filters.availability)
      );
    }

    // Salary filtering
    filtered = filtered.filter(candidate => {
      const salary = parseSalary(candidate.annual_salary_expectation['full-time'] || '0');
      return salary >= filters.salaryMin && salary <= filters.salaryMax;
    });

    setFilteredCandidates(filtered);
  };

  const parseSalary = (salaryString: string): number => {
    return parseInt(salaryString.replace(/[$,]/g, '')) || 0;
  };

  const toggleCandidateSelection = (candidateId: string) => {
    if (selectedCandidates.length >= 5 && !selectedCandidates.find(c => c.id === candidateId)) {
      return; // Don't allow more than 5 selections
    }

    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const isSelected = selectedCandidates.find(c => c.id === candidateId);
    
    if (isSelected) {
      setSelectedCandidates(prev => prev.filter(c => c.id !== candidateId));
    } else {
      setSelectedCandidates(prev => [...prev, candidate]);
    }
  };

  const updateCandidateNotes = (candidateId: string, notes: string) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId ? { ...candidate, notes } : candidate
      )
    );
  };

  const uploadCandidates = (newCandidates: Candidate[]) => {
    const enrichedCandidates = newCandidates.map((candidate, index) => ({
      ...candidate,
      id: candidate.id || `uploaded-${Date.now()}-${index}`,
      score: calculateCandidateScore(candidate),
      selected: false,
      notes: candidate.notes || '',
      // Generate realistic LinkedIn and social profiles for uploaded candidates too
      linkedinUrl: candidate.linkedinUrl || generateLinkedInUrl(candidate.name),
      githubUrl: candidate.githubUrl || generateGitHubUrl(candidate.name),
      portfolioUrl: candidate.portfolioUrl || generatePortfolioUrl(candidate.name),
    }));
    
    setCandidates(enrichedCandidates);
    setSelectedCandidates([]); // Clear selections when new data is uploaded
  };

  return {
    candidates,
    filteredCandidates,
    selectedCandidates,
    loading,
    filters,
    setFilters,
    toggleCandidateSelection,
    updateCandidateNotes,
    uploadCandidates,
  };
};