import { useEffect } from "react";
import { useLocation } from "wouter";
import { getAuthToken } from "@/services/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken();
    
    if (!token) {
      // Redirect to login if no token
      setLocation("/auth/login");
    }
  }, [setLocation]);

  // You might want to add loading state here
  const token = getAuthToken();
  
  if (!token) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}