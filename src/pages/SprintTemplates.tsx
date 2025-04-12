import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSprint } from "@/context/SprintContext";
import { toast } from "sonner";
import { Copy, CheckCircle, Code, BarChart, Server, PenTool } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  goal: string;
  tags: string[];
  icon: React.ElementType;
}

const SprintTemplates: React.FC = () => {
  const navigate = useNavigate();
  const { addSprint } = useSprint();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates: Template[] = [
    {
      id: "frontend-feature",
      name: "Frontend Feature Implementation",
      description: "A sprint focused on implementing a new frontend feature from design to deployment.",
      duration: 14,
      goal: "Implement and deploy new frontend feature including responsive design, animations, and unit tests.",
      tags: ["Frontend", "UI/UX", "React"],
      icon: Code,
    },
    {
      id: "backend-api",
      name: "Backend API Development",
      description: "Build a new API endpoint with proper documentation and testing.",
      duration: 14,
      goal: "Design, implement, test, and document new REST API endpoints with authentication and rate limiting.",
      tags: ["Backend", "API", "Documentation"],
      icon: Server,
    },
    {
      id: "analytics-dashboard",
      name: "Analytics Dashboard",
      description: "Create an analytics dashboard with charts and data visualization.",
      duration: 21,
      goal: "Build interactive dashboard with charts, filters, and exportable reports to visualize key metrics.",
      tags: ["Data", "Charts", "Dashboard"],
      icon: BarChart,
    },
    {
      id: "design-system",
      name: "Design System Components",
      description: "Create reusable components for your design system.",
      duration: 21,
      goal: "Develop 5-10 new reusable UI components following accessibility guidelines with documentation.",
      tags: ["UI", "Components", "Design System"],
      icon: PenTool,
    },
  ];

  const createSprintFromTemplate = (template: Template) => {
    setSelectedTemplate(template.id);
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + template.duration);
    
    addSprint({
      name: template.name,
      goal: template.goal,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    
    toast.success("Sprint created from template!");
    
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Sprint Templates</h1>
        <p className="text-muted-foreground mb-6">
          Choose a template to quickly set up your next sprint
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                selectedTemplate === template.id ? "border-2 border-primary" : ""
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="flex items-center">
                    <template.icon className="h-5 w-5 mr-2" />
                    {template.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {template.duration} days
                  </CardDescription>
                </div>
                {selectedTemplate === template.id && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{template.description}</p>
                <p className="text-xs text-muted-foreground">Goal:</p>
                <p className="text-sm">{template.goal}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => createSprintFromTemplate(template)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SprintTemplates;
