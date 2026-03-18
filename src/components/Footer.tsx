import { Link, useLocation } from "wouter";
import { MessageCircle, Twitter, Linkedin, Facebook } from "lucide-react";

export function Footer() {
  const [location] = useLocation();
  
  const isAuthenticatedRoute =
    ["/inbox", "/contacts", "/pipeline", "/automation", "/broadcast", "/analytics", "/billing", "/dashboard"]
      .some(route => location.startsWith(route)) || location === "/templates";
  
  if (isAuthenticatedRoute || location.startsWith("/auth")) return null;

  return (
    <footer className="bg-slate-50 border-t border-slate-100 py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
              <MessageCircle className="h-6 w-6 text-primary fill-current" />
              <span>AutoReply</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Automated WhatsApp follow-ups that turn cold leads into paying customers. Stop chasing, start closing.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/demo" className="hover:text-primary transition-colors">Interactive Demo</Link></li>
              <li><Link href="/meta-verification" className="hover:text-primary transition-colors">Meta Verification</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Templates</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/templates/clinics" className="hover:text-primary transition-colors">Clinics</Link></li>
              <li><Link href="/templates/salons" className="hover:text-primary transition-colors">Salons</Link></li>
              <li><Link href="/templates/coaching" className="hover:text-primary transition-colors">Coaching</Link></li>
              <li><Link href="/templates/repairs" className="hover:text-primary transition-colors">Repair Shops</Link></li>
              <li><Link href="/templates/restaurants" className="hover:text-primary transition-colors">Restaurants</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/terms#privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} AutoReply SaaS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}