import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MessageCircle, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { apiUrl } from "@/lib/api";

const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPassword() {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const res = await fetch(apiUrl("/api/v1/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      const text = await res.text();
      let data: any = null;
      try { data = text ? JSON.parse(text) : null; } catch { data = null; }

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Request failed. Please try again.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setServerError(err.message || "Something went wrong. Please try again.");
    }
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
          <h2 className="text-2xl font-bold text-slate-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-slate-500">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-6">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold text-emerald-700">Check your email</p>
              <p className="text-xs text-emerald-600">
                If an account exists for <strong>{form.getValues("email")}</strong>, you'll receive a password reset link shortly.
              </p>
            </div>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full rounded-lg gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="name@company.com"
                          {...field}
                          className="rounded-lg pl-9"
                        />
                      </div>
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
                {form.formState.isSubmitting ? "Sending…" : "Send Reset Link"}
              </Button>
            </form>
          </Form>
        )}

        <div className="text-center">
          <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
