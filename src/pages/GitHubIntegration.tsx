
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Github, Lock, User, List, GitBranch, GitCommit } from "lucide-react";
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

const GitHubIntegration: React.FC = () => {
  const navigate = useNavigate();
  const { currentSprint, dailyLogs } = useSprint();
  const [username, setUsername] = useState<string>("");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [autoSync, setAutoSync] = useState<boolean>(true);

  const handleFetchRepositories = async () => {
    if (!username) {
      toast.error("Please enter your GitHub username");
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would be an actual API call
      // For demo purposes, we'll simulate the API response
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
      // In a real app, this would be an actual API call
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

  const handleSyncCommits = () => {
    toast.success("Commits synced with daily logs!");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">GitHub Integration</h1>
        <p className="text-muted-foreground mb-6">
          Connect your GitHub account to automatically include commits in your daily logs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Github className="mr-2 h-5 w-5" />
                Connect to GitHub
              </CardTitle>
              <CardDescription>
                Link your GitHub account to sync your commits
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
                      Automatically sync commits with daily logs
                    </Label>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleFetchCommits}
                    disabled={!selectedRepo || isLoading}
                  >
                    <GitBranch className="mr-2 h-4 w-4" />
                    Fetch Recent Commits
                  </Button>
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
                  Sync Commits to Daily Logs
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GitCommit className="mr-2 h-5 w-5" />
                Recent Commits
              </CardTitle>
              <CardDescription>
                {commits.length > 0 ? `${commits.length} commits found` : "No commits loaded"}
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                    Connect your repository and fetch commits to see them here
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
    </Layout>
  );
};

export default GitHubIntegration;
