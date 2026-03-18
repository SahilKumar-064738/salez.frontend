import * as React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const industries = [
  { href: "/templates/clinics",     label: "Clinics" },
  { href: "/templates/coaching",    label: "Coaching Centres" },
  { href: "/templates/salons",      label: "Salons" },
  { href: "/templates/repairs",     label: "Repair Shops" },
  { href: "/templates/restaurants", label: "Restaurants" },
];

// Routes where the public Navbar must NOT render
const DASHBOARD_ROUTES = [
  "/inbox", "/contacts", "/pipeline", "/automation",
  "/broadcast", "/analytics", "/billing", "/dashboard",
];

export function Navbar() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const [templatesOpen, setTemplatesOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Hide on auth pages and all dashboard routes (but NOT /templates/* public pages)
  const isAuthPage = location.startsWith("/auth");
  const isDashboard =
    DASHBOARD_ROUTES.some(r => location.startsWith(r)) ||
    location === "/templates"; // exact /templates = dashboard

  if (isAuthPage || isDashboard) return null;

  // Close dropdown on outside click (not onBlur — that fires before Link click)
  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTemplatesOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <MessageCircle className="h-6 w-6 text-primary fill-current" />
            <span>AutoReply</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className={cn("hover:text-primary transition-colors", location === "/" && "text-primary")}>
              Home
            </Link>
            <Link href="/pricing" className={cn("hover:text-primary transition-colors", location === "/pricing" && "text-primary")}>
              Pricing
            </Link>
            <Link href="/about" className={cn("hover:text-primary transition-colors", location === "/about" && "text-primary")}>
              About
            </Link>

            {/* Templates dropdown — fixed: uses mousedown outside-click, not onBlur */}
            <div className="relative" ref={dropdownRef}>
              <button
                className={cn(
                  "flex items-center gap-1 hover:text-primary transition-colors select-none",
                  location.startsWith("/templates/") && "text-primary"
                )}
                onClick={() => setTemplatesOpen(v => !v)}
              >
                Templates <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", templatesOpen && "rotate-180")} />
              </button>

              {templatesOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 min-w-[190px] z-50">
                  {industries.map(i => (
                    <Link
                      key={i.href}
                      href={i.href}
                      className={cn(
                        "block px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors",
                        location === i.href && "text-primary font-semibold bg-green-50"
                      )}
                      onClick={() => setTemplatesOpen(false)}
                    >
                      {i.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/terms" className={cn("hover:text-primary transition-colors", location === "/terms" && "text-primary")}>
              T&amp;C
            </Link>
            <Link href="/meta-verification" className={cn("hover:text-primary transition-colors", location === "/meta-verification" && "text-primary")}>
              Meta Verification
            </Link>
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/inbox">
                <Button className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/25">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-slate-600 hover:text-primary hover:bg-green-50">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/25">
                    Start Free Trial
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3 text-sm font-medium">
          <Link href="/" className="block hover:text-primary" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/pricing" className="block hover:text-primary" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <Link href="/about" className="block hover:text-primary" onClick={() => setMobileOpen(false)}>About</Link>
          <Link href="/terms" className="block hover:text-primary" onClick={() => setMobileOpen(false)}>T&amp;C</Link>
          {industries.map(i => (
            <Link key={i.href} href={i.href} className="block pl-3 text-slate-500 hover:text-primary" onClick={() => setMobileOpen(false)}>
              → {i.label}
            </Link>
          ))}
          <div className="pt-3 border-t flex flex-col gap-2">
            {isAuthenticated ? (
              <Link href="/inbox" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-primary text-white">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-primary text-white">Start Free Trial</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
