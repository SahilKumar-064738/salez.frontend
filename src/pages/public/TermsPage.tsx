export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10 border-b border-slate-200 pb-8">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">Legal Document</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Platform Agreement &amp; Legal Compliance Framework
          </h1>
          <p className="text-sm text-slate-500">
            Unified Terms of Service, Data Protection, Acceptable Use, Communication Compliance,
            Billing, Service Levels, Confidentiality, and Contractual Provisions
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
            <span>Version 2.0</span>
            <span>•</span>
            <span>Effective Date: 1 April 2026</span>
            <span>•</span>
            <span>Governed by the Laws of India</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span>legal@salez.online | www.salez.online</span>
            <br />
            <span>Operated by: Salez.online (Proprietorship), Chandigarh, Punjab, India</span>
          </div>
        </div>

        <div className="space-y-10 text-sm text-slate-700 leading-6">

          {/* Preamble */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">Preamble</h2>
            <p>
              This document constitutes the complete and legally binding Platform Agreement &amp; Legal Compliance
              Framework (this "Agreement") between salez.online (Proprietorship), a sole proprietorship registered and
              operating under the laws of India (the "Company," "we," "us," or "our"), with its principal place of business at
              Chandigarh, Punjab, India, and the entity or individual accessing, registering for, or using the salez.online
              platform and associated services (the "Client," "User," "you," or "your").
            </p>
            <p className="mt-3">
              This Agreement supersedes and replaces all prior or contemporaneous agreements, representations,
              warranties, and understandings between the parties with respect to its subject matter. All policies, addenda,
              Order Forms, and compliance requirements that may previously have been presented as separate
              instruments are merged herein and shall be construed and enforced as integral provisions of this single,
              unified Agreement.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 1 — Acceptance of Terms, Legal Acceptance Mechanism, and Identity of the Company
            </h2>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">1.1 Binding Acceptance</h3>
            <p>
              This Agreement is legally binding. By performing any of the acts specified below, you accept and agree to be
              bound by this Agreement, and all terms incorporated herein, in a manner constituting valid and irrevocable
              acceptance equivalent to a signed written agreement under the Information Technology Act, 2000 ("IT Act")
              and the Indian Contract Act, 1872:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>completing the online registration process and clicking "I Agree," "Accept," "Sign Up," or any functionally equivalent acceptance button or checkbox on the Platform (clickwrap acceptance);</li>
              <li>accessing or browsing the Platform or any part thereof following publication or notification of this Agreement;</li>
              <li>activating, deploying, or using any feature of the Services, including AI Features, calling or messaging functionalities, or API integrations;</li>
              <li>executing an Order Form that expressly incorporates this Agreement by reference; or</li>
              <li>continuing to use the Services after notification of any modification to this Agreement in accordance with Section 26.</li>
            </ul>
            <p className="mt-3">
              Each of the foregoing acts constitutes express, informed, and unambiguous digital consent to this Agreement.
              The parties expressly agree that electronic contracts formed through the above mechanisms are valid,
              binding, and enforceable under Section 10A of the IT Act and the provisions of the Indian Contract Act, 1872.
              The Company maintains a timestamped record of the date, time, and IP address associated with each
              acceptance event, which shall constitute admissible evidence of acceptance in any arbitral, judicial, or
              regulatory proceeding, absent proof to the contrary. If you do not agree to this Agreement in its entirety, you
              must immediately cease all use of the Services and close your account.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">1.2 Authority to Bind</h3>
            <p>
              If you are accessing the Services on behalf of a corporation, partnership, limited liability partnership, or other
              legal entity, you individually represent and warrant that you are duly authorised to bind that entity to this
              Agreement, and that such entity accepts these terms. In such case, "you" and "your" shall refer jointly and
              severally to both the individual and the entity. The Company reserves the right to request written evidence of
              such authority at any time, including a board resolution, power of attorney, or letter of authority.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">1.3 Legal Identity and Platform Role</h3>
            <p>
              The Services are operated by salez.online (Proprietorship), a sole proprietorship registered under Indian law,
              with its principal place of business at Chandigarh, Punjab, India. The Company operates through the domain
              www.salez.online and holds all intellectual property rights in the Platform.
            </p>
            <p className="mt-3">
              salez.online is a technology infrastructure provider exclusively. The Company is not a telecommunications
              operator, internet service provider, voice carrier, messaging aggregator, or regulated communication service
              provider of any kind. The Company does not transmit, route, or carry communication traffic of its own accord.
              All communication services available through the Platform are enabled through Third-Party APIs operated by
              independent providers over which the Company exercises no operational, technical, or regulatory control.
            </p>
            <p className="mt-3">
              The Company operates as a sole proprietorship. Under Indian law, the proprietor bears unlimited personal
              liability for the obligations of the business. The Company has nonetheless structured its contractual
              arrangements — including the liability cap in Section 16 and the indemnification provisions in Section 17 — to
              allocate commercial risk appropriately between the parties, in a manner proportionate to the pricing at which
              the Services are offered. These provisions reflect a freely negotiated allocation of risk and constitute a
              material inducement to the Company's entry into this Agreement. The pricing of the Services is expressly set
              to reflect this allocation. No claim arising under or in connection with this Agreement shall extend beyond the
              monetary limits agreed herein, save only where expressly prohibited by mandatory provisions of applicable
              Indian law that cannot be excluded by contract.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">1.4 Users Outside India</h3>
            <p>
              Users located outside India are solely responsible for determining whether their access to and use of the
              Services complies with the laws, regulations, and licensing requirements of their respective jurisdictions.
              salez.online makes no representation that the Services are appropriate, lawful, or available for use in any
              jurisdiction other than India. Access to the Services from territories where such access is unlawful is strictly
              prohibited.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">Section 2 — Definitions</h2>
            <p>
              For the purposes of this Agreement, the following terms shall have the meanings assigned below. Defined
              terms used in the singular include the plural and vice versa, as the context requires. References to statutes
              include amendments and successor legislation.
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>"Agreement"</strong> means this Platform Agreement &amp; Legal Compliance Framework, including all sections, schedules, Order Forms, addenda, and policies incorporated herein by reference.</li>
              <li><strong>"AI Features"</strong> means artificial intelligence-powered functionalities within the Platform, including without limitation AI voice agents, automated response generation, natural language processing systems, and IVR logic systems driven by machine learning models.</li>
              <li><strong>"API Services"</strong> means third-party application programming interfaces integrated into or accessible through the Platform, including without limitation Plivo, WhatsApp Business API, and other telecommunications or messaging APIs, which are owned and operated by independent third-party providers.</li>
              <li><strong>"Business Day"</strong> means any day other than a Saturday, Sunday, or public holiday in the State of Punjab, India.</li>
              <li><strong>"Confidential Information"</strong> means all non-public technical, business, financial, operational, or strategic information disclosed by one party to the other in connection with this Agreement, whether disclosed in writing, orally, electronically, or by any other means, that is designated as confidential or that a reasonable person in the position of the Receiving Party would understand to be confidential given the nature of the information and the circumstances of disclosure. Confidential Information includes, without limitation, pricing, product roadmaps, source code, security architecture, business strategies, and the terms of this Agreement.</li>
              <li><strong>"Data Fiduciary" or "Data Controller"</strong> has the meaning ascribed under the DPDP Act and means the Client, who determines the purposes and means of processing End User Personal Data and bears primary responsibility for compliance thereunder.</li>
              <li><strong>"Data Principal"</strong> has the meaning ascribed under the DPDP Act and refers to the individual to whom Personal Data relates.</li>
              <li><strong>"Data Processor"</strong> means salez.online in its capacity as processor of End User Personal Data, acting solely on the documented instructions of the Client as Data Fiduciary.</li>
              <li><strong>"DLT"</strong> means the Distributed Ledger Technology platform operated by TRAI for the registration and management of commercial communication entities, sender IDs, and message templates under the TCCCPR.</li>
              <li><strong>"DND / NDNC Registry"</strong> means the National Do Not Call Registry maintained by TRAI under the TCCCPR.</li>
              <li><strong>"DPDP Act"</strong> means the Digital Personal Data Protection Act, 2023, as amended from time to time, together with all rules, regulations, and frameworks issued thereunder, including any orders or determinations of the Data Protection Board of India.</li>
              <li><strong>"End Users" or "Contacts"</strong> means the customers, prospects, leads, or other individuals whom Users contact or communicate with through the Platform.</li>
              <li><strong>"Force Majeure Event"</strong> has the meaning ascribed in Section 21 of this Agreement.</li>
              <li><strong>"GDPR"</strong> means the General Data Protection Regulation (EU) 2016/679, applicable where processing involves data subjects located in the European Union or European Economic Area.</li>
              <li><strong>"IT Act"</strong> means the Information Technology Act, 2000, as amended, together with all rules and regulations framed thereunder, including the SPDI Rules.</li>
              <li><strong>"Order Form"</strong> means a duly executed commercial schedule specifying the Subscription plan, term, applicable fees, and service parameters agreed between the Company and a specific Client, which is incorporated into and governed by this Agreement.</li>
              <li><strong>"Personal Data"</strong> has the meaning ascribed under the DPDP Act and applicable law, and includes all information that relates to an identified or identifiable individual.</li>
              <li><strong>"Platform"</strong> means the salez.online software-as-a-service application, including all features for inbound and outbound calling, AI voice agents, IVR systems, WhatsApp automation, CRM workflows, Instagram integrations, and lead management tools, as updated or modified from time to time.</li>
              <li><strong>"Processing"</strong> means any operation or set of operations performed on Personal Data, whether or not by automated means, including collection, storage, retrieval, use, disclosure, combination, erasure, and deletion.</li>
              <li><strong>"Services"</strong> means the Platform, website, application programming interfaces, and all associated services provided by salez.online.</li>
              <li><strong>"SPDI Rules"</strong> means the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</li>
              <li><strong>"Sub-processor"</strong> means any third party engaged by salez.online to process Personal Data on behalf of the Client.</li>
              <li><strong>"Subscription"</strong> means the paid plan under which Users are granted access to the Platform and its features for a defined billing period, as specified in the applicable Order Form.</li>
              <li><strong>"TRAI"</strong> means the Telecom Regulatory Authority of India.</li>
              <li><strong>"TCCCPR"</strong> means the Telecom Commercial Communications Customer Preference Regulations issued by TRAI, as amended or superseded from time to time.</li>
              <li><strong>"Third-Party Services"</strong> means any service, API, platform, or infrastructure not owned or controlled by salez.online, including without limitation WhatsApp, Meta, telecom service providers, cloud infrastructure providers, and payment gateways.</li>
              <li><strong>"User Data"</strong> means all data, including Personal Data, that Users upload, transmit, input into, or generate through use of the Services.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 3 — Account Registration, Eligibility, and KYC Verification
            </h2>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">3.1 Eligibility Requirements</h3>
            <p>
              To register for and use the Services, you must: (a) be at least eighteen (18) years of age; (b) be legally
              authorised to conduct business in India or your applicable jurisdiction; (c) provide accurate, complete, and
              current registration information at the time of registration and maintain its accuracy throughout the term; (d)
              maintain the security and confidentiality of your account credentials; and (e) agree to and comply with this
              Agreement in its entirety.
            </p>
            <p className="mt-3">
              You are solely and exclusively responsible for all activities that occur under your account, whether or not
              authorised by you. You must immediately notify salez.online at support@salez.online upon becoming aware
              of any unauthorised access to or breach of account security. salez.online shall bear no liability for any loss
              arising from unauthorised account use attributable to your failure to maintain adequate account security.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">3.2 KYC and Business Verification</h3>
            <p>
              salez.online reserves the right, at any time and in its sole discretion, to request that a User furnish identity
              verification, business registration documentation, regulatory compliance records, or other information
              (collectively, "KYC Documentation") for any of the following purposes: (a) verifying the User's legal identity
              and authority to conduct business; (b) confirming compliance with TRAI DLT registration requirements; (c)
              satisfying the Company's obligations under applicable anti-money laundering, counter-terrorism financing, or
              data protection laws; (d) assessing the risk profile of a User's communication activities; or (e) complying with
              any direction from a governmental, regulatory, or law enforcement authority.
            </p>
            <p className="mt-3">
              KYC Documentation may include, without limitation: government-issued identity documents; certificate of
              incorporation or business registration documents; GST registration certificates; TRAI DLT Principal Entity
              registration confirmation; consent management framework documentation; and such other documentation as
              the Company reasonably requests. Failure to provide requested KYC Documentation within five (5) Business
              Days of the request (or such shorter period as urgency requires) shall constitute grounds for suspension or
              termination of the account. salez.online shall not be liable for any loss arising from a suspension effected in
              these circumstances.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">3.3 Right to Refuse, Suspend, or Terminate Registration</h3>
            <p>
              salez.online reserves the right to refuse registration, or to suspend or terminate any account at its discretion,
              without prior notice or liability, where it determines that a User has violated this Agreement or any applicable
              law, or that a User poses a legal, regulatory, reputational, or financial risk to the Company or its service
              ecosystem.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 4 — Platform Description and Service Warranties
            </h2>
            <p>
              salez.online provides a business communication and automation platform enabling Users to manage inbound
              and outbound voice calls via API integrations, deploy AI voice agents and IVR systems, automate WhatsApp
              messaging and CRM workflows, integrate Instagram and other messaging channels, and manage leads and
              customer communications.
            </p>
            <p className="mt-3">
              The Services are provided on an "as is" and "as available" basis. salez.online expressly disclaims all
              warranties, whether express, implied, statutory, or otherwise, including any implied warranties of
              merchantability, fitness for a particular purpose, title, and non-infringement. salez.online does not warrant that
              the Services will be uninterrupted, error-free, secure, or free from defects.
            </p>
            <p className="mt-3">
              Without limiting the foregoing, salez.online does not guarantee that: (a) calls will be connected, maintained, or
              of acceptable voice quality; (b) messages will be delivered to intended recipients; (c) API integrations will
              function continuously or without latency; (d) AI-generated responses will be accurate, appropriate, or
              compliant with applicable law; or (e) the Platform will be compatible with all devices, operating systems, or
              network configurations.
            </p>
            <p className="mt-3">
              The Company's sole and express warranties are that: (i) it has full authority to enter into this Agreement; (ii)
              the Platform will materially conform to the documentation provided to the Client; and (iii) the Company shall
              implement and maintain reasonable and appropriate technical and organisational security measures to
              protect Client data. These limited warranties constitute the entirety of the warranties provided by salez.online
              under this Agreement.
            </p>
            <p className="mt-3">
              salez.online reserves the right to modify, update, or discontinue any feature or component of the Services
              upon reasonable notice. No modification shall give rise to any right of refund or compensation unless a core
              contracted feature is permanently removed and no functionally equivalent substitute is provided.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 5 — User Obligations and Compliance
            </h2>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">5.1 General Compliance</h3>
            <p>You represent, warrant, and covenant on a continuing basis throughout the term of this Agreement that you shall:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>use the Services only for lawful business purposes and in full compliance with all applicable laws and regulations, whether Indian or international;</li>
              <li>obtain all required regulatory registrations, including TRAI DLT registration as a Principal Entity, prior to using the Platform for any commercial communication;</li>
              <li>obtain and maintain verifiable opt-in consent records for all End Users contacted through the Platform, ensuring that consent is freely given, specific, informed, and unambiguous;</li>
              <li>scrub all contact lists against the NDNC/DND registry before each use, and maintain and update suppression lists at intervals of no greater than seven (7) days;</li>
              <li>configure AI Features responsibly, maintain the required logs and audit trails described in Section 8, and validate all AI outputs independently before deployment and on an ongoing basis;</li>
              <li>comply with all WhatsApp Business API policies and Meta's Platform Terms as issued and updated by Meta from time to time;</li>
              <li>appoint a designated compliance officer or contact who is solely responsible for the Client's regulatory compliance obligations; and</li>
              <li>ensure compliance with the laws of every jurisdiction in which your End Users are located, in addition to applicable Indian law.</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">5.2 Cross-Border Compliance</h3>
            <p>
              Users communicating with End Users located outside India bear sole and exclusive responsibility for ensuring
              compliance with all applicable laws of the relevant foreign jurisdictions, including data protection statutes,
              telecom regulations, anti-spam legislation, consumer protection laws, and any sector-specific regulatory
              requirements. salez.online makes no representation as to the Services' suitability for use under any
              non-Indian legal framework and shall bear no liability for any regulatory consequences arising from
              cross-border use.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">5.3 Independent Data Backup Obligation</h3>
            <p>
              The User is solely responsible for maintaining independent, current backups of all critical User Data, including
              contact lists, consent records, communication histories, CRM data, and any other data material to the User's
              business operations. salez.online's infrastructure does not constitute a backup or archival solution.
              salez.online shall bear no liability for any loss of User Data, however caused. The obligation to maintain
              independent backups constitutes a continuing material obligation of the User under this Agreement.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">5.4 Technology Platform Acknowledgement</h3>
            <p>
              By using the Services, you expressly acknowledge and accept that: (a) the regulatory landscape governing
              telecommunications and digital communications in India is complex and subject to change without notice; (b)
              regulatory non-compliance may result in significant civil penalties, criminal liability, or account suspension by
              telecom authorities; (c) the Company does not provide compliance monitoring, legal advice, or regulatory
              guidance; and (d) you assume full and exclusive responsibility for all compliance risks associated with your
              use of the Platform.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 6 — Acceptable Use and Prohibited Conduct
            </h2>
            <p>
              Compliance with this Section is a material condition of access to the Services. Violation of this Section
              constitutes a material breach of this Agreement and may result in immediate account suspension or
              termination without prior notice or liability, and may expose you to civil and criminal liability under applicable
              law.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">6.1 Anti-Spam and Consent Requirements</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>You shall obtain explicit prior written consent (opt-in) from every individual before sending any commercial communication or initiating any outbound call through the Platform.</li>
              <li>Consent must be freely given, specific, informed, and unambiguous. Pre-ticked boxes, bundled consents, and inferred consent do not satisfy this standard.</li>
              <li>You must maintain comprehensive and verifiable records of all consents, including the date, time, method, and language of consent, for a minimum of three (3) years.</li>
              <li>Consent obtained for one purpose does not authorise communications for a different purpose without separate and distinct consent.</li>
              <li>You shall not contact any individual registered on the NDNC/DND registry for commercial purposes.</li>
              <li>You shall not use contact lists obtained through web scraping, data purchase, or information harvesting.</li>
              <li>You shall not send unsolicited bulk messages via SMS, WhatsApp, voice, or any other channel, regardless of volume.</li>
              <li>You shall not engage in call bombing, message flooding, or any communication practice constituting harassment.</li>
              <li>You shall not use deceptive subject lines, false sender IDs, CLI spoofing, or any fraudulent sender identification method.</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">6.2 Prohibited Uses</h3>
            <p>You agree not to use the Services for any of the following:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Impersonating any person, organisation, government entity, or regulated professional.</li>
              <li>Conducting phishing, vishing, smishing, or any form of fraudulent communication.</li>
              <li>Transmitting content that is defamatory, obscene, harassing, abusive, threatening, or that incites violence or hatred.</li>
              <li>Using AI Features to represent that a human agent is present when no human is available, in violation of applicable disclosure requirements.</li>
              <li>Circumventing WhatsApp's, Meta's, or any other platform's spam detection or quality rating mechanisms.</li>
              <li>Using the Platform for debt collection activities that violate the Consumer Protection Act, 2019, or any applicable consumer protection law.</li>
              <li>Processing data of individuals under eighteen (18) years of age without verified parental or guardian consent.</li>
              <li>Engaging in any activity that violates applicable local, national, or international law.</li>
              <li>Sub-licensing, reselling, or granting access to the Platform to third parties without the Company's prior written authorisation.</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">6.3 Prohibited Content</h3>
            <p>The following categories of content are strictly prohibited on the Platform:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Content promoting or facilitating violence, terrorism, extremism, or illegal activity.</li>
              <li>Content that is defamatory, harassing, threatening, or abusive toward any individual or group.</li>
              <li>Sexually explicit, obscene, or pornographic content.</li>
              <li>Content that infringes third-party intellectual property, trademark, copyright, or moral rights.</li>
              <li>Disinformation, deliberately false health claims, or misleading financial representations.</li>
              <li>Content related to illegal gambling, prohibited controlled substances, or unlicensed financial services.</li>
              <li>Content targeting individuals based on protected characteristics in a discriminatory manner.</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">6.4 Technical Restrictions</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>You may not reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of any component of the Platform.</li>
              <li>You may not use automated scripts, bots, or tools to access the Platform in a manner that exceeds normal usage patterns or circumvents rate limits or access controls.</li>
              <li>You may not probe, scan, or test the Platform or its infrastructure for vulnerabilities without the Company's prior express written authorisation.</li>
              <li>You may not interfere with the integrity, performance, or availability of the Platform or any data contained therein.</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">6.5 Export Controls and Sanctions Compliance</h3>
            <p>
              You represent and warrant that: (a) you are not located in, organised under the laws of, or ordinarily resident
              in any country subject to comprehensive sanctions administered by the United Nations Security Council, the
              Government of India, the United States Office of Foreign Assets Control (OFAC), the European Union, or the
              United Kingdom Office of Financial Sanctions Implementation (OFSI); (b) you are not named on any sanctions
              list or designation maintained by any of the foregoing authorities; and (c) your use of the Services will not
              directly or indirectly result in a violation of any applicable export control law or regulation, or any economic or
              trade sanctions regime.
            </p>
            <p className="mt-3">
              If you become aware of any change in circumstances that may cause the foregoing representations to
              become untrue, you must immediately notify the Company at legal@salez.online and cease all use of the
              Services. salez.online reserves the right to suspend or terminate any account where continued access may
              result in a violation of applicable sanctions or export control laws, without liability.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 7 — Communication and Telecom Compliance
            </h2>
            <p>
              The use of voice calling, SMS, WhatsApp, and other messaging technologies through the Platform is subject
              to regulatory oversight by TRAI, the Department of Telecommunications, and other governmental authorities.
              The requirements in this Section represent the minimum mandatory standards applicable to all Users.
              Non-compliance constitutes a material breach of this Agreement and may result in immediate account
              suspension, reporting to relevant authorities, and sole personal liability for all resulting regulatory
              consequences. salez.online operates exclusively as a technology facilitation platform and expressly disclaims
              all liability for any User's failure to comply with the obligations in this Section.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">7.1 TRAI Registration and DLT Compliance</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Users making commercial calls or sending commercial SMS or OTT messages must register as a Principal Entity (PE) with TRAI's DLT platform before using the Platform for any commercial communication purpose.</li>
              <li>All SMS headers (Sender IDs) used for commercial communications must be registered on the DLT platform.</li>
              <li>All SMS and call templates for commercial communications must be pre-approved and registered on the DLT platform before use.</li>
              <li>Users must obtain and maintain a valid Telemarketer registration where required under applicable TRAI regulations.</li>
              <li>Users must comply with all obligations under the Digital Consent Acquisition (DCA) system, including consent management, scrubbing, and reporting requirements.</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">7.2 Permissible Communication Hours</h3>
            <p>
              All promotional communications — including voice calls and messages — shall be transmitted exclusively
              between 09:00 hours and 21:00 hours in the recipient's applicable time zone, or such other window as TRAI
              may prescribe. Commercial voice calls may only be made between 9:00 AM and 9:00 PM Indian Standard
              Time unless the recipient has provided explicit, documented consent to communications outside those hours.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">7.3 Telephone Number Series Compliance</h3>
            <p className="mt-2 font-medium">140-Series — Promotional Calls</p>
            <p>
              All promotional voice calls shall originate exclusively from numbers designated under the 140 series in
              accordance with TRAI regulations. The User is solely responsible for configuring its communication
              infrastructure to comply with this requirement. salez.online provides communication routing and API
              enablement only and does not verify, enforce, or guarantee compliance with originating number requirements.
              All regulatory consequences of non-compliance are the sole liability of the User.
            </p>
            <p className="mt-2 font-medium">160-Series — Transactional and Service Communications</p>
            <p>
              Numbers allocated under the 160 series are reserved for transactional and service-related communications,
              including OTPs, alerts, and critical notifications. Their use requires prior registration, verification, and approval
              under TRAI's DLT framework. The User is solely responsible for obtaining all necessary approvals and
              ensuring that communications classified as transactional strictly conform to applicable regulatory definitions.
              salez.online accepts no responsibility for misuse, misclassification, or non-compliance in the User's
              implementation.
            </p>
            <p className="mt-2 font-medium">1800-Series — Toll-Free Numbers</p>
            <p>
              1800-series toll-free numbers carry all associated charges for the User. salez.online may facilitate integration
              with toll-free infrastructure but assumes no responsibility for provisioning, regulatory compliance, uptime, or
              service quality of such numbers unless explicitly agreed in writing. The User shall ensure that all toll-free
              service usage complies with applicable laws and telecom regulations.
            </p>
            <p className="mt-2 font-medium">DID and Virtual Long Code Numbers</p>
            <p>
              Direct Inward Dialling (DID) or virtual long code numbers used for inbound and outbound communications
              may be subject to restrictions under applicable telecom and anti-spam regulations. The User is solely
              responsible for lawful usage, registration, and regulatory adherence. salez.online shall not be liable for any
              penalties, restrictions, or enforcement actions arising from non-compliant usage of such numbers.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">7.4 DND Compliance and Consent Verification</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Before initiating any commercial call or sending any commercial message, Users must verify that the recipient's number does not appear on the NDNC/DND registry.</li>
              <li>All consent must be documented and obtained through a compliant method such as website opt-in, physical form, recorded verbal consent, or digital consent acquisition under TRAI's DCA requirements.</li>
              <li>Users must maintain a suppression list of all individuals who have opted out or registered DND preferences, and must update their contact lists against this suppression list at intervals of no greater than seven (7) days.</li>
              <li>All opt-out or consent withdrawal requests from End Users must be processed within twenty-four (24) hours of receipt, or within such shorter timeframe as prescribed by applicable regulations.</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">7.5 Promotional SMS Compliance</h3>
            <p>
              All promotional SMS communications shall be transmitted exclusively through duly registered sender headers
              and pre-approved message templates under the DLT framework. Transactional message templates must not
              be repurposed for promotional or marketing communications.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">7.6 WhatsApp Business API Compliance</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>All WhatsApp communications must comply with Meta's Business Messaging Policy and WhatsApp Business API Terms, as updated by Meta from time to time.</li>
              <li>Opt-in processes must clearly identify the business name, state the nature of communications to be received, comply with applicable laws, and be retained as records capable of production on request.</li>
              <li>All promotional or transactional WhatsApp messages must use pre-approved Message Templates and must not be used to circumvent Meta's anti-spam or quality management policies.</li>
              <li>Message Templates receiving low quality ratings from Meta's systems must be updated or retired promptly.</li>
              <li>Promotional WhatsApp messages may only be sent between 9:00 AM and 9:00 PM in the recipient's time zone, and every promotional communication must include clear, accessible opt-out instructions.</li>
            </ul>
            <p className="mt-3">
              WhatsApp continuously monitors message quality, delivery rates, and user block rates. A poor account health
              score may result in messaging restrictions or permanent account suspension by Meta. salez.online does not
              control or accept responsibility for WhatsApp's or Meta's enforcement decisions. Users are solely responsible
              for maintaining WhatsApp account health, and salez.online will not provide refunds or credits for service
              disruptions caused by WhatsApp account restrictions or bans.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">7.7 Regulatory Compliance Records</h3>
            <p>Users must retain the following records for a minimum of three (3) years, as these may be required in response to regulatory inquiries, audit requests, or legal proceedings:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Opt-in consent records for all contacted End Users, including method, date, time, and language of consent.</li>
              <li>DND and NDNC scrubbing logs, including dates of each scrub.</li>
              <li>Opt-out requests and the dates on which they were actioned.</li>
              <li>TRAI DLT registration documentation, including PE and Telemarketer registration records.</li>
              <li>WhatsApp opt-in confirmation records.</li>
            </ul>
            <p className="mt-3">
              salez.online is not responsible for the storage or maintenance of Users' regulatory compliance records.
              Compliance with this record-keeping obligation is a material obligation of the User under this Agreement.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 8 — Artificial Intelligence and Automation Compliance
            </h2>
            <p>
              salez.online's AI Features produce outputs based on machine learning models. The Company makes no
              representations or warranties of any kind regarding the accuracy, completeness, correctness, legality,
              appropriateness, or fitness for any purpose of any AI-generated content or output. AI-generated outputs may
              be factually incorrect, contextually inappropriate, legally non-compliant, or otherwise unsuitable for
              deployment. You must not rely on AI-generated content for any legal, regulatory, medical, financial,
              safety-critical, or compliance-related decision without independent professional validation.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">8.1 Mandatory Disclosure and Human Escalation</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>AI voice agents and automated IVR systems must clearly identify themselves as automated systems at the commencement of every interaction, unless applicable law specifically permits otherwise.</li>
              <li>Every AI-powered interaction must offer End Users a clear, prominently communicated option to speak with a human agent or to terminate the interaction.</li>
              <li>AI-generated communications must not make false representations, illegal claims, or misleading statements, and must not impersonate government bodies, regulated financial institutions, licensed professionals, or emergency services.</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">8.2 Prohibition on High-Risk Deployments Without Validation</h3>
            <p>
              Users must not deploy AI Features in any high-risk context — including without limitation medical triage,
              financial advice, legal guidance, credit decisions, or communications with vulnerable populations — without
              prior independent validation and testing by qualified professionals. Deployment of AI Features in high-risk
              contexts without adequate validation constitutes a material breach of this Agreement and may result in
              immediate suspension of the relevant feature set.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">8.3 Audit Trails and Logging</h3>
            <p>
              Users deploying AI Features must maintain comprehensive logs and audit trails of AI-powered interactions, to
              the extent technically feasible and as required by applicable law, for a minimum of three (3) years. Such logs
              must be sufficient to: (a) reconstruct the material content and sequence of each AI interaction; (b) identify the
              End User and the date and time of the interaction; (c) demonstrate compliance with applicable disclosure and
              consent requirements; and (d) support dispute resolution, regulatory inquiry, or legal proceedings.
            </p>
            <p className="mt-3">
              salez.online may assist with log access to the extent permitted by the Platform's technical architecture, but the
              obligation to maintain adequate records rests solely with the User. Where a User's AI-related conduct is the
              subject of a regulatory complaint or legal claim, the absence of adequate audit logs may be treated as
              evidence of non-compliance by a relevant authority.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">8.4 User's Sole Responsibility for AI Outputs</h3>
            <p>
              The User is solely responsible for reviewing, validating, testing, monitoring, and approving all AI-generated
              content prior to deployment and on an ongoing basis. The User accepts sole responsibility for any decision
              made on the basis of AI-generated output. salez.online shall not be liable for any damages, regulatory
              exposure, or liability of any nature arising from the User's use of or reliance upon AI-generated content.
              AI-generated voice calls are subject to all TRAI calling regulations applicable to other commercial calls,
              including those in Section 7.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 9 — Third-Party Services and API Integrations
            </h2>
            <p>
              The Platform integrates with Third-Party Services operated by independent providers. salez.online does not
              own, operate, control, or assume any responsibility for Third-Party Services. The integration of any
              Third-Party Service with the Platform does not constitute an endorsement of that service or its provider. The
              Company expressly disclaims all liability for:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Service outages, downtime, rate limiting, latency, performance degradation, or permanent discontinuation caused by Third-Party Services.</li>
              <li>Unilateral changes to Third-Party Services' terms of service, pricing structures, feature sets, or usage policies.</li>
              <li>Suspension, restriction, or termination of your account by any Third-Party Service provider, including account bans or restrictions imposed by Meta or WhatsApp.</li>
              <li>Data loss, interception, corruption, or breach occurring within or attributable to Third-Party Services' infrastructure.</li>
              <li>Billing disputes, overcharges, erroneous charges, chargebacks, or fee failures attributable to Third-Party Service providers or payment gateway operators.</li>
              <li>Regulatory actions, enforcement proceedings, penalties, or sanctions taken by WhatsApp, telecom authorities, or any other regulatory or governmental body against you in connection with your use of Third-Party Services.</li>
              <li>Any changes to or failures of Third-Party Services occurring after the date of your registration, regardless of whether such changes affect the availability or functionality of the Platform.</li>
            </ul>
            <p className="mt-3">
              Your use of Third-Party Services is governed solely by those providers' terms of service and applicable
              policies. salez.online is not a party to, and assumes no obligations under, any agreement between you and
              any Third-Party Service provider.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 10 — Payments, Billing, and Refund Policy
            </h2>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">10.1 Subscription Fees and Advance Payment</h3>
            <p>
              All Subscription fees are due in advance, are non-cancellable for the committed subscription period, and are
              denominated in Indian Rupees (INR) plus applicable Goods and Services Tax (GST). Subscription terms
              commence on the date of activation and renew automatically unless cancelled in accordance with Section
              10.3.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">10.2 No-Refund Policy</h3>
            <p>
              All fees paid to salez.online are non-refundable, except: (a) where expressly required by a mandatory
              provision of applicable Indian consumer protection law that cannot be contractually excluded; or (b) where a
              service failure is established, through the Company's internal records, to be solely and directly attributable to
              a technical defect in the Company's own core Platform infrastructure (expressly excluding Third-Party API
              failures, telecom network issues, and Force Majeure Events), and the Company has verified that such failure
              materially prevented the User from accessing the core Platform for a continuous period exceeding forty-eight
              (48) hours. In such latter case, the sole remedy shall be a prorated service credit applied to future invoices;
              no cash refund shall be issued.
            </p>
            <p className="mt-3">Without limiting the foregoing, the following circumstances do not entitle a User to a refund:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Service downtime caused by Third-Party APIs, telecom providers, internet infrastructure, or Force Majeure Events.</li>
              <li>Failure of calls to connect, dropped calls, poor call quality, or incorrect call routing attributable to Third-Party providers.</li>
              <li>Failure of WhatsApp, SMS, or other messages to be delivered to recipients.</li>
              <li>Account suspension or termination resulting from the User's violation of this Agreement or applicable law.</li>
              <li>WhatsApp account restrictions or bans imposed by Meta independently of any action by salez.online.</li>
              <li>Unilateral changes to Third-Party Services' pricing, policies, or availability.</li>
              <li>Failure to utilise the Services or a decision to discontinue use.</li>
              <li>Dissatisfaction with AI-generated outputs or AI feature performance.</li>
              <li>Force Majeure Events as defined in Section 21.</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">10.3 Subscription Cancellation</h3>
            <p>
              You may cancel your Subscription at any time by contacting billing@salez.online. Upon cancellation, your
              Subscription will remain active until the end of the current billing period. No prorated refund shall be issued for
              any unused portion of the billing period. Any unused API credits, call minutes, or messaging credits shall be
              forfeited without refund upon expiry of the billing period. To avoid being charged for the next billing cycle,
              cancellation must be received at least forty-eight (48) working hours before the renewal date.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">10.4 Third-Party Payment Gateway</h3>
            <p>
              All payment processing is conducted through Razorpay and other third-party payment gateway operators.
              salez.online is not responsible for payment processing errors, gateway failures, unauthorised deductions,
              failed transactions, or errors attributable to the payment gateway. Disputes relating to payment processing
              must be raised directly with the relevant payment gateway provider. salez.online's liability is strictly limited to
              amounts it has received and confirmed as collected in its own systems.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">10.5 Disputed Charges and Chargeback Protocol</h3>
            <p>
              If you believe a charge on your account is erroneous, you must notify salez.online at billing@salez.online
              within seven (7) days of the charge date, specifying the nature and amount of the dispute. The Company will
              acknowledge receipt within two (2) Business Days and provide a substantive response within ten (10)
              Business Days. Disputes raised after the seven (7)-day window will not be investigated.
            </p>
            <p className="mt-3">
              Initiating a chargeback or payment reversal with your bank or payment provider prior to conclusion of the
              internal dispute resolution process, or without a bona fide basis, may result in suspension of the account
              pending investigation. Where a chargeback is determined to be unwarranted, the Company reserves the right
              to recover the disputed amount together with any bank charges or administrative costs incurred, and to treat
              the initiation of an unwarranted chargeback as a material breach of this Agreement.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">10.6 Pricing Changes</h3>
            <p>
              salez.online reserves the right to change pricing upon thirty (30) days' written notice to registered Users.
              Continued use of the Services after the effective date of a pricing change constitutes acceptance of the
              revised pricing. For all billing inquiries, contact billing@salez.online.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 11 — Service Level Agreement
            </h2>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">11.1 Scope and Exclusions</h3>
            <p>
              The service level commitments in this Section apply exclusively to the salez.online core Platform
              infrastructure, comprising the dashboard, API gateway, and data storage layer, for eligible paid Subscription
              plans. Service credits as described herein are the sole and exclusive remedy available to a Client in respect
              of any Platform downtime.
            </p>
            <p className="mt-3">
              This Section expressly does not apply to, and provides no remedies in respect of: (a) free or trial plan users;
              (b) Third-Party API services, including Plivo, Twilio, WhatsApp, Meta, and all telecom infrastructure providers;
              (c) beta or preview features; or (d) issues caused by the Client's own configuration, misuse, negligence, or
              third-party software.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">11.2 Uptime Commitment</h3>
            <p>
              salez.online targets a Monthly Uptime Percentage of 99.5% for the core Platform, calculated as: (Total
              Minutes in Month minus Downtime Minutes) ÷ Total Minutes in Month × 100.
            </p>
            <p className="mt-3">
              "Downtime" means the Platform is completely unavailable to all Users for five (5) or more consecutive
              minutes, as measured by the Company's internal monitoring systems. The following events do not constitute
              Downtime:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Scheduled maintenance announced at least forty-eight (48) hours in advance via the salez.online status page or email notification.</li>
              <li>Unavailability or degradation caused by Third-Party API failures, including WhatsApp, Plivo, Twilio, or any telecom infrastructure provider.</li>
              <li>Unavailability caused by Force Majeure Events as defined in Section 21.</li>
              <li>Unavailability caused by the Client's misuse, excessive API calls, denial-of-service attacks originating from the Client's network, or unauthorised access.</li>
              <li>Degraded performance (slow response times) that does not constitute complete unavailability.</li>
              <li>Issues affecting only individual User accounts rather than the Platform as a whole.</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">11.3 Service Credit Schedule</h3>
            <div className="overflow-x-auto mt-3">
              <table className="w-full border border-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">Monthly Uptime Percentage</th>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">Service Credit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-slate-200 px-4 py-2">99.5% or above</td><td className="border border-slate-200 px-4 py-2">None</td></tr>
                  <tr className="bg-slate-50"><td className="border border-slate-200 px-4 py-2">99.0% – 99.49%</td><td className="border border-slate-200 px-4 py-2">5% of monthly fee as service credit</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2">95.0% – 98.99%</td><td className="border border-slate-200 px-4 py-2">10% of monthly fee as service credit</td></tr>
                  <tr className="bg-slate-50"><td className="border border-slate-200 px-4 py-2">Below 95.0%</td><td className="border border-slate-200 px-4 py-2">20% of monthly fee as service credit</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              Service credits are the sole and exclusive remedy for Platform downtime and shall not be construed as a
              basis for any other claim or compensation. Service credits are applied exclusively to future invoices and
              cannot be redeemed as cash or transferred. The maximum aggregate service credits in any calendar month
              shall not exceed twenty percent (20%) of the monthly fee for that month. salez.online's determination of
              downtime, based on its internal monitoring data and logs, shall be determinative absent manifest error.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">11.4 Credit Request Procedure</h3>
            <p>
              To request a service credit, the Client must: (a) submit a written request to support@salez.online within ten
              (10) Business Days of the end of the calendar month in which the downtime occurred; (b) provide a detailed
              description of the downtime experienced, including timestamps and affected features; and (c) include
              reasonably available evidence of the impact. Credits shall not be issued for requests submitted after this
              deadline.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">11.5 Persistent Low Uptime — Termination Right</h3>
            <p>
              Where the Monthly Uptime Percentage falls below ninety-five percent (95.0%) for three (3) or more
              consecutive calendar months, and where such failure is attributable solely to the Company's own core
              Platform infrastructure (expressly excluding Third-Party API failures and Force Majeure Events), the Client
              shall have the right, exercisable within thirty (30) days of the end of the third such month, to terminate the
              Agreement for cause on thirty (30) days' written notice to legal@salez.online. Upon such termination, the
              Company shall issue a prorated credit for any prepaid Subscription fees for the period following termination.
              This right of termination constitutes the Client's sole and exclusive remedy for persistent low uptime.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">11.6 Support Response Time Targets</h3>
            <div className="overflow-x-auto mt-3">
              <table className="w-full border border-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">Priority</th>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">Definition</th>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">Initial Response Target</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-slate-200 px-4 py-2">P1 — Critical</td><td className="border border-slate-200 px-4 py-2">Platform completely unavailable to all Users</td><td className="border border-slate-200 px-4 py-2">4 business hours</td></tr>
                  <tr className="bg-slate-50"><td className="border border-slate-200 px-4 py-2">P2 — High</td><td className="border border-slate-200 px-4 py-2">Major feature severely degraded or non-functional</td><td className="border border-slate-200 px-4 py-2">8 business hours</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2">P3 — Medium</td><td className="border border-slate-200 px-4 py-2">Non-critical feature impaired; workaround available</td><td className="border border-slate-200 px-4 py-2">2 business days</td></tr>
                  <tr className="bg-slate-50"><td className="border border-slate-200 px-4 py-2">P4 — Low</td><td className="border border-slate-200 px-4 py-2">General inquiry or feature request</td><td className="border border-slate-200 px-4 py-2">5 business days</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              Support is provided via email to support@salez.online during business hours (Monday to Saturday, 9:00 AM
              to 6:00 PM IST). Response time targets are performance objectives only and do not constitute a contractual
              guarantee of response within any specified time.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 12 — Data Protection, Privacy, and Processing
            </h2>
            <p>
              salez.online is committed to protecting Personal Data in full compliance with the DPDP Act, the IT Act, the
              SPDI Rules, and, where applicable, the GDPR. This Section governs the Company's obligations as a Data
              Processor and sets out User rights in respect of their own Personal Data.
            </p>
            <p className="mt-3">
              <strong>Important:</strong> salez.online operates as a Data Processor with respect to all Personal Data of End Users that
              Users upload to or process through the Platform. Users are the Data Fiduciaries for such data and bear
              exclusive legal responsibility for obtaining all required consents, complying with applicable data protection
              laws, and providing End Users with adequate privacy notices.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">12.1 Information Collected</h3>
            <p className="font-medium mt-2">From Users (Businesses)</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Account Information: Full legal name, email address, phone number, company name, job title, registered business address, and GST/tax identification numbers.</li>
              <li>Payment Information: Billing address and payment method details processed through third-party payment processors. salez.online does not store full card numbers or sensitive payment authentication data.</li>
              <li>Usage Data: Log data including IP addresses, browser type, operating system, pages visited, features used, API call logs, and session duration.</li>
              <li>Communications: Support tickets, emails, and chat communications directed to the Company.</li>
              <li>Technical Data: Device identifiers, authentication tokens, and API keys.</li>
            </ul>
            <p className="font-medium mt-3">End User Data Processed on Behalf of Users</p>
            <p>
              When Users deploy the Platform to communicate with End Users, salez.online may process on the User's
              behalf: names, phone numbers, email addresses, WhatsApp IDs, call recordings (where enabled by the
              User), message content, and interaction history. salez.online processes this data solely as Data Processor,
              acting under the documented instructions of the User as Data Fiduciary.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">12.2 Legal Basis for Processing</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Contractual Necessity: To fulfil the Company's obligations under this Agreement.</li>
              <li>Consent: Where explicit and informed consent has been provided for specific processing activities.</li>
              <li>Legitimate Interests: For fraud prevention, security monitoring, and service improvement, where such interests are not overridden by the rights of Data Principals.</li>
              <li>Legal Obligation: Where processing is required by applicable Indian law, regulatory directive, or order of a competent authority.</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">12.3 Purposes of Processing</h3>
            <p>
              Personal data is used for the following purposes: to provide, operate, maintain, and improve the Platform; to
              process Subscription payments and manage billing; to authenticate Users and maintain Platform security; to
              send service-related communications; to respond to support requests; to detect, investigate, and prevent
              fraud, abuse, and policy violations; to comply with legal obligations and regulatory requirements; and to
              analyse aggregate usage patterns using anonymised and pseudonymised data only. salez.online does not
              sell Personal Data to any third party and does not use End User Personal Data for its own marketing or
              advertising purposes.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">12.4 Data Retention</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Account data: retained for the duration of the Subscription plus three (3) years, or as otherwise required by applicable law.</li>
              <li>Billing records: retained for a minimum of seven (7) years as required under Indian financial and tax regulations.</li>
              <li>Call recordings: retained for the period configured by the User, subject to a default maximum of ninety (90) days on the Company's infrastructure, unless extended storage is purchased.</li>
              <li>Message logs: retained for ninety (90) days by default.</li>
              <li>Upon account termination, User Data will be deleted within ninety (90) days of the termination date, except where retention is required by applicable law.</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">12.5 Data Processor Obligations</h3>
            <p>
              In its capacity as Data Processor, salez.online shall: (a) process Personal Data only on documented
              instructions from the Client; (b) ensure that authorised personnel handling Personal Data are bound by
              appropriate confidentiality obligations; (c) implement and maintain the security measures set out in Section
              12.7; (d) assist the Client in responding to Data Principal rights requests to the extent technically feasible; (e)
              delete or return all Personal Data upon termination in accordance with Section 12.9; and (f) make available on
              reasonable request all information necessary to demonstrate compliance with this Section.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">12.6 Cross-Border Data Transfers</h3>
            <p>
              Where the processing of Personal Data requires transfer to countries or territories outside India — including
              transfers to the Sub-processors listed in Section 13, some of whom are located in the United States and other
              jurisdictions — salez.online shall ensure that such transfers comply with the requirements of the DPDP Act
              and any applicable rules, orders, or frameworks issued by the Government of India or the Data Protection
              Board of India governing cross-border data transfers.
            </p>
            <p className="mt-3">
              Where India has not made a finding of adequacy with respect to a recipient country, salez.online shall
              implement appropriate contractual safeguards, such as standard data transfer clauses or equivalent
              mechanisms approved under the DPDP Act, prior to transferring Personal Data to that jurisdiction. The
              Company shall not transfer Personal Data to any jurisdiction that is expressly restricted under applicable
              Indian law. Users who transfer Personal Data of Indian residents outside India through the Platform remain
              independently responsible for their own compliance with applicable cross-border transfer restrictions under
              the DPDP Act. As the DPDP Act framework continues to evolve, the Company shall review and update its
              transfer mechanisms in accordance with guidance from the Data Protection Board of India.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">12.7 Data Security</h3>
            <p>salez.online implements the following minimum technical and organisational security measures:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Encryption: AES-256 encryption at rest; TLS 1.2 or higher in transit.</li>
              <li>Access Controls: Role-based access controls; multi-factor authentication for all administrative access.</li>
              <li>Monitoring: Continuous security monitoring, intrusion detection, and anomaly alerting.</li>
              <li>Vulnerability Management: Regular security assessments and penetration testing at appropriate intervals.</li>
              <li>Incident Response: Documented and tested procedures for responding to security incidents.</li>
              <li>Personnel Training: Regular data protection and information security training for all relevant personnel.</li>
            </ul>
            <p className="mt-3">
              No method of electronic transmission or storage is entirely secure, and salez.online cannot guarantee
              absolute protection against all threats. To report a security vulnerability, contact security@salez.online.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">12.8 Data Breach Notification</h3>
            <p>
              In the event of a confirmed Personal Data breach that is likely to result in a risk to the rights of Data
              Principals, salez.online shall notify the Client without undue delay and in any event within seventy-two (72)
              hours of becoming aware of the breach, providing: (a) a description of the nature of the breach and the
              affected data categories; (b) the approximate number of affected records; (c) the likely consequences of the
              breach; and (d) measures taken or proposed to address and mitigate the breach. This notification obligation
              applies only to breaches of Personal Data held by salez.online as Data Processor; it does not extend to
              breaches occurring within Third-Party Service providers' systems. The Client is solely responsible for notifying
              the Data Protection Board of India and affected Data Principals as required by applicable law.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">12.9 Data Deletion and Return</h3>
            <p>
              Upon termination of this Agreement, salez.online shall, at the Client's written request received within thirty
              (30) days of termination, delete or return all Personal Data within ninety (90) days, unless retention is required
              by applicable law. After the applicable period, salez.online will securely delete all retained Personal Data and,
              upon request, provide written confirmation of deletion.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">12.10 Data Principal Rights</h3>
            <p>
              As a Data Principal under the DPDP Act, you have the following rights in respect of your Personal Data: the
              right to access and receive a summary of data processed; the right to correction of inaccurate data; the right
              to erasure, subject to statutory retention obligations; the right to grievance redressal; and the right to nominate
              another individual to exercise these rights in the event of your death or incapacity. Submit a written request to
              privacy@salez.online. The Company will respond within thirty (30) days, with a possible extension of a further
              thirty (30) days for complex requests, with prior written notice.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">12.11 GDPR Addendum — EU/EEA Users</h3>
            <p>
              For Users in the European Union or European Economic Area, to the extent the GDPR applies, salez.online
              additionally acknowledges the right to data portability; the right to object to processing; the right to restrict
              processing; and the right to withdraw consent at any time without affecting prior lawful processing. Legal basis
              under GDPR includes contract performance, legitimate interests, and consent. For GDPR requests, contact
              privacy@salez.online with the subject line "GDPR Request."
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">12.12 Children's Privacy</h3>
            <p>
              The Services are not directed to individuals under eighteen (18) years of age. salez.online does not knowingly
              collect Personal Data from minors. If you have reason to believe a minor has provided Personal Data to the
              Company, contact privacy@salez.online immediately and the Company will take prompt steps to delete such
              data.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">12.13 Cookies</h3>
            <p>salez.online uses cookies and similar tracking technologies on its website and Platform. The types of cookies used, their purposes, and User control options are set out below.</p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full border border-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">Cookie Type</th>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">Purpose</th>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">User Control</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-slate-200 px-4 py-2">Essential</td><td className="border border-slate-200 px-4 py-2">Authentication, session management, and core security functions</td><td className="border border-slate-200 px-4 py-2">Not optional — required for Platform functionality</td></tr>
                  <tr className="bg-slate-50"><td className="border border-slate-200 px-4 py-2">Analytics</td><td className="border border-slate-200 px-4 py-2">Understand how users interact with the Platform to improve experience</td><td className="border border-slate-200 px-4 py-2">Yes — via cookie consent manager</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2">Functional</td><td className="border border-slate-200 px-4 py-2">Remember user preferences and settings across sessions</td><td className="border border-slate-200 px-4 py-2">Yes — non-essential</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              Cookie preferences may be managed through browser settings and through the cookie consent manager on
              the website. Disabling essential cookies will prevent the Platform from functioning correctly. Third-party
              service providers integrated into the Platform may set their own cookies, subject to their own policies.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 13 — Third-Party Sub-processors
            </h2>
            <p>
              Last Updated: 1 April 2026. salez.online engages the following Sub-processors for the provision of services
              involving the Processing of Personal Data on behalf of Users. All Sub-processors are subject to contractual
              data protection obligations consistent with the DPDP Act and applicable law.
            </p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full border border-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">Sub-processor</th>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">Purpose</th>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">Location</th>
                    <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700">Data Processed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-slate-200 px-4 py-2">Plivo</td><td className="border border-slate-200 px-4 py-2">Voice &amp; SMS API services</td><td className="border border-slate-200 px-4 py-2">USA / India</td><td className="border border-slate-200 px-4 py-2">Phone numbers, call logs, call recordings</td></tr>
                  <tr className="bg-slate-50"><td className="border border-slate-200 px-4 py-2">Meta / WhatsApp</td><td className="border border-slate-200 px-4 py-2">WhatsApp Business API</td><td className="border border-slate-200 px-4 py-2">USA</td><td className="border border-slate-200 px-4 py-2">Phone numbers, message content</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2">Netlify and Render</td><td className="border border-slate-200 px-4 py-2">Cloud infrastructure and hosting</td><td className="border border-slate-200 px-4 py-2">India / Global</td><td className="border border-slate-200 px-4 py-2">All Platform data</td></tr>
                  <tr className="bg-slate-50"><td className="border border-slate-200 px-4 py-2">Razorpay</td><td className="border border-slate-200 px-4 py-2">Payment processing</td><td className="border border-slate-200 px-4 py-2">India / Global</td><td className="border border-slate-200 px-4 py-2">Billing data (no card numbers stored)</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2">Supabase</td><td className="border border-slate-200 px-4 py-2">Data storage and analytics</td><td className="border border-slate-200 px-4 py-2">India / Global</td><td className="border border-slate-200 px-4 py-2">Usage data, logs</td></tr>
                  <tr className="bg-slate-50"><td className="border border-slate-200 px-4 py-2">Google SMTP Relay</td><td className="border border-slate-200 px-4 py-2">Transactional email delivery</td><td className="border border-slate-200 px-4 py-2">USA</td><td className="border border-slate-200 px-4 py-2">Email addresses, names</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2">Monitoring &amp; Analytics Tools</td><td className="border border-slate-200 px-4 py-2">Performance monitoring</td><td className="border border-slate-200 px-4 py-2">Global</td><td className="border border-slate-200 px-4 py-2">Anonymised usage data only</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              This list is reviewed and updated periodically. Clients will be notified of material changes to Sub-processors at
              least thirty (30) days prior to any new Sub-processor being engaged, providing an opportunity to object on
              legitimate data protection grounds. Where no resolution is reached following a valid objection, either party
              may terminate the affected services on written notice. To request the current Sub-processor list, contact
              privacy@salez.online.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 14 — Intellectual Property Rights
            </h2>
            <p>
              The Platform — including all software, algorithms, machine learning models, user interfaces, databases,
              documentation, branding, and associated intellectual property — is owned exclusively by salez.online and is
              protected under Indian and international intellectual property laws, including the Copyright Act, 1957, the
              Trade Marks Act, 1999, and the Patents Act, 1970, as amended. Nothing in this Agreement grants you any
              ownership rights in the Platform or any component thereof.
            </p>
            <p className="mt-3">
              Subject to your full and continuous compliance with this Agreement, you are granted a limited, non-exclusive,
              non-transferable, non-sublicensable, revocable licence to access and use the Platform solely for your internal
              business purposes during the term of your Subscription. This licence terminates automatically upon expiry or
              termination of your Subscription for any reason.
            </p>
            <p className="mt-3">
              You retain ownership of your User Data. By uploading or transmitting data to the Platform, you grant
              salez.online a limited, non-exclusive, royalty-free licence to process, store, and use your data solely to
              provide and improve the Services during the term of your Subscription. This licence expires upon account
              termination, subject to the Company's data retention obligations.
            </p>
            <p className="mt-3">
              salez.online shall indemnify the Client against third-party claims alleging that the Platform itself (excluding
              Client content and User-generated data) infringes a valid Indian intellectual property right, provided the Client:
              (a) promptly notifies salez.online of such claim in writing; (b) grants salez.online sole control of the defence
              and any settlement; and (c) provides all reasonable cooperation in the defence of the claim.
            </p>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 15 — Confidentiality
            </h2>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">15.1 Confidentiality Obligations</h3>
            <p>
              Each party (the "Receiving Party") that receives Confidential Information from the other party (the "Disclosing
              Party") in connection with this Agreement agrees to: (a) hold the Disclosing Party's Confidential Information in
              strict confidence, using at least the same degree of care it uses to protect its own confidential information of a
              similar nature, but in no event less than reasonable care; (b) not disclose or permit access to the Disclosing
              Party's Confidential Information to any third party without the Disclosing Party's prior written consent, except
              to its own employees, contractors, and advisers who have a genuine need to know and are bound by
              equivalent written confidentiality obligations; and (c) use the Disclosing Party's Confidential Information solely
              for the purposes of performing or exercising its rights under this Agreement.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">15.2 Exclusions</h3>
            <p>
              Confidentiality obligations do not apply to information that: (a) is or becomes publicly available through no
              breach of this Agreement by the Receiving Party; (b) was lawfully known to the Receiving Party without
              restriction prior to disclosure by the Disclosing Party, as evidenced by contemporaneous written records; (c) is
              independently developed by the Receiving Party without reference to the Disclosing Party's Confidential
              Information; (d) is received lawfully from a third party without restriction on disclosure; or (e) is required to be
              disclosed by applicable law, court order, or regulatory directive, provided that the Receiving Party gives the
              Disclosing Party prompt prior written notice (to the extent legally permissible) and cooperates with the
              Disclosing Party's efforts to seek a protective order or other appropriate relief.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">15.3 Survival</h3>
            <p>
              Confidentiality obligations under this Section shall survive the expiry or termination of this Agreement for a
              period of three (3) years, except in respect of trade secrets and source code, in respect of which obligations
              shall continue for so long as the relevant information retains its character as a trade secret under applicable
              law.
            </p>
          </section>

          {/* Section 16 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 16 — Limitation of Liability
            </h2>
            <p>
              The limitation of liability provisions in this Section constitute a material term of this Agreement, without which
              salez.online would not have entered into the Agreement at the pricing and on the terms offered. They
              represent a freely negotiated allocation of commercial risk, reflect the Company's unlimited personal liability
              as a sole proprietorship, and shall be given full effect by any arbitral tribunal or court of competent jurisdiction.
            </p>
            <p className="mt-3">
              To the maximum extent permitted by applicable law, salez.online, its proprietor, officers, employees, agents,
              affiliates, and service providers shall not be liable, whether based on contract, tort (including negligence),
              strict liability, statute, or any other legal or equitable theory, for any of the following:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Any interruption, downtime, degradation, or unavailability of the Services or Third-Party Services, for any duration or reason.</li>
              <li>Failure of calls to connect or be maintained, dropped calls, poor call quality, or incorrect call routing.</li>
              <li>Failure of messages, communications, or notifications to be delivered to intended recipients.</li>
              <li>Errors, inaccuracies, inappropriate outputs, non-compliant content, or any other deficiency in AI-generated content or responses.</li>
              <li>Suspension, restriction, or banning of your account by WhatsApp, Meta, telecom providers, payment processors, or any regulatory authority.</li>
              <li>Loss of User Data, contacts, communication records, or business information due to technical failures, Third-Party Service outages, or any other cause.</li>
              <li>Any indirect, incidental, special, consequential, punitive, or exemplary damages of any nature, including loss of revenue, profits, goodwill, business opportunity, anticipated savings, or data.</li>
              <li>Regulatory fines, penalties, enforcement costs, or legal costs arising from your non-compliance with applicable law.</li>
              <li>Losses arising from your use of or reliance upon AI-generated content without independent validation.</li>
              <li>API outages or failures of Third-Party Services; WhatsApp or Meta account bans or restrictions; or regulatory actions against the Client arising from the Client's own conduct.</li>
            </ul>
            <p className="mt-4 font-semibold">
              Aggregate Liability Cap:
            </p>
            <p className="mt-2">
              In all cases where liability cannot be fully excluded under applicable mandatory law, salez.online's total
              aggregate liability to you for all claims, demands, actions, or proceedings arising from or related to this
              Agreement, the Services, or any Order Form — whether based on contract, tort (including negligence),
              statute, strict liability, or any other legal or equitable theory — shall not exceed the total fees actually paid by
              you to salez.online during the three (3) calendar months immediately preceding the date of the event first
              giving rise to the claim.
            </p>
            <p className="mt-3">
              This monetary cap applies to all causes of action in the aggregate and not individually. It applies regardless
              of: (a) the number of claims brought; (b) whether claims are brought concurrently or sequentially; (c) the legal
              basis of any claim; or (d) whether the Company has been advised of the possibility of such claims or damages.
            </p>
            <p className="mt-3">
              Nothing in this Agreement limits liability for death, personal injury, or fraud caused by gross negligence or
              wilful misconduct, solely to the extent that such limitation is expressly prohibited by mandatory provisions of
              applicable Indian law and cannot be excluded by agreement.
            </p>
          </section>

          {/* Section 17 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 17 — Indemnification
            </h2>
            <p>
              You shall defend, indemnify, and hold harmless salez.online, its proprietor, affiliates, officers, employees,
              agents, partners, licensors, and service providers from and against any and all claims, liabilities, damages,
              losses, costs, expenses, fines, penalties, and legal fees (including reasonable advocates' fees) arising out of
              or relating to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Your use or misuse of the Services in any manner.</li>
              <li>Your violation of this Agreement, any incorporated policy, or any applicable law or regulation, including TRAI regulations, the DPDP Act, the IT Act, WhatsApp Business API policies, or any telecom, data protection, or consumer protection law.</li>
              <li>Any spam, unsolicited commercial communication, or unauthorised communication transmitted through the Platform by you or through your account.</li>
              <li>Your failure to obtain required consents, opt-ins, or permissions from End Users.</li>
              <li>Any claim made by a third party, including End Users, regulatory bodies, telecom authorities, payment processors, or consumer forums, arising from your use of the Services.</li>
              <li>Your violation or alleged violation of any third-party intellectual property, privacy, or other rights.</li>
              <li>Any fines, penalties, or enforcement actions taken by TRAI, the Data Protection Board of India, Meta, WhatsApp, or any other regulatory or governmental authority as a result of your actions or omissions.</li>
            </ul>
            <p className="mt-3">
              salez.online reserves the right to assume exclusive control of the defence of any matter subject to
              indemnification at its own expense, and you agree to cooperate fully and promptly in that defence. You shall
              not settle any claim that imposes any obligation or liability on salez.online without the Company's prior written
              consent.
            </p>
          </section>

          {/* Section 18 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 18 — Audit, Monitoring, and Enforcement Rights
            </h2>
            <p>
              salez.online reserves the right, at any time and without prior notice, to monitor, audit, review, and investigate
              User activity on the Platform for the purposes of: (a) ensuring compliance with this Agreement; (b) detecting
              and preventing fraud, spam, abuse, or policy violations; (c) fulfilling obligations under applicable law,
              regulatory directives, or law enforcement orders; and (d) protecting the integrity and security of the Platform
              and other Users.
            </p>
            <p className="mt-3">
              The Company may request that a User provide consent records, DLT registration documentation, opt-in
              records, KYC Documentation, compliance certifications, AI interaction logs, or other evidence of regulatory
              compliance. A User's failure to provide requested documentation within the timeframe specified by the
              Company may be treated as grounds for account suspension pending the outcome of the compliance review.
            </p>
            <p className="mt-3">
              salez.online will investigate all credible abuse or policy violation reports submitted to abuse@salez.online and
              may suspend or terminate accounts found to be in violation of this Agreement. The Company may cooperate
              fully with law enforcement authorities and disclose information about Users engaged in illegal activity, as
              required by applicable law or court order.
            </p>
          </section>

          {/* Section 19 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 19 — Account Suspension and Termination
            </h2>
            <p>
              salez.online reserves the right to suspend, restrict, or terminate your account and access to the Services at
              any time, including in the following non-exhaustive circumstances:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Actual or suspected violation of this Agreement.</li>
              <li>Actual or suspected engagement in spam, unsolicited communications, or violation of TRAI regulations.</li>
              <li>Any activity that, in the Company's reasonable judgment, poses legal, regulatory, reputational, or financial risk to salez.online or to any third party.</li>
              <li>Non-payment of any Subscription fees or other amounts due.</li>
              <li>Receipt of an instruction or request from WhatsApp, a telecom authority, law enforcement, or any regulatory or governmental body, including any direction issued in the exercise of statutory powers.</li>
              <li>Any regulatory or compliance requirement, including directions from TRAI, the Data Protection Board of India, or any other competent authority, that necessitates suspension to protect the Company's legal position.</li>
              <li>Technical abuse, including excessive API calls, denial-of-service attacks, or unauthorised automated access.</li>
              <li>Failure to provide KYC Documentation when requested under Section 3.2.</li>
              <li>Client insolvency, bankruptcy filing, or assignment for the benefit of creditors.</li>
              <li>Any circumstance in which immediate suspension is necessary to protect the Platform, other Users, or the Company's compliance with applicable law, including imminent or actual regulatory exposure.</li>
            </ul>
            <p className="mt-3">
              salez.online may effect an immediate suspension without prior notice where it reasonably determines that
              delay could cause irreparable harm, regulatory exposure, or material risk to the Company, its infrastructure, or
              other Users. salez.online shall have no liability for any loss of data, revenue, or business opportunity resulting
              from account suspension or termination effected in accordance with this Agreement.
            </p>
            <p className="mt-3">
              Either party may terminate this Agreement upon thirty (30) days' written notice for convenience, subject to the
              Client's payment of all fees accrued and due. Termination does not entitle the Client to a refund of any
              prepaid fees, except as provided in Section 11.5. Upon termination for any reason, the Client's access to the
              Platform ceases immediately, and Client Data will be deleted within ninety (90) days of the termination date in
              accordance with Section 12.9.
            </p>
          </section>

          {/* Section 20 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 20 — Publicity Rights
            </h2>
            <p>
              By entering into this Agreement, you grant salez.online a limited, non-exclusive, royalty-free right to identify
              you as a customer of the Company and to use your company name, registered trading name, and logo in the
              Company's marketing materials, website, investor presentations, case studies, and press releases, solely for
              the purpose of identifying you as a client of salez.online.
            </p>
            <p className="mt-3">
              If you wish to opt out of this publicity right, you must notify the Company in writing at legal@salez.online within
              thirty (30) days of the Effective Date of this Agreement or, for existing clients, within thirty (30) days of the
              effective date of this provision. If no written opt-out notice is received within that period, your consent to the
              use described herein shall be deemed to have been given. Upon receipt of a timely written opt-out notice, the
              Company shall refrain from making new use of your name or logo and shall remove existing uses within a
              commercially reasonable period, provided that the Company shall not be required to recall or destroy
              materials already distributed or published prior to receipt of the opt-out notice. salez.online shall not make any
              statement, attribution, or testimonial that misrepresents the nature or scope of the commercial relationship
              between the parties.
            </p>
          </section>

          {/* Section 21 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 21 — Force Majeure
            </h2>
            <p>
              salez.online shall not be liable for any delay, failure, interruption, or degradation of the Services arising from
              circumstances beyond its reasonable control, including without limitation: acts of God; natural disasters;
              floods, earthquakes, or other geophysical events; pandemics or public health emergencies; war, armed
              conflict, terrorism, civil unrest, or riots; actions of governmental or regulatory authorities, including the
              imposition of sanctions, embargoes, or regulatory orders; telecommunications network failures, internet
              infrastructure outages, or fibre cable disruptions; failures, outages, or rate limiting by Third-Party Service
              providers; failure or suspension of electricity or other utility services; cyberattacks or distributed
              denial-of-service attacks affecting the Company's infrastructure; or any other event or circumstance beyond
              the reasonable control of the Company (each, a "Force Majeure Event").
            </p>
            <p className="mt-3">
              In the event of a Force Majeure Event, salez.online shall notify affected Users as soon as reasonably
              practicable and shall use commercially reasonable efforts to restore the Services. The occurrence of a Force
              Majeure Event shall not entitle any User to a refund of fees paid and shall not excuse any payment obligation.
              Where a Force Majeure Event affecting the core Platform continues for more than sixty (60) consecutive days,
              either party may terminate the affected services on written notice without liability, save that all fees accrued
              prior to the Force Majeure Event remain payable.
            </p>
          </section>

          {/* Section 22 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 22 — No Agency; Independent Contractor
            </h2>
            <p>
              Nothing in this Agreement shall be construed to create or imply any agency, partnership, joint venture,
              employment, franchise, or fiduciary relationship between salez.online and any User, affiliate, or third party.
              salez.online is an independent technology service provider, and each party shall remain independently
              responsible for its own compliance obligations, legal liabilities, tax obligations, and business operations.
            </p>
            <p className="mt-3">
              You do not have any right or authority to assume or create any obligation on behalf of salez.online, express or
              implied, nor to bind salez.online in any respect whatsoever. The Company's employees, agents, and
              contractors are not your employees or agents in any respect.
            </p>
          </section>

          {/* Section 23 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 23 — No Reliance
            </h2>
            <p>
              You acknowledge and agree that, in entering into this Agreement, you have not relied on, and shall have no
              right or remedy in respect of, any statement, representation, assurance, or warranty (whether made
              innocently or negligently) other than those expressly set out in this Agreement. This Section shall not limit or
              exclude liability for fraud or fraudulent misrepresentation.
            </p>
            <p className="mt-3">
              Any information, guidance, compliance templates, or technical documentation provided by salez.online
              outside the express terms of this Agreement is for general reference only. You assume sole responsibility for
              verifying the currency, accuracy, and applicability of any such materials to your specific circumstances, and no
              such materials shall constitute a representation or warranty by salez.online.
            </p>
          </section>

          {/* Section 24 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 24 — Disclaimer of Legal, Compliance, and Regulatory Advice
            </h2>
            <p>
              Nothing on the salez.online website, Platform, documentation, or in any communication from salez.online
              employees or agents constitutes legal advice, compliance guidance, regulatory advice, or professional
              advisory services of any kind. salez.online is a technology platform provider and is not a licensed legal
              practitioner, compliance consultant, regulatory specialist, or telecom regulatory expert.
            </p>
            <p className="mt-3">
              You are solely responsible for obtaining independent legal and compliance advice regarding your use of the
              Platform and your compliance with all applicable laws, including TRAI regulations, the DPDP Act, the IT Act,
              the Consumer Protection Act, 2019, and all other applicable laws. Any compliance-related documentation,
              templates, or guidance provided by salez.online is for general informational reference only and shall not be
              relied upon as legal advice or as confirmation of regulatory compliance.
            </p>
            <p className="mt-3">
              salez.online does not warrant that its features, documentation, guidance materials, or compliance templates
              are current with the latest regulatory requirements. It is your sole and ongoing responsibility to monitor
              regulatory changes and obtain independent legal advice. salez.online shall not be liable for any regulatory
              fines, penalties, enforcement actions, or other consequences arising from your use of the Services, whether
              or not such consequences arise from regulatory changes occurring after your registration.
            </p>
          </section>

          {/* Section 25 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 25 — Governing Law, Jurisdiction, and Dispute Resolution
            </h2>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">25.1 Governing Law</h3>
            <p>
              This Agreement shall be governed by, and construed in accordance with, the laws of India, without regard to
              any conflict of law principles that would require the application of the laws of any other jurisdiction. Users
              accessing the Services from outside India acknowledge that the exclusive governing law is Indian law and
              that the dispute resolution forum specified in this Section is binding.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">25.2 Pre-Dispute Negotiation</h3>
            <p>
              Any dispute, controversy, or claim arising out of or relating to this Agreement, the Services, or any breach,
              termination, or validity thereof shall first be referred for good-faith negotiation between duly authorised senior
              representatives of both parties for a period of thirty (30) days from the date of written notice specifying the
              nature of the dispute. Neither party shall initiate formal proceedings during this period, except to seek urgent
              interim relief as described in Section 25.4.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">25.3 Binding Arbitration</h3>
            <p>
              If the dispute is not resolved through good-faith negotiation within thirty (30) days (or such extended period as
              the parties may agree in writing), it shall be submitted to binding arbitration under the Arbitration and
              Conciliation Act, 1996 of India. The seat and venue of arbitration shall be Chandigarh, Punjab, India. The
              arbitral proceedings shall be conducted in the English language before a sole arbitrator appointed by mutual
              agreement, or, failing agreement within fifteen (15) days of a request for appointment, by the relevant
              appointing authority under the Arbitration and Conciliation Act, 1996. The arbitral award shall be final and
              binding on both parties and may be enforced in any court of competent jurisdiction.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">25.4 Courts of Exclusive Jurisdiction</h3>
            <p>
              The courts at Chandigarh, Punjab, India shall have exclusive jurisdiction over: (a) any application for interim
              relief, injunctive relief, or emergency preservation of rights pending the constitution of an arbitral tribunal or
              during arbitral proceedings; (b) any application to enforce, set aside, or remit an arbitral award; and (c) any
              matter that is, by operation of law, not capable of resolution by arbitration. Both parties irrevocably submit to
              the exclusive jurisdiction of the courts at Chandigarh, Punjab, India for these purposes and waive any
              objection to proceedings in those courts on grounds of inconvenient forum or otherwise.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">25.5 Right to Seek Equitable Relief</h3>
            <p>
              Notwithstanding the arbitration agreement, salez.online may, at its sole election, seek injunctive relief,
              specific performance, or other equitable remedies in any court of competent jurisdiction to protect its
              intellectual property rights, Confidential Information, or Platform integrity, or to prevent or restrain actual or
              threatened breach of this Agreement, without the requirement to first submit the matter to arbitration or
              pre-dispute negotiation.
            </p>
          </section>

          {/* Section 26 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 26 — Survival of Provisions
            </h2>
            <p>
              The following provisions of this Agreement shall survive the expiry or termination of the Subscription and any
              associated agreement, regardless of the cause of termination, and shall remain in full force and effect:
              Section 14 (Intellectual Property Rights); Section 15 (Confidentiality); Section 16 (Limitation of Liability);
              Section 17 (Indemnification); Section 20 (Publicity Rights, as to uses made prior to a valid opt-out notice);
              Section 22 (No Agency; Independent Contractor); Section 23 (No Reliance); Section 10 (Payments and
              Billing, as to payment obligations accrued prior to termination); Section 25 (Governing Law, Jurisdiction, and
              Dispute Resolution); and the data protection and deletion obligations in Section 12. Any cause of action that
              accrued prior to termination shall not be extinguished by termination.
            </p>
          </section>

          {/* Section 27 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 27 — Modifications to This Agreement
            </h2>
            <p>
              salez.online reserves the right to modify this Agreement at any time. Registered Users will be notified of
              material changes via email to the registered address or via a conspicuous notice on the Platform at least
              fourteen (14) days before the effective date of the change, and at least thirty (30) days before the effective
              date of any material change to the data protection provisions in Section 12. Your continued use of the
              Services following the effective date of any modification constitutes your acceptance of the revised
              Agreement as further described in Section 1.1. If you do not agree to a modification, you must cease use of
              the Services and close your account before the modification takes effect.
            </p>
          </section>

          {/* Section 28 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">
              Section 28 — General Provisions
            </h2>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">28.1 Entire Agreement</h3>
            <p>
              This Agreement, together with all applicable Order Forms, addenda, and policies incorporated by reference,
              constitutes the entire agreement between the parties with respect to its subject matter and supersedes all
              prior agreements, representations, warranties, and understandings, whether written or oral. No
              representation, warranty, or statement not contained in this Agreement shall be binding on either party.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">28.2 Amendment</h3>
            <p>
              Subject to the Company's right to modify this Agreement under Section 27, this Agreement may otherwise be
              amended only by a written instrument signed by duly authorised representatives of both parties. No oral
              amendment, course of dealing, or conduct shall constitute a modification of this Agreement.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">28.3 Waiver</h3>
            <p>
              Failure by either party to enforce any provision of this Agreement shall not constitute a waiver of that provision
              or any subsequent breach thereof. No waiver of any right under this Agreement shall be effective unless
              made in writing and signed by an authorised representative of the waiving party. A single or partial exercise of
              a right does not preclude any further or other exercise of that right.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">28.4 Severability</h3>
            <p>
              If any provision of this Agreement is held to be invalid, illegal, or unenforceable under applicable law, that
              provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining
              provisions shall continue in full force and effect without impairment. If a provision cannot be modified to
              become enforceable, it shall be severed from the Agreement, and the parties shall in good faith negotiate a
              replacement provision that most closely achieves the original commercial intent.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">28.5 Notices</h3>
            <p>
              Legal notices to salez.online must be directed to legal@salez.online and to the Company's registered address
              at Chandigarh, Punjab, India, by email with read-receipt confirmation or by courier with delivery confirmation.
              Notices shall be deemed effective upon confirmed delivery. Notices to Users will be sent to the email address
              registered with the account, and shall be deemed effective twenty-four (24) hours after dispatch unless a
              delivery failure notification is received.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">28.6 Assignment</h3>
            <p>
              You may not assign, transfer, delegate, or sub-contract this Agreement or any rights or obligations hereunder
              without the prior written consent of salez.online. Any purported assignment without such consent is void.
              salez.online may assign this Agreement and its rights and obligations, in whole or in part, to any successor
              entity in connection with a merger, acquisition, corporate restructuring, or sale of all or substantially all of its
              business assets, without your consent, provided that the assignee assumes all obligations under this
              Agreement.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">28.7 Order of Precedence</h3>
            <p>
              In the event of any conflict between provisions of this Agreement, the data protection provisions in Section 12
              shall govern with respect to matters of Personal Data processing. In the event of any conflict between an
              Order Form and this Agreement, this Agreement shall govern unless the Order Form expressly and
              specifically provides otherwise by explicit reference to the clause being varied.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">28.8 Electronic Execution</h3>
            <p>
              This Agreement may be executed, accepted, or acknowledged electronically, including through clickwrap
              acceptance as described in Section 1.1. The parties expressly agree that electronic signatures and electronic
              acceptances are legally valid and binding under Section 10A of the IT Act and applicable provisions of the
              Indian Contract Act, 1872, and shall have the same force and effect as hand-signed written instruments.
              Neither party shall challenge the validity or enforceability of this Agreement solely on the ground that it was
              entered into electronically.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">28.9 Grievance Officer</h3>
            <p>
              In accordance with Rule 5(9) of the Information Technology (Intermediaries Guidelines and Digital Media
              Ethics Code) Rules, 2021, salez.online has designated a Grievance Officer for the purpose of receiving and
              addressing complaints from Users and Data Principals. Grievances relating to the Platform, the processing of
              Personal Data, or alleged violations of applicable law may be submitted to:
            </p>
            <div className="mt-3 pl-4 border-l-2 border-slate-200">
              <p>Grievance Officer: [Name of Designated Officer]</p>
              <p>Email: legal@salez.online</p>
              <p>Address: Chandigarh, Punjab, India</p>
            </div>
            <p className="mt-3">
              The Company shall acknowledge receipt of a grievance within forty-eight (48) hours and shall endeavour to
              resolve it within thirty (30) days of receipt.
            </p>

            <h3 className="font-semibold text-slate-800 mt-4 mb-2">28.10 Contact Information</h3>
            <p>For all inquiries and formal communications relating to this Agreement:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>General Inquiries: hello@salez.online</li>
              <li>Legal Matters: legal@salez.online</li>
              <li>Privacy and Data Requests: privacy@salez.online</li>
              <li>Support: support@salez.online</li>
              <li>Billing: billing@salez.online</li>
              <li>Abuse Reports: abuse@salez.online</li>
              <li>Security Concerns: security@salez.online</li>
            </ul>
          </section>

        </div>

        {/* Footer note */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-xs text-slate-400 text-center">
          salez.online Platform Agreement &amp; Legal Compliance Framework | Version 2.0 | Effective 1 April 2026
        </div>
      </div>
    </div>
  );
}
