
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Plus, Clipboard, LineChart, CopyCheck, Share2, Github, Settings } from "lucide-react";

const MobileNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const closeSheet = () => {
    setOpen(false);
  };
  
  return (
    <div className="md:hidden sticky top-0 z-10 bg-background border-b p-2 flex items-center justify-between">
      <div className="flex items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] max-w-sm p-0">
            <div className="h-full bg-secondary p-4 flex flex-col">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-primary">DevSprint</h1>
                <p className="text-sm text-muted-foreground">Personal Agile Tracker</p>
              </div>
              
              <div className="space-y-2">
                <Link to="/" className="block" onClick={closeSheet}>
                  <Button
                    variant={isActive("/") ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Dashboard
                  </Button>
                </Link>
                
                <Link to="/sprint/new" className="block" onClick={closeSheet}>
                  <Button
                    variant={isActive("/sprint/new") ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    New Sprint
                  </Button>
                </Link>
                
                <Link to="/templates" className="block" onClick={closeSheet}>
                  <Button
                    variant={isActive("/templates") ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <CopyCheck className="mr-2 h-5 w-5" />
                    Templates
                  </Button>
                </Link>
                
                <Link to="/daily-log/new" className="block" onClick={closeSheet}>
                  <Button
                    variant={isActive("/daily-log/new") ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Clipboard className="mr-2 h-5 w-5" />
                    Daily Log
                  </Button>
                </Link>
                
                <Link to="/analytics" className="block" onClick={closeSheet}>
                  <Button
                    variant={isActive("/analytics") ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <LineChart className="mr-2 h-5 w-5" />
                    Analytics
                  </Button>
                </Link>
                
                <Link to="/share" className="block" onClick={closeSheet}>
                  <Button
                    variant={isActive("/share") ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share Progress
                  </Button>
                </Link>
                
                <Link to="/github" className="block" onClick={closeSheet}>
                  <Button
                    variant={isActive("/github") ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Github className="mr-2 h-5 w-5" />
                    GitHub
                  </Button>
                </Link>
                
                <Link to="/settings" className="block" onClick={closeSheet}>
                  <Button
                    variant={isActive("/settings") ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-bold ml-2 text-primary">DevSprint</h1>
      </div>
      
      <div className="flex items-center space-x-1">
        <Link to="/daily-log/new">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Clipboard className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/sprint/new">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/settings">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
