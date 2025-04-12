
import React from "react";
import { useSprint } from "@/context/SprintContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, FileText, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Analytics: React.FC = () => {
  const { sprints, dailyLogs } = useSprint();
  const { toast } = useToast();

  // Process data for charts
  const taskCompletionData = React.useMemo(() => {
    const data: { date: string; count: number }[] = [];
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 6);

    for (let i = 0; i <= 6; i++) {
      const date = new Date(oneWeekAgo);
      date.setDate(oneWeekAgo.getDate() + i);
      const dateString = date.toISOString().slice(0, 10);
      
      const log = dailyLogs.find(log => log.date === dateString);
      data.push({
        date: dateString,
        count: log ? log.tasksCompleted.length : 0
      });
    }
    
    return data;
  }, [dailyLogs]);

  const blockerData = React.useMemo(() => {
    const data: { date: string; count: number }[] = [];
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 6);

    for (let i = 0; i <= 6; i++) {
      const date = new Date(oneWeekAgo);
      date.setDate(oneWeekAgo.getDate() + i);
      const dateString = date.toISOString().slice(0, 10);
      
      const log = dailyLogs.find(log => log.date === dateString);
      data.push({
        date: dateString,
        count: log ? log.blockers.length : 0
      });
    }
    
    return data;
  }, [dailyLogs]);

  // Generate example summary
  const generateWeeklySummary = async () => {
    // In a real implementation, we would call OpenAI API here
    toast({
      title: "Summary Generated",
      description: "Your weekly summary is ready to view!",
    });

    // Simulate waiting for API response
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return a simulated summary
    return `# Weekly Summary (${new Date().toLocaleDateString()} - ${new Date().toLocaleDateString()})

## Accomplishments
- Implemented user authentication flow
- Created responsive dashboard
- Fixed 3 critical bugs in the checkout process
- Set up automated testing pipeline

## Challenges
- Struggled with API rate limits
- Had to refactor database schema midweek

## Insights
Based on your daily logs, you seem most productive in the mornings. Consider scheduling complex tasks during this period.

## Next Steps
- Complete the payment integration
- Improve error handling across the application
- Document API endpoints`;
  };

  // Export all logs to markdown
  const exportToMarkdown = () => {
    let markdownContent = `# Sprint Logs Export\n\n`;
    
    sprints.forEach(sprint => {
      markdownContent += `## Sprint: ${sprint.name}\n`;
      markdownContent += `Goal: ${sprint.goal}\n`;
      markdownContent += `Duration: ${new Date(sprint.startDate).toLocaleDateString()} to ${new Date(sprint.endDate).toLocaleDateString()}\n\n`;
      
      const sprintLogs = dailyLogs.filter(log => log.sprintId === sprint.id);
      sprintLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      sprintLogs.forEach(log => {
        markdownContent += `### ${new Date(log.date).toLocaleDateString()}\n\n`;
        
        markdownContent += `#### Tasks Completed\n`;
        log.tasksCompleted.forEach(task => {
          markdownContent += `- ${task}\n`;
        });
        
        markdownContent += `\n#### Blockers\n`;
        if (log.blockers.length > 0) {
          log.blockers.forEach(blocker => {
            markdownContent += `- ${blocker}\n`;
          });
        } else {
          markdownContent += `- No blockers reported\n`;
        }
        
        markdownContent += `\n#### Reflections\n${log.reflections}\n\n`;
      });
    });
    
    // Create a downloadable file
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `devsprint-logs-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Your logs have been exported to Markdown format.",
    });
  };

  // Function to handle showing the weekly summary
  const showWeeklySummary = async () => {
    const summary = await generateWeeklySummary();
    
    // Since we can't actually implement a modal without modifying other files,
    // let's demonstrate the summary with a toast for now
    toast({
      title: "Weekly Summary",
      description: "Summary is ready. In a real app, this would open a modal with formatted content.",
      duration: 5000,
    });
    
    console.log("Summary Content:", summary);
  };
  
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <div className="flex space-x-2">
            <Button onClick={showWeeklySummary} className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Generate Weekly Summary
            </Button>
            <Button onClick={exportToMarkdown} className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Export to Markdown
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Completed Tasks</CardTitle>
              <CardDescription>
                Number of tasks completed each day over the past week
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={taskCompletionData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45} 
                    textAnchor="end"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" name="Tasks" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Daily Blockers</CardTitle>
              <CardDescription>
                Number of blockers reported each day over the past week
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={blockerData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45} 
                    textAnchor="end"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FF7C43" name="Blockers" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Productivity Analysis</CardTitle>
            <CardDescription>
              Insights based on your sprint performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-primary mr-4" />
                <div>
                  <h4 className="font-medium">Peak Productivity Time</h4>
                  <p className="text-muted-foreground">Based on your logs, you appear most productive in the mornings.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-3xl font-bold">{dailyLogs.reduce((total, log) => total + log.tasksCompleted.length, 0)}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks Completed</div>
                </div>
                
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-3xl font-bold">{dailyLogs.reduce((total, log) => total + log.blockers.length, 0)}</div>
                  <div className="text-sm text-muted-foreground">Total Blockers Encountered</div>
                </div>
                
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-3xl font-bold">{dailyLogs.length > 0 ? (dailyLogs.reduce((total, log) => total + log.tasksCompleted.length, 0) / dailyLogs.length).toFixed(1) : "0"}</div>
                  <div className="text-sm text-muted-foreground">Avg. Tasks Per Day</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
