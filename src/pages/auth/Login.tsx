import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { MessageCircle } from "lucide-react";
import { useLogin } from "@/hooks/use-auth";
import { setAuthToken } from "@/services/auth";

const formSchema = z.object({
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


export default function Login() {
  const [, setLocation] = useLocation();
  const login = useLogin();

  function onSubmit(values: z.infer<typeof formSchema>) {

    login.mutate(values, {
      onSuccess: (data) => {
        // 1. store token using auth service
        if (data.token) {
          setAuthToken(data.token);
        }

        // 2. redirect to inbox (main dashboard)
        setLocation("/inbox");
      },
      onError: (err: any) => {
        alert(err.message || "Login failed");
      },
    });
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <Link href="/">
            <div className="inline-flex items-center gap-2 mb-6">
              <MessageCircle className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-slate-900">AutoReply</span>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to your account to manage leads</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl><Input placeholder="name@company.com" {...field} className="rounded-lg" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                </div>
                <FormControl><Input type="password" {...field} className="rounded-lg" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={login.isPending} className="w-full rounded-lg bg-primary hover:bg-primary/90 font-bold text-white shadow-lg shadow-primary/20">
              {login.isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline font-semibold">Start free trial</Link>
        </div>
      </div>
    </div>
  );
}