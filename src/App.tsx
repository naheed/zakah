import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { VaultProvider } from "@/context/VaultContext";
import { ZakatPersistenceProvider } from "@/context/ZakatPersistenceContext";
import { VaultGuard } from "@/components/vault";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SavedCalculations from "./pages/SavedCalculations";
import Methodology from "./pages/Methodology";
import { MethodologyZMCS } from "./pages/MethodologyZMCS";
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
import AccountDeleted from "./pages/AccountDeleted";
import Donations from "./pages/Donations";
import Jurisprudence from "./pages/Jurisprudence";
import Changelog from "./pages/Changelog";
import { initAnalytics } from "./lib/analytics";
import { usePageTracking } from "./hooks/usePageTracking";

// Initialize Analytics (once)
initAnalytics();

const queryClient = new QueryClient();

function AppContent() {
  usePageTracking();

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Calculator - Vault optional (frictionless first experience) */}
        <Route path="/" element={
          <VaultGuard optional>
            <Index />
          </VaultGuard>
        } />

        <Route path="/auth" element={<Auth />} />

        {/* Public Content Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/jurisprudence" element={<Jurisprudence />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Protected data routes - Vault required */}
        <Route path="/calculations" element={
          <VaultGuard>
            <SavedCalculations />
          </VaultGuard>
        } />
        <Route path="/assets" element={
          <VaultGuard>
            <Assets />
          </VaultGuard>
        } />
        <Route path="/assets/add" element={
          <VaultGuard>
            <AddAccount />
          </VaultGuard>
        } />
        <Route path="/assets/:accountId" element={
          <VaultGuard>
            <AccountDetail />
          </VaultGuard>
        } />
        <Route path="/donations" element={
          <VaultGuard>
            <Donations />
          </VaultGuard>
        } />

        {/* Public routes */}
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/methodology/zmcs" element={<MethodologyZMCS />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/invite/:code" element={<Invite />} />
        <Route path="/logout" element={<LogoutSuccess />} />
        <Route path="/account-deleted" element={<AccountDeleted />} />

        {/* Dev routes */}
        <Route path="/dev" element={<DevTools />} />
        <Route path="/debug-adapter" element={<ZakatAdapterTest />} />
        <Route path="/extraction-test" element={<ExtractionTest />} />
        <Route path="/sankey-test" element={<SankeyTest />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <VaultProvider>
            <ZakatPersistenceProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </TooltipProvider>
            </ZakatPersistenceProvider>
          </VaultProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
