import * as React from "react";
import { Link, useLocation } from "wouter";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  BarChart3, Bolt, CreditCard, Home, LayoutGrid,
  LogOut, MessageSquareText, MessagesSquare, NotebookText, Send, Users2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { queryClient } from "@/lib/queryClient";
import { logoutUser } from "@/services/auth";

const nav = [
  { href: "/inbox",      label: "Inbox",      icon: MessageSquareText },
  { href: "/contacts",   label: "Contacts",   icon: Users2 },
  { href: "/pipeline",   label: "Pipeline",   icon: LayoutGrid },
  { href: "/automation", label: "Automation", icon: Bolt },
  { href: "/broadcast",  label: "Broadcast",  icon: Send },
  { href: "/templates",  label: "Templates",  icon: NotebookText },
  { href: "/analytics",      label: "Analytics",   icon: BarChart3 },
  { href: "/whatsapp-setup",  label: "WA Setup",    icon: MessagesSquare },
  { href: "/billing",         label: "Billing",     icon: CreditCard },
] as const;

export function AppSidebar() {
  const [loc, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    logout();               // clear AuthContext + localStorage
    queryClient.clear();    // wipe all cached queries
    setLocation("/");
  };

  return (
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
                const active =
                  loc === item.href ||
                  (item.href !== "/inbox" && loc.startsWith(item.href));
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
  );
}
