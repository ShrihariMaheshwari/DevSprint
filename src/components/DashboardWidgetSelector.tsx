
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Grip } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WidgetOption {
  id: string;
  name: string;
  description: string;
}

interface DashboardWidgetSelectorProps {
  selectedWidgets: string[];
  setSelectedWidgets: (widgets: string[]) => void;
}

const widgetOptions: WidgetOption[] = [
  {
    id: "active-sprint",
    name: "Active Sprint",
    description: "Shows your current active sprint and progress."
  },
  {
    id: "tasks-completed",
    name: "Tasks Completed",
    description: "Displays the total number of completed tasks."
  },
  {
    id: "blockers",
    name: "Active Blockers",
    description: "Shows blockers that need to be resolved."
  },
  {
    id: "daily-streak",
    name: "Daily Streak",
    description: "Tracks your consistency with daily logs."
  },
  {
    id: "github-activity",
    name: "GitHub Activity",
    description: "Shows recent commits from GitHub."
  },
  {
    id: "productivity-score",
    name: "Productivity Score",
    description: "Displays your overall productivity metrics."
  },
  {
    id: "time-tracking",
    name: "Focus Time",
    description: "Shows total focus time tracked."
  },
  {
    id: "upcoming-deadlines",
    name: "Upcoming Deadlines",
    description: "Shows sprints or tasks with approaching deadlines."
  },
  {
    id: "recent-logs",
    name: "Recent Daily Logs",
    description: "Shows a summary of your recent daily logs."
  }
];

const DashboardWidgetSelector: React.FC<DashboardWidgetSelectorProps> = ({
  selectedWidgets,
  setSelectedWidgets
}) => {
  const toggleWidget = (widgetId: string) => {
    if (selectedWidgets.includes(widgetId)) {
      setSelectedWidgets(selectedWidgets.filter(id => id !== widgetId));
    } else {
      setSelectedWidgets([...selectedWidgets, widgetId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Select which widgets to display on your dashboard:
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {widgetOptions.map((widget) => (
          <Card 
            key={widget.id} 
            className={`cursor-pointer transition-colors ${
              selectedWidgets.includes(widget.id) 
                ? "border-primary/50 bg-primary/5" 
                : "bg-card"
            }`}
            onClick={() => toggleWidget(widget.id)}
          >
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm flex justify-between items-center">
                <div className="flex items-center">
                  <Grip className="w-4 h-4 mr-2 text-muted-foreground" />
                  {widget.name}
                </div>
                {selectedWidgets.includes(widget.id) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardDescription className="text-xs">
                {widget.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-xs text-muted-foreground pt-2">
        * Changes will be applied after saving settings
      </div>
    </div>
  );
};

export default DashboardWidgetSelector;
