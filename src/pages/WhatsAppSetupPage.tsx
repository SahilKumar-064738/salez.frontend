import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, X, Plus, Trash2, ChevronDown, CheckCircle2, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────
interface TeamMember { id: number; name: string; role: string; specialization: string; contact: string; }
interface PriceItem  { id: number; service: string; price: string; note: string; }
interface FaqItem    { id: number; question: string; answer: string; }

// ── CalendarPicker ────────────────────────────────────────────────────────────
function CalendarPicker({
  value, onChange, placeholder = "Pick a date", minDate,
}: {
  value?: Date; onChange: (d?: Date) => void; placeholder?: string; minDate?: Date;
}) {
  const [open, setOpen] = React.useState(false);
  const label = value ? format(value, "dd MMM yyyy") : placeholder;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-9 px-3 gap-2 rounded-xl focus-ring",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 opacity-60" />
          <span className="flex-1 truncate">{label}</span>
          {value && (
            <span
              onClick={(e) => { e.stopPropagation(); onChange(undefined); }}
              className="ml-auto opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 shadow-xl rounded-2xl overflow-hidden" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => { onChange(d); setOpen(false); }}
          disabled={minDate ? (d) => d < minDate : undefined}
          initialFocus
          className="rounded-2xl"
        />
      </PopoverContent>
    </Popover>
  );
}

// ── TagInput ──────────────────────────────────────────────────────────────────
function TagInput({ tags, onChange, placeholder }: { tags: string[]; onChange: (tags: string[]) => void; placeholder: string }) {
  const [input, setInput] = React.useState("");
  const ref = React.useRef<HTMLInputElement>(null);

  const addTag = (val: string) => {
    const v = val.replace(/,/g, "").trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput("");
  };

  return (
    <div
      className="flex flex-wrap gap-1.5 items-center min-h-[38px] px-3 py-1.5 border border-input rounded-xl cursor-text bg-background focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary"
      onClick={() => ref.current?.focus()}
    >
      {tags.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded-md px-2 py-0.5 text-xs font-medium">
          {t}
          <button type="button" onClick={() => onChange(tags.filter(x => x !== t))} className="hover:text-destructive">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        ref={ref}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(input); }
          if (e.key === "Backspace" && !input && tags.length) onChange(tags.slice(0, -1));
        }}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="outline-none border-none bg-transparent text-sm min-w-[120px] flex-1"
      />
    </div>
  );
}

// ── ServiceRow ────────────────────────────────────────────────────────────────
function ServiceRow({ title, desc, subs, checked, onCheck }: {
  title: string; desc: string; subs: string[]; checked: boolean;
  onCheck: (v: boolean) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);

  const toggleSub = (s: string) =>
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  return (
    <div className="border border-input rounded-xl overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors"
        onClick={() => { setOpen(!open); if (!open) onCheck(true); }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => { e.stopPropagation(); onCheck(e.target.checked); setOpen(e.target.checked); }}
          className="accent-primary w-4 h-4 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </div>
      {open && (
        <div className="px-4 pb-3 pt-1 bg-muted/20 border-t border-input grid grid-cols-1 sm:grid-cols-2 gap-1">
          {subs.map(s => (
            <label key={s} className="flex items-center gap-2 text-sm py-1 cursor-pointer text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={selected.includes(s)}
                onChange={() => toggleSub(s)}
                className="accent-primary w-3.5 h-3.5"
              />
              {s}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Stepper ────────────────────────────────────────────────────────────────────
const STEPS = [
  "Business Identity", "Location & Hours", "Contact Details",
  "Team & People", "Services", "Pricing",
  "Documents Required", "Policies", "FAQs", "Review & Submit",
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function WhatsAppSetupPage() {
  const [step, setStep] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Step 1
  const [bizName, setBizName] = React.useState("");
  const [legalName, setLegalName] = React.useState("");
  const [industries, setIndustries] = React.useState<string[]>([]);
  const [regNo, setRegNo] = React.useState("");
  const [estYear, setEstYear] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const [language, setLanguage] = React.useState("English");

  // Step 2
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [pincode, setPincode] = React.useState("");
  const [country, setCountry] = React.useState("India");
  const [mapsUrl, setMapsUrl] = React.useState("");
  const [hours, setHours] = React.useState("");
  const [closed, setClosed] = React.useState("");
  const [branches, setBranches] = React.useState("");

  // Step 3
  const [phone1, setPhone1] = React.useState("");
  const [whatsapp, setWhatsapp] = React.useState("");
  const [phone2, setPhone2] = React.useState("");
  const [email1, setEmail1] = React.useState("");
  const [email2, setEmail2] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [instagram, setInstagram] = React.useState("");
  const [social2, setSocial2] = React.useState("");

  // Step 4
  const [ownerName, setOwnerName] = React.useState("");
  const [ownerRole, setOwnerRole] = React.useState("");
  const [quals, setQuals] = React.useState<string[]>([]);
  const [specs, setSpecs] = React.useState<string[]>([]);
  const [team, setTeam] = React.useState<TeamMember[]>([]);

  // Step 5
  const [svcChecked, setSvcChecked] = React.useState<Record<string, boolean>>({});
  const [customSvcs, setCustomSvcs] = React.useState<string[]>([]);

  // Step 6
  const [prices, setPrices] = React.useState<PriceItem[]>([{ id: Date.now(), service: "", price: "", note: "" }]);
  const [discount, setDiscount] = React.useState("");
  const [bundle, setBundle] = React.useState("");
  const [priceNote, setPriceNote] = React.useState("");

  // Step 7
  const [checkedDocs, setCheckedDocs] = React.useState<string[]>([]);
  const [customDocs, setCustomDocs] = React.useState<string[]>([]);

  // Step 8
  const [payTerms, setPayTerms] = React.useState("");
  const [refund, setRefund] = React.useState("");
  const [privacy, setPrivacy] = React.useState("");
  const [turnaround, setTurnaround] = React.useState("");
  const [otherPolicy, setOtherPolicy] = React.useState("");

  // Step 9
  const [faqs, setFaqs] = React.useState<FaqItem[]>([
    { id: 1, question: "", answer: "" },
    { id: 2, question: "", answer: "" },
  ]);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const INDUSTRY_OPTIONS = [
    { value: "healthcare", label: "🏥 Healthcare / Clinic" },
    { value: "coaching", label: "🎓 Coaching / Education" },
    { value: "ca_finance", label: "📊 CA / Finance / Legal" },
    { value: "realestate", label: "🏠 Real Estate" },
    { value: "ecommerce", label: "🛍️ E-Commerce / Retail" },
    { value: "salon_beauty", label: "💇 Salon / Beauty / Spa" },
    { value: "repair_tech", label: "🔧 Repair / Technical" },
    { value: "restaurant_food", label: "🍽️ Restaurant / Food" },
    { value: "fitness_wellness", label: "💪 Fitness / Wellness" },
    { value: "travel_events", label: "✈️ Travel / Events" },
    { value: "freelance", label: "💼 Freelance / Agency" },
    { value: "other", label: "➕ Other" },
  ];

  const SERVICES = [
    { key: "A", title: "Consultations / Appointments", desc: "Booking, scheduling, follow-ups", subs: ["Initial consultation", "Follow-up visits", "Online / video consultations", "Group sessions / workshops", "Emergency / same-day appointments"] },
    { key: "B", title: "Product / Service Delivery", desc: "Orders, deliveries, job tracking", subs: ["Order confirmation & tracking", "Delivery status updates", "Job completion alerts", "Return & refund processing", "Warranty & after-service"] },
    { key: "C", title: "Compliance & Documentation", desc: "Filings, renewals, document collection", subs: ["Document collection requests", "Filing deadline reminders", "Renewal alerts", "Status update notifications", "Certificate / report delivery"] },
    { key: "D", title: "Sales & Lead Management", desc: "Enquiries, follow-ups, conversions", subs: ["New lead auto-response", "Follow-up sequences", "Quotation / proposal sharing", "Abandoned cart recovery", "Upsell / cross-sell campaigns"] },
    { key: "E", title: "Payments & Finance", desc: "Invoices, reminders, confirmations", subs: ["Payment due reminders", "Invoice sharing", "Payment confirmation receipts", "EMI reminders", "Refund status updates"] },
    { key: "F", title: "Marketing & Engagement", desc: "Offers, broadcasts, loyalty", subs: ["Promotional broadcasts", "Festival / seasonal offers", "Loyalty reward updates", "Review / feedback requests", "Referral campaigns"] },
  ];

  const DOC_OPTIONS = [
    "Government ID (Aadhaar / PAN)", "Passport / Visa", "Address Proof",
    "Bank Statements", "Income / Salary Proof", "Photos / Images",
    "Medical Reports", "Previous Reports / Records", "Product / Item (for repair)",
    "Agreement / Contract", "Property Documents", "Business Registration Proof",
  ];

  const toggleDoc = (d: string) =>
    setCheckedDocs(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const addTeam = () => setTeam(prev => [...prev, { id: Date.now(), name: "", role: "", specialization: "", contact: "" }]);
  const updateTeam = (id: number, field: keyof TeamMember, val: string) =>
    setTeam(prev => prev.map(t => t.id === id ? { ...t, [field]: val } : t));
  const removeTeam = (id: number) => setTeam(prev => prev.filter(t => t.id !== id));

  const addPrice = () => setPrices(prev => [...prev, { id: Date.now(), service: "", price: "", note: "" }]);
  const updatePrice = (id: number, field: keyof PriceItem, val: string) =>
    setPrices(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p));
  const removePrice = (id: number) => setPrices(prev => prev.filter(p => p.id !== id));

  const addFaq = () => setFaqs(prev => [...prev, { id: Date.now(), question: "", answer: "" }]);
  const updateFaq = (id: number, field: keyof FaqItem, val: string) =>
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, [field]: val } : f));
  const removeFaq = (id: number) => setFaqs(prev => prev.filter(f => f.id !== id));

  const buildJSON = () => ({
    business_identity: { business_name: bizName, legal_name: legalName, industries, registration_number: regNo, established_year: estYear, tagline, communication_language: language },
    location: { address, city, state, pincode, country, google_maps_url: mapsUrl, office_hours: hours, closed_on: closed, branches: branches || null },
    contact_details: { phone: { primary: phone1, secondary: phone2 }, whatsapp, email: { general: email1, support: email2 }, website, social: { instagram, other: social2 } },
    key_people: { owner: { name: ownerName, role: ownerRole, qualifications: quals, specializations: specs }, team: team.filter(t => t.name) },
    services: { categories: Object.fromEntries(Object.entries(svcChecked).filter(([,v]) => v)), custom_services: customSvcs },
    pricing: { packages: prices.filter(p => p.service), discounts: discount, bundle_deals: bundle, notes: priceNote },
    documents_required: [...checkedDocs, ...customDocs],
    policies: { payment_terms: payTerms, cancellation_refund: refund, privacy_confidentiality: privacy, turnaround_time: turnaround, other: otherPolicy },
    faqs: faqs.filter(f => f.question),
    meta: { generated_at: new Date().toISOString(), schema_version: "2.0", platform: "AutoReply" },
  });

  const jsonStr = React.useMemo(() => JSON.stringify(buildJSON(), null, 2), [
    bizName, legalName, industries, regNo, estYear, tagline, language,
    address, city, state, pincode, country, mapsUrl, hours, closed, branches,
    phone1, whatsapp, phone2, email1, email2, website, instagram, social2,
    ownerName, ownerRole, quals, specs, team,
    svcChecked, customSvcs,
    prices, discount, bundle, priceNote,
    checkedDocs, customDocs,
    payTerms, refund, privacy, turnaround, otherPolicy,
    faqs,
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  // ── Field wrapper ────────────────────────────────────────────────────────────
  const Field = ({ label, hint, children, full }: { label: string; hint?: string; children: React.ReactNode; full?: boolean }) => (
    <div className={cn("flex flex-col gap-1.5", full && "col-span-full")}>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      {hint && <p className="text-[11px] text-muted-foreground -mt-1">{hint}</p>}
      {children}
    </div>
  );

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center rise-in">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-3xl mx-auto mb-5">✅</div>
        <h2 className="text-2xl font-bold mb-2">Your automation is ready!</h2>
        <p className="text-muted-foreground mb-6 text-sm max-w-sm mx-auto">We've received your business profile. Your WhatsApp automation will be live within 24 hours. We'll message you on WhatsApp to confirm.</p>
        <div className="flex gap-3 justify-center flex-wrap mb-6">
          <Button variant="outline" className="rounded-xl" onClick={() => setSubmitted(false)}>← Set Up Another</Button>
        </div>
        <div className="text-left">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Generated JSON</p>
            <Button variant="outline" size="sm" className="rounded-xl gap-2" onClick={handleCopy}>
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <pre className="rounded-2xl bg-[#0d1117] text-[#9eceff] text-[11.5px] leading-relaxed p-4 overflow-auto max-h-80 font-mono">{jsonStr}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 py-6 rise-in" data-testid="page-whatsapp-setup">

      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-primary/20 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          WhatsApp Automation Setup
        </div>
        <h1 className="text-2xl font-bold">Set Up Your Business Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Works for any industry · Takes about 5 minutes · Your data personalises every automated message.</p>
      </div>

      {/* Card */}
      <Card className="rounded-2xl border-card-border shadow-sm overflow-hidden">

        {/* Progress bar */}
        <div className="px-5 pt-5 pb-0 border-b border-card-border bg-card/60 backdrop-blur">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Step {step + 1} of {STEPS.length} — {STEPS[step]}</span>
            <span className="text-xs font-semibold text-primary">{pct}%</span>
          </div>
          <div className="h-1 bg-muted rounded-full mb-4">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>

          {/* Step tabs — scrollable */}
          <div className="flex overflow-x-auto gap-0 scrollbar-none -mx-5 px-5 pb-0">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(i)}
                className={cn(
                  "flex-shrink-0 text-[11px] font-medium px-3 py-2 border-b-2 transition-all whitespace-nowrap",
                  i === step
                    ? "border-primary text-primary"
                    : i < step
                    ? "border-transparent text-green-500"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {i + 1}. {s}
              </button>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="p-5 space-y-4">

          {/* ── STEP 0: Business Identity ── */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Business Identity</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Basic information about your business. This appears in every automated client message.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Business / Brand Name *">
                  <Input value={bizName} onChange={e => setBizName(e.target.value)} placeholder="e.g. Apex Consultants, City Clinic" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Legal Registered Name (if different)">
                  <Input value={legalName} onChange={e => setLegalName(e.target.value)} placeholder="As on registration documents" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Industry / Business Type *" hint="Select all that apply" full>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                    {INDUSTRY_OPTIONS.map(opt => (
                      <label key={opt.value} className={cn(
                        "flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer text-xs font-medium transition-all",
                        industries.includes(opt.value) ? "border-primary bg-primary/10 text-primary" : "border-input hover:border-primary/50 text-muted-foreground"
                      )}>
                        <input
                          type="checkbox"
                          checked={industries.includes(opt.value)}
                          onChange={() => setIndustries(prev => prev.includes(opt.value) ? prev.filter(x => x !== opt.value) : [...prev, opt.value])}
                          className="accent-primary w-3.5 h-3.5"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </Field>
                <Field label="Registration / License No. (optional)">
                  <Input value={regNo} onChange={e => setRegNo(e.target.value)} placeholder="e.g. GSTIN, ICAI No." className="rounded-xl focus-ring" />
                </Field>
                <Field label="Year Established (optional)">
                  <Input type="number" value={estYear} onChange={e => setEstYear(e.target.value)} placeholder="e.g. 2015" min={1900} max={2030} className="rounded-xl focus-ring" />
                </Field>
                <Field label="Tagline / Motto (optional)">
                  <Input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="e.g. Your trusted partner in growth" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Primary Language">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="rounded-xl focus-ring"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["English","Hindi","Hinglish","Marathi","Tamil","Telugu","Kannada","Bengali","Gujarati"].map(l => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>
          )}

          {/* ── STEP 1: Location & Hours ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Location & Office Hours</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Where clients find you — shared in appointment confirmations and automated messages.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Primary Address *" full>
                  <Textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Building, street, area, landmark..." rows={2} className="rounded-xl focus-ring" />
                </Field>
                <Field label="City *">
                  <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai" className="rounded-xl focus-ring" />
                </Field>
                <Field label="State *">
                  <Input value={state} onChange={e => setState(e.target.value)} placeholder="Maharashtra" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Pincode">
                  <Input value={pincode} onChange={e => setPincode(e.target.value)} placeholder="400001" maxLength={6} className="rounded-xl focus-ring" />
                </Field>
                <Field label="Country">
                  <Input value={country} onChange={e => setCountry(e.target.value)} placeholder="India" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Google Maps URL (optional)" full>
                  <Input type="url" value={mapsUrl} onChange={e => setMapsUrl(e.target.value)} placeholder="https://maps.google.com/..." className="rounded-xl focus-ring" />
                </Field>
                <Field label="Office / Working Hours">
                  <Input value={hours} onChange={e => setHours(e.target.value)} placeholder="Mon–Sat, 9 AM – 6 PM" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Closed / Holiday Days">
                  <Input value={closed} onChange={e => setClosed(e.target.value)} placeholder="Sundays & public holidays" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Branch / Additional Locations (optional)" full>
                  <Textarea value={branches} onChange={e => setBranches(e.target.value)} placeholder="List any other office or branch locations..." rows={2} className="rounded-xl focus-ring" />
                </Field>
              </div>
            </div>
          )}

          {/* ── STEP 2: Contact Details ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Contact Details</h3>
                <p className="text-xs text-muted-foreground mt-0.5">All contact points that will be shared with clients in automated replies.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Primary Phone *">
                  <Input type="tel" value={phone1} onChange={e => setPhone1(e.target.value)} placeholder="+91 98765 43210" className="rounded-xl focus-ring" />
                </Field>
                <Field label="WhatsApp Number *">
                  <Input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+91 98765 43210" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Secondary Phone (optional)">
                  <Input type="tel" value={phone2} onChange={e => setPhone2(e.target.value)} placeholder="+91 22 2345 6789" className="rounded-xl focus-ring" />
                </Field>
                <Field label="General Email *">
                  <Input type="email" value={email1} onChange={e => setEmail1(e.target.value)} placeholder="hello@yourbusiness.com" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Support / Billing Email (optional)">
                  <Input type="email" value={email2} onChange={e => setEmail2(e.target.value)} placeholder="support@yourbusiness.com" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Website (optional)">
                  <Input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourbusiness.com" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Instagram (optional)">
                  <Input type="url" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="https://instagram.com/yourbusiness" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Facebook / LinkedIn (optional)">
                  <Input type="url" value={social2} onChange={e => setSocial2(e.target.value)} placeholder="https://facebook.com/..." className="rounded-xl focus-ring" />
                </Field>
              </div>
            </div>
          )}

          {/* ── STEP 3: Team & People ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Team & Key People</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Owner, founder, or key contact details — used in personalised messages.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Owner / Founder Name *">
                  <Input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="e.g. Rajesh Mehta, Dr. Priya Sharma" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Designation / Role">
                  <Input value={ownerRole} onChange={e => setOwnerRole(e.target.value)} placeholder="e.g. Founder, Head CA" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Qualifications / Credentials (optional)" hint="Press Enter to add each" full>
                  <TagInput tags={quals} onChange={setQuals} placeholder="e.g. CA, MBA, MBBS..." />
                </Field>
                <Field label="Specializations / Expertise (optional)" hint="Press Enter to add each" full>
                  <TagInput tags={specs} onChange={setSpecs} placeholder="e.g. GST, Oncology, UI Design..." />
                </Field>
              </div>

              <div className="border-t border-input pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Additional Team Members (optional)</p>
                  <Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={addTeam}>
                    <Plus className="h-3.5 w-3.5" /> Add Member
                  </Button>
                </div>
                <div className="space-y-3">
                  {team.map(t => (
                    <div key={t.id} className="border border-input rounded-xl p-4 bg-muted/20 relative">
                      <button onClick={() => removeTeam(t.id)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                        <Field label="Name">
                          <Input value={t.name} onChange={e => updateTeam(t.id, "name", e.target.value)} placeholder="Team member name" className="rounded-xl focus-ring" />
                        </Field>
                        <Field label="Role / Designation">
                          <Input value={t.role} onChange={e => updateTeam(t.id, "role", e.target.value)} placeholder="e.g. Senior Consultant" className="rounded-xl focus-ring" />
                        </Field>
                        <Field label="Specialization">
                          <Input value={t.specialization} onChange={e => updateTeam(t.id, "specialization", e.target.value)} placeholder="e.g. Taxation, UI Design" className="rounded-xl focus-ring" />
                        </Field>
                        <Field label="Contact (optional)">
                          <Input value={t.contact} onChange={e => updateTeam(t.id, "contact", e.target.value)} placeholder="Direct phone or email" className="rounded-xl focus-ring" />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Services ── */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Services Offered</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Select your services. Each expands into specific sub-services.</p>
              </div>
              <div className="space-y-2">
                {SERVICES.map(s => (
                  <ServiceRow
                    key={s.key}
                    title={s.title} desc={s.desc} subs={s.subs}
                    checked={!!svcChecked[s.key]}
                    onCheck={(v) => setSvcChecked(prev => ({ ...prev, [s.key]: v }))}
                  />
                ))}
              </div>
              <Field label="Custom Services (optional)" hint="Press Enter to add services specific to your business">
                <TagInput tags={customSvcs} onChange={setCustomSvcs} placeholder="e.g. Site visits, Tax audit, Home delivery..." />
              </Field>
            </div>
          )}

          {/* ── STEP 5: Pricing ── */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Pricing Information</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Shared with clients who ask about costs. Add as many service prices as you offer.</p>
              </div>
              <div className="space-y-2">
                {prices.map(p => (
                  <div key={p.id} className="border border-input rounded-xl p-4 bg-muted/20 relative">
                    <button onClick={() => removePrice(p.id)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                      <Field label="Service Name">
                        <Input value={p.service} onChange={e => updatePrice(p.id, "service", e.target.value)} placeholder="e.g. Basic Consultation" className="rounded-xl focus-ring" />
                      </Field>
                      <Field label="Price / Range">
                        <Input value={p.price} onChange={e => updatePrice(p.id, "price", e.target.value)} placeholder="e.g. ₹999 / ₹500–₹2000" className="rounded-xl focus-ring" />
                      </Field>
                      <Field label="Note">
                        <Input value={p.note} onChange={e => updatePrice(p.id, "note", e.target.value)} placeholder="e.g. per session, per month" className="rounded-xl focus-ring" />
                      </Field>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full rounded-xl gap-2 border-dashed" onClick={addPrice}>
                  <Plus className="h-4 w-4" /> Add Service Price
                </Button>
              </div>
              <div className="border-t border-input pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Discounts / Offers (optional)">
                  <Input value={discount} onChange={e => setDiscount(e.target.value)} placeholder="e.g. 15% off for new clients" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Bundle / Package Deal (optional)">
                  <Input value={bundle} onChange={e => setBundle(e.target.value)} placeholder="e.g. Monthly plan at ₹4,999" className="rounded-xl focus-ring" />
                </Field>
                <Field label="Pricing Notes (optional)" full>
                  <Input value={priceNote} onChange={e => setPriceNote(e.target.value)} placeholder="e.g. Prices vary by scope. Contact us for a custom quote." className="rounded-xl focus-ring" />
                </Field>
              </div>
            </div>
          )}

          {/* ── STEP 6: Documents Required ── */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Documents / Information Required</h3>
                <p className="text-xs text-muted-foreground mt-0.5">What do clients need to provide to get started? Used in automated WhatsApp checklists.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DOC_OPTIONS.map(d => (
                  <label key={d} className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 border rounded-xl cursor-pointer text-sm font-medium transition-all",
                    checkedDocs.includes(d) ? "border-primary bg-primary/10 text-primary" : "border-input hover:border-primary/50 text-muted-foreground"
                  )}>
                    <input
                      type="checkbox"
                      checked={checkedDocs.includes(d)}
                      onChange={() => toggleDoc(d)}
                      className="accent-primary w-3.5 h-3.5"
                    />
                    {d}
                  </label>
                ))}
              </div>
              <Field label="Add Custom Requirements (optional)" hint="Press Enter to add items specific to your business">
                <TagInput tags={customDocs} onChange={setCustomDocs} placeholder="e.g. Measurement chart, Reference photos..." />
              </Field>
            </div>
          )}

          {/* ── STEP 7: Policies ── */}
          {step === 7 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Business Policies</h3>
                <p className="text-xs text-muted-foreground mt-0.5">These are shared with clients who ask about terms, payments, or cancellations via WhatsApp.</p>
              </div>
              <div className="space-y-3">
                <Field label="Payment Terms">
                  <Textarea value={payTerms} onChange={e => setPayTerms(e.target.value)} placeholder="e.g. 50% advance to confirm booking, balance before delivery..." rows={3} className="rounded-xl focus-ring" />
                </Field>
                <Field label="Cancellation / Refund Policy">
                  <Textarea value={refund} onChange={e => setRefund(e.target.value)} placeholder="e.g. Cancellations within 24 hours of appointment are free..." rows={3} className="rounded-xl focus-ring" />
                </Field>
                <Field label="Privacy / Confidentiality Statement">
                  <Textarea value={privacy} onChange={e => setPrivacy(e.target.value)} placeholder="e.g. All client data is kept strictly confidential..." rows={2} className="rounded-xl focus-ring" />
                </Field>
                <Field label="Delivery / Turnaround Time">
                  <Textarea value={turnaround} onChange={e => setTurnaround(e.target.value)} placeholder="e.g. Standard work: 3–5 business days. Urgent: 24 hours..." rows={2} className="rounded-xl focus-ring" />
                </Field>
                <Field label="Any Other Policy (optional)">
                  <Textarea value={otherPolicy} onChange={e => setOtherPolicy(e.target.value)} placeholder="e.g. We require a signed consent form before any medical procedure." rows={2} className="rounded-xl focus-ring" />
                </Field>
              </div>
            </div>
          )}

          {/* ── STEP 8: FAQs ── */}
          {step === 8 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Frequently Asked Questions</h3>
                <p className="text-xs text-muted-foreground mt-0.5">These are answered automatically when clients ask on WhatsApp.</p>
              </div>
              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <div key={f.id} className="border border-input rounded-xl p-4 bg-muted/20 relative">
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <Badge variant="outline" className="text-[10px] rounded-full">FAQ {i + 1}</Badge>
                      {faqs.length > 1 && (
                        <button onClick={() => removeFaq(f.id)} className="text-muted-foreground hover:text-destructive transition-colors ml-1">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 pr-20">
                      <Field label="Question">
                        <Input value={f.question} onChange={e => updateFaq(f.id, "question", e.target.value)} placeholder="e.g. What are your timings? Do you offer EMI?" className="rounded-xl focus-ring" />
                      </Field>
                      <Field label="Answer">
                        <Textarea value={f.answer} onChange={e => updateFaq(f.id, "answer", e.target.value)} rows={2} placeholder="e.g. We are open Monday to Saturday, 9 AM to 6 PM." className="rounded-xl focus-ring" />
                      </Field>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full rounded-xl gap-2 border-dashed" onClick={addFaq}>
                  <Plus className="h-4 w-4" /> Add FAQ
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 9: Review & Submit ── */}
          {step === 9 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Review & Submit</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Check your details before we set up your WhatsApp automation.</p>
              </div>

              {/* Summary cards */}
              <div className="space-y-2">
                {[
                  { title: "Business", rows: [["Name", bizName], ["Industries", industries.join(", ")], ["Language", language], ["Tagline", tagline]] },
                  { title: "Location", rows: [["Address", address], ["City / State", [city, state].filter(Boolean).join(", ")], ["Hours", hours]] },
                  { title: "Contact", rows: [["WhatsApp", whatsapp], ["Email", email1], ["Website", website]] },
                  { title: "Key People", rows: [["Owner", ownerName], ["Role", ownerRole], ["Team", team.length + " members"]] },
                  { title: "Content", rows: [["Services", Object.values(svcChecked).filter(Boolean).length + " categories"], ["Pricing", prices.filter(p => p.service).length + " packages"], ["Documents", (checkedDocs.length + customDocs.length) + " items"], ["FAQs", faqs.filter(f => f.question).length + " questions"]] },
                ].map(block => (
                  <div key={block.title} className="rounded-xl border border-input bg-muted/20 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{block.title}</p>
                    <div className="space-y-1">
                      {block.rows.filter(([,v]) => v).map(([k, v]) => (
                        <div key={k} className="flex gap-3 text-sm">
                          <span className="text-muted-foreground min-w-[110px] text-xs">{k}</span>
                          <span className="font-medium text-xs">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* JSON preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Generated JSON</p>
                  <Button variant="outline" size="sm" className="rounded-xl gap-2" onClick={handleCopy}>
                    {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied!" : "Copy JSON"}
                  </Button>
                </div>
                <pre className="rounded-2xl bg-[#0d1117] text-[#9eceff] text-[11px] leading-relaxed p-4 overflow-auto max-h-64 font-mono">{jsonStr}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-card-border bg-card/60 backdrop-blur">
          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button variant="outline" className="rounded-xl" onClick={() => setStep(s => s - 1)}>
                ← Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {step < STEPS.length - 1 ? (
              <Button
                className="rounded-xl bg-gradient-to-br from-primary to-primary/85 shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                onClick={() => setStep(s => s + 1)}
              >
                Continue →
              </Button>
            ) : (
              <Button
                className="rounded-xl bg-gradient-to-br from-green-600 to-green-500 shadow-md shadow-green-600/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                onClick={() => setSubmitted(true)}
              >
                Submit & Go Live ✓
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
