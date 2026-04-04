import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

const formSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

function useQueryParam(key: string): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const token = useQueryParam("token");

  const [isSuccess, setIsSuccess] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);

    if (!token) {
      setServerError("Invalid or missing reset token. Please request a new reset link.");
      return;
    }

    try {
      const data: any = await api.post("/api/v1/auth/reset-password", { token, password: values.password });

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Reset failed. Your link may have expired.");
      }

      setIsSuccess(true);
      setTimeout(() => setLocation("/auth/login"), 3000);
    } catch (err: any) {
      setServerError(err.message || "Something went wrong. Please try again.");
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Invalid Reset Link</h2>
          <p className="text-sm text-slate-500">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link href="/auth/forgot-password">
            <Button className="w-full rounded-lg">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <Link href="/">
            <div className="inline-flex items-center gap-2 mb-6 cursor-pointer">
              <MessageCircle className="h-8 w-8 text-primary fill-current" />
              <span className="text-2xl font-bold text-slate-900">Salez.online</span>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Set New Password</h2>
          <p className="mt-2 text-sm text-slate-500">
            Choose a strong password for your account
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-6">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold text-emerald-700">Password updated!</p>
              <p className="text-xs text-emerald-600">
                Your password has been changed. Redirecting to login…
              </p>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Minimum 6 characters"
                        {...field}
                        className="rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Repeat your password"
                        {...field}
                        className="rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {serverError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5">
                  <p className="text-sm text-red-600">{serverError}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full rounded-lg bg-primary hover:bg-primary/90 font-bold text-white shadow-lg shadow-primary/20"
              >
                {form.formState.isSubmitting ? "Updating…" : "Update Password"}
              </Button>
            </form>
          </Form>
        )}

        {!isSuccess && (
          <div className="text-center">
            <Link href="/auth/login" className="text-sm text-slate-400 hover:text-primary transition-colors">
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
