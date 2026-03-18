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
          <div className="md:hidden sticky top-0 z-50 border-b bg-background/70 backdrop-blur">
            <div className="h-14 px-4 flex items-center gap-2">
              <SidebarTrigger />
              <span className="font-semibold truncate">{user?.name || "Dashboard"}</span>
            </div>
          </div>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// ─── /dashboard: redirect shortcut for post-login ─────────────────────────────
// Authenticated users land here after login and get sent to /inbox.
// This is SEPARATE from "/" so that "/" always shows the landing page.
function DashboardRedirect() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  React.useEffect(() => {
    if (!isLoading) {
      setLocation(isAuthenticated ? "/inbox" : "/auth/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);
  return null;
}

// ─── Router ───────────────────────────────────────────────────────────────────
function Router() {
  return (
    <Switch>
      {/* "/" always renders the public Landing page — NEVER redirects automatically.
          Authenticated users who navigate here intentionally SHOULD see the landing page.
          This fixes the "Home Page button → /inbox" bug. */}
      <Route path="/">
        <PublicLayout><Landing /></PublicLayout>
      </Route>

      {/* /dashboard is the post-login redirect target (not "/") */}
      <Route path="/dashboard">
        <DashboardRedirect />
      </Route>

      {/* Public routes */}
      <Route path="/pricing"><PublicLayout><Pricing /></PublicLayout></Route>
      <Route path="/demo"><PublicLayout><Demo /></PublicLayout></Route>
      <Route path="/about"><PublicLayout><About /></PublicLayout></Route>
      <Route path="/terms"><PublicLayout><Terms /></PublicLayout></Route>
      <Route path="/meta-verification"><PublicLayout><MetaVerification /></PublicLayout></Route>

      {/* Industry template landing pages (public, NOT the dashboard /templates) */}
      <Route path="/templates/clinics"><PublicLayout><TemplateLanding industry="clinics" /></PublicLayout></Route>
      <Route path="/templates/coaching"><PublicLayout><TemplateLanding industry="coaching" /></PublicLayout></Route>
      <Route path="/templates/salons"><PublicLayout><TemplateLanding industry="salons" /></PublicLayout></Route>
      <Route path="/templates/repairs"><PublicLayout><TemplateLanding industry="repairs" /></PublicLayout></Route>
      <Route path="/templates/restaurants"><PublicLayout><TemplateLanding industry="restaurants" /></PublicLayout></Route>

      {/* Auth */}
      <Route path="/auth/login"><PublicLayout><Login /></PublicLayout></Route>
      <Route path="/auth/signup"><PublicLayout><Signup /></PublicLayout></Route>

      {/* Protected dashboard routes */}
      <Route path="/inbox">
        <ProtectedRoute><AuthenticatedLayout><InboxPage /></AuthenticatedLayout></ProtectedRoute>
      </Route>
      <Route path="/contacts">
        <ProtectedRoute><AuthenticatedLayout><ContactsPage /></AuthenticatedLayout></ProtectedRoute>
      </Route>
      <Route path="/pipeline">
        <ProtectedRoute><AuthenticatedLayout><PipelinePage /></AuthenticatedLayout></ProtectedRoute>
      </Route>
      <Route path="/automation">
        <ProtectedRoute><AuthenticatedLayout><AutomationPage /></AuthenticatedLayout></ProtectedRoute>
      </Route>
      <Route path="/broadcast">
        <ProtectedRoute><AuthenticatedLayout><BroadcastPage /></AuthenticatedLayout></ProtectedRoute>
      </Route>
      <Route path="/templates">
        <ProtectedRoute><AuthenticatedLayout><TemplatesPage /></AuthenticatedLayout></ProtectedRoute>
      </Route>
      <Route path="/analytics">
        <ProtectedRoute><AuthenticatedLayout><AnalyticsPage /></AuthenticatedLayout></ProtectedRoute>
      </Route>
      <Route path="/billing">
        <ProtectedRoute><AuthenticatedLayout><BillingPage /></AuthenticatedLayout></ProtectedRoute>
      </Route>

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
