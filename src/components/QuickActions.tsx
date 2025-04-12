
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Clipboard, 
  LineChart, 
  Share2, 
  Github, 
  PanelRightOpen, 
  CopyCheck 
} from "lucide-react";
import { toast } from "sonner";

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const handleQuickAction = (path: string, message?: string) => {
    if (message) {
      toast.success(message);
    }
    navigate(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
          <PanelRightOpen className="h-4 w-4" />
          <span className="sr-only">Quick Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleQuickAction("/sprint/new")}>
          <Plus className="mr-2 h-4 w-4" />
          <span>New Sprint</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleQuickAction("/daily-log/new")}>
          <Clipboard className="mr-2 h-4 w-4" />
          <span>Daily Log</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleQuickAction("/templates")}>
          <CopyCheck className="mr-2 h-4 w-4" />
          <span>Sprint Templates</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleQuickAction("/analytics")}>
          <LineChart className="mr-2 h-4 w-4" />
          <span>View Analytics</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleQuickAction("/share", "Create shareable progress card")}>
          <Share2 className="mr-2 h-4 w-4" />
          <span>Share Progress</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleQuickAction("/github")}>
          <Github className="mr-2 h-4 w-4" />
          <span>GitHub Integration</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuickActions;
