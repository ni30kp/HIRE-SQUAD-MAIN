import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MapPin, GraduationCap, TrendingUp } from 'lucide-react';
import { Candidate } from '@/types/candidate';

interface DashboardStatsProps {
  candidates: Candidate[];
  filteredCount: number;
  selectedCount: number;
}

export const DashboardStats = ({ candidates, filteredCount, selectedCount }: DashboardStatsProps) => {
  const stats = {
    total: candidates.length,
    locations: new Set(candidates.map(c => c.location)).size,
    avgScore: Math.round(candidates.reduce((sum, c) => sum + (c.score || 0), 0) / candidates.length),
    highScoreCount: candidates.filter(c => (c.score || 0) >= 80).length,
  };

  const topEducationLevels = candidates.reduce((acc, candidate) => {
    const level = candidate.education?.highest_level || 'Unknown';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLevel = Object.entries(topEducationLevels)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {filteredCount} after filters • {selectedCount}/5 selected
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Locations</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.locations}</div>
          <p className="text-xs text-muted-foreground">
            Global diversity
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgScore}/100</div>
          <p className="text-xs text-muted-foreground">
            {stats.highScoreCount} high performers (80+)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Education</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-sm">
            {topLevel.replace("'s", "'s")}
          </div>
          <p className="text-xs text-muted-foreground">
            Most common level
          </p>
        </CardContent>
      </Card>
    </div>
  );
};