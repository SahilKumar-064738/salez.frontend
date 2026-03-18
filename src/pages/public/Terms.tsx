export default function Terms() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms &amp; Conditions</h1>
        <p className="text-slate-400 mb-10">Last updated: January 1, 2025</p>
        <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
          {[
            { title: "1. Acceptance of Terms", body: 'By accessing or using AutoReply ("Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.' },
            { title: "2. Use of Service", body: "You may use AutoReply only for lawful purposes and in accordance with these Terms. You agree not to use the Service to send spam, unsolicited messages, or any content that violates WhatsApp's terms of service or applicable laws." },
            { title: "3. WhatsApp Compliance", body: "All messages sent through AutoReply must comply with Meta's WhatsApp Business Policy. You are solely responsible for obtaining proper opt-in consent from your contacts before sending messages." },
            { title: "4. Account Responsibility", body: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account." },
            { title: "5. Payments & Refunds", body: "Subscriptions are billed monthly or annually. All payments are non-refundable except as required by law. You may cancel your subscription at any time; access continues until the end of the billing period." },
            { title: "6. Privacy Policy", body: "We collect and process personal data as described in our Privacy Policy. We do not sell your data to third parties. Contact data you import is stored securely and used only to provide the service." },
            { title: "7. Limitation of Liability", body: "AutoReply shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service, including message delivery failures or WhatsApp account restrictions." },
            { title: "8. Changes to Terms", body: "We reserve the right to modify these terms at any time. We will notify users of significant changes via email. Continued use of the service after changes constitutes acceptance." },
            { title: "9. Contact Us", body: "If you have questions about these Terms, please contact us at legal@autoreply.in." },
          ].map(s => (
            <section key={s.title}>
              <h2 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h2>
              <p>{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
