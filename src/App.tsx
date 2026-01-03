import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";

import Auth from "./pages/Auth";
import SavedCalculations from "./pages/SavedCalculations";
import Methodology from "./pages/Methodology";
import Settings from "./pages/Settings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Invite from "./pages/Invite";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ZakatAdapterTest from "./components/debug/ZakatAdapterTest";
import ExtractionTest from "./pages/ExtractionTest";
import Assets from "./pages/Assets";
import AddAccount from "./pages/AddAccount";
import AccountDetail from "./pages/AccountDetail";
import LogoutSuccess from "./pages/LogoutSuccess";
import DevTools from "./pages/DevTools";
import SankeyTest from "./pages/SankeyTest";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />

                <Route path="/auth" element={<Auth />} />
                <Route path="/calculations" element={<SavedCalculations />} />
                <Route path="/methodology" element={<Methodology />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/about" element={<About />} />
                <Route path="/invite/:code" element={<Invite />} />
                <Route path="/debug-adapter" element={<ZakatAdapterTest />} />
                <Route path="/extraction-test" element={<ExtractionTest />} />
                <Route path="/assets" element={<Assets />} />
                <Route path="/assets/add" element={<AddAccount />} />
                <Route path="/assets/:accountId" element={<AccountDetail />} />
                <Route path="/logout" element={<LogoutSuccess />} />
                <Route path="/dev" element={<DevTools />} />
                <Route path="/sankey-test" element={<SankeyTest />} />
                <Route path="/debug-adapter" element={<ZakatAdapterTest />} />
                <Route path="/extraction-test" element={<ExtractionTest />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
