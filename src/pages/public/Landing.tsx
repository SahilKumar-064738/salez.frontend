import { motion } from "framer-motion";
import { ArrowRight, Clock, DollarSign, MessageSquareOff, CheckCircle2, Zap, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PhoneSimulator } from "@/components/PhoneSimulator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Landing() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-white -z-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 space-y-8"
            >
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Never forget to <span className="text-primary">follow up</span> on WhatsApp
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
                Automate your sales follow-ups, payment reminders, and customer re-engagement. Set it once, and let our bots do the heavy lifting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all">
                    See WhatsApp Demo <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
                <span className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-1 text-primary" /> No credit card required</span>
                <span className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-1 text-primary" /> 14-day free trial</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2 flex justify-center lg:justify-end"
            >
              <PhoneSimulator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why businesses lose money on WhatsApp</h2>
            <p className="text-slate-500 text-lg">Manual follow-ups are inconsistent, awkward, and impossible to scale.</p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: MessageSquareOff, title: "Leads go cold", desc: "60% of customers buy from the first responder. Delayed replies mean lost sales." },
              { icon: DollarSign, title: "Payments forgotten", desc: "Chasing payments manually is awkward. Automated reminders get you paid faster." },
              { icon: Clock, title: "Wasted admin time", desc: "Copy-pasting messages takes hours every week. Automation gives you that time back." }
            ].map((feature, i) => (
              <motion.div key={i} variants={item} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to automate growth</h2>
            <p className="text-slate-500 text-lg">Built specifically for small businesses using WhatsApp.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { icon: Zap, title: "Automatic Lead Capture", desc: "Sync leads from Facebook Ads or your website directly into follow-up sequences." },
               { icon: Shield, title: "Smart Rules Engine", desc: "Set conditions: 'If no reply in 24h, send message B'. Totally customizable." },
               { icon: MessageSquareOff, title: "Auto-Stop on Reply", desc: "The moment a customer replies, the bot stops. You take over seamlessly." },
               { icon: DollarSign, title: "Payment Reminders", desc: "Schedule gentle nudges for unpaid invoices without the awkwardness." },
               { icon: Users, title: "Unified Inbox", desc: "Manage all conversations from one dashboard. No more phone-switching." },
               { icon: Clock, title: "Scheduled Broadcasts", desc: "Send offers to 1000s of customers at once (compliant with WhatsApp policy)." }
             ].map((f, i) => (
               <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-all group">
                 <CardHeader>
                   <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                     <f.icon className="h-5 w-5 text-primary" />
                   </div>
                   <CardTitle className="text-lg">{f.title}</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-slate-500 text-sm">{f.desc}</p>
                 </CardContent>
               </Card>
             ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2000&q=80')] opacity-10 mix-blend-overlay bg-cover bg-center" />
        {/* Abstract shapes background image */}

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to automate your sales?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Join 10,000+ businesses saving time and closing more deals with AutoReply.</p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-10 py-7 rounded-xl shadow-2xl shadow-primary/30 transform hover:scale-105 transition-all">
              Start Your 14-Day Free Trial
            </Button>
          </Link>
          <p className="mt-6 text-sm text-slate-400">No credit card required. Cancel anytime.</p>
        </div>
      </section>
    </div>
  );
}
