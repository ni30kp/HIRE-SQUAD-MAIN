import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Mail, Phone, Calendar, DollarSign, Briefcase, GraduationCap, Star, MessageSquare } from 'lucide-react';
import { Candidate } from '@/types/candidate';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  selectionLimit: boolean;
}

export const CandidateCard = ({ 
  candidate, 
  isSelected, 
  onToggleSelection, 
  onUpdateNotes,
  selectionLimit 
}: CandidateCardProps) => {
  const [notes, setNotes] = useState(candidate.notes || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNotesUpdate = () => {
    onUpdateNotes(candidate.id!, notes);
    setIsDialogOpen(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-muted-foreground';
  };

  const parseSalary = (salaryString: string) => {
    const amount = parseInt(salaryString?.replace(/[$,]/g, '') || '0');
    return amount.toLocaleString();
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${
      isSelected ? 'ring-2 ring-primary shadow-lg bg-gradient-to-br from-primary/5 to-accent/5' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{candidate.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {candidate.location}
              </div>
              <div className="flex items-center gap-1">
                <Star className={`h-3 w-3 ${getScoreColor(candidate.score || 0)}`} />
                <span className={getScoreColor(candidate.score || 0)}>
                  {candidate.score}/100
                </span>
              </div>
            </div>
          </div>
          <Button
            variant={isSelected ? "success" : "outline"}
            size="sm"
            onClick={() => onToggleSelection(candidate.id!)}
            disabled={!isSelected && selectionLimit}
            className="ml-2"
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{candidate.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{candidate.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>${parseSalary(candidate.annual_salary_expectation['full-time'] || '0')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(candidate.submitted_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{candidate.education?.highest_level}</span>
          </div>
          {candidate.education?.degrees?.[0] && (
            <p className="text-xs text-muted-foreground ml-6">
              {candidate.education.degrees[0].degree} in {candidate.education.degrees[0].subject}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Recent Experience</span>
          </div>
          <div className="ml-6 space-y-1">
            {candidate.work_experiences?.slice(0, 2).map((exp, index) => (
              <div key={index} className="text-xs">
                <span className="font-medium">{exp.roleName}</span> at {exp.company}
              </div>
            ))}
            {candidate.work_experiences?.length > 2 && (
              <p className="text-xs text-muted-foreground">
                +{candidate.work_experiences.length - 2} more
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {candidate.work_availability?.map((availability) => (
            <Badge key={availability} variant="secondary" className="text-xs">
              {availability}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8">
                <MessageSquare className="h-3 w-3 mr-1" />
                Notes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Notes for {candidate.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Add your notes about this candidate..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleNotesUpdate}>
                    Save Notes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {candidate.notes && (
            <Badge variant="accent" className="text-xs">
              Has Notes
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};