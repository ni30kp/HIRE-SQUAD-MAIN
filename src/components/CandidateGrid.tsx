import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { EnhancedCandidateCard } from './EnhancedCandidateCard';
import { Candidate } from '@/types/candidate';

interface CandidateGridProps {
  candidates: Candidate[];
  selectedCandidates: Candidate[];
  onToggleSelection: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

const CANDIDATES_PER_PAGE = 15;

export const CandidateGrid = ({ 
  candidates, 
  selectedCandidates, 
  onToggleSelection, 
  onUpdateNotes 
}: CandidateGridProps) => {
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'date' | 'salary'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'score':
          comparison = (a.score || 0) - (b.score || 0);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
          break;
        case 'salary':
          const aSalary = parseInt(a.annual_salary_expectation['full-time']?.replace(/[$,]/g, '') || '0');
          const bSalary = parseInt(b.annual_salary_expectation['full-time']?.replace(/[$,]/g, '') || '0');
          comparison = aSalary - bSalary;
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [candidates, sortBy, sortOrder]);

  const totalPages = Math.ceil(sortedCandidates.length / CANDIDATES_PER_PAGE);
  
  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * CANDIDATES_PER_PAGE;
    const endIndex = startIndex + CANDIDATES_PER_PAGE;
    return sortedCandidates.slice(startIndex, endIndex);
  }, [sortedCandidates, currentPage]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const isSelected = (candidateId: string) => 
    selectedCandidates.some(c => c.id === candidateId);

  const selectionLimit = selectedCandidates.length >= 5;

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Reset to page 1 when filters change (candidates array changes)
  useMemo(() => {
    setCurrentPage(1);
  }, [candidates.length]);

  return (
    <div className="space-y-6">
      {/* Header with sorting and pagination info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="date">Application Date</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={toggleSortOrder}>
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Showing {paginatedCandidates.length} of {sortedCandidates.length} candidates
          {totalPages > 1 && (
            <span className="ml-2">
              (Page {currentPage} of {totalPages})
            </span>
          )}
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginatedCandidates.map((candidate) => (
          <EnhancedCandidateCard
            key={candidate.id}
            candidate={candidate}
            isSelected={isSelected(candidate.id!)}
            onToggleSelection={onToggleSelection}
            onUpdateNotes={onUpdateNotes}
            selectionLimit={selectionLimit && !isSelected(candidate.id!)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ) : (
                <span key={index} className="px-2 text-muted-foreground">...</span>
              )
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Empty state */}
      {candidates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No candidates match your current filters.</p>
        </div>
      )}
    </div>
  );
};