import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "₹999",
      desc: "Perfect for freelancers and solo agents.",
      features: ["100 Active Leads", "Basic Automation Rules", "Email Support", "1 User Account"]
    },
    {
      name: "Growth",
      price: "₹1,999",
      popular: true,
      desc: "For growing teams that need more power.",
      features: ["500 Active Leads", "Advanced Logic Engine", "Priority Support", "5 User Accounts", "Payment Reminders"]
    },
    {
      name: "Pro",
      price: "₹2,999",
      desc: "Maximum automation for established businesses.",
      features: ["Unlimited Leads", "Custom Workflows", "Dedicated Account Manager", "Unlimited Users", "API Access"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-slate-500">Choose the plan that fits your business size.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative bg-white rounded-2xl p-8 shadow-sm border ${plan.popular ? 'border-primary shadow-xl ring-2 ring-primary/20 scale-105 z-10' : 'border-slate-200'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="text-sm text-slate-500 mb-8">{plan.desc}</p>
              
              <Link href="/auth/signup">
                <Button className={`w-full mb-8 font-semibold ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-slate-900 hover:bg-slate-800'}`}>
                  Get Started
                </Button>
              </Link>

              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-600">
                    <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
