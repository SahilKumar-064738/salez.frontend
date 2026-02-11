import * as React from "react";
import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pre-signin layout components
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pre-signin pages (public)
import Landing from "@/pages/public/Landing";
import Pricing from "@/pages/public/Pricing";
import Demo from "@/pages/public/Demo";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";

// Post-signin pages (authenticated)
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import InboxPage from "@/pages/InboxPage";
import ContactsPage from "@/pages/ContactsPage";
import PipelinePage from "@/pages/PipelinePage";
import AutomationPage from "@/pages/AutomationPage";
import BroadcastPage from "@/pages/BroadcastPage";
import TemplatesPage from "@/pages/TemplatesPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import BillingPage from "@/pages/BillingPage";

// Public layout wrapper (with Navbar and Footer)
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Authenticated layout wrapper (with Sidebar)
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public routes with Navbar/Footer */}
      <Route path="/">
        <PublicLayout>
          <Landing />
        </PublicLayout>
      </Route>
      
      <Route path="/pricing">
        <PublicLayout>
          <Pricing />
        </PublicLayout>
      </Route>
      
      <Route path="/demo">
        <PublicLayout>
          <Demo />
        </PublicLayout>
      </Route>

      {/* Auth routes with Navbar/Footer */}
      <Route path="/auth/login">
        <PublicLayout>
          <Login />
        </PublicLayout>
      </Route>
      
      <Route path="/auth/signup">
        <PublicLayout>
          <Signup />
        </PublicLayout>
      </Route>

      {/* Authenticated routes with Sidebar */}
      <Route path="/inbox">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <InboxPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/contacts">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <ContactsPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/pipeline">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <PipelinePage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/automation">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <AutomationPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/broadcast">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <BroadcastPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/templates">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <TemplatesPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/analytics">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <AnalyticsPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/billing">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <BillingPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  React.useEffect(() => {
    // Default: respect existing class; otherwise light.
    // Could be enhanced later to read OS preference.
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;