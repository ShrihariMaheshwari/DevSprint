
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSprint } from "@/context/SprintContext";
import { Calendar, ClipboardCheck, AlertTriangle, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
  const { sprints, currentSprint, dailyLogs } = useSprint();
  
  const today = new Date().toISOString().slice(0, 10);
  const todaysLog = dailyLogs.find(log => log.date === today && (currentSprint ? log.sprintId === currentSprint.id : true));
  
  return (
    <Layout>
      <div className="space-y-6">
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">DevSprint Dashboard</h1>
            <Link to="/sprint/new">
              <Button>
                Create Sprint
              </Button>
            </Link>
          </div>
          
          {currentSprint ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current Sprint: {currentSprint.name}</span>
                  <Button variant="outline" size="sm">View Details</Button>
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(currentSprint.startDate).toLocaleDateString()} - {new Date(currentSprint.endDate).toLocaleDateString()}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="font-medium">Sprint Goal:</h3>
                  <p className="text-muted-foreground">{currentSprint.goal}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Active Sprint</CardTitle>
                <CardDescription>Create a sprint to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/sprint/new">
                  <Button>
                    Create Your First Sprint
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaysLog ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Tasks Completed:</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {todaysLog.tasksCompleted.map((task, index) => (
                        <li key={index}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No log entry for today</p>
                  <Link to="/daily-log/new">
                    <Button>
                      Create Today's Log Entry
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Blockers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaysLog && todaysLog.blockers.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {todaysLog.blockers.map((blocker, index) => (
                    <li key={index}>{blocker}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-6">
                  {todaysLog ? "No blockers today!" : "Log your blockers for today"}
                </p>
              )}
            </CardContent>
          </Card>
        </section>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Recent Reflections
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyLogs.length > 0 ? (
              <div className="space-y-6">
                {dailyLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="space-y-2 border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{new Date(log.date).toLocaleDateString()}</h3>
                      <Link to={`/log/${log.id}`} className="text-primary text-sm underline">
                        View
                      </Link>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{log.reflections}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">
                No reflections yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
