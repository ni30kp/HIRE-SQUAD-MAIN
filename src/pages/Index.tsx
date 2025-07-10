import { useCandidates } from '@/hooks/useCandidates';
import { DashboardStats } from '@/components/DashboardStats';
import { CandidateFilters } from '@/components/CandidateFilters';
import { CandidateGrid } from '@/components/CandidateGrid';
import { SelectedCandidates } from '@/components/SelectedCandidates';
import { FileUpload } from '@/components/FileUpload';

import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Building2, Users } from 'lucide-react';

const Index = () => {
  const {
    candidates,
    filteredCandidates,
    selectedCandidates,
    loading,
    filters,
    setFilters,
    toggleCandidateSelection,
    updateCandidateNotes,
    uploadCandidates,
  } = useCandidates();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-surface">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading candidates...</p>
        </div>
      </div>
    );
  }

  // Show upload-first screen when no candidates are loaded
  if (candidates.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-surface">
        {/* Header */}
        <div className="bg-gradient-hero text-white">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Building2 className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text text-transparent">
                  Mercor
                </h1>
                <p className="text-xl opacity-90 mt-1">AI-powered talent marketplace for the future of work</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge variant="secondary" className="bg-white/15 text-white border-white/25 backdrop-blur-sm px-3 py-1">
                <Users className="h-4 w-4 mr-2" />
                Ready for Upload
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Upload Your Candidate Data</h2>
              <p className="text-muted-foreground">
                Start by uploading a JSON file with your candidate information to begin the hiring process.
              </p>
            </div>
            <FileUpload onCandidatesUploaded={uploadCandidates} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Building2 className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text text-transparent">
                Mercor
              </h1>
              <p className="text-xl opacity-90 mt-1">AI-powered talent marketplace for the future of work</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge variant="secondary" className="bg-white/15 text-white border-white/25 backdrop-blur-sm px-3 py-1">
              <Users className="h-4 w-4 mr-2" />
              {candidates.length} Applicants
            </Badge>
            <Badge variant="secondary" className="bg-white/15 text-white border-white/25 backdrop-blur-sm px-3 py-1">
              {selectedCandidates.length}/5 Selected
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Dashboard Stats */}
        <DashboardStats 
          candidates={candidates}
          filteredCount={filteredCandidates.length}
          selectedCount={selectedCandidates.length}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <FileUpload onCandidatesUploaded={uploadCandidates} />
            <CandidateFilters
              filters={filters}
              onFiltersChange={setFilters}
              candidateCount={filteredCandidates.length}
            />
            <SelectedCandidates
              selectedCandidates={selectedCandidates}
              onRemoveCandidate={toggleCandidateSelection}
            />
          </div>

          {/* Candidate Grid */}
          <div className="xl:col-span-3">
            <CandidateGrid
              candidates={filteredCandidates}
              selectedCandidates={selectedCandidates}
              onToggleSelection={toggleCandidateSelection}
              onUpdateNotes={updateCandidateNotes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
