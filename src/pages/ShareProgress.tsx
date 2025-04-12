
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useSprint } from "@/context/SprintContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Share2, Download, Twitter, Linkedin, Github } from "lucide-react";
import html2canvas from "html2canvas";

const ShareProgress: React.FC = () => {
  const { sprints, dailyLogs } = useSprint();
  const [selectedSprintId, setSelectedSprintId] = useState<string>(sprints[0]?.id || "");
  const [shareTitle, setShareTitle] = useState<string>("");
  const [cardStyle, setCardStyle] = useState<string>("modern");
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const selectedSprint = sprints.find(sprint => sprint.id === selectedSprintId);
  const sprintLogs = dailyLogs.filter(log => log.sprintId === selectedSprintId);
  
  const completedTasks = sprintLogs.reduce((acc, log) => acc + log.tasksCompleted.length, 0);
  const blockers = sprintLogs.reduce((acc, log) => acc + log.blockers.length, 0);
  
  // Calculate progress percentage
  const startDate = selectedSprint ? new Date(selectedSprint.startDate) : new Date();
  const endDate = selectedSprint ? new Date(selectedSprint.endDate) : new Date();
  const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
  const today = new Date();
  const daysCompleted = Math.min(
    Math.max(0, (today.getTime() - startDate.getTime()) / (1000 * 3600 * 24)),
    totalDays
  );
  const progressPercentage = Math.round((daysCompleted / totalDays) * 100);
  
  const handleDownload = async () => {
    if (cardRef.current === null) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, { 
        backgroundColor: null,
        scale: 2 // Higher resolution
      });
      
      const link = document.createElement("a");
      link.download = `sprint-progress-${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Progress card downloaded!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };
  
  const handleShare = async () => {
    if (cardRef.current === null) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, { 
        backgroundColor: null,
        scale: 2
      });
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, "image/png");
      });
      
      if (navigator.share) {
        await navigator.share({
          title: shareTitle || "My Sprint Progress",
          text: `Check out my progress on ${selectedSprint?.name || "my sprint"}!`,
          files: [new File([blob], "sprint-progress.png", { type: "image/png" })],
        });
        toast.success("Shared successfully!");
      } else {
        // Fallback for browsers that don't support the Web Share API
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `sprint-progress-${new Date().toISOString().split("T")[0]}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Progress card downloaded!");
      }
    } catch (error) {
      toast.error("Failed to share");
    }
  };
  
  if (sprints.length === 0) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto text-center py-12">
          <h1 className="text-3xl font-bold mb-6">Create Shareable Progress Cards</h1>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">You need to create a sprint before sharing progress.</p>
              <Button onClick={() => navigate("/sprint/new")}>Create Your First Sprint</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Shareable Progress Cards</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customize Your Card</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sprint">Select Sprint</Label>
                  <Select 
                    value={selectedSprintId} 
                    onValueChange={setSelectedSprintId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sprint" />
                    </SelectTrigger>
                    <SelectContent>
                      {sprints.map((sprint) => (
                        <SelectItem key={sprint.id} value={sprint.id}>
                          {sprint.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Card Title</Label>
                  <Input
                    id="title"
                    placeholder="My Sprint Progress"
                    value={shareTitle}
                    onChange={(e) => setShareTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Card Style</Label>
                  <Tabs defaultValue="modern" value={cardStyle} onValueChange={setCardStyle}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="modern">Modern</TabsTrigger>
                      <TabsTrigger value="minimal">Minimal</TabsTrigger>
                      <TabsTrigger value="gradient">Gradient</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/")}>Cancel</Button>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm">
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button variant="outline" size="sm">
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Button>
              <Button variant="outline" size="sm">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
          </div>
          
          <div>
            <div 
              ref={cardRef} 
              className={`rounded-lg overflow-hidden shadow-xl p-6 ${
                cardStyle === "modern" ? "bg-slate-800 text-white" : 
                cardStyle === "minimal" ? "bg-white text-slate-800 border border-slate-200" :
                "bg-gradient-to-br from-purple-600 to-blue-500 text-white"
              }`}
            >
              <div className="text-xl font-bold mb-4">
                {shareTitle || selectedSprint?.name || "My Sprint Progress"}
              </div>
              
              {selectedSprint && (
                <div className="mb-4">
                  <div className="text-sm opacity-80 mb-1">
                    {new Date(selectedSprint.startDate).toLocaleDateString()} - {new Date(selectedSprint.endDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm mb-2">{selectedSprint.goal}</div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                      <div 
                        className={`h-2 rounded-full ${
                          cardStyle === "gradient" ? "bg-white" : "bg-blue-500"
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="text-center p-2 rounded-md bg-black/20">
                        <div className="text-lg font-bold">{completedTasks}</div>
                        <div className="text-xs">Tasks Completed</div>
                      </div>
                      <div className="text-center p-2 rounded-md bg-black/20">
                        <div className="text-lg font-bold">{sprintLogs.length}</div>
                        <div className="text-xs">Daily Logs</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-xs mt-4 opacity-70 text-center">
                Created with DevSprint
              </div>
            </div>
            
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Preview - Customize and share your progress!
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShareProgress;
