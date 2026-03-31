/**
 * BillingPage — Replaced with local Pricing page
 * /billing endpoint does NOT exist in the backend API contract.
 * Redirects to /pricing which is the local pricing page.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function BillingPage() {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation("/pricing", { replace: true }); }, []);
  return null;
}
