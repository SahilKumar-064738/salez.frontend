import { Link } from "wouter";
import { MessageCircle, Users, Globe, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <div className="bg-primary rounded-2xl p-4 inline-block mb-4">
            <MessageCircle className="h-10 w-10 text-white fill-current" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900">About AutoReply</h1>
          <p className="mt-3 text-slate-500 text-lg">We help small businesses grow through the power of WhatsApp automation.</p>
        </div>

        <div className="space-y-5 text-slate-600 text-base leading-relaxed">
          <p>AutoReply was founded with a simple idea: <strong className="text-slate-900">every business already uses WhatsApp</strong>. The challenge is turning those chats into a scalable, automated sales and CRM system.</p>
          <p>We built AutoReply as the most affordable, easiest-to-use WhatsApp CRM designed for clinics, coaching centres, salons, repair shops, and other local businesses that want to grow without hiring a large team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {[
            { icon: Users,  title: "10,000+ businesses",   desc: "Active businesses using AutoReply across India" },
            { icon: Globe,  title: "50M+ messages sent",   desc: "WhatsApp messages delivered through our platform" },
            { icon: Heart,  title: "4.9★ rating",          desc: "Average rating from users across all plans" },
          ].map(s => (
            <div key={s.title} className="bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm">
              <div className="bg-green-50 rounded-xl p-3 inline-block mb-3">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
              <p className="text-sm text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Join thousands of growing businesses</h2>
          <p className="text-slate-500 mb-6">Start your 14-day free trial — no credit card required.</p>
          <Link href="/auth/signup" className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors inline-block">
            Get started free
          </Link>
        </div>
      </div>
    </div>
  );
}
