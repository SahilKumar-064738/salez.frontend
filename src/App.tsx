import * as React from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Landing from "@/pages/public/Landing";
import Pricing from "@/pages/public/Pricing";
import Demo from "@/pages/public/Demo";
import About from "@/pages/public/About";
import Terms from "@/pages/public/Terms";
import MetaVerification from "@/pages/public/MetaVerification";
import TemplateLanding from "@/pages/public/TemplateLanding";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

import InboxPage from "@/pages/InboxPage";
import ContactsPage from "@/pages/ContactsPage";
import PipelinePage from "@/pages/PipelinePage";
import AutomationPage from "@/pages/AutomationPage";
import BroadcastPage from "@/pages/BroadcastPage";
import TemplatesPage from "@/pages/TemplatesPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import BillingPage from "@/pages/BillingPage";

// ─── Layouts ──────────────────────────────────────────────────────────────────

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen w-full bg-background flex">
        <AppSidebar />
        <SidebarInset className="flex-1 min-w-0">
          <div className="md:hidden sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="h-14 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <SidebarTrigger />
                <span className="font-semibold truncate">{user?.name || "Dashboard"}</span>
              </div>
            </div>
          </div>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// ─── DashboardRedirect: /dashboard → /inbox (if authed) or /auth/login ───────
function DashboardRedirect() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  React.useEffect(() => {
    if (!isLoading) {
      setLocation(isAuthenticated ? "/inbox" : "/auth/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, setLocation]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

// ─── AuthGate: redirect already-logged-in users away from auth pages ─────────
function AuthGate({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/inbox", { replace: true });
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

// ─── Router ───────────────────────────────────────────────────────────────────
function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/"><PublicLayout><Landing /></PublicLayout></Route>
      <Route path="/dashboard"><DashboardRedirect /></Route>
      <Route path="/pricing"><PublicLayout><Pricing /></PublicLayout></Route>
      <Route path="/demo"><PublicLayout><Demo /></PublicLayout></Route>
      <Route path="/about"><PublicLayout><About /></PublicLayout></Route>
      <Route path="/terms"><PublicLayout><Terms /></PublicLayout></Route>
      <Route path="/meta-verification"><PublicLayout><MetaVerification /></PublicLayout></Route>

      {/* Industry template pages — public */}
      <Route path="/templates/clinics"><PublicLayout><TemplateLanding industry="clinics" /></PublicLayout></Route>
      <Route path="/templates/coaching"><PublicLayout><TemplateLanding industry="coaching" /></PublicLayout></Route>
      <Route path="/templates/salons"><PublicLayout><TemplateLanding industry="salons" /></PublicLayout></Route>
      <Route path="/templates/repairs"><PublicLayout><TemplateLanding industry="repairs" /></PublicLayout></Route>
      <Route path="/templates/restaurants"><PublicLayout><TemplateLanding industry="restaurants" /></PublicLayout></Route>
      <Route path="/templates/ecommerce"><PublicLayout><TemplateLanding industry="ecommerce" /></PublicLayout></Route>
      <Route path="/templates/realestate"><PublicLayout><TemplateLanding industry="realestate" /></PublicLayout></Route>
      <Route path="/templates/ca"><PublicLayout><TemplateLanding industry="ca" /></PublicLayout></Route>

      {/* Auth — AuthGate prevents logged-in users from seeing these */}
      <Route path="/auth/login">
        <PublicLayout><AuthGate><Login /></AuthGate></PublicLayout>
      </Route>
      <Route path="/auth/signup">
        <PublicLayout><AuthGate><Signup /></AuthGate></PublicLayout>
      </Route>

      {/* Protected dashboard routes */}
      <Route path="/inbox"><ProtectedRoute><AuthenticatedLayout><InboxPage /></AuthenticatedLayout></ProtectedRoute></Route>
      <Route path="/contacts"><ProtectedRoute><AuthenticatedLayout><ContactsPage /></AuthenticatedLayout></ProtectedRoute></Route>
      <Route path="/pipeline"><ProtectedRoute><AuthenticatedLayout><PipelinePage /></AuthenticatedLayout></ProtectedRoute></Route>
      <Route path="/automation"><ProtectedRoute><AuthenticatedLayout><AutomationPage /></AuthenticatedLayout></ProtectedRoute></Route>
      <Route path="/broadcast"><ProtectedRoute><AuthenticatedLayout><BroadcastPage /></AuthenticatedLayout></ProtectedRoute></Route>
      <Route path="/templates"><ProtectedRoute><AuthenticatedLayout><TemplatesPage /></AuthenticatedLayout></ProtectedRoute></Route>
      <Route path="/analytics"><ProtectedRoute><AuthenticatedLayout><AnalyticsPage /></AuthenticatedLayout></ProtectedRoute></Route>
      <Route path="/billing"><ProtectedRoute><AuthenticatedLayout><BillingPage /></AuthenticatedLayout></ProtectedRoute></Route>

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
