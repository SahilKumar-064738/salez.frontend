import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { MessageCircle } from "lucide-react";
import { useSignup } from "@/hooks/use-auth";
import { setAuthToken } from "@/services/auth";

const formSchema = z.object({
  name:        z.string().min(2, "Name must be at least 2 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email:       z.string().email("Enter a valid email"),
  password:    z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signup() {
  const [, setLocation] = useLocation();
  const signup = useSignup();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", companyName: "", email: "", password: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signup.mutate(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        businessName: values.companyName,
      },
      {
        onSuccess: () => {
  setLocation("/inbox");
},

        onError: (err: any) => {
          alert(err.message || "Signup failed");
        },
      }
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <Link href="/">
            <div className="inline-flex items-center gap-2 mb-6">
              <MessageCircle className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-slate-900">AutoReply</span>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
          <p className="mt-2 text-sm text-slate-500">Start automating your WhatsApp follow-ups today</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} className="rounded-lg" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="companyName" render={({ field }) => (
              <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="Acme Inc." {...field} className="rounded-lg" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="name@company.com" type="email" {...field} className="rounded-lg" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} className="rounded-lg" /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" disabled={signup.isPending} className="w-full mt-4 rounded-lg bg-primary hover:bg-primary/90 font-bold text-white shadow-lg shadow-primary/20">
              {signup.isPending ? "Creating account…" : "Create Account"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline font-semibold">Log in</Link>
        </div>
      </div>
    </div>
  );
}