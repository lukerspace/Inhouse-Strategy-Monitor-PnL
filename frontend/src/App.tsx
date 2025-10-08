import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UsaModel1 from "./pages/UsaModel1";
import UsaModel2 from "./pages/UsaModel2";
import TwseModel1 from "./pages/TwseModel1";
import NotFound from "./pages/NotFound";
import DashboardTemplate from "@/components/DashboardTemplate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/usa-model1"
            element={
              <DashboardTemplate
                apiEndpoint="/api/usa-model1"
                title="USA Model 1"
                description="Real-time strategy monitoring and trade analytics"
              />
            }
          />
          <Route
            path="/usa-model2"
            element={
              <DashboardTemplate
                apiEndpoint="/api/usa-model2"
                title="USA Model 2"
                description="Real-time strategy monitoring and trade analytics"
              />
            }
          />
          <Route
            path="/twse-model1"
            element={
              <DashboardTemplate
                apiEndpoint="/api/twse-model1"
                title="TWSE Model 1"
                description="Real-time strategy monitoring and trade analytics"
              />
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
