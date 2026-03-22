import * as React from "react";
import { Check, X, TrendingUp, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

const plans = [
  {
    id: "starter",
    name: "Starter",
    icon: TrendingUp,
    color: "text-primary",
    iconBg: "bg-green-100",
    price: 1999,
    originalPrice: 4000,
    popular: true,
    desc: "Everything you need to automate WhatsApp and convert more leads.",
    cta: "Start Automating WhatsApp",
    features: [
      { text: "Up to 2,000 contacts", ok: true },
      { text: "Unlimited auto-reply rules", ok: true },
      { text: "Broadcast campaigns (5,000 msgs/mo)", ok: true },
      { text: "Full analytics dashboard", ok: true },
      { text: "CSV upload & campaign tracking", ok: true },
      { text: "5 user accounts", ok: true },
      { text: "Priority WhatsApp support", ok: true },
      { text: "Payment reminders", ok: true },
      { text: "API access", ok: false },
      { text: "Team management", ok: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    icon: Crown,
    color: "text-purple-600",
    iconBg: "bg-purple-100",
    price: 3999,
    originalPrice: null,
    popular: false,
    desc: "Maximum power for established businesses and agencies managing multiple accounts.",
    cta: "Get More Leads Instantly",
    features: [
      { text: "Unlimited contacts", ok: true },
      { text: "Everything in Starter", ok: true },
      { text: "Unlimited broadcasts", ok: true },
      { text: "Advanced analytics + CSV exports", ok: true },
      { text: "Full API access", ok: true },
      { text: "Unlimited user accounts", ok: true },
      { text: "Dedicated account manager", ok: true },
      { text: "Custom workflow builder", ok: true },
      { text: "Team management dashboard", ok: true },
      { text: "White-label option (on request)", ok: true },
    ],
  },
];

const comparison = [
  { feature: "Contacts", starter: "2,000", pro: "Unlimited" },
  { feature: "Auto-reply rules", starter: "Unlimited", pro: "Unlimited" },
  { feature: "Monthly broadcast messages", starter: "5,000", pro: "Unlimited" },
  { feature: "User accounts", starter: "5", pro: "Unlimited" },
  { feature: "Analytics", starter: "✅ Full", pro: "✅ Advanced + Export" },
  { feature: "API access", starter: "❌", pro: "✅" },
  { feature: "Dedicated account manager", starter: "❌", pro: "✅" },
  { feature: "Support", starter: "Priority WhatsApp", pro: "Dedicated manager" },
];

export default function Pricing() {
  const [annual, setAnnual] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/60 to-white -z-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 rounded-full border border-orange-200 mb-6">
              🔥 Limited Time — 50% OFF Starter Plan First Month
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">Simple, transparent pricing</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8">
              Two plans. No hidden fees. Start automating today.
            </p>

            <div className="inline-flex items-center gap-3 bg-slate-100 rounded-full p-1.5">
              <button onClick={() => setAnnual(false)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!annual ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Monthly</button>
              <button onClick={() => setAnnual(true)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${annual ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                Annual <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">SAVE 20%</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PLANS ─────────────────────────────────────────────────────────── */}
      <section className="pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative bg-white rounded-2xl border-2 p-8 shadow-sm hover:shadow-xl transition-shadow ${plan.popular ? "border-primary shadow-lg shadow-primary/10" : "border-slate-200"}`}>

                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                    ⭐ Most Popular
                  </div>
                )}

                <div className={`inline-flex items-center justify-center w-11 h-11 ${plan.iconBg} rounded-xl mb-5`}>
                  <plan.icon className={`h-6 w-6 ${plan.color}`} />
                </div>

                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-1 mb-5">{plan.desc}</p>

                <div className="mb-6">
                  {plan.originalPrice && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-400 line-through text-lg">₹{plan.originalPrice.toLocaleString("en-IN")}</span>
                      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">50% OFF</span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-slate-900">
                      ₹{annual ? Math.round(plan.price * 12 * 0.8 / 12).toLocaleString("en-IN") : plan.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-slate-400 text-sm">/month</span>
                  </div>
                  {annual && <p className="text-xs text-green-600 mt-1 font-medium">Billed ₹{Math.round(plan.price * 12 * 0.8).toLocaleString("en-IN")}/year</p>}
                </div>

                <Link href="/auth/signup">
                  <Button className={`w-full font-semibold rounded-xl py-5 mb-8 ${plan.popular ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25" : "bg-purple-600 hover:bg-purple-700 text-white"}`}>
                    {plan.cta} <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      {feat.ok ? <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" /> : <X className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />}
                      <span className={feat.ok ? "text-slate-700" : "text-slate-400"}>{feat.text}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-400 mt-8">50% discount on Starter applies to first month only · Prices in INR · Cancel anytime</p>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">Full feature comparison</h2>
          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left pb-4 font-semibold text-slate-600 w-1/3">Feature</th>
                  <th className="text-center pb-4 font-bold text-primary">Starter ⭐</th>
                  <th className="text-center pb-4 font-semibold text-slate-600">Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="py-3.5 pr-4 font-medium text-slate-700">{row.feature}</td>
                    <td className="py-3.5 text-center font-semibold text-slate-700 bg-green-50/50">{row.starter}</td>
                    <td className="py-3.5 text-center text-slate-500">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to manage conversations better?</h2>
          <p className="text-slate-500 text-lg mb-8">Get started today. Setup takes less than 24 hours.</p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold text-base px-10 py-6 rounded-xl shadow-xl shadow-primary/25">
              Start Automating Business <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-slate-400">Official WhatsApp API · No long-term commitment · Cancel anytime</p>
        </div>
      </section>
    </div>
  );
}
