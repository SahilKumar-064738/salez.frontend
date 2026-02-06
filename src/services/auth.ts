import { apiUrl } from "@/lib/api";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  companyName: string | null;
}

// Token storage helpers
const TOKEN_KEY = 'auth_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(apiUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }
  
  const data = await res.json();
  
  // Store the token
  if (data.token) {
    setAuthToken(data.token);
  }
  
  // Return user data in expected format
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    companyName: data.companyName || null
  };
}

export async function signupUser(data: {
  name: string;
  companyName: string;
  email: string;
  password: string;
}): Promise<AuthUser> {
  const res = await fetch(apiUrl("/auth/signup"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      name: data.name,
      company_name: data.companyName,
      email: data.email,
      password: data.password,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    
    try {
      const json = JSON.parse(text);
      throw new Error(json.message || "Signup failed");
    } catch {
      throw new Error(text || "Signup failed");
    }
  }

  const responseData = await res.json();
  
  // Store the token
  if (responseData.token) {
    setAuthToken(responseData.token);
  }
  
  // Return user data in expected format
  return {
    id: responseData.id,
    email: responseData.email,
    name: responseData.name,
    companyName: responseData.companyName || null
  };
}

export async function fetchMe(): Promise<AuthUser | null> {
  const token = getAuthToken();
  
  if (!token) {
    return null;
  }
  
  try {
    const res = await fetch(apiUrl("/auth/me"), { 
      credentials: "include",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (res.status === 401) {
      // Token expired or invalid, remove it
      removeAuthToken();
      return null;
    }
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      companyName: data.companyName || null
    };
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  const token = getAuthToken();
  
  try {
    await fetch(apiUrl("/auth/logout"), { 
      method: "POST", 
      credentials: "include",
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });
  } catch (error) {
    console.error('Logout request failed:', error);
  } finally {
    // Always remove token, even if request fails
    removeAuthToken();
  }
}
