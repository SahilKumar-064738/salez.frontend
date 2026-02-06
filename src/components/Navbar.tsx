import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();

  const isAuthPage = location.startsWith("/auth");
  const isAuthenticatedRoute = [
    "/inbox",
    "/contacts",
    "/pipeline",
    "/automation",
    "/broadcast",
    "/templates",
    "/analytics",
    "/billing"
  ].some(route => location.startsWith(route));

  if (isAuthPage || isAuthenticatedRoute) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <MessageCircle className="h-6 w-6 text-primary fill-current" />
            <span>AutoReply</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className={cn("hover:text-primary transition-colors", location === "/" && "text-primary")}>
              Features
            </Link>
            <Link href="/pricing" className={cn("hover:text-primary transition-colors", location === "/pricing" && "text-primary")}>
              Pricing
            </Link>
            <Link href="/demo" className={cn("hover:text-primary transition-colors", location === "/demo" && "text-primary")}>
              Demo
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="hidden sm:flex text-slate-600 hover:text-primary hover:bg-green-50">
                Log in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/25">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}