import { Link } from "wouter";
import { CheckCircle2, ShieldCheck, ArrowRight, BadgeCheck } from "lucide-react";

const steps = [
  { n: "1", title: "Create Meta Business Account", desc: "Go to business.facebook.com and create your verified business account using your GST or business registration documents." },
  { n: "2", title: "Set Up WhatsApp Business API", desc: "In Meta Business Suite, navigate to WhatsApp Manager and add your phone number. Verify via SMS or voice call." },
  { n: "3", title: "Submit for Business Verification", desc: "Upload your business documents for Meta verification. This usually takes 2–5 business days." },
  { n: "4", title: "Connect to AutoReply", desc: "Once verified, copy your WhatsApp Business Account ID and access token, then paste them in your AutoReply settings." },
];

export default function MetaVerification() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <BadgeCheck className="h-4 w-4" /> Meta Official Partner
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Get WhatsApp Business API Verified</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">Follow these 4 steps to connect your verified WhatsApp number to AutoReply.</p>
        </div>

        <div className="space-y-4 mb-14">
          {steps.map(s => (
            <div key={s.n} className="flex gap-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="bg-primary text-white rounded-xl w-10 h-10 flex items-center justify-center font-bold text-lg shrink-0">{s.n}</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-8 mb-10 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Documents Required
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["GST registration certificate","Company PAN card","Business registration certificate","Utility bill (not older than 3 months)","Government-issued photo ID of director","Business bank statement"].map(d => (
              <div key={d} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />{d}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Already verified? Start using AutoReply today</h2>
          <p className="text-slate-500 mb-6">Connect your verified WhatsApp number and start broadcasting in minutes.</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
