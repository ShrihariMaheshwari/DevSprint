
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  BarChart3, 
  GitCommit, 
  Calendar,
  ClipboardList,
  Calendar as CalendarIcon
} from "lucide-react";
import { useSprint } from "@/context/SprintContext";
import { getUserPreferences } from "@/context/UserPreferences";
import { useNavigate } from "react-router-dom";

interface WidgetProps {
  type: string;
  className?: string;
}

const DashboardWidget: React.FC<WidgetProps> = ({ type, className }) => {
  const { sprints, dailyLogs } = useSprint();
  const navigate = useNavigate();
  const currentDate = new Date();
  const activeSprints = sprints.filter(sprint => {
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    return startDate <= currentDate && endDate >= currentDate;
  });
  
  const currentSprint = activeSprints[0];
  
  // Calculate completed tasks from all daily logs
  const completedTasksCount = dailyLogs.reduce((acc, log) => {
    return acc + (log.tasksCompleted ? log.tasksCompleted.length : 0);
  }, 0);
  
  // Calculate total blockers from all daily logs
  const totalBlockers = dailyLogs.reduce((acc, log) => {
    return acc + (log.blockers ? log.blockers.length : 0);
  }, 0);
  
  // Get the 7 most recent daily logs
  const recentLogs = [...dailyLogs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);
  
  // Calculate sprint progress percentage
  const getSprintProgress = () => {
    if (!currentSprint) return 0;
    
    const start = new Date(currentSprint.startDate).getTime();
    const end = new Date(currentSprint.endDate).getTime();
    const now = currentDate.getTime();
    
    if (now <= start) return 0;
    if (now >= end) return 100;
    
    return Math.round(((now - start) / (end - start)) * 100);
  };

  // Get upcoming deadlines
  const upcomingDeadlines = [...sprints]
    .filter(sprint => new Date(sprint.endDate) >= currentDate)
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 3);
  
  // Get recent daily logs
  const recentDailyLogs = [...dailyLogs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const widgets = {
    "active-sprint": (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Active Sprint
            </div>
            {currentSprint && (
              <Badge variant="outline" className="text-xs">
                {getSprintProgress()}% complete
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentSprint ? (
            <div>
              <h3 className="text-lg font-medium">{currentSprint.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{currentSprint.goal}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                {new Date(currentSprint.startDate).toLocaleDateString()} - {new Date(currentSprint.endDate).toLocaleDateString()}
              </div>
              <div className="w-full h-2 bg-secondary rounded-full mt-2">
                <div 
                  className="h-2 bg-primary rounded-full" 
                  style={{ width: `${getSprintProgress()}%` }} 
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">No active sprint</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2"
                onClick={() => navigate("/sprint/new")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Start New Sprint
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    ),
    "tasks-completed": (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            Tasks Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{completedTasksCount}</span>
            <span className="text-xs text-muted-foreground">Total tasks completed</span>
          </div>
        </CardContent>
      </Card>
    ),
    "daily-streak": (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            Daily Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{recentLogs.length}</span>
            <span className="text-xs text-muted-foreground">Days with logs</span>
          </div>
        </CardContent>
      </Card>
    ),
    "blockers": (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Active Blockers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{totalBlockers}</span>
            <span className="text-xs text-muted-foreground">Blockers to resolve</span>
          </div>
        </CardContent>
      </Card>
    ),
    "github-activity": (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <GitCommit className="mr-2 h-4 w-4" />
            GitHub Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">12</span>
            <span className="text-xs text-muted-foreground">Recent commits</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-2"
            onClick={() => navigate("/github")}
          >
            <GitCommit className="mr-2 h-4 w-4" />
            View GitHub
          </Button>
        </CardContent>
      </Card>
    ),
    "productivity-score": (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Productivity Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">87%</span>
            <span className="text-xs text-muted-foreground">Based on activity</span>
          </div>
        </CardContent>
      </Card>
    ),
    "time-tracking": (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Focus Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">14h</span>
            <span className="text-xs text-muted-foreground">This week</span>
          </div>
        </CardContent>
      </Card>
    ),
    "upcoming-deadlines": (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-2">
              {upcomingDeadlines.map((sprint, index) => (
                <div key={`deadline-${index}`} className="flex justify-between text-sm">
                  <span className="truncate">{sprint.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(sprint.endDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
            </div>
          )}
        </CardContent>
      </Card>
    ),
    "recent-logs": (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <ClipboardList className="mr-2 h-4 w-4" />
            Recent Daily Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentDailyLogs.length > 0 ? (
            <div className="space-y-2">
              {recentDailyLogs.map((log, index) => (
                <div key={`log-${index}`} className="flex justify-between text-sm">
                  <span className="truncate">{log.date}</span>
                  <span className="text-xs text-muted-foreground">
                    {log.tasksCompleted?.length || 0} tasks
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">No recent logs</p>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-2"
            onClick={() => navigate("/daily-log/new")}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Create Log
          </Button>
        </CardContent>
      </Card>
    ),
  };
  
  return widgets[type as keyof typeof widgets] || null;
};

interface DashboardWidgetsProps {
  layout?: string[];
}

const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ layout }) => {
  // Get user preferences for dashboard widgets
  const userPreferences = getUserPreferences();
  const widgetsToShow = layout || userPreferences.dashboardWidgets;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {widgetsToShow.map((widgetType, index) => (
        <DashboardWidget 
          key={`${widgetType}-${index}`} 
          type={widgetType}
          className={widgetType === "active-sprint" ? "md:col-span-3" : ""}
        />
      ))}
    </div>
  );
};

export default DashboardWidgets;
