
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSprint } from "@/context/SprintContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Calendar, CheckCircle, AlertTriangle, BookOpen } from "lucide-react";

const ViewLog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dailyLogs, sprints } = useSprint();
  
  const log = dailyLogs.find(log => log.id === id);
  const sprint = log ? sprints.find(sprint => sprint.id === log.sprintId) : null;
  
  if (!log) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Log Entry Not Found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </Layout>
    );
  }
  
  const formattedDate = new Date(log.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{formattedDate}</h1>
            {sprint && (
              <p className="text-muted-foreground flex items-center mt-1">
                <Calendar className="mr-2 h-4 w-4" />
                Sprint: {sprint.name}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Tasks Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                {log.tasksCompleted.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {log.tasksCompleted.map((task, index) => (
                      <li key={index}>{task}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No tasks recorded for this day</p>
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
                {log.blockers.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {log.blockers.map((blocker, index) => (
                      <li key={index}>{blocker}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No blockers recorded for this day</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Reflections & Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>{log.reflections}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ViewLog;
