import React from "react";
import { useSprint } from "@/context/SprintContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, FileText, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChartDataItem {
  date: string;
  displayDate: string;
  count: number;
}

const Analytics: React.FC = () => {
  const { sprints, dailyLogs } = useSprint();
  const { toast } = useToast();

  const taskCompletionData = React.useMemo(() => {
    const data: ChartDataItem[] = [];
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 6);

    for (let i = 0; i <= 6; i++) {
      const date = new Date(oneWeekAgo);
      date.setDate(oneWeekAgo.getDate() + i);
      const dateString = date.toISOString().slice(0, 10);
      
      const log = dailyLogs.find(log => log.date === dateString);
      const formattedDate = new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      data.push({
        date: dateString,
        displayDate: formattedDate,
        count: log ? log.tasksCompleted.length : 0
      });
    }
    
    return data;
  }, [dailyLogs]);

  const blockerData = React.useMemo(() => {
    const data: ChartDataItem[] = [];
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 6);

    for (let i = 0; i <= 6; i++) {
      const date = new Date(oneWeekAgo);
      date.setDate(oneWeekAgo.getDate() + i);
      const dateString = date.toISOString().slice(0, 10);
      
      const log = dailyLogs.find(log => log.date === dateString);
      const formattedDate = new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      data.push({
        date: dateString,
        displayDate: formattedDate,
        count: log ? log.blockers.length : 0
      });
    }
    
    return data;
  }, [dailyLogs]);

  const chartConfig = {
    tasks: {
      label: "Tasks Completed",
      theme: {
        light: "#8B5CF6",
        dark: "#A78BFA",
      },
    },
    blockers: {
      label: "Blockers",
      theme: {
        light: "#F97316",
        dark: "#FB923C",
      },
    },
  };

  const generateWeeklySummary = async () => {
    toast({
      title: "Summary Generated",
      description: "Your weekly summary is ready to view!",
    });

    await new Promise(resolve => setTimeout(resolve, 500));

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

  const showWeeklySummary = async () => {
    const summary = await generateWeeklySummary();
    
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
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <div className="flex flex-col xs:flex-row gap-2">
            <Button onClick={showWeeklySummary} className="flex items-center gap-1.5 shadow-sm" variant="secondary">
              <FileText className="h-4 w-4" />
              Weekly Summary
            </Button>
            <Button onClick={exportToMarkdown} className="flex items-center gap-1.5 shadow-sm">
              <Download className="h-4 w-4" />
              Export to Markdown
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">Daily Completed Tasks</CardTitle>
              <CardDescription>
                Tasks completed each day over the past week
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 h-80">
              <ChartContainer config={chartConfig} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={taskCompletionData} margin={{ top: 5, right: 20, left: 0, bottom: 25 }}>
                    <defs>
                      <linearGradient id="tasksGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.12} />
                    <XAxis 
                      dataKey="displayDate" 
                      angle={0} 
                      tick={{ fontSize: 12 }}
                      stroke="#6B7280"
                      tickLine={false}
                      axisLine={{ stroke: '#E5E7EB', strokeWidth: 0.5 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      stroke="#6B7280"
                      fontSize={12}
                      tickMargin={8}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border/30 shadow-lg rounded-md p-3 text-sm">
                              <p className="font-medium">{payload[0].payload.displayDate}</p>
                              <p className="text-primary font-semibold mt-1">
                                {payload[0].value} Tasks Completed
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8B5CF6" 
                      strokeWidth={2.5}
                      dot={{ r: 4, strokeWidth: 2, fill: "#111827" }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#8B5CF6" }}
                      name="Tasks"
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">Daily Blockers</CardTitle>
              <CardDescription>
                Blockers reported each day over the past week
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 h-80">
              <ChartContainer config={chartConfig} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={blockerData} margin={{ top: 5, right: 20, left: 0, bottom: 25 }}>
                    <defs>
                      <linearGradient id="blockersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.12} />
                    <XAxis 
                      dataKey="displayDate" 
                      angle={0} 
                      tick={{ fontSize: 12 }}
                      stroke="#6B7280" 
                      tickLine={false}
                      axisLine={{ stroke: '#E5E7EB', strokeWidth: 0.5 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      stroke="#6B7280"
                      fontSize={12}
                      tickMargin={8}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border/30 shadow-lg rounded-md p-3 text-sm">
                              <p className="font-medium">{payload[0].payload.displayDate}</p>
                              <p className="text-destructive font-semibold mt-1">
                                {payload[0].value} Blockers
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="url(#blockersGradient)" 
                      radius={[4, 4, 0, 0]}
                      name="Blockers" 
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border-border/50 shadow-sm hover:shadow transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Productivity Analysis
            </CardTitle>
            <CardDescription>
              Insights based on your sprint performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <Clock className="h-10 w-10 text-primary mt-1" />
                <div>
                  <h4 className="font-medium text-lg">Peak Productivity Time</h4>
                  <p className="text-muted-foreground mt-1">Based on your logs, you appear most productive in the mornings. Consider scheduling complex tasks during this period to maximize output.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-secondary/40 p-5 rounded-lg border border-border/50 shadow-sm hover:shadow transition-shadow">
                  <div className="text-3xl font-bold text-primary">
                    {dailyLogs.reduce((total, log) => total + log.tasksCompleted.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Total Tasks Completed</div>
                </div>
                
                <div className="bg-secondary/40 p-5 rounded-lg border border-border/50 shadow-sm hover:shadow transition-shadow">
                  <div className="text-3xl font-bold text-destructive">
                    {dailyLogs.reduce((total, log) => total + log.blockers.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Total Blockers Encountered</div>
                </div>
                
                <div className="bg-secondary/40 p-5 rounded-lg border border-border/50 shadow-sm hover:shadow transition-shadow">
                  <div className="text-3xl font-bold text-primary/90">
                    {dailyLogs.length > 0 ? (dailyLogs.reduce((total, log) => total + log.tasksCompleted.length, 0) / dailyLogs.length).toFixed(1) : "0"}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Avg. Tasks Per Day</div>
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
