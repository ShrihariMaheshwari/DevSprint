
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SprintProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sprint/new" element={<CreateSprint />} />
            <Route path="/daily-log/new" element={<CreateDailyLog />} />
            <Route path="/log/:id" element={<ViewLog />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SprintProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
