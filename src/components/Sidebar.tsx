
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Home,
  Plus,
  Clipboard,
  LineChart,
  User,
} from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-secondary p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">DevSprint</h1>
        <p className="text-sm text-muted-foreground">Personal Agile Tracker</p>
      </div>
      
      <div className="space-y-2">
        <Link to="/" className="block">
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <Home className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
        </Link>
        
        <Link to="/sprint/new" className="block">
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Sprint
          </Button>
        </Link>
        
        <Link to="/daily-log/new" className="block">
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <Clipboard className="mr-2 h-5 w-5" />
            Daily Log
          </Button>
        </Link>
        
        <Link to="/analytics" className="block">
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <LineChart className="mr-2 h-5 w-5" />
            Analytics
          </Button>
        </Link>
      </div>
      
      <div className="mt-auto">
        <Button 
          variant="outline" 
          className="w-full justify-start"
        >
          <User className="mr-2 h-5 w-5" />
          Login with GitHub
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
