import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { MessageCircle, Home } from "lucide-react";
import { useSignup } from "@/hooks/use-auth";

const BUSINESS_TYPES = [
  "Clinic / Healthcare", "Coaching / Education", "Salon / Beauty",
  "Repair Shop", "Restaurant / Food", "Retail / E-commerce",
  "Real Estate", "Finance / Insurance", "Other",
];

const formSchema = z.object({
  name:         z.string().min(2, "Name must be at least 2 characters"),
  companyName:  z.string().min(2, "Business name must be at least 2 characters"),
  businessType: z.string().min(1, "Please select a business type"),
  phone:        z.string().optional(),
  email:        z.string().email("Enter a valid email"),
  password:     z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signup() {
  const [, setLocation] = useLocation();

  // Navigation fires inside hook's onSuccess — after auth context is updated
  const signup = useSignup(() => setLocation("/inbox"));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", companyName: "", businessType: "", phone: "", email: "", password: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signup.mutate(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        businessName: values.companyName,
        businessType: values.businessType,
        phone: values.phone,
      },
      {
        onError: (err: any) => {
          form.setError("root", { message: err.message || "Signup failed" });
        },
      }
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <Link href="/">
            <div className="inline-flex items-center gap-2 mb-4 cursor-pointer">
              <MessageCircle className="h-8 w-8 text-primary fill-current" />
              <span className="text-2xl font-bold text-slate-900">AutoReply</span>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
          <p className="mt-2 text-sm text-slate-500">Start automating your WhatsApp follow-ups today</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Your details</p>

            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Full Name</FormLabel>
              <FormControl><Input placeholder="John Doe" {...field} className="rounded-lg" /></FormControl>
              <FormMessage /></FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel>
                <FormControl><Input placeholder="you@company.com" type="email" {...field} className="rounded-lg" /></FormControl>
                <FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone <span className="text-slate-400 font-normal">(opt.)</span></FormLabel>
                <FormControl><Input placeholder="+91 98765 43210" {...field} className="rounded-lg" /></FormControl>
                <FormMessage /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem><FormLabel>Password</FormLabel>
              <FormControl><Input type="password" placeholder="Min. 6 characters" {...field} className="rounded-lg" /></FormControl>
              <FormMessage /></FormItem>
            )} />

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide pt-1">Business details</p>

            <FormField control={form.control} name="companyName" render={({ field }) => (
              <FormItem><FormLabel>Business Name</FormLabel>
              <FormControl><Input placeholder="Acme Clinic" {...field} className="rounded-lg" /></FormControl>
              <FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="businessType" render={({ field }) => (
              <FormItem>
                <FormLabel>Business Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BUSINESS_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {form.formState.errors.root && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5">
                <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={signup.isPending}
              className="w-full rounded-lg bg-primary hover:bg-primary/90 font-bold text-white shadow-lg shadow-primary/20"
            >
              {signup.isPending ? "Creating account…" : "Create Account"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline font-semibold">Log in</Link>
        </div>
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition-colors">
            <Home className="h-4 w-4" /> Go to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
