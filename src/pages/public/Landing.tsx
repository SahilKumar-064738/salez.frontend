import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Clock, TrendingUp, CheckCircle2, Zap, Shield,
  Users, Bot, Megaphone, LineChart, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PhoneSimulator } from "@/components/PhoneSimulator";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const stats = [
  { value: "3–5 hrs", label: "Saved daily per business" },
  { value: "< 1 min", label: "Average first response time" },
  { value: "20–40%", label: "Typical conversion increase" },
  { value: "24/7", label: "Automated availability" },
];

const features = [
  { icon: Bot, title: "Auto Replies", desc: "Keyword triggers, FAQ bots, lead capture — your business responds instantly, even at 2 AM." },
  { icon: Megaphone, title: "Broadcast Campaigns", desc: "Send bulk messages to your full contact list with CSV upload, scheduling, and delivery tracking." },
  { icon: Zap, title: "Workflow Builder", desc: "Visual automation flows. 'If no reply in 24h → send follow-up.' Drag, drop, done." },
  { icon: LineChart, title: "Analytics Dashboard", desc: "Open rates, response rates, conversion metrics — see exactly what's working." },
  { icon: Users, title: "Unified Inbox", desc: "All WhatsApp conversations in one place. One-click handoff from bot to human." },
  { icon: Shield, title: "Auto-Stop on Reply", desc: "Bot stops the moment a customer responds. You take over seamlessly, every time." },
];

const templates = [
  { industry: "E-Commerce", emoji: "🛍️", href: "/templates/ecommerce", color: "border-orange-200 hover:border-orange-400", tags: ["Abandoned Cart", "Order Updates", "Flash Sales", "Returns"] },
  { industry: "Coaching", emoji: "🎓", href: "/templates/coaching", color: "border-purple-200 hover:border-purple-400", tags: ["Lead Nurture", "Session Reminders", "Batch Enrollment", "Fee Reminders"] },
  { industry: "Real Estate", emoji: "🏠", href: "/templates/realestate", color: "border-blue-200 hover:border-blue-400", tags: ["Site Visits", "Follow-ups", "Price Alerts", "EMI Sharing"] },
  { industry: "CA / Accounting", emoji: "📊", href: "/templates/ca", color: "border-green-200 hover:border-green-400", hot: true, tags: ["Tax Reminders", "Document Requests", "GST Alerts", "Appointments"] },
];

const faqs = [
  { q: "Do I need a WhatsApp Business API account?", a: "Yes. AutoReply connects to the official WhatsApp Business API. We guide you through verification — most businesses are live within 24 hours." },
  { q: "Is bulk messaging allowed by WhatsApp?", a: "Yes. We only use official, WhatsApp-approved API methods. No grey-area tools, no risk of account ban." },
  { q: "What industries is this best for?", a: "Any business that manages leads or repeat customers via WhatsApp: e-commerce, real estate, coaching, clinics, CA firms, salons, repair shops, and more." },
  { q: "Can I cancel anytime?", a: "Yes. No long-term contracts. Cancel from your billing page at any time — effective at the end of your billing period." },
  { q: "How is AutoReply different from just using WhatsApp Business App?", a: "WhatsApp Business App is manual — you reply yourself. AutoReply adds automation, broadcast campaigns, analytics, and a unified inbox so your business can scale without adding headcount." },
];

export default function Landing() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50/30 -z-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/40 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div initial="hidden" animate="show" variants={stagger} className="lg:w-1/2 space-y-7">
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full border border-green-200">
                  <Zap className="h-3.5 w-3.5" /> WhatsApp and Call Automation for Indian Businesses
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
                Automate your{" "}
                <br />
                <span className="text-primary">Business</span>{" "}
                and{" "}
                <br />  
                <span className="relative inline-block">
                  grow faster
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 9C50 3 100 1 150 2C200 3 250 7 298 9" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-xl text-slate-500 leading-relaxed max-w-lg">
                Save 3–5 hours daily. Never miss a lead again. AutoReply handles follow-ups, broadcasts, and customer engagement — all on autopilot.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="text-base px-8 py-6 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 hover:-translate-y-0.5 transition-all font-bold">
                    Start Automating Business <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" size="lg" className="text-base px-8 py-6 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700">
                    Watch Demo
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Setup in 24 hours</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Official WhatsApp API</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Cancel anytime</span>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.2 }} className="lg:w-1/2 flex justify-center lg:justify-end">
              <PhoneSimulator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-white py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="text-3xl font-extrabold text-slate-900">{s.value}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Why businesses lose customers</h2>
            <p className="text-slate-500 text-lg">Manual follow-ups are slow, inconsistent, and impossible to scale.</p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8">
            {[
              { emoji: "❌", title: "Leads go cold", desc: "60% of customers buy from whoever responds first. Every delayed reply hands the sale to a competitor." },
              { emoji: "😓", title: "Hours wasted daily", desc: "Copy-pasting messages, chasing payments, booking appointments manually — this is not how you grow." },
              { emoji: "💸", title: "Revenue leaks silently", desc: "Most businesses follow up with less than 20% of leads. The other 80% just disappear." },
            ].map((p, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{p.emoji}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{p.title}</h3>
                <p className="text-slate-500 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── VALUE PROPS ────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Real impact, from day one</h2>
            <p className="text-slate-500 text-lg">Here's what changes when you automate your WhatsApp.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {[
              { icon: Clock, color: "from-blue-500 to-blue-600", bg: "bg-blue-50", stat: "3–5 hrs", label: "saved every day", title: "Reclaim your time", desc: "Stop manually copy-pasting messages. Automate replies, reminders, and follow-ups across every customer — without lifting a finger.", bullets: ["Auto-reply to common queries instantly", "Scheduled follow-ups run themselves", "Bulk broadcasts take 2 minutes, not 2 hours"] },
              { icon: TrendingUp, color: "from-green-500 to-green-600", bg: "bg-green-50", stat: "20–40%", label: "more conversions", title: "Grow revenue faster", desc: "Speed wins deals. Instant replies mean more leads convert before they cool down. Organised follow-ups mean nothing slips through.", bullets: ["First response in under 60 seconds", "Automated sequences nurture leads 24/7", "Organised pipeline = no lost opportunities"] },
            ].map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden p-8">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${v.color}`} />
                <div className={`inline-flex items-center justify-center w-12 h-12 ${v.bg} rounded-xl mb-5`}>
                  <v.icon className="h-6 w-6 text-slate-700" />
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-extrabold text-slate-900">{v.stat}</span>
                  <span className="text-slate-400 text-sm">{v.label}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-6">{v.desc}</p>
                <ul className="space-y-2.5">
                  {v.bullets.map((b, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />{b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Everything you need to manage WhatsApp at scale</h2>
            <p className="text-slate-500 text-lg">Built for Indian small businesses. Plug in and go live in hours, not weeks.</p>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TEMPLATES ──────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Industry templates, ready to launch</h2>
            <p className="text-slate-500 text-lg">Don't start from scratch. Pick your industry and go live in minutes.</p>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((t, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Link href={t.href}>
                  <div className={`relative bg-white rounded-2xl border-2 ${t.color} p-6 cursor-pointer hover:shadow-lg transition-all group h-full`}>
                    {t.hot && (
                      <span className="absolute -top-2.5 left-4 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">High Demand</span>
                    )}
                    <div className="text-4xl mb-3">{t.emoji}</div>
                    <h3 className="font-bold text-slate-900 mb-3">{t.industry}</h3>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {t.tags.map((tag, j) => (
                        <span key={j} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center text-sm font-semibold text-primary group-hover:gap-2 gap-1 transition-all">
                      View templates <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING TEASER ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 rounded-full border border-orange-200 mb-6">
              🔥 Limited Time — 50% OFF First Month
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Start from just{" "}
              <span className="line-through text-slate-400 text-2xl">₹4000</span>{" "}
              <span className="text-primary">₹1999/month</span>
            </h2>
            <p className="text-slate-500 text-lg mb-8">Full automation. Broadcast. Analytics. No hidden fees.</p>
            <Link href="/pricing">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold text-base px-10 py-6 rounded-xl shadow-xl shadow-primary/25">
                See All Plans <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Frequently asked questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <button className="w-full flex items-center justify-between px-6 py-4 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="font-semibold text-slate-900 text-sm">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform shrink-0 ml-4 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">{faq.a}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="py-28 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              Manage conversations better.<br />
              <span className="text-primary">Close more leads faster.</span>
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Set up AutoReply in under 24 hours and start automating the conversations that drive your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-12 py-7 rounded-xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                  Start Automating Business <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 font-semibold text-lg px-8 py-7 rounded-xl">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-400">Official WhatsApp API · Setup in 24 hours · Cancel anytime</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
