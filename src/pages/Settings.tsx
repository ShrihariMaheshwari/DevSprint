
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  Layout as LayoutIcon, 
  Bell, 
  Github,
  Save,
  RefreshCcw
} from "lucide-react";
import { toast } from "sonner";
import { useSprint } from "@/context/SprintContext";
import DashboardWidgetSelector from "@/components/DashboardWidgetSelector";

const Settings: React.FC = () => {
  const { updateUserPreferences, userPreferences } = useSprint();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    userPreferences?.notificationsEnabled ?? true
  );
  const [autoSyncGithub, setAutoSyncGithub] = useState(
    userPreferences?.autoSyncGithub ?? true
  );
  const [theme, setTheme] = useState(
    userPreferences?.theme ?? "system"
  );

  // Dashboard widget settings
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(
    userPreferences?.dashboardWidgets || [
      "active-sprint", 
      "tasks-completed", 
      "blockers", 
      "daily-streak", 
      "github-activity", 
      "productivity-score", 
      "time-tracking"
    ]
  );

  // Initialize states from user preferences when component mounts
  useEffect(() => {
    if (userPreferences) {
      setNotificationsEnabled(userPreferences.notificationsEnabled);
      setAutoSyncGithub(userPreferences.autoSyncGithub);
      setTheme(userPreferences.theme);
      setSelectedWidgets(userPreferences.dashboardWidgets);
    }
  }, [userPreferences]);

  const handleSaveSettings = () => {
    updateUserPreferences({
      dashboardWidgets: selectedWidgets,
      notificationsEnabled,
      autoSyncGithub,
      theme
    });
    
    toast.success("Settings saved successfully!");
  };

  const handleResetDefaults = () => {
    const defaultWidgets = [
      "active-sprint", 
      "tasks-completed", 
      "blockers", 
      "daily-streak", 
      "github-activity", 
      "productivity-score", 
      "time-tracking"
    ];
    
    setSelectedWidgets(defaultWidgets);
    setNotificationsEnabled(true);
    setAutoSyncGithub(true);
    setTheme("system");
    
    updateUserPreferences({
      dashboardWidgets: defaultWidgets,
      notificationsEnabled: true,
      autoSyncGithub: true,
      theme: "system"
    });
    
    toast.success("Settings reset to defaults");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Customize your DevSprint experience
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 mb-2 p-1 bg-muted/30">
            <TabsTrigger value="dashboard" className="data-[state=active]:shadow-md">
              <LayoutIcon className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:shadow-md">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:shadow-md">
              <Github className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <Card className="border-t-4 border-t-primary shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-xl">
                  <LayoutIcon className="h-5 w-5 mr-2 text-primary" />
                  Dashboard Customization
                </CardTitle>
                <CardDescription>
                  Choose which widgets appear on your dashboard and their arrangement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardWidgetSelector 
                  selectedWidgets={selectedWidgets}
                  setSelectedWidgets={setSelectedWidgets}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="border-t-4 border-t-primary shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-xl">
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between bg-muted/20 p-3 rounded-md">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="text-base">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about your sprints and daily logs
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                {notificationsEnabled && (
                  <div className="space-y-4 pt-2 border-l-2 border-primary/30 pl-4 ml-2">
                    <div className="flex items-center space-x-2 p-2 hover:bg-muted/20 rounded-md">
                      <Checkbox id="sprint-starts" defaultChecked />
                      <Label htmlFor="sprint-starts" className="cursor-pointer">Sprint starts</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 hover:bg-muted/20 rounded-md">
                      <Checkbox id="sprint-ends" defaultChecked />
                      <Label htmlFor="sprint-ends" className="cursor-pointer">Sprint ends</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 hover:bg-muted/20 rounded-md">
                      <Checkbox id="daily-reminder" defaultChecked />
                      <Label htmlFor="daily-reminder" className="cursor-pointer">Daily log reminder</Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations">
            <Card className="border-t-4 border-t-primary shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-xl">
                  <Github className="h-5 w-5 mr-2 text-primary" />
                  GitHub Integration
                </CardTitle>
                <CardDescription>
                  Configure your GitHub integration settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between bg-muted/20 p-3 rounded-md">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-sync" className="text-base">Auto-sync with GitHub</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically include commits in your daily logs
                    </p>
                  </div>
                  <Switch
                    id="auto-sync"
                    checked={autoSyncGithub}
                    onCheckedChange={setAutoSyncGithub}
                  />
                </div>
                
                <div className="pt-2">
                  <Label htmlFor="repo" className="text-base block mb-2">Default Repository</Label>
                  <Input 
                    id="repo" 
                    placeholder="username/repository"
                    className="mt-1 bg-background/70"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5 pl-1">
                    Set a default repository for activity tracking
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-8 pt-4 border-t border-border/40">
          <Button 
            variant="outline"
            onClick={handleResetDefaults}
            className="gap-2 hover:border-destructive/50"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings} className="gap-2 px-6">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
