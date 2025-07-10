import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Search, Filter } from 'lucide-react';
import { CandidateFilters as FiltersType } from '@/types/candidate';

interface CandidateFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  candidateCount: number;
}

export const CandidateFilters = ({ filters, onFiltersChange, candidateCount }: CandidateFiltersProps) => {
  console.log('CandidateFilters render - filters:', filters);
  
  const updateFilter = (key: keyof FiltersType, value: any) => {
    console.log('updateFilter called:', key, value);
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
          <span className="text-sm font-normal text-muted-foreground">
            ({candidateCount} candidates)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Name, email, company, role..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <Select value={filters.location || 'all'} onValueChange={(value) => updateFilter('location', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              <SelectItem value="São Paulo">São Paulo</SelectItem>
              <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
              <SelectItem value="Maceió">Maceió</SelectItem>
              <SelectItem value="London">London</SelectItem>
              <SelectItem value="New York">New York</SelectItem>
              <SelectItem value="Toronto">Toronto</SelectItem>
              <SelectItem value="Sydney">Sydney</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Education Level</Label>
          <Select value={filters.education || 'all'} onValueChange={(value) => updateFilter('education', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All education levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All education levels</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
              <SelectItem value="Master's">Master's Degree</SelectItem>
              <SelectItem value="Bachelor's">Bachelor's Degree</SelectItem>
              <SelectItem value="Associate">Associate Degree</SelectItem>
              <SelectItem value="High School">High School</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Work Availability</Label>
          <Select value={filters.availability || 'all'} onValueChange={(value) => updateFilter('availability', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All availability</SelectItem>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Salary Range</Label>
          <div className="px-3">
            <Slider
              min={0}
              max={500000}
              step={5000}
              value={[filters.salaryMin, filters.salaryMax]}
              onValueChange={(values) => {
                console.log('Slider values changed:', values);
                onFiltersChange({ 
                  ...filters, 
                  salaryMin: values[0], 
                  salaryMax: values[1] 
                });
              }}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.salaryMin.toLocaleString()}</span>
            <span>${filters.salaryMax.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};