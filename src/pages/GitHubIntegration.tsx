
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Github, Lock, User, List, GitBranch, GitCommit, GitPullRequest, GitFork, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useSprint } from "@/context/SprintContext";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

interface PullRequest {
  id: number;
  title: string;
  state: "open" | "closed" | "merged";
  created_at: string;
  number: number;
}

const GitHubIntegration: React.FC = () => {
  const navigate = useNavigate();
  const { currentSprint, dailyLogs } = useSprint();
  const [username, setUsername] = useState<string>("");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("commits");

  const handleFetchRepositories = async () => {
    if (!username) {
      toast.error("Please enter your GitHub username");
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would be an actual API call
      setTimeout(() => {
        // Mock repositories
        const mockRepos = [
          {
            id: 1,
            name: "devSprint",
            full_name: `${username}/devSprint`,
            description: "Personal agile tracker for developers"
          },
          {
            id: 2,
            name: "portfolio",
            full_name: `${username}/portfolio`,
            description: "My personal portfolio website"
          },
          {
            id: 3,
            name: "api-toolkit",
            full_name: `${username}/api-toolkit`,
            description: "A collection of tools for API development"
          }
        ];
        setRepositories(mockRepos);
        setIsLoading(false);
        toast.success("Repositories fetched successfully!");
        setIsConnected(true);
      }, 1000);
    } catch (error) {
      toast.error("Failed to fetch repositories");
      setIsLoading(false);
    }
  };

  const handleFetchCommits = async () => {
    if (!selectedRepo) {
      toast.error("Please select a repository");
      return;
    }

    setIsLoading(true);
    try {
      setTimeout(() => {
        // Mock commits
        const mockCommits = [
          {
            sha: "abc123",
            commit: {
              message: "Fix navigation bug on mobile",
              author: {
                name: username,
                date: new Date().toISOString()
              }
            }
          },
          {
            sha: "def456",
            commit: {
              message: "Add dark mode toggle",
              author: {
                name: username,
                date: new Date(Date.now() - 86400000).toISOString()
              }
            }
          },
          {
            sha: "ghi789",
            commit: {
              message: "Refactor authentication logic",
              author: {
                name: username,
                date: new Date(Date.now() - 172800000).toISOString()
              }
            }
          }
        ];
        setCommits(mockCommits);
        setIsLoading(false);
        toast.success("Commits fetched successfully!");
      }, 1000);
    } catch (error) {
      toast.error("Failed to fetch commits");
      setIsLoading(false);
    }
  };

  const handleFetchPullRequests = async () => {
    if (!selectedRepo) {
      toast.error("Please select a repository");
      return;
    }

    setIsLoading(true);
    try {
      setTimeout(() => {
        // Mock PRs
        const mockPRs = [
          {
            id: 101,
            title: "Feature: Add analytics dashboard",
            state: "open" as "open",
            created_at: new Date().toISOString(),
            number: 42
          },
          {
            id: 102,
            title: "Fix: Resolve mobile navigation issues",
            state: "merged" as "merged",
            created_at: new Date(Date.now() - 172800000).toISOString(),
            number: 41
          },
          {
            id: 103,
            title: "Enhancement: Improve form validation",
            state: "closed" as "closed",
            created_at: new Date(Date.now() - 345600000).toISOString(),
            number: 40
          }
        ];
        setPullRequests(mockPRs);
        setIsLoading(false);
        toast.success("Pull requests fetched successfully!");
      }, 1000);
    } catch (error) {
      toast.error("Failed to fetch pull requests");
      setIsLoading(false);
    }
  };

  const handleSyncCommits = () => {
    toast.success("Commits synced with daily logs!");
  };

  const getStateStyle = (state: string) => {
    switch (state) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-red-100 text-red-800 border-red-200";
      case "merged":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">GitHub Integration</h1>
        <p className="text-muted-foreground mb-6">
          Connect your GitHub account to automatically include commits and PRs in your daily logs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Github className="mr-2 h-5 w-5" />
                  Connect to GitHub
                </CardTitle>
                <CardDescription>
                  Link your GitHub account to sync your development activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isConnected ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">GitHub Username</Label>
                      <div className="flex gap-2">
                        <Input
                          id="username"
                          placeholder="e.g. johndoe"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <Button onClick={handleFetchRepositories} disabled={isLoading}>
                          {isLoading ? "Loading..." : "Connect"}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        We only access your public repositories
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-2 bg-primary/10 rounded-md">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{username}</p>
                        <p className="text-xs text-muted-foreground">Connected</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="repository">Select Repository</Label>
                      <Select
                        value={selectedRepo}
                        onValueChange={setSelectedRepo}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a repository" />
                        </SelectTrigger>
                        <SelectContent>
                          {repositories.map((repo) => (
                            <SelectItem key={repo.id} value={repo.full_name}>
                              {repo.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-sync"
                        checked={autoSync}
                        onCheckedChange={setAutoSync}
                      />
                      <Label htmlFor="auto-sync">
                        Automatically sync with daily logs
                      </Label>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleFetchCommits}
                        disabled={!selectedRepo || isLoading}
                      >
                        <GitCommit className="mr-2 h-4 w-4" />
                        Fetch Recent Commits
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleFetchPullRequests}
                        disabled={!selectedRepo || isLoading}
                      >
                        <GitPullRequest className="mr-2 h-4 w-4" />
                        Fetch Pull Requests
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {isConnected && (
                  <Button
                    className="w-full"
                    onClick={handleSyncCommits}
                    disabled={commits.length === 0}
                  >
                    Sync Activity to Daily Logs
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <GitBranch className="mr-2 h-5 w-5" />
                    Repository Activity
                  </CardTitle>
                  {selectedRepo && (
                    <Badge variant="outline" className="font-mono">
                      {selectedRepo}
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  View your recent development activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isConnected && selectedRepo ? (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="commits">
                        <GitCommit className="mr-2 h-4 w-4" />
                        Commits
                      </TabsTrigger>
                      <TabsTrigger value="pull-requests">
                        <GitPullRequest className="mr-2 h-4 w-4" />
                        Pull Requests
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="commits" className="mt-4">
                      {commits.length > 0 ? (
                        <div className="space-y-3">
                          {commits.map((commit) => (
                            <div
                              key={commit.sha}
                              className="p-3 border border-border rounded-md"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-mono text-xs opacity-70">
                                  {commit.sha.substring(0, 7)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(commit.commit.author.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm">{commit.commit.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <GitCommit className="h-12 w-12 mx-auto mb-3 opacity-20" />
                          <p>No commits to display</p>
                          <p className="text-xs mt-2">
                            Fetch commits to see them here
                          </p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="pull-requests" className="mt-4">
                      {pullRequests.length > 0 ? (
                        <div className="space-y-3">
                          {pullRequests.map((pr) => (
                            <div
                              key={pr.id}
                              className="p-3 border border-border rounded-md"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-mono text-xs opacity-70">
                                      #{pr.number}
                                    </span>
                                    <Badge 
                                      variant="outline" 
                                      className={`${getStateStyle(pr.state)} text-xs`}
                                    >
                                      {pr.state}
                                    </Badge>
                                  </div>
                                  <p className="text-sm font-medium">{pr.title}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(pr.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <GitPullRequest className="h-12 w-12 mx-auto mb-3 opacity-20" />
                          <p>No pull requests to display</p>
                          <p className="text-xs mt-2">
                            Fetch pull requests to see them here
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-12">
                    <Github className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium mb-1">Connect to GitHub</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter your GitHub username and select a repository to view your activity
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/daily-log/new")}
                >
                  <List className="mr-2 h-4 w-4" />
                  Create New Daily Log
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Repository Stats Section */}
        {isConnected && selectedRepo && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm flex items-center">
                  <GitCommit className="mr-2 h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {commits.length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Commits this week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm flex items-center">
                  <GitPullRequest className="mr-2 h-4 w-4" />
                  Pull Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {pullRequests.filter(pr => pr.state === "open").length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Open PRs
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Productivity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {commits.length > 0 ? "High" : "N/A"}
                </div>
                <p className="text-sm text-muted-foreground">
                  Commit frequency
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GitHubIntegration;
