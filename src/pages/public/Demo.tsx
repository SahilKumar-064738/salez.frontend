import { PhoneSimulator } from "@/components/PhoneSimulator";

export default function Demo() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 flex flex-col items-center">
      <div className="container mx-auto px-4 text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Experience the Automation</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          See how our bot handles a typical customer interaction. Watch the sequence below.
        </p>
      </div>
      
      <div className="scale-90 md:scale-100 transform transition-transform">
        <PhoneSimulator />
      </div>

      <div className="mt-12 container mx-auto px-4 max-w-2xl text-center">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-2">What happened just now?</h3>
          <ol className="text-left space-y-3 text-slate-600 text-sm list-decimal pl-5">
            <li>Customer (You) sent an inquiry.</li>
            <li>System waited 2 minutes (simulated) then sent a brochure.</li>
            <li>System waited 24 hours (simulated) then sent a follow-up.</li>
            <li>When you clicked Reply, automation stopped immediately to let a human take over.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
