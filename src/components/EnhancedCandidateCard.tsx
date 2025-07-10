import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, Mail, Phone, Calendar, DollarSign, Briefcase, 
  GraduationCap, Star, MessageSquare, Award, Clock, Building,
  TrendingUp, Users, CheckCircle, ExternalLink, Github, Globe
} from 'lucide-react';
import { Candidate } from '@/types/candidate';

interface EnhancedCandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  selectionLimit: boolean;
}

export const EnhancedCandidateCard = ({ 
  candidate, 
  isSelected, 
  onToggleSelection, 
  onUpdateNotes,
  selectionLimit 
}: EnhancedCandidateCardProps) => {
  const [notes, setNotes] = useState(candidate.notes || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

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

  const getExperienceYears = () => {
    const experienceCount = candidate.work_experiences?.length || 0;
    if (experienceCount === 0) return 'No experience';
    return `${experienceCount} role${experienceCount !== 1 ? 's' : ''}`;
  };

  const getTopEducation = () => {
    return candidate.education?.degrees?.find(d => d.isTop25 || d.isTop50);
  };

  const getGpaScore = (gpa: string) => {
    if (!gpa) return 'text-muted-foreground';
    if (gpa.includes('3.9') || gpa.includes('4.0')) return 'text-success';
    if (gpa.includes('3.5')) return 'text-warning';
    return 'text-muted-foreground';
  };

  // Handle missing or invalid data gracefully
  const safeName = candidate.name?.trim() || 'Unknown Candidate';
  const safeEmail = candidate.email?.trim() || 'No email provided';
  const safeLocation = candidate.location?.trim() || 'Location not specified';
  const safePhone = candidate.phone?.trim() || 'No phone provided';
  const safeEducationLevel = candidate.education?.highest_level?.trim() || 'Education not specified';

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${
      isSelected ? 'ring-2 ring-primary shadow-lg bg-gradient-to-br from-primary/5 to-accent/5' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-foreground">{safeName}</h3>
              
              
              {getTopEducation() && (
                <Badge variant="accent" className="text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  Top School
                </Badge>
              )}
              {(candidate.work_experiences?.length || 0) === 0 && (
                <Badge variant="destructive" className="text-xs">
                  No Experience
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {safeLocation}
              </div>
              <div className="flex items-center gap-1">
                <Star className={`h-3 w-3 ${getScoreColor(candidate.score || 0)}`} />
                <span className={getScoreColor(candidate.score || 0)}>
                  {candidate.score || 0}/100
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {getExperienceYears()}
              </div>
            </div>
          </div>
          <Button
            variant={isSelected ? "success" : "outline"}
            size="sm"
            onClick={() => onToggleSelection(candidate.id!)}
            disabled={!isSelected && selectionLimit}
            className="ml-2 shrink-0"
          >
            {isSelected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Selected
              </>
            ) : (
              'Select'
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* LinkedIn & Social Profiles - Prominent Display */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Professional Profiles</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {candidate.linkedinUrl && (
              <a
                href={candidate.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1 bg-[#0A66C2] text-white rounded-md text-xs hover:bg-[#0A66C2]/90 transition-colors"
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn Profile
              </a>
            )}
            {candidate.githubUrl && (
              <a
                href={candidate.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1 bg-[#24292e] text-white rounded-md text-xs hover:bg-[#24292e]/90 transition-colors"
              >
                <Github className="h-3 w-3" />
                GitHub
              </a>
            )}
            {candidate.portfolioUrl && (
              <a
                href={candidate.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1 bg-gradient-primary text-primary-foreground rounded-md text-xs hover:opacity-90 transition-opacity"
              >
                <Globe className="h-3 w-3" />
                Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Contact & Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{safeEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{safePhone}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>${parseSalary(candidate.annual_salary_expectation?.['full-time'] || '0')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{candidate.submitted_at ? new Date(candidate.submitted_at).toLocaleDateString() : 'Unknown'}</span>
          </div>
        </div>

        <Separator />

        {/* Education - LinkedIn Style */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{safeEducationLevel}</span>
          </div>
          {candidate.education?.degrees && candidate.education.degrees.length > 0 ? (
            candidate.education.degrees.slice(0, showFullDetails ? undefined : 1).map((degree, index) => (
              <div key={index} className="ml-6 p-2 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{degree.degree || 'Degree not specified'}</p>
                    {degree.subject && <p className="text-xs text-muted-foreground">{degree.subject}</p>}
                    <p className="text-xs text-muted-foreground">{degree.originalSchool || degree.school || 'School not specified'}</p>
                  </div>
                  <div className="text-right">
                    {degree.gpa && (
                      <span className={`text-xs font-medium ${getGpaScore(degree.gpa)}`}>
                        {degree.gpa}
                      </span>
                    )}
                    {degree.endDate && (
                      <p className="text-xs text-muted-foreground">{degree.endDate}</p>
                    )}
                  </div>
                </div>
                {(degree.isTop50 || degree.isTop25) && (
                  <Badge variant="success" className="text-xs mt-1">
                    {degree.isTop25 ? 'Top 25 School' : 'Top 50 School'}
                  </Badge>
                )}
              </div>
            ))
          ) : (
            <div className="ml-6 p-2 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">No education information provided</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Work Experience - LinkedIn Style */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Experience</span>
          </div>
          <div className="ml-6 space-y-2">
            {candidate.work_experiences && candidate.work_experiences.length > 0 ? (
              <>
                {candidate.work_experiences.slice(0, showFullDetails ? undefined : 2).map((exp, index) => (
                  <div key={index} className="p-2 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium">{exp.roleName || 'Role not specified'}</p>
                    <p className="text-xs text-muted-foreground">{exp.company || 'Company not specified'}</p>
                  </div>
                ))}
                {candidate.work_experiences.length > 2 && !showFullDetails && (
                  <p className="text-xs text-muted-foreground ml-2">
                    +{candidate.work_experiences.length - 2} more positions
                  </p>
                )}
              </>
            ) : (
              <div className="p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive font-medium">No work experience provided</p>
                <p className="text-xs text-muted-foreground">This candidate appears to be entry-level or missing experience data</p>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {candidate.skills && candidate.skills.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Skills</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, showFullDetails ? undefined : 6).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {candidate.skills.length > 6 && !showFullDetails && (
                  <Badge variant="outline" className="text-xs">
                    +{candidate.skills.length - 6} more
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}

        {/* Work Availability */}
        <div className="flex flex-wrap gap-1">
          {candidate.work_availability?.map((availability) => (
            <Badge key={availability} variant="accent" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {availability}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowFullDetails(!showFullDetails)}
            className="h-8"
          >
            {showFullDetails ? 'Show Less' : 'Show More'}
          </Button>

          <div className="flex gap-2">
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
        </div>
      </CardContent>
    </Card>
  );
};