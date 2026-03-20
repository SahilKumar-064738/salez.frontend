import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Send, Phone, Video, Menu, ChevronLeft } from "lucide-react";

// ─── Per-industry phone chat sequences ───────────────────────────────────────
interface Msg { id: number; text: string; sender: "user" | "biz"; time: string }

const sequences: Record<string, { contact: string; initials: string; messages: Msg[] }> = {
  clinics: {
    contact: "City Dental Clinic",
    initials: "CD",
    messages: [
      { id: 1, text: "Hi! I'd like to book a dental check-up.", sender: "user", time: "9:02 AM" },
      { id: 2, text: "Hello Priya! 😊 We have a slot open this Thursday at 11 AM with Dr. Mehta. Shall I confirm it for you?", sender: "biz", time: "9:02 AM" },
      { id: 3, text: "Yes please! Thursday works perfectly.", sender: "user", time: "9:03 AM" },
      { id: 4, text: "Done! ✅ Your appointment is confirmed for Thu, 10 Apr at 11:00 AM. We'll send a reminder the day before. See you soon! 🦷", sender: "biz", time: "9:03 AM" },
      { id: 5, text: "Reminder: Your appointment is tomorrow at 11 AM. Reply 1 to confirm or 2 to reschedule.", sender: "biz", time: "Next Day" },
    ],
  },
  coaching: {
    contact: "Apex IAS Academy",
    initials: "AI",
    messages: [
      { id: 1, text: "Hello, I want details about your UPSC batch starting next month.", sender: "user", time: "2:15 PM" },
      { id: 2, text: "Hi Rahul! 🎓 Our new Foundation Batch starts 15 Apr. Only 8 seats left! Fee: ₹45,000 for 12 months. Want me to send the full syllabus PDF?", sender: "biz", time: "2:15 PM" },
      { id: 3, text: "Yes please, and can I get a demo class?", sender: "user", time: "2:16 PM" },
      { id: 4, text: "Absolutely! Free demo class this Saturday at 10 AM — online. Sending Zoom link now 👇\nzoom.us/j/apex-demo-apr\n\nSee you there! 🚀", sender: "biz", time: "2:16 PM" },
      { id: 5, text: "⏰ Reminder: Your free demo class is tomorrow at 10 AM. We're excited to have you!", sender: "biz", time: "Friday" },
    ],
  },
  salons: {
    contact: "Glamour Studio",
    initials: "GS",
    messages: [
      { id: 1, text: "Hi! Do you have any slots available for a haircut this evening?", sender: "user", time: "4:30 PM" },
      { id: 2, text: "Hey Anika! 💇‍♀️ Yes! We have 6:00 PM & 7:30 PM free today with Simran. Which works for you?", sender: "biz", time: "4:30 PM" },
      { id: 3, text: "6 PM would be great!", sender: "user", time: "4:31 PM" },
      { id: 4, text: "Booked! ✨ 6:00 PM today with Simran at Glamour Studio, Koregaon Park. See you in a bit!\n\nP.S. Show this message for 10% off today! 🎁", sender: "biz", time: "4:31 PM" },
      { id: 5, text: "Hope you loved your new look Anika! 🌟 Rate us & get ₹100 off next visit → bit.ly/glamour-review", sender: "biz", time: "8:00 PM" },
    ],
  },
  repairs: {
    contact: "QuickFix Electronics",
    initials: "QF",
    messages: [
      { id: 1, text: "My iPhone screen is cracked. How much to repair?", sender: "user", time: "11:10 AM" },
      { id: 2, text: "Hi Vikram! iPhone screen replacement starts at ₹2,499 and is done in 45 minutes. Drop in anytime — no appointment needed! 📱", sender: "biz", time: "11:10 AM" },
      { id: 3, text: "Great, I'll come in today. Can I get a receipt of job?", sender: "user", time: "11:11 AM" },
      { id: 4, text: "Of course! We'll WhatsApp you the job card when your device is received. You'll also get live status updates. See you soon! 🔧", sender: "biz", time: "11:11 AM" },
      { id: 5, text: "✅ Job #QF-4821 Update: Your iPhone screen repair is COMPLETE. Ready for pickup! Amount due: ₹2,499. Store open till 8 PM.", sender: "biz", time: "1:45 PM" },
    ],
  },
  ecommerce: {
    contact: "StyleCart India",
    initials: "SC",
    messages: [
      { id: 1, text: "Hi! I ordered a jacket but haven't received it in 5 days?", sender: "user", time: "10:15 AM" },
      { id: 2, text: "Hi Sneha! Sorry for the delay 🙏 Your order #SC-8821 is out for delivery today. Track live: stylecart.in/track/8821", sender: "biz", time: "10:15 AM" },
      { id: 3, text: "Got it! Also, can I return the blue one I got last week?", sender: "user", time: "10:16 AM" },
      { id: 4, text: "Of course! Returns are free within 15 days. Just reply RETURN and we'll arrange a pickup tomorrow. 📦", sender: "biz", time: "10:16 AM" },
      { id: 5, text: "🛍️ Flash Sale! 40% OFF on winter jackets — only 6 hrs left. Shop: stylecart.in/sale Your saved items are waiting! ❄️", sender: "biz", time: "8:00 PM" },
    ],
  },
  realestate: {
    contact: "PrimeSpace Realty",
    initials: "PS",
    messages: [
      { id: 1, text: "Hi, I'm interested in 2BHK flats in Wakad under 70L.", sender: "user", time: "3:30 PM" },
      { id: 2, text: "Hi Vikram! Great choice — Wakad is booming 📈 We have 3 options ready for visit. Can I share brochures for Serene Heights & Green Valley?", sender: "biz", time: "3:30 PM" },
      { id: 3, text: "Yes, send both. What's the EMI roughly?", sender: "user", time: "3:31 PM" },
      { id: 4, text: "Sending now! 📄 For ₹65L at 8.5% — EMI ≈ ₹56,000/month. Site visit this Saturday? I'll arrange a cab from your location. 🚗", sender: "biz", time: "3:31 PM" },
      { id: 5, text: "🏠 Vikram — only 2 units left at pre-launch price in Green Valley. Price increases Monday. Shall I reserve your slot? Reply YES.", sender: "biz", time: "Friday" },
    ],
  },
  ca: {
    contact: "CA Rajesh & Associates",
    initials: "RA",
    messages: [
      { id: 1, text: "Hi, I need to file my ITR for FY 2024-25. When's the deadline?", sender: "user", time: "11:00 AM" },
      { id: 2, text: "Hello Priya! Deadline is 31st July 2025 ⚠️ To start, please share: PAN, Form 16, and bank statements for FY24-25. Reply DOCS to get our checklist.", sender: "biz", time: "11:00 AM" },
      { id: 3, text: "DOCS", sender: "user", time: "11:01 AM" },
      { id: 4, text: "📋 Sending your document checklist now. Once received, filing takes 2 business days. Book a 15-min call: calendly.com/carajesh ✅", sender: "biz", time: "11:01 AM" },
      { id: 5, text: "⏰ Reminder: GST return due in 3 days (20th). Upload invoices on portal or reply HELP for assistance. — CA Rajesh & Associates", sender: "biz", time: "17th" },
    ],
  },
  restaurants: {
    contact: "The Spice Garden",
    initials: "SG",
    messages: [
      { id: 1, text: "Hi! I want to book a table for 4 this Saturday evening.", sender: "user", time: "3:00 PM" },
      { id: 2, text: "Hello Neha! 🍽️ Saturday evening looks great. We have 7:30 PM & 8:00 PM available for a table of 4. Any preference?", sender: "biz", time: "3:00 PM" },
      { id: 3, text: "8 PM please. Is the rooftop section available?", sender: "user", time: "3:01 PM" },
      { id: 4, text: "Rooftop it is! 🌟 Table for 4 confirmed at 8:00 PM Saturday on the rooftop. We'll keep it reserved for 15 mins. See you!", sender: "biz", time: "3:01 PM" },
      { id: 5, text: "🌶️ Today's special: Butter Chicken Thali + Garlic Naan at ₹399 only! Order: spicegarden.in/order or reply ORDER 🍛", sender: "biz", time: "Saturday" },
    ],
  },
};

// ─── Phone Simulator ──────────────────────────────────────────────────────────
function IndustryPhone({ industry }: { industry: string }) {
  const data = sequences[industry] || sequences.clinics;
  const [shown, setShown] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx >= data.messages.length) return;
    const msg = data.messages[idx];
    const delay = idx === 0 ? 800 : msg.sender === "biz" ? 1800 : 1200;
    const showTyping = msg.sender === "biz";

    const t1 = setTimeout(() => {
      if (showTyping) setTyping(true);
      const t2 = setTimeout(() => {
        setTyping(false);
        setShown(prev => [...prev, msg]);
        setIdx(i => i + 1);
      }, showTyping ? 1200 : 0);
      return () => clearTimeout(t2);
    }, delay);

    return () => clearTimeout(t1);
  }, [idx, data.messages]);

  // Auto-restart
  useEffect(() => {
    if (idx >= data.messages.length && shown.length > 0) {
      const t = setTimeout(() => { setShown([]); setIdx(0); }, 4000);
      return () => clearTimeout(t);
    }
  }, [idx, shown.length, data.messages.length]);

  return (
    <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[580px] w-[290px] shadow-2xl">
      {/* Notch */}
      <div className="w-[120px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20" />
      {/* Side buttons */}
      <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg" />
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg" />
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg" />
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg" />

      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-[#E5DDD5] flex flex-col">
        {/* WhatsApp header */}
        <div className="bg-[#075E54] text-white px-3 pt-8 pb-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" />
            <div className="bg-emerald-200 rounded-full w-8 h-8 flex items-center justify-center text-emerald-800 font-bold text-xs shrink-0">
              {data.initials}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-none">{data.contact}</span>
              <span className="text-[10px] opacity-75">Business Account ✓</span>
            </div>
          </div>
          <div className="flex gap-3 opacity-80">
            <Video className="h-4 w-4" />
            <Phone className="h-4 w-4" />
            <Menu className="h-4 w-4" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 px-3 py-3 overflow-y-auto space-y-2 bg-[#e5ddd5]">
          <AnimatePresence>
            {shown.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[82%] text-[12.5px] leading-relaxed rounded-xl px-3 py-2 shadow-sm ${
                  msg.sender === "user"
                    ? "bg-[#dcf8c6] rounded-tr-sm text-gray-800"
                    : "bg-white rounded-tl-sm text-gray-800"
                }`}>
                  {msg.text}
                  <div className="text-[9px] text-gray-400 text-right mt-0.5 flex justify-end items-center gap-1">
                    {msg.time}
                    {msg.sender === "user" && <span className="text-[#34b7f1]">✓✓</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white rounded-xl rounded-tl-sm px-4 py-2.5 shadow-sm">
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="bg-[#f0f0f0] px-2 py-2 flex items-center gap-2">
          <div className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-gray-400">Type a message</div>
          <div className="bg-[#075E54] p-2 rounded-full text-white shrink-0">
            <Send className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Config ───────────────────────────────────────────────────────────────────
interface Config { title: string; emoji: string; hero: string; desc: string; useCases: string[]; templates: { name: string; preview: string }[] }

const configs: Record<string, Config> = {
  clinics: {
    title: "Clinics & Healthcare", emoji: "🏥",
    hero: "Never miss a patient again",
    desc: "Automate appointment reminders, follow-ups, and health tips for your clinic on WhatsApp.",
    useCases: ["Appointment confirmations & reminders", "Prescription ready notifications", "Post-visit follow-ups", "Lab report delivery", "No-show reduction by 60%", "Health tips broadcasts"],
    templates: [
      { name: "Appointment Reminder", preview: "Hello Priya! Your appointment with Dr. Mehta is confirmed for Thursday at 11:00 AM. Reply 1 to confirm or 2 to reschedule. 🏥" },
      { name: "Prescription Ready", preview: "Good news Ankit! Your prescription is ready for pickup at City Dental. We're open Mon–Sat, 9 AM – 8 PM. See you soon! 💊" },
      { name: "Post-Visit Follow-up", preview: "Hi Sunita, hope you're feeling better after yesterday's visit! Any concerns? We're just a message away. Your health matters to us. 😊" },
    ],
  },
  coaching: {
    title: "Coaching Centres", emoji: "🎓",
    hero: "Fill every batch, every time",
    desc: "Convert leads, send class schedules, and keep students engaged through WhatsApp automation.",
    useCases: ["Lead follow-up sequences", "Class schedule & Zoom link updates", "Fee payment reminders", "Result announcements", "Batch enrollment broadcasts", "Free demo class invites"],
    templates: [
      { name: "Batch Enrollment", preview: "Hi Rahul! Our UPSC Foundation Batch starts 15 Apr — only 8 seats left! Includes study material, mock tests & mentorship. Reply JOIN to enroll. 🎓" },
      { name: "Class Reminder", preview: "📚 Reminder: Today's class — Indian Polity at 6:00 PM on Zoom. Link: zoom.us/apex-live. Don't be late, Meera — attendance matters!" },
      { name: "Fee Reminder", preview: "Hi Arjun, your monthly fee of ₹3,500 is due on 5th April. Pay via UPI: apex@upi and send screenshot here. Thank you! 🙏" },
    ],
  },
  salons: {
    title: "Salons & Beauty", emoji: "💇",
    hero: "Keep your chair always booked",
    desc: "Send appointment reminders, offer loyalty rewards, and fill last-minute slots via WhatsApp.",
    useCases: ["Booking confirmations", "Appointment reminders", "Last-minute slot offers", "Loyalty point updates", "New service launch alerts", "Review & referral requests"],
    templates: [
      { name: "Booking Confirmed", preview: "Booked! ✨ Anika, your appointment with Simran is set for Today at 6:00 PM at Glamour Studio, Koregaon Park. Show this for 10% off! 💇‍♀️" },
      { name: "Last Minute Slot", preview: "Psst! Divya, we just had a cancellation — 4:30 PM today is open! Want to grab it for a blowout or manicure? Reply YES in the next hour! 💅" },
      { name: "Loyalty Reward", preview: "Congrats Riya! 🎉 You've earned 500 loyalty points. Redeem for ₹200 off your next visit. Valid till 30th April. Book: glamour.in/book" },
    ],
  },
  repairs: {
    title: "Repair Shops", emoji: "🔧",
    hero: "Keep customers updated, always",
    desc: "Send repair status updates, ready alerts, and collect reviews automatically on WhatsApp.",
    useCases: ["Job received confirmation", "Repair status updates", "Ready for pickup alerts", "Payment collection via UPI", "Warranty reminder broadcasts", "Review collection"],
    templates: [
      { name: "Job Received", preview: "Hi Vikram! We've received your iPhone 14 for screen repair. Job ID: QF-4821. Estimated time: 45 minutes. We'll WhatsApp you when it's done! 📱" },
      { name: "Ready for Pickup", preview: "✅ Great news Karan! Your MacBook is repaired and ready for pickup. Amount due: ₹3,200. Store open till 8 PM. See you soon! 🙌" },
      { name: "Warranty Reminder", preview: "Hi Sneha! Your phone repair warranty expires in 7 days (10 Apr). Any issues? Come in for a free check. QuickFix, MG Road — open daily 10–8. 🔧" },
    ],
  },
  restaurants: {
    title: "Restaurants & Food", emoji: "🍽️",
    hero: "Turn one-time diners into regulars",
    desc: "Send table confirmations, daily specials, and loyalty offers to your customers via WhatsApp.",
    useCases: ["Table booking confirmations", "Daily specials broadcast", "Order ready alerts", "Loyalty reward updates", "Feedback & review collection", "Event & special night invites"],
    templates: [
      { name: "Reservation Confirmed", preview: "Rooftop confirmed! 🌟 Neha, your table for 4 is reserved this Saturday at 8:00 PM at The Spice Garden. We'll hold it for 15 mins. See you! 🍽️" },
      { name: "Daily Special", preview: "🌶️ Today's Special at The Spice Garden: Butter Chicken Thali + Garlic Naan for just ₹399! Dine-in or order: spicegarden.in/order 🍛" },
      { name: "Loyalty Reward", preview: "You're our star, Pooja! ⭐ You've dined with us 10 times — enjoy a FREE dessert on your next visit! Valid till Sunday. Show this message. 🎂" },
    ],
  },
  ecommerce: {
    title: "E-Commerce Stores", emoji: "🛍️",
    hero: "Turn browsers into buyers, automatically",
    desc: "Recover abandoned carts, send order updates, and run flash sales directly on WhatsApp.",
    useCases: ["Abandoned cart recovery", "Order confirmation & tracking", "Delivery status updates", "Flash sale broadcasts", "Return & refund automation", "Review collection after delivery"],
    templates: [
      { name: "Abandoned Cart", preview: "Hey Sneha! 👋 You left 2 items in your cart. Your Floral Kurti (Size M) is still waiting! Tap to complete your order: stylecart.in/cart 🛒 Use code SAVE10 for 10% off!" },
      { name: "Order Shipped", preview: "📦 Your order #SC-8821 is on its way! Expected delivery: Tomorrow by 8 PM. Track live: stylecart.in/track/8821. Any questions? Just reply here!" },
      { name: "Flash Sale Alert", preview: "⚡ 4-HOUR FLASH SALE! 40% OFF on winter collection — ends at midnight. Your saved items are included! Shop now: stylecart.in/sale ❄️ Don't miss it!" },
    ],
  },
  realestate: {
    title: "Real Estate Agents", emoji: "🏠",
    hero: "Close more deals, miss fewer leads",
    desc: "Follow up instantly on enquiries, share property brochures, and book site visits via WhatsApp.",
    useCases: ["Instant lead response", "Property brochure sharing", "Site visit scheduling", "EMI & loan calculator sharing", "Price drop alerts", "Booking follow-up sequences"],
    templates: [
      { name: "Lead Follow-Up", preview: "Hi Vikram! 🏡 Thanks for your interest in 2BHK flats in Wakad. We have 3 ready-to-move options under ₹70L. Can I send you brochures + virtual tour links?" },
      { name: "Site Visit Reminder", preview: "Reminder: Your site visit for Green Valley Phase 2 is tomorrow at 11 AM 📍 Address: Baner-Pashan Link Rd. I'll pick you up from Baner Metro — shall I confirm? 🚗" },
      { name: "Price Drop Alert", preview: "🔔 Price Drop! The 2BHK you liked at Serene Heights dropped from ₹68L to ₹63L — only 2 units left at this price. Shall I reserve one for you? Valid 48 hrs only." },
    ],
  },
  ca: {
    title: "Chartered Accountants", emoji: "📊",
    hero: "Automate compliance, delight clients",
    desc: "Send tax reminders, collect documents, book appointments, and follow up on pending filings automatically.",
    useCases: ["ITR filing reminders", "GST return due date alerts", "Document collection requests", "Appointment booking & reminders", "Follow-up on pending submissions", "Advance tax payment reminders"],
    templates: [
      { name: "ITR Filing Reminder", preview: "⚠️ ITR Deadline Reminder: Only 15 days left to file your Income Tax Return (FY 2024-25). Please share Form 16 + bank statements to start. Reply DOCS for checklist. — CA Rajesh & Associates" },
      { name: "Document Request", preview: "Hi Priya! For your GST filing this month, please share: Sales invoices, Purchase invoices, Bank statement. You can WhatsApp photos here directly. Deadline: 20th June 📋" },
      { name: "Appointment Booking", preview: "Hi! Book a 15-min consultation with CA Rajesh for tax planning, ITR queries, or business registration. Available slots this week: Tue 4PM, Thu 11AM, Fri 3PM. Reply preferred slot. 📅" },
    ],
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TemplateLanding({ industry }: { industry: string }) {
  const c = configs[industry] || configs.clinics;

  return (
    <div className="py-16 px-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">{c.emoji}</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{c.hero}</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">{c.desc}</p>
          <Link href="/auth/signup" className="mt-8 inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Use these templates free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Phone + Use Cases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Phone simulator */}
          <div className="flex justify-center">
            <IndustryPhone key={industry} industry={industry} />
          </div>

          {/* Use cases */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Perfect for {c.title}</h2>
            <ul className="space-y-3 mb-8">
              {c.useCases.map(u => (
                <li key={u} className="flex items-center gap-3 text-slate-600">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />{u}
                </li>
              ))}
            </ul>
            <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Sample templates with WhatsApp bubble style */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Ready-to-use message templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {c.templates.map(t => (
              <div key={t.name} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                {/* Mini phone chrome */}
                <div className="bg-[#075E54] rounded-t-xl px-3 py-2 flex items-center gap-2 -mx-5 -mt-5 mb-4 rounded-tl-2xl rounded-tr-2xl">
                  <div className="bg-emerald-200 rounded-full w-6 h-6 flex items-center justify-center text-emerald-800 font-bold text-[9px]">
                    {c.title.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-white text-xs font-semibold">{c.contact || c.title}</span>
                </div>
                <p className="text-xs font-semibold text-slate-500 mb-2">{t.name}</p>
                <div className="bg-[#dcf8c6] rounded-xl rounded-tl-sm p-3 text-sm text-gray-800 shadow-sm">
                  {t.preview}
                  <div className="text-[10px] text-gray-400 text-right mt-1">11:30 AM ✓✓</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to automate your {c.title.toLowerCase()}?</h2>
          <p className="text-slate-500 mb-6">Set up in 10 minutes. No technical skills needed.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/signup" className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">Start free trial</Link>
            <Link href="/pricing" className="border border-slate-200 bg-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors">View pricing</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
