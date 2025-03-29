
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FactCheckProvider } from "@/context/FactCheckContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Legal from "./pages/Legal";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NavBar from "./components/NavBar";
import ApiKeyModal from "./components/ApiKeyModal";
import { Suspense, lazy } from "react";
import { Skeleton } from "./components/ui/skeleton";

// Create a query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="space-y-4 w-full max-w-md px-4">
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-2/3" />
    </div>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FactCheckProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <NavBar />
                <ApiKeyModal />
                <Suspense fallback={<LoadingFallback />}>
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/legal" element={<Legal />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </Suspense>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </FactCheckProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
