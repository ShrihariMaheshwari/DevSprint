
import React, { useState } from "react";
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
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSyncGithub, setAutoSyncGithub] = useState(true);
  const [theme, setTheme] = useState("system");

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
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-6">
          Customize your DevSprint experience
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">
              <LayoutIcon className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Github className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Customization</CardTitle>
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
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Enable Notifications</Label>
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
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sprint-starts" defaultChecked />
                      <Label htmlFor="sprint-starts">Sprint starts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sprint-ends" defaultChecked />
                      <Label htmlFor="sprint-ends">Sprint ends</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="daily-reminder" defaultChecked />
                      <Label htmlFor="daily-reminder">Daily log reminder</Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>GitHub Integration</CardTitle>
                <CardDescription>
                  Configure your GitHub integration settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-sync">Auto-sync with GitHub</Label>
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
                
                <div>
                  <Label htmlFor="repo">Default Repository</Label>
                  <Input 
                    id="repo" 
                    placeholder="username/repository"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Set a default repository for activity tracking
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline"
            onClick={handleResetDefaults}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
