import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Star, MapPin, Briefcase, X } from 'lucide-react';
import { Candidate } from '@/types/candidate';

interface SelectedCandidatesProps {
  selectedCandidates: Candidate[];
  onRemoveCandidate: (id: string) => void;
}

export const SelectedCandidates = ({ selectedCandidates, onRemoveCandidate }: SelectedCandidatesProps) => {
  const avgScore = selectedCandidates.length > 0 
    ? Math.round(selectedCandidates.reduce((sum, c) => sum + (c.score || 0), 0) / selectedCandidates.length)
    : 0;

  const uniqueLocations = new Set(selectedCandidates.map(c => c.location)).size;
  const uniqueRoles = new Set(selectedCandidates.flatMap(c => 
    c.work_experiences?.map(exp => exp.roleName) || []
  )).size;

  if (selectedCandidates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Selected Team (0/5)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No candidates selected yet. Choose up to 5 candidates for your team.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Selected Team ({selectedCandidates.length}/5)
        </CardTitle>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-warning" />
            <span>Avg Score: {avgScore}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-accent" />
            <span>{uniqueLocations} Locations</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4 text-success" />
            <span>{uniqueRoles} Role Types</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {selectedCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="flex items-center justify-between p-3 bg-background rounded-lg shadow-sm border"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{candidate.name}</h4>
                <Badge variant="secondary" className="text-xs">
                  {candidate.score}/100
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {candidate.location} • {candidate.education?.highest_level}
              </p>
              <p className="text-xs text-muted-foreground">
                {candidate.work_experiences?.[0]?.roleName} at {candidate.work_experiences?.[0]?.company}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveCandidate(candidate.id!)}
              className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {selectedCandidates.length === 5 && (
          <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
            <p className="text-sm font-medium text-success">
              ✓ Team Complete! You've selected 5 candidates.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};