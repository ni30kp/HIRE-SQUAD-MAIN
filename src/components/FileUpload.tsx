import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Candidate } from '@/types/candidate';

interface FileUploadProps {
  onCandidatesUploaded: (candidates: Candidate[]) => void;
}

export const FileUpload = ({ onCandidatesUploaded }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsUploading(true);
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate that it's an array of candidates
      if (!Array.isArray(data)) {
        throw new Error('File must contain an array of candidates');
      }

      // Validate and clean candidate data
      const validationResults = data.map((candidate: any, index: number) => {
        const errors: string[] = [];
        
        if (!candidate.name || candidate.name.trim() === '') {
          errors.push(`Missing name`);
        }
        if (!candidate.email || candidate.email.trim() === '') {
          errors.push(`Missing email`);
        }
        if (!candidate.location || candidate.location.trim() === '') {
          errors.push(`Missing location`);
        }
        
        return { candidate, errors, index, isValid: errors.length === 0 };
      });

      // Separate valid and invalid candidates
      const validCandidates = validationResults.filter(result => result.isValid);
      const invalidCandidates = validationResults.filter(result => !result.isValid);
      
      // If no valid candidates, show error
      if (validCandidates.length === 0) {
        throw new Error(`No valid candidates found. All ${data.length} candidates have missing required fields (name, email, or location).`);
      }
      
      // Process valid candidates
      const processedCandidates = validCandidates.map((result) => ({
        ...result.candidate,
        id: result.candidate.id || `uploaded-${Date.now()}-${result.index}`,
        score: calculateCandidateScore(result.candidate),
        selected: false,
        notes: '',
        // Ensure required fields have safe values
        name: result.candidate.name?.trim(),
        email: result.candidate.email?.trim(),
        location: result.candidate.location?.trim(),
        work_experiences: result.candidate.work_experiences || [],
        skills: result.candidate.skills || [],
        work_availability: result.candidate.work_availability || ['full-time'],
        annual_salary_expectation: result.candidate.annual_salary_expectation || { 'full-time': '$0' },
        education: result.candidate.education || { 
          highest_level: 'Not Specified', 
          degrees: [] 
        },
      }));
      
      onCandidatesUploaded(processedCandidates);
      
      // Show success message with details about skipped candidates
      const skippedCount = invalidCandidates.length;
      
      if (skippedCount > 0) {
        // Show main success message
        toast({
          title: "File uploaded with warnings!",
          description: `Loaded ${processedCandidates.length} valid candidates. ${skippedCount} candidates were skipped due to missing data.`,
        });
        
        // Show details about skipped candidates
        setTimeout(() => {
          const skippedDetails = invalidCandidates.slice(0, 5).map(result => 
            `Row ${result.index + 1}: ${result.errors.join(', ')}`
          ).join('\n');
          
          toast({
            title: "Skipped Candidates",
            description: `${skippedDetails}${skippedCount > 5 ? `\n...and ${skippedCount - 5} more` : ''}`,
            variant: "destructive",
          });
        }, 1000);
      } else {
        toast({
          title: "File uploaded successfully!",
          description: `Loaded ${processedCandidates.length} candidates from ${file.name}`,
        });
      }
      
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Invalid JSON file format",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const calculateCandidateScore = (candidate: any): number => {
    let score = 0;
    
    // Experience diversity
    const uniqueRoles = new Set(candidate.work_experiences?.map((exp: any) => exp.roleName.toLowerCase()) || []);
    score += uniqueRoles.size * 10;
    
    // Education level and prestige
    const educationLevel = candidate.education?.highest_level || '';
    if (educationLevel.includes("PhD")) score += 25;
    else if (educationLevel.includes("Master's") || educationLevel.includes("Juris Doctor")) score += 20;
    else if (educationLevel.includes("Bachelor's")) score += 15;
    else score += 10;
    
    // Top school bonus
    const hasTopSchool = candidate.education?.degrees?.some((d: any) => d.isTop25 || d.isTop50);
    if (hasTopSchool) score += 15;
    
    // GPA bonus
    const hasHighGPA = candidate.education?.degrees?.some((d: any) => 
      d.gpa && (d.gpa.includes('3.9') || d.gpa.includes('4.0'))
    );
    if (hasHighGPA) score += 10;
    
    // Skills count
    const skillsCount = candidate.skills?.length || 0;
    score += Math.min(skillsCount * 2, 10);
    
    // Work availability flexibility
    if (candidate.work_availability?.includes('full-time') && 
        candidate.work_availability?.includes('part-time')) {
      score += 5;
    }
    
    return Math.min(score, 100);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/json" || file.name.endsWith('.json')) {
        processFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a JSON file",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Candidate Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <Input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="space-y-2">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground">Processing file...</p>
                </>
              ) : (
                <>
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-sm font-medium">Drop your JSON file here or click to browse</p>
                    <p className="text-xs text-muted-foreground">Supports candidate data in JSON format</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="h-4 w-4" />
              Expected JSON Format:
            </div>
            <pre className="text-xs text-muted-foreground overflow-x-auto">
{`[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "location": "New York",
    "work_experiences": [...],
    "education": {...},
    "skills": [...],
    ...
  }
]`}
            </pre>
          </div>

          <Button
            onClick={openFileDialog}
            disabled={isUploading}
            className="w-full"
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};