import * as React from "react";
import { Link, useLocation } from "wouter";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  BarChart3, Bolt, Home, LayoutGrid,
  LogOut, MessageSquareText, MessagesSquare, NotebookText, Send, Users2, Zap, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { queryClient } from "@/lib/queryClient";
import { logoutUser } from "@/services/auth";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

// REMOVED: /billing and /automation (automation not in API contract)
const nav = [
  { href: "/inbox",          label: "Inbox",      icon: MessageSquareText },
  { href: "/contacts",       label: "Contacts",   icon: Users2 },
  { href: "/pipeline",       label: "Pipeline",   icon: LayoutGrid },
  { href: "/broadcast",      label: "Broadcast",  icon: Send },
  { href: "/templates",      label: "Templates",  icon: NotebookText },
  { href: "/records",        label: "Records",    icon: FileText },
  { href: "/analytics",      label: "Analytics",  icon: BarChart3 },
  { href: "/whatsapp-setup", label: "WA Setup",   icon: MessagesSquare },
] as const;

function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [selecting, setSelecting] = React.useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    setSelecting(planId);
    try {
      await api.post("/api/v1/billing/select-plan", { planId });
      toast({ title: "Plan selected successfully", description: `You are now on the ${planId} plan.` });
      onClose();
    } catch {
      toast({ title: "Failed to select plan", description: "Please try again or contact support.", variant: "destructive" });
    } finally {
      setSelecting(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Upgrade Your Plan
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-3">
            {[
              { name: "Starter", price: "₹999/mo", features: ["500 contacts", "1,000 messages/mo", "2 WhatsApp accounts", "Basic analytics"], badge: null },
              { name: "Growth", price: "₹2,499/mo", features: ["5,000 contacts", "10,000 messages/mo", "5 WhatsApp accounts", "Advanced analytics", "Priority support"], badge: "Popular" },
              { name: "Pro", price: "₹5,999/mo", features: ["Unlimited contacts", "Unlimited messages", "Unlimited accounts", "Full analytics", "Dedicated support", "API access"], badge: null },
            ].map((plan) => (
              <div key={plan.name} className={cn(
                "rounded-xl border p-4 flex items-start justify-between gap-4",
                plan.badge ? "border-primary bg-primary/5" : "border-border"
              )}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{plan.name}</span>
                    {plan.badge && <Badge className="text-[10px]">{plan.badge}</Badge>}
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {plan.features.map(f => (
                      <li key={f} className="text-xs text-muted-foreground">• {f}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-sm">{plan.price}</div>
                  <Button size="sm" variant={plan.badge ? "default" : "outline"} className="mt-2 text-xs h-7"
                    disabled={selecting === plan.name.toLowerCase()}
                    onClick={() => handleSelectPlan(plan.name.toLowerCase())}>
                    {selecting === plan.name.toLowerCase() ? "..." : "Select"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">Contact us at support@salez.in for custom enterprise pricing.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AppSidebar() {
  const [loc, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [upgradeOpen, setUpgradeOpen] = React.useState(false);

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    logout();
    queryClient.clear();
    setLocation("/");
  };

  return (
    <>
      <Sidebar data-testid="app-sidebar" className="border-r border-sidebar-border">
        <SidebarHeader className="px-3 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold truncate">{user?.name || "Dashboard"}</span>
              <span className="text-[11px] text-muted-foreground truncate">{user?.email || ""}</span>
            </div>
            <ThemeToggle variant="outline" />
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] tracking-wide text-muted-foreground">
              Workspace
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => {
                  const active = loc === item.href || (item.href !== "/inbox" && loc.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                            active
                              ? "bg-gradient-to-r from-primary/16 to-accent/10 text-foreground shadow-sm ring-1 ring-border"
                              : "hover:bg-sidebar-accent/70 hover:shadow-sm"
                          )}
                          data-testid={`nav-${item.label.toLowerCase()}`}
                        >
                          <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-3 py-3 space-y-1">
          {/* FIXED: Upgrade button now opens modal instead of redirecting to Replit */}
          <button
            onClick={() => setUpgradeOpen(true)}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 bg-primary/10 hover:bg-primary/20 text-primary"
          >
            <Zap className="h-4 w-4" />
            <span>Upgrade Plan</span>
          </button>
          <Link
            href="/"
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-sidebar-accent/70 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            <span>Home Page</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-sidebar-accent/70 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </SidebarFooter>
      </Sidebar>
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </>
  );
}
