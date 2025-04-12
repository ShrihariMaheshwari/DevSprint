
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SprintProvider } from "@/context/SprintContext";
import Index from "./pages/Index";
import CreateSprint from "./pages/CreateSprint";
import CreateDailyLog from "./pages/CreateDailyLog";
import ViewLog from "./pages/ViewLog";
import Analytics from "./pages/Analytics";
import SprintTemplates from "./pages/SprintTemplates";
import ShareProgress from "./pages/ShareProgress";
import GitHubIntegration from "./pages/GitHubIntegration";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import MobileNav from "./components/MobileNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SprintProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MobileNav />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sprint/new" element={<CreateSprint />} />
            <Route path="/daily-log/new" element={<CreateDailyLog />} />
            <Route path="/log/:id" element={<ViewLog />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/templates" element={<SprintTemplates />} />
            <Route path="/share" element={<ShareProgress />} />
            <Route path="/github" element={<GitHubIntegration />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SprintProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
