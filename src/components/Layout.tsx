
import React from "react";
import Sidebar from "@/components/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-background/95">
      {!isMobile && <Sidebar />}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
